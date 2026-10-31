#!/usr/bin/env python3
"""
Collect citable official fields for politicians already in
db/paragon_scores_export.json.

Sources, in order:
- Parliament of Albania member API (kuvendiapi /anetaret and /anetaret/{id})
- Wikidata (biographical statements) and Wikimedia Commons (licensed photos)

Nothing is invented. A field with no accepted source is cleared so the UI
shows "Në pritje të të dhënave / Awaiting data". PARAGON scores are never written.

Usage:
  python3 scripts/collect_official_politician_sources.py
  python3 scripts/collect_official_politician_sources.py --offline
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

ROOT = Path(__file__).resolve().parent.parent
EXPORT_PATH = ROOT / "db" / "paragon_scores_export.json"
OUT_DIR = ROOT / "data" / "official"
SNAPSHOT_PATH = OUT_DIR / "kuvendi_anetaret.snapshot.json"
CSV_PATH = OUT_DIR / "politician_field_sources.csv"
COVERAGE_PATH = OUT_DIR / "coverage.json"
PHOTO_DIR = ROOT / "public" / "politicians" / "official"

KUVENDI_API = "https://kuvendiapi.azurewebsites.net/api/anetaret"
UA = "NOVARIC-research/1.0 (official-source-audit; https://novaric.al)"
QARK_MAP = {
    1: "Elbasan",
    2: "Korçë",
    3: "Tiranë",
    4: "Berat",
    5: "Kukës",
    6: "Durrës",
    7: "Shkodër",
    8: "Vlorë",
    9: "Fier",
    10: "Lezhë",
    11: "Dibër",
    12: "Gjirokastër",
}
OFFICIAL_HOSTS = (
    "parlament.al",
    "kuvendi.gov.al",
    "kryeministria.al",
    "president.al",
    "kqz.gov.al",
    "ps.al",
    "pd.al",
    "partiasocialiste.al",
    "tirana.al",
)
OPEN_LICENCE = re.compile(
    r"cc0|cc[-\s]?by(?!-nc)|creative commons attribution(?!.*noncommercial)|public domain|\bpd\b",
    re.I,
)
FIELDS = (
    "fullName",
    "currentRole",
    "party",
    "dateOfBirth",
    "placeOfBirth",
    "education",
    "mandates",
    "parliamentaryGroup",
    "constituency",
    "officialLinks",
    "photo",
)


def fold(value: str) -> str:
    text = (value or "").casefold()
    for src, dst in (("ë", "e"), ("ç", "c"), ("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u")):
        text = text.replace(src, dst)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return " ".join(text.split())


def civil_birth_date(raw: Optional[str]) -> Optional[str]:
    """Accept a Kuvendi ditlindje only when it is a plausible birthday, not an import timestamp."""
    if not raw or not isinstance(raw, str):
        return None
    if raw.startswith("0001") or raw.startswith("2022-01-15"):
        return None
    date_part, _, time_part = raw.partition("T")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_part):
        return None
    year = int(date_part[:4])
    if year < 1930 or year > 2005:
        return None
    clock = time_part.split(".")[0]
    if clock not in ("", "00:00:00", "22:00:00", "23:00:00"):
        return None
    parsed = datetime.fromisoformat(date_part + "T" + (clock or "00:00:00"))
    if clock == "23:00:00":
        parsed += timedelta(hours=1)
    elif clock == "22:00:00":
        parsed += timedelta(hours=2)
    return parsed.date().isoformat()


def title_case_source(value: str) -> str:
    """Title-case an official uppercase string without adding letters the source did not contain."""
    parts = []
    for word in value.split():
        if word.isupper() and len(word) > 2:
            parts.append(word[:1] + word[1:].lower())
        else:
            parts.append(word)
    return " ".join(parts)


def http_json(url: str, timeout: int = 40) -> Any:
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def levenshtein(left: str, right: str) -> int:
    if left == right:
        return 0
    if not left or not right:
        return max(len(left), len(right))
    previous = list(range(len(right) + 1))
    for i, char in enumerate(left, 1):
        current = [i]
        for j, other in enumerate(right, 1):
            current.append(min(
                previous[j] + 1,
                current[j - 1] + 1,
                previous[j - 1] + (char != other),
            ))
        previous = current
    return previous[-1]


def doubled_letter_variant(left: str, right: str) -> bool:
    """Allow krashi/krrashi, not meta/metaj or beqaj/metaj."""
    if abs(len(left) - len(right)) != 1 or levenshtein(left, right) != 1:
        return False
    short, long = (left, right) if len(left) < len(right) else (right, left)
    for index, char in enumerate(long):
        if short == long[:index] + long[index + 1:] and index > 0 and long[index] == long[index - 1]:
            return True
    return False


def base_name(name: str) -> str:
    stripped = re.sub(r"\s*\([^)]*\)", " ", name or "")
    return fold(stripped)


def match_kuvendi_record(name: str, records: List[Dict[str, Any]]) -> Tuple[Optional[Dict[str, Any]], str]:
    """Return a unique Kuvendi row, or a reason the name stays unresolved."""
    target = base_name(name)
    parts = target.split()
    if len(parts) < 2:
        return None, "name has no first and last token after removing parentheticals"
    first, last = parts[0], parts[-1]
    exact = []
    variants = []
    for record in records:
        record_first = fold(record.get("emer") or "")
        record_last = fold(record.get("mbiemer") or "")
        record_name = f"{record_first} {record_last}".strip()
        if record_name == target:
            exact.append(record)
            continue
        surname_close = record_last == last or doubled_letter_variant(record_last, last)
        prefix = (
            len(first) >= 4
            and len(record_first) >= 4
            and (record_first.startswith(first) or first.startswith(record_first))
        )
        given_close = record_first == first or prefix or levenshtein(record_first, first) <= 1
        if surname_close and given_close and record_first and record_last:
            variants.append(record)
    if len(exact) == 1:
        return exact[0], "exact"
    if len(exact) > 1:
        return None, f"ambiguous: {len(exact)} exact Kuvendi rows"
    if len(variants) == 1:
        return variants[0], "unique spelling or patronymic variant"
    if len(variants) > 1:
        return None, f"ambiguous: {len(variants)} close Kuvendi rows"
    # Spellings confirmed against a single Kuvendi row. Not inferred biographies.
    documented = {
        "lindita buxhelaj": "lindita buxheli",
    }
    alias = documented.get(target)
    if alias:
        for record in records:
            official = fold(f"{record.get('emer') or ''} {record.get('mbiemer') or ''}")
            if official == alias:
                return record, "documented unique Kuvendi spelling"
    return None, "not in the current Kuvendi member register"


def index_kuvendi(records: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    grouped: Dict[str, List[Dict[str, Any]]] = {}
    for record in records:
        key = fold(f"{record.get('emer') or ''} {record.get('mbiemer') or ''}")
        if key:
            grouped.setdefault(key, []).append(record)
    return {key: rows[0] for key, rows in grouped.items() if len(rows) == 1}


def wd_time(value: Any) -> Optional[str]:
    if not isinstance(value, dict):
        return None
    raw = value.get("time") or ""
    match = re.search(r"([+-]?\d{4})-(\d{2})-(\d{2})", raw)
    if not match:
        return None
    year, month, day = int(match.group(1)), match.group(2), match.group(3)
    if year < 1930 or year > 2005 or month == "00" or day == "00":
        return None
    return f"{year:04d}-{month}-{day}"


def claim_ids(claims: Dict[str, Any], prop: str) -> List[str]:
    found = []
    for statement in claims.get(prop) or []:
        value = statement.get("mainsnak", {}).get("datavalue", {}).get("value")
        if isinstance(value, dict) and value.get("id"):
            found.append(value["id"])
    return found


def claim_strings(claims: Dict[str, Any], prop: str) -> List[str]:
    found = []
    for statement in claims.get(prop) or []:
        value = statement.get("mainsnak", {}).get("datavalue", {}).get("value")
        if isinstance(value, str) and value.strip():
            found.append(value.strip())
    return found


def official_website(url: str) -> bool:
    host = urllib.parse.urlparse(url).netloc.lower()
    return any(host == item or host.endswith("." + item) for item in OFFICIAL_HOSTS)


def licence_allows_copy(licence: str) -> bool:
    text = licence or ""
    if re.search(r"noncommercial|all rights reserved|copyrighted", text, re.I):
        return False
    return bool(OPEN_LICENCE.search(text))


def positions_from_claims(claims: Dict[str, Any], labels: Dict[str, str]) -> List[Dict[str, Any]]:
    rows = []
    for statement in claims.get("P39") or []:
        value = statement.get("mainsnak", {}).get("datavalue", {}).get("value")
        if not isinstance(value, dict) or not value.get("id"):
            continue
        quals = statement.get("qualifiers") or {}
        start = None
        end = None
        for snak in quals.get("P580") or []:
            start = wd_time(snak.get("datavalue", {}).get("value")) or start
        for snak in quals.get("P582") or []:
            end = wd_time(snak.get("datavalue", {}).get("value")) or end
        title = labels.get(value["id"]) or value["id"]
        # A missing end date is not evidence the office is current.
        current = end is None and start is not None and start >= "2021-09-01"
        rows.append({"role": title, "start": start, "end": end, "current": current})
    return rows


def merge_profile(profile: Dict[str, Any], sourced: Dict[str, Any], retrieved_at: str) -> Dict[str, Any]:
    """Apply sourced fields. Score columns are copied through unchanged."""
    updated = dict(profile)
    for key in (
        "composite",
        "compositeDelta",
        "dynamicScore",
        "paragonDimensions",
        "periodEnd",
        "scoring_suspended",
        "scoring_suspension_notice",
    ):
        updated[key] = profile.get(key)

    sources = sourced.get("fieldSources") or {}
    updated["fieldSources"] = sources
    updated["sourceRetrievedAt"] = retrieved_at

    dob = sourced.get("dateOfBirth")
    updated["dateOfBirth"] = dob
    updated["dateOfBirthSourceUrl"] = (sources.get("dateOfBirth") or {}).get("sourceUrl")
    updated["dateOfBirthVerifiedAt"] = retrieved_at if dob else None
    updated["dateOfBirthVerificationStatus"] = "verified" if dob else None
    updated["placeOfBirth"] = sourced.get("placeOfBirth")
    updated["electoralZone"] = sourced.get("constituency") or profile.get("electoralZone") if sourced.get("keepConstituency") else sourced.get("constituency")
    if not sourced.get("constituency"):
        updated["electoralZone"] = None
    else:
        updated["electoralZone"] = sourced.get("constituency")

    role = sourced.get("currentRole")
    updated["primaryRole"] = role
    updated["secondaryRoles"] = sourced.get("secondaryRoles") or []
    updated["parliamentaryGroup"] = sourced.get("parliamentaryGroup")
    updated["mandates"] = sourced.get("mandates") or []
    updated["officialLinks"] = sourced.get("officialLinks") or []
    updated["affiliations"] = sourced.get("affiliations") or []
    updated["bio"] = {
        "fullName": profile.get("name"),
        "education": sourced.get("education"),
        "profession": None,
        "email": sourced.get("email"),
        "party": sourced.get("partyOfficial"),
        "activeStatus": True if sourced.get("sittingMp") else (False if sourced.get("kuvendiMatched") else None),
    }
    updated["education"] = sourced.get("education")
    updated["email"] = sourced.get("email")
    photo = sourced.get("photo") or {}
    updated["officialPhoto"] = photo or None
    updated["officialPhotoPath"] = photo.get("localPath")
    if photo.get("sourceUrl"):
        updated["photo_source_url"] = photo["sourceUrl"]
        updated["photoLicence"] = photo.get("licence")
        updated["photoRetrievedAt"] = retrieved_at
    # Unsourced narrative bios are not official quotations.
    if not sourced.get("keepNarrative"):
        updated["shortBio"] = None
        updated["detailedBio"] = None
    return updated


def build_sourced(profile: Dict[str, Any], kuvendi: Optional[Dict[str, Any]], detail: Optional[Dict[str, Any]], wiki: Optional[Dict[str, Any]], retrieved_at: str) -> Dict[str, Any]:
    sources: Dict[str, Any] = {}
    result: Dict[str, Any] = {"fieldSources": sources, "secondaryRoles": [], "mandates": [], "officialLinks": [], "affiliations": []}
    name = profile.get("name") or ""
    if kuvendi:
        api_url = f"{KUVENDI_API}/{kuvendi.get('id')}"
        sources["fullName"] = {"value": name, "sourceUrl": api_url, "retrievedAt": retrieved_at}
        result["kuvendiMatched"] = True
        result["sittingMp"] = kuvendi.get("status") == 0
        party = (kuvendi.get("partia") or "").strip()
        if party:
            result["partyOfficial"] = party
            sources["party"] = {"value": party, "sourceUrl": api_url, "retrievedAt": retrieved_at}
            result["affiliations"].append({"kind": "party", "label": party, "detail": None, "url": api_url})
        qark = kuvendi.get("qarku")
        if isinstance(qark, int) and qark in QARK_MAP:
            zone = QARK_MAP[qark]
            result["constituency"] = zone
            sources["constituency"] = {"value": zone, "sourceUrl": api_url, "retrievedAt": retrieved_at, "notes": f"qarku={qark}"}
        email = (kuvendi.get("email") or "").strip()
        if "@" in email:
            result["email"] = email
            sources["email"] = {"value": email, "sourceUrl": api_url, "retrievedAt": retrieved_at}
            result["officialLinks"].append({"label": email, "url": f"mailto:{email}"})
        result["officialLinks"].append({"label": "Regjistri i Kuvendit / Parliament register", "url": api_url})
        photo_url = (kuvendi.get("fotoProfil") or "").strip()
        if photo_url.startswith("http"):
            result["photo"] = {
                "sourceUrl": photo_url,
                "licence": "No reuse licence published by the Parliament of Albania. Referenced by URL; file not copied.",
                "retrievedAt": retrieved_at,
                "copied": False,
                "localPath": None,
            }
            sources["photo"] = {"value": photo_url, "sourceUrl": photo_url, "retrievedAt": retrieved_at, "licence": result["photo"]["licence"]}
        birth = civil_birth_date(kuvendi.get("ditlindje"))
        place = (kuvendi.get("vendlindje") or "").strip()
        if place:
            place = title_case_source(place)
            result["kuvendiPlace"] = place
            result["kuvendiPlaceSource"] = api_url
        if birth:
            result["kuvendiBirth"] = birth
            result["kuvendiBirthSource"] = api_url
        if result["sittingMp"]:
            result["kuvendiRole"] = "Deputet i Kuvendit të Shqipërisë"
            result["kuvendiRoleSource"] = api_url
            result["mandates"].append({
                "period": None,
                "role": "Deputet i Kuvendit të Shqipërisë",
                "current": True,
                "sourceUrl": api_url,
            })
    if detail:
        api_url = f"{KUVENDI_API}/{kuvendi.get('id')}" if kuvendi else None
        for struct in detail.get("strukturat") or []:
            title = (struct.get("emer") or "").strip()
            if not title:
                continue
            if struct.get("tip") == 6 or "grupi parlamentar" in title.casefold():
                result["parliamentaryGroup"] = title
                sources["parliamentaryGroup"] = {"value": title, "sourceUrl": api_url, "retrievedAt": retrieved_at}
                result["affiliations"].append({"kind": "parliamentary-group", "label": title, "detail": None, "url": api_url})
                break
    if wiki:
        entity_url = f"https://www.wikidata.org/wiki/{wiki['id']}"
        wiki_birth = wiki.get("birth")
        if wiki_birth and (not result.get("kuvendiBirth") or result.get("kuvendiBirth") == wiki_birth):
            result["dateOfBirth"] = wiki_birth
            sources["dateOfBirth"] = {"value": wiki_birth, "sourceUrl": entity_url, "retrievedAt": retrieved_at}
        elif result.get("kuvendiBirth") and not wiki_birth:
            result["dateOfBirth"] = result["kuvendiBirth"]
            sources["dateOfBirth"] = {"value": result["kuvendiBirth"], "sourceUrl": result["kuvendiBirthSource"], "retrievedAt": retrieved_at}
        elif result.get("kuvendiBirth") and wiki_birth and result["kuvendiBirth"] != wiki_birth:
            result["dateOfBirthConflict"] = {"kuvendi": result["kuvendiBirth"], "wikidata": wiki_birth}
        if wiki.get("birthPlace"):
            result["placeOfBirth"] = wiki["birthPlace"]
            sources["placeOfBirth"] = {"value": wiki["birthPlace"], "sourceUrl": entity_url, "retrievedAt": retrieved_at}
        elif result.get("kuvendiPlace"):
            result["placeOfBirth"] = result["kuvendiPlace"]
            sources["placeOfBirth"] = {"value": result["kuvendiPlace"], "sourceUrl": result["kuvendiPlaceSource"], "retrievedAt": retrieved_at}
        if wiki.get("education"):
            result["education"] = wiki["education"]
            sources["education"] = {"value": wiki["education"], "sourceUrl": entity_url, "retrievedAt": retrieved_at}
        current_positions = [item for item in wiki.get("positions") or [] if item.get("current")]
        current_positions.sort(key=lambda item: item.get("start") or "")
        current_roles = [item["role"] for item in current_positions]
        if current_roles:
            result["currentRole"] = current_roles[-1]
            result["secondaryRoles"] = [role for role in current_roles[:-1] if role != result["currentRole"]][:3]
            if result.get("kuvendiRole") and result["kuvendiRole"] not in current_roles:
                result["secondaryRoles"] = [result["kuvendiRole"], *result["secondaryRoles"]][:4]
            sources["currentRole"] = {"value": result["currentRole"], "sourceUrl": entity_url, "retrievedAt": retrieved_at}
        elif result.get("kuvendiRole"):
            result["currentRole"] = result["kuvendiRole"]
            sources["currentRole"] = {"value": result["kuvendiRole"], "sourceUrl": result["kuvendiRoleSource"], "retrievedAt": retrieved_at}
        for item in wiki.get("positions") or []:
            if not item.get("start") and not item.get("end"):
                continue
            period = " — ".join(part for part in (item.get("start"), item.get("end")) if part) or None
            result["mandates"].append({
                "period": period,
                "role": item["role"],
                "current": bool(item.get("current")),
                "sourceUrl": entity_url,
            })
        if wiki.get("party") and "party" not in sources:
            result["partyOfficial"] = wiki["party"]
            sources["party"] = {"value": wiki["party"], "sourceUrl": entity_url, "retrievedAt": retrieved_at}
            result["affiliations"].append({"kind": "party", "label": wiki["party"], "detail": None, "url": entity_url})
        for link in wiki.get("officialLinks") or []:
            result["officialLinks"].append(link)
        result["officialLinks"].append({"label": f"Wikidata {wiki['id']}", "url": entity_url})
        if wiki.get("photo") and (not result.get("photo") or wiki["photo"].get("copied")):
            result["photo"] = wiki["photo"]
            sources["photo"] = {
                "value": wiki["photo"].get("localPath") or wiki["photo"].get("sourceUrl"),
                "sourceUrl": wiki["photo"].get("sourceUrl"),
                "retrievedAt": retrieved_at,
                "licence": wiki["photo"].get("licence"),
            }
    else:
        if result.get("kuvendiBirth"):
            result["dateOfBirth"] = result["kuvendiBirth"]
            sources["dateOfBirth"] = {"value": result["kuvendiBirth"], "sourceUrl": result["kuvendiBirthSource"], "retrievedAt": retrieved_at}
        if result.get("kuvendiPlace"):
            result["placeOfBirth"] = result["kuvendiPlace"]
            sources["placeOfBirth"] = {"value": result["kuvendiPlace"], "sourceUrl": result["kuvendiPlaceSource"], "retrievedAt": retrieved_at}
        if result.get("kuvendiRole") and not result.get("currentRole"):
            result["currentRole"] = result["kuvendiRole"]
            sources["currentRole"] = {"value": result["kuvendiRole"], "sourceUrl": result["kuvendiRoleSource"], "retrievedAt": retrieved_at}
    if name and "fullName" not in sources and wiki:
        sources["fullName"] = {"value": name, "sourceUrl": f"https://www.wikidata.org/wiki/{wiki['id']}", "retrievedAt": retrieved_at}
    result["mandates"] = result["mandates"][:12]
    if result.get("mandates"):
        sources["mandates"] = {"value": str(len(result["mandates"])), "sourceUrl": result["mandates"][0].get("sourceUrl"), "retrievedAt": retrieved_at}
    if result.get("officialLinks"):
        sources["officialLinks"] = {"value": str(len(result["officialLinks"])), "sourceUrl": result["officialLinks"][0]["url"], "retrievedAt": retrieved_at}
    zone = roster_constituency(name)
    if zone:
        # Certified election district overrides a missing or placeholder Kuvendi qarku code.
        result["constituency"] = zone
        sources["constituency"] = {
            "value": zone,
            "sourceUrl": "https://kqz.gov.al",
            "retrievedAt": retrieved_at,
            "notes": "KQZ Decision No. 34, 28 August 2025, as compiled in CERTIFIED_2025_ROSTER",
        }
    return result


def roster_constituency(name: str) -> Optional[str]:
    import sys
    root = str(ROOT)
    if root not in sys.path:
        sys.path.insert(0, root)
    from services.parliament_roster_service import CERTIFIED_2025_ROSTER
    target = fold(name)
    for member in CERTIFIED_2025_ROSTER:
        if fold(member.get("name") or "") == target and member.get("zone"):
            return member["zone"]
    return None


def repair_open_ended_roles(profile: Dict[str, Any]) -> None:
    """Do not treat an old Wikidata office with no end date as the current role.

    A role already cited to an official host is left as recorded. This pass only
    fills a missing role from a current mandate, or clears a stale Wikidata role.
    """
    mandates = profile.get("mandates") or []
    for mandate in mandates:
        source = mandate.get("sourceUrl") or ""
        period = (mandate.get("period") or "").split("—")[0].strip()
        if "wikidata.org" in source and mandate.get("current") and (not period or period < "2021-09-01"):
            mandate["current"] = False
    sources = profile.setdefault("fieldSources", {})
    existing_url = (sources.get("currentRole") or {}).get("sourceUrl") or ""
    if (sources.get("currentRole") or {}).get("value") and "wikidata.org" not in existing_url:
        return
    current = [mandate for mandate in mandates if mandate.get("current")]
    wiki_current = [mandate for mandate in current if "wikidata.org" in (mandate.get("sourceUrl") or "")]
    kuvendi_current = [mandate for mandate in current if "kuvendiapi" in (mandate.get("sourceUrl") or "")]
    chosen = sorted(wiki_current, key=lambda item: item.get("period") or "")[-1] if wiki_current else (kuvendi_current[0] if kuvendi_current else None)
    if chosen and not (sources.get("currentRole") or {}).get("value"):
        profile["primaryRole"] = chosen["role"]
        sources["currentRole"] = {
            "value": chosen["role"],
            "sourceUrl": chosen.get("sourceUrl"),
            "retrievedAt": profile.get("sourceRetrievedAt"),
        }
        profile["secondaryRoles"] = [mandate["role"] for mandate in current if mandate is not chosen][:3]
    else:
        source = existing_url
        recorded = (sources.get("currentRole") or {}).get("value") or ""
        # A Wikidata office is kept only when the recorded value includes the dated period.
        if "wikidata.org" in source and not re.search(r"\d{4}", recorded):
            profile["primaryRole"] = None
            profile["secondaryRoles"] = []
            sources.pop("currentRole", None)


def rewrite_outputs_from_export() -> Dict[str, Any]:
    export = json.loads(EXPORT_PATH.read_text(encoding="utf-8"))
    retrieved_at = export.get("official_sources_retrieved_at") or ""
    rows = []
    for profile in export["profiles"]:
        zone = roster_constituency(profile.get("name") or "")
        if zone:
            profile["electoralZone"] = zone
            profile.setdefault("fieldSources", {})["constituency"] = {
                "value": zone,
                "sourceUrl": "https://kqz.gov.al",
                "retrievedAt": retrieved_at,
                "notes": "KQZ Decision No. 34, 28 August 2025, as compiled in CERTIFIED_2025_ROSTER",
            }
        repair_open_ended_roles(profile)
        for field in FIELDS:
            source = (profile.get("fieldSources") or {}).get(field) or {}
            rows.append({
                "vip_id": profile["id"],
                "name": profile["name"],
                "field": field,
                "value": source.get("value") or "",
                "source_url": source.get("sourceUrl") or "",
                "retrieved_at": source.get("retrievedAt") or "",
                "licence": source.get("licence") or ((profile.get("officialPhoto") or {}).get("licence") if field == "photo" else "") or "",
                "notes": source.get("notes") or ("no official source on this run" if not source.get("value") else ""),
            })
    EXPORT_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_csv(rows)
    summary = coverage_from(rows, len(export["profiles"]))
    summary["retrievedAt"] = retrieved_at
    COVERAGE_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def search_wikidata(name: str) -> Optional[str]:
    query = urllib.parse.urlencode({
        "action": "wbsearchentities",
        "search": name,
        "language": "sq",
        "uselang": "en",
        "type": "item",
        "limit": 5,
        "format": "json",
    })
    data = http_json("https://www.wikidata.org/w/api.php?" + query)
    target = fold(name)
    for hit in data.get("search") or []:
        label = fold(hit.get("label") or "")
        description = (hit.get("description") or "").casefold()
        if label != target:
            continue
        if "wikinews" in description or "article" in description:
            continue
        if any(token in description for token in ("politician", "politikan", "minister", "president", "mayor", "deputet", "prime minister", "mp")):
            return hit.get("id")
    return None


def fetch_entities(ids: List[str]) -> Dict[str, Any]:
    found: Dict[str, Any] = {}
    for offset in range(0, len(ids), 40):
        chunk = [item for item in ids[offset:offset + 40] if item]
        if not chunk:
            continue
        query = urllib.parse.urlencode({
            "action": "wbgetentities",
            "ids": "|".join(chunk),
            "props": "claims|labels",
            "languages": "sq|en",
            "format": "json",
        })
        data = http_json("https://www.wikidata.org/w/api.php?" + query, timeout=60)
        found.update(data.get("entities") or {})
        time.sleep(0.2)
    return found


def label_of(entity: Dict[str, Any]) -> str:
    labels = entity.get("labels") or {}
    for lang in ("sq", "en"):
        if lang in labels and labels[lang].get("value"):
            return labels[lang]["value"]
    return ""


def commons_photo(filename: str, vip_id: str) -> Optional[Dict[str, Any]]:
    query = urllib.parse.urlencode({
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size",
        "iiurlwidth": "480",
        "format": "json",
    })
    data = http_json("https://commons.wikimedia.org/w/api.php?" + query)
    pages = (data.get("query") or {}).get("pages") or {}
    for page in pages.values():
        info = (page.get("imageinfo") or [None])[0]
        if not info:
            return None
        meta = info.get("extmetadata") or {}
        licence = (meta.get("LicenseShortName") or meta.get("UsageTerms") or {}).get("value") or ""
        artist = (meta.get("Artist") or {}).get("value") or ""
        artist = re.sub(r"<[^>]+>", "", artist).strip()
        page_url = info.get("descriptionurl") or f"https://commons.wikimedia.org/wiki/File:{urllib.parse.quote(filename)}"
        record = {
            "sourceUrl": page_url,
            "fileUrl": info.get("thumburl") or info.get("url"),
            "licence": re.sub(r"<[^>]+>", "", licence).strip(),
            "artist": artist[:180],
            "copied": False,
            "localPath": None,
        }
        if licence_allows_copy(record["licence"]) and record["fileUrl"]:
            local = download_thumb(record["fileUrl"], vip_id)
            if local:
                record["copied"] = True
                record["localPath"] = local
        return record
    return None


def download_thumb(url: str, vip_id: str) -> Optional[str]:
    PHOTO_DIR.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = response.read(500_000)
            if len(payload) < 800 or len(payload) >= 500_000:
                return None
    except (urllib.error.URLError, TimeoutError, ssl.SSLError):
        return None
    extension = ".png" if payload.startswith(b"\x89PNG") else ".jpg"
    destination = PHOTO_DIR / f"{vip_id}{extension}"
    destination.write_bytes(payload)
    return f"/politicians/official/{destination.name}"


def write_csv(rows: List[Dict[str, Any]]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with CSV_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "field", "value", "source_url", "retrieved_at", "licence", "notes"])
        writer.writeheader()
        writer.writerows(rows)


def coverage_from(rows: List[Dict[str, Any]], total: int) -> Dict[str, Any]:
    summary = {"politicians": total, "fields": {}}
    for field in FIELDS:
        filled = sum(1 for row in rows if row["field"] == field and row["value"])
        summary["fields"][field] = {"filled": filled, "awaiting": total - filled}
    return summary


def collect(offline: bool = False) -> Dict[str, Any]:
    retrieved_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    export = json.loads(EXPORT_PATH.read_text(encoding="utf-8"))
    profiles = export["profiles"]
    if offline and SNAPSHOT_PATH.exists():
        kuvendi_rows = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    else:
        kuvendi_rows = http_json(KUVENDI_API, timeout=60)
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        SNAPSHOT_PATH.write_text(json.dumps(kuvendi_rows, ensure_ascii=False), encoding="utf-8")
    kuvendi_index = index_kuvendi(kuvendi_rows)

    wiki_ids: Dict[str, str] = {}
    if not offline:
        for profile in profiles:
            try:
                found = search_wikidata(profile["name"])
            except Exception:
                found = None
            if found:
                wiki_ids[profile["id"]] = found
            time.sleep(0.12)
    entities = fetch_entities(sorted(set(wiki_ids.values()))) if wiki_ids else {}
    needed: List[str] = []
    for entity in entities.values():
        claims = entity.get("claims") or {}
        needed.extend(claim_ids(claims, "P19"))
        needed.extend(claim_ids(claims, "P69"))
        needed.extend(claim_ids(claims, "P102"))
        needed.extend(claim_ids(claims, "P39"))
    labels = {qid: label_of(entity) for qid, entity in fetch_entities(sorted(set(needed))).items()} if needed else {}

    details: Dict[str, Any] = {}
    detail_ids = []
    for profile in profiles:
        record = kuvendi_index.get(fold(profile["name"]))
        if record and record.get("id"):
            detail_ids.append(record["id"])

    def fetch_detail(record_id: str) -> Tuple[str, Optional[Dict[str, Any]]]:
        try:
            return record_id, http_json(f"{KUVENDI_API}/{record_id}", timeout=30)
        except Exception:
            return record_id, None

    if not offline and detail_ids:
        with ThreadPoolExecutor(max_workers=6) as pool:
            futures = [pool.submit(fetch_detail, record_id) for record_id in detail_ids]
            for future in as_completed(futures):
                record_id, payload = future.result()
                if payload:
                    details[record_id] = payload

    csv_rows: List[Dict[str, Any]] = []
    updated_profiles = []
    for profile in profiles:
        record = kuvendi_index.get(fold(profile["name"]))
        detail = details.get(record["id"]) if record else None
        wiki = None
        qid = wiki_ids.get(profile["id"])
        entity = entities.get(qid) if qid else None
        if entity and "claims" in entity:
            claims = entity["claims"]
            if "Q5" in claim_ids(claims, "P31") and (claim_ids(claims, "P106") or claim_ids(claims, "P39")):
                positions = positions_from_claims(claims, labels)
                education = "; ".join(labels.get(item) or item for item in claim_ids(claims, "P69"))
                party = "; ".join(labels.get(item) or item for item in claim_ids(claims, "P102")[:2])
                place_ids = claim_ids(claims, "P19")
                birth_values = []
                for statement in claims.get("P569") or []:
                    parsed = wd_time(statement.get("mainsnak", {}).get("datavalue", {}).get("value"))
                    if parsed:
                        birth_values.append(parsed)
                links = []
                for site in claim_strings(claims, "P856"):
                    if official_website(site):
                        links.append({"label": site, "url": site})
                photo = None
                images = claim_strings(claims, "P18")
                if images and not offline:
                    try:
                        photo = commons_photo(images[0], profile["id"])
                    except Exception:
                        photo = None
                    time.sleep(0.05)
                wiki = {
                    "id": qid,
                    "birth": birth_values[0] if birth_values else None,
                    "birthPlace": labels.get(place_ids[0]) if place_ids else None,
                    "education": education or None,
                    "party": party or None,
                    "positions": positions[:8],
                    "officialLinks": links,
                    "photo": photo,
                }
        sourced = build_sourced(profile, record, detail, wiki, retrieved_at)
        merged = merge_profile(profile, sourced, retrieved_at)
        updated_profiles.append(merged)
        for field in FIELDS:
            source = (merged.get("fieldSources") or {}).get(field) or {}
            value = source.get("value") or ""
            csv_rows.append({
                "vip_id": profile["id"],
                "name": profile["name"],
                "field": field,
                "value": value,
                "source_url": source.get("sourceUrl") or "",
                "retrieved_at": source.get("retrievedAt") or "",
                "licence": source.get("licence") or (merged.get("officialPhoto") or {}).get("licence") if field == "photo" else "",
                "notes": source.get("notes") or ("no official source on this run" if not value else ""),
            })

    export["profiles"] = updated_profiles
    export["official_sources_retrieved_at"] = retrieved_at
    EXPORT_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_csv(csv_rows)
    summary = coverage_from(csv_rows, len(profiles))
    summary["retrievedAt"] = retrieved_at
    summary["kuvendiRecords"] = len(kuvendi_rows)
    summary["kuvendiUniqueNameMatches"] = sum(1 for profile in profiles if fold(profile["name"]) in kuvendi_index)
    summary["wikidataMatches"] = len(wiki_ids)
    COVERAGE_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def quote_url(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, urllib.parse.quote(parts.path), parts.query, parts.fragment))


def parse_cv_text(text: str) -> Dict[str, Optional[str]]:
    flat = re.sub(r"\s+", " ", text or "").strip()
    parsed: Dict[str, Optional[str]] = {"dateOfBirth": None, "placeOfBirth": None, "education": None, "career": None}
    birth = re.search(r"Dat[eë]lindja\s*:\s*(\d{1,2})[./](\d{1,2})[./](\d{4})", flat, re.I)
    if birth:
        day, month, year = int(birth.group(1)), int(birth.group(2)), int(birth.group(3))
        if 1930 <= year <= 2005 and 1 <= month <= 12 and 1 <= day <= 31:
            parsed["dateOfBirth"] = f"{year:04d}-{month:02d}-{day:02d}"
    place = re.search(r"Vendlindja\s*:\s*([^:]{2,60}?)(?:\s+E-?mail|\s+Jet[eë]shkrimi|$)", flat, re.I)
    if place:
        parsed["placeOfBirth"] = place.group(1).strip(" .;-")
    education = re.search(
        r"((?:studim\w*|diplom\w*|ka kryer|ka mbaruar)[^.]{0,220}(?:Universitet\w*|Fakultet\w*|Akadem\w*|Institut\w*)[^.]{0,80})",
        flat,
        re.I,
    )
    if not education:
        education = re.search(
            r"((?:është diplomuar|diplomuar në|arsimin e lartë)[^.]{8,220})",
            flat,
            re.I,
        )
    if education:
        parsed["education"] = education.group(1).strip()[:500]
    career = re.search(r"Jet[eë]shkrimi\s*:\s*(.{40,900})", flat, re.I)
    if career:
        parsed["career"] = career.group(1).strip()
    return parsed


def cv_document(detail: Optional[Dict[str, Any]]) -> Optional[str]:
    if not detail:
        return None
    for document in detail.get("dokumentat") or []:
        tip = ((document.get("tipDokument") or {}).get("emer") or "").casefold()
        url = document.get("url") or ""
        if url.startswith("http") and ("cv" in tip or "jetëshkrim" in tip or "jeteskrim" in tip or url.lower().endswith(".pdf")):
            if "cv" in tip or "jet" in tip:
                return url
    return None


def read_pdf_text(url: str) -> str:
    import io
    from pypdf import PdfReader
    request = urllib.request.Request(quote_url(url), headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=40) as response:
        payload = response.read(2_000_000)
    reader = PdfReader(io.BytesIO(payload))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def set_field(profile: Dict[str, Any], field: str, value: str, source_url: str, retrieved_at: str, notes: str = "") -> None:
    sources = profile.setdefault("fieldSources", {})
    sources[field] = {"value": value, "sourceUrl": source_url, "retrievedAt": retrieved_at, "notes": notes}
    if field == "dateOfBirth":
        profile["dateOfBirth"] = value
        profile["dateOfBirthSourceUrl"] = source_url
        profile["dateOfBirthVerifiedAt"] = retrieved_at
        profile["dateOfBirthVerificationStatus"] = "verified"
    elif field == "placeOfBirth":
        profile["placeOfBirth"] = value
    elif field == "currentRole":
        profile["primaryRole"] = value
    elif field == "party":
        profile.setdefault("bio", {})["party"] = value
        if not profile.get("party"):
            profile["party"] = value
    elif field == "constituency":
        profile["electoralZone"] = value
    elif field == "parliamentaryGroup":
        profile["parliamentaryGroup"] = value
    elif field == "education":
        profile["education"] = value
        profile.setdefault("bio", {})["education"] = value
    elif field == "fullName":
        profile.setdefault("bio", {})["fullName"] = profile.get("name")


def enrich(limit_details: Optional[int] = None) -> Dict[str, Any]:
    """Fill gaps from unique Kuvendi variants, official CV PDFs, and secondary Wikidata."""
    retrieved_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    export = json.loads(EXPORT_PATH.read_text(encoding="utf-8"))
    records = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    conflicts: List[Dict[str, str]] = []
    unresolved: List[Dict[str, str]] = []
    matched = 0
    cv_used = 0
    detail_cache_path = OUT_DIR / "kuvendi_details.snapshot.json"
    details: Dict[str, Any] = {}
    if detail_cache_path.exists():
        details = json.loads(detail_cache_path.read_text(encoding="utf-8"))

    assignments: Dict[str, Tuple[Dict[str, Any], str]] = {}
    for profile in export["profiles"]:
        record, reason = match_kuvendi_record(profile.get("name") or "", records)
        if record:
            assignments[profile["id"]] = (record, reason)
        else:
            unresolved.append({"vip_id": profile["id"], "name": profile["name"], "reason": reason})

    missing_ids = [record["id"] for record, _reason in assignments.values() if record.get("id") and record["id"] not in details]
    if limit_details is not None:
        missing_ids = missing_ids[:limit_details]

    def fetch_detail(record_id: str) -> Tuple[str, Optional[Dict[str, Any]]]:
        try:
            return record_id, http_json(f"{KUVENDI_API}/{record_id}", timeout=30)
        except Exception:
            return record_id, None

    if missing_ids:
        with ThreadPoolExecutor(max_workers=6) as pool:
            for future in as_completed(pool.submit(fetch_detail, record_id) for record_id in missing_ids):
                record_id, payload = future.result()
                if payload:
                    details[record_id] = payload
        detail_cache_path.write_text(json.dumps(details, ensure_ascii=False), encoding="utf-8")

    for profile in export["profiles"]:
        assignment = assignments.get(profile["id"])
        if not assignment:
            continue
        record, reason = assignment
        matched += 1
        api_url = f"{KUVENDI_API}/{record.get('id')}"
        sources = profile.setdefault("fieldSources", {})
        if not (sources.get("fullName") or {}).get("value"):
            set_field(profile, "fullName", profile.get("name") or "", api_url, retrieved_at, reason)
        if not (sources.get("party") or {}).get("value") and (record.get("partia") or "").strip():
            set_field(profile, "party", record["partia"].strip(), api_url, retrieved_at, reason)
        if not profile.get("officialLinks"):
            profile["officialLinks"] = [{"label": "Regjistri i Kuvendit / Parliament register", "url": api_url}]
            sources["officialLinks"] = {"value": "1", "sourceUrl": api_url, "retrievedAt": retrieved_at}
        email = (record.get("email") or "").strip()
        if email and "@" in email and not (profile.get("bio") or {}).get("email"):
            profile.setdefault("bio", {})["email"] = email
            sources["email"] = {"value": email, "sourceUrl": api_url, "retrievedAt": retrieved_at}
        if record.get("status") == 0 and not profile.get("primaryRole"):
            set_field(profile, "currentRole", "Deputet i Kuvendit të Shqipërisë", api_url, retrieved_at, reason)
            profile.setdefault("mandates", []).append({
                "period": None,
                "role": "Deputet i Kuvendit të Shqipërisë",
                "current": True,
                "sourceUrl": api_url,
            })
            sources["mandates"] = {"value": str(len(profile["mandates"])), "sourceUrl": api_url, "retrievedAt": retrieved_at}
        photo_url = (record.get("fotoProfil") or "").strip()
        if photo_url.startswith("http") and not (sources.get("photo") or {}).get("value"):
            profile["officialPhoto"] = {
                "sourceUrl": photo_url,
                "licence": "No reuse licence published by the Parliament of Albania. Referenced by URL; file not copied.",
                "retrievedAt": retrieved_at,
                "copied": False,
                "localPath": None,
            }
            profile["photoLicence"] = profile["officialPhoto"]["licence"]
            if not profile.get("photo_source_url"):
                profile["photo_source_url"] = photo_url
            sources["photo"] = {"value": photo_url, "sourceUrl": photo_url, "retrievedAt": retrieved_at, "licence": profile["photoLicence"]}
        detail = details.get(record.get("id"))
        if detail and not profile.get("parliamentaryGroup"):
            for struct in detail.get("strukturat") or []:
                title = (struct.get("emer") or "").strip()
                if struct.get("tip") == 6 or "grupi parlamentar" in title.casefold():
                    set_field(profile, "parliamentaryGroup", title, api_url, retrieved_at)
                    profile.setdefault("affiliations", []).append({"kind": "parliamentary-group", "label": title, "detail": None, "url": api_url})
                    break
        register_birth = civil_birth_date(record.get("ditlindje"))
        cv_url = cv_document(detail)
        cv_fields: Dict[str, Optional[str]] = {}
        if cv_url:
            try:
                cv_fields = parse_cv_text(read_pdf_text(cv_url))
                cv_used += 1
            except Exception as exc:
                conflicts.append({"vip_id": profile["id"], "name": profile["name"], "field": "cv", "chosen": "", "rejected": cv_url, "reason": str(exc)[:180]})
        chosen_birth = cv_fields.get("dateOfBirth") or register_birth
        existing_birth = profile.get("dateOfBirth")
        if chosen_birth and existing_birth and chosen_birth != existing_birth:
            conflicts.append({
                "vip_id": profile["id"],
                "name": profile["name"],
                "field": "dateOfBirth",
                "chosen": chosen_birth,
                "rejected": existing_birth,
                "reason": "official CV or Kuvendi register preferred over the previously stored date",
            })
        if chosen_birth and chosen_birth != existing_birth:
            source = cv_url if cv_fields.get("dateOfBirth") else api_url
            set_field(profile, "dateOfBirth", chosen_birth, source, retrieved_at, "CV" if cv_fields.get("dateOfBirth") else "Kuvendi register")
        if cv_fields.get("placeOfBirth") and not profile.get("placeOfBirth"):
            set_field(profile, "placeOfBirth", cv_fields["placeOfBirth"], cv_url or api_url, retrieved_at, "CV")
        elif not profile.get("placeOfBirth") and (record.get("vendlindje") or "").strip():
            set_field(profile, "placeOfBirth", title_case_source(record["vendlindje"].strip()), api_url, retrieved_at)
        if cv_fields.get("education"):
            previous = (sources.get("education") or {}).get("sourceUrl") or ""
            if previous and "wikidata.org" in previous:
                conflicts.append({"vip_id": profile["id"], "name": profile["name"], "field": "education", "chosen": cv_url or "", "rejected": previous, "reason": "Parliament CV preferred over Wikidata"})
            set_field(profile, "education", cv_fields["education"], cv_url or api_url, retrieved_at, "Parliament CV")
        if cv_fields.get("career"):
            profile.setdefault("mandates", []).append({
                "period": None,
                "role": cv_fields["career"],
                "current": False,
                "sourceUrl": cv_url,
            })
            sources["mandates"] = {"value": str(len(profile["mandates"])), "sourceUrl": cv_url, "retrievedAt": retrieved_at, "notes": "Parliament CV biography"}
            profile["careerSummary"] = cv_fields["career"]

    still_open = [row for row in unresolved if "ambiguous" not in row["reason"] and "not in the current" in row["reason"]]
    for row in still_open:
        profile = next(item for item in export["profiles"] if item["id"] == row["vip_id"])
        try:
            qid = search_wikidata(re.sub(r"\s*\([^)]*\)", "", profile.get("name") or "").strip())
        except Exception:
            qid = None
        time.sleep(0.15)
        if not qid:
            row["reason"] = row["reason"] + "; no unique Wikidata politician"
            continue
        row["reason"] = row["reason"] + f"; secondary Wikidata {qid} (not used as the identity source)"
        # Secondary fill only for empty education, birth, and dated offices.
        entity_url = f"https://www.wikidata.org/wiki/{qid}"
        try:
            entity = fetch_entities([qid]).get(qid) or {}
        except Exception:
            entity = {}
        claims = entity.get("claims") or {}
        if not profile.get("dateOfBirth"):
            for statement in claims.get("P569") or []:
                parsed = wd_time(statement.get("mainsnak", {}).get("datavalue", {}).get("value"))
                if parsed:
                    set_field(profile, "dateOfBirth", parsed, entity_url, retrieved_at, "secondary Wikidata")
                    break
        if not profile.get("education"):
            labels = {item: label_of(ent) for item, ent in fetch_entities(claim_ids(claims, "P69")).items()} if claim_ids(claims, "P69") else {}
            education = "; ".join(label for label in labels.values() if label)
            if education:
                set_field(profile, "education", education, entity_url, retrieved_at, "secondary Wikidata")
        if not profile.get("mandates"):
            labels = {item: label_of(ent) for item, ent in fetch_entities(claim_ids(claims, "P39")).items()} if claim_ids(claims, "P39") else {}
            positions = positions_from_claims(claims, labels)
            dated = [item for item in positions if item.get("start") or item.get("end")]
            if dated:
                profile["mandates"] = [{
                    "period": " — ".join(part for part in (item.get("start"), item.get("end")) if part) or None,
                    "role": item["role"],
                    "current": bool(item.get("current")),
                    "sourceUrl": entity_url,
                } for item in dated[:8]]
                profile.setdefault("fieldSources", {})["mandates"] = {"value": str(len(profile["mandates"])), "sourceUrl": entity_url, "retrievedAt": retrieved_at, "notes": "secondary Wikidata"}
                current = [item for item in dated if item.get("current")]
                if current and not profile.get("primaryRole"):
                    set_field(profile, "currentRole", current[-1]["role"], entity_url, retrieved_at, "secondary Wikidata")

    export["official_sources_retrieved_at"] = retrieved_at
    EXPORT_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / "dob_conflicts.csv").write_text("", encoding="utf-8")
    with (OUT_DIR / "dob_conflicts.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "field", "chosen", "rejected", "reason"])
        writer.writeheader()
        writer.writerows(conflicts)
    with (OUT_DIR / "unresolved_names.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "reason"])
        writer.writeheader()
        writer.writerows(unresolved)
    summary = rewrite_outputs_from_export()
    summary["newlyMatchedKuvendi"] = matched
    summary["cvDocumentsRead"] = cv_used
    summary["unresolved"] = len(unresolved)
    summary["conflicts"] = len(conflicts)
    COVERAGE_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def is_politician_entity(claims: Dict[str, Any]) -> bool:
    return "Q5" in claim_ids(claims, "P31") and bool(claim_ids(claims, "P106") or claim_ids(claims, "P39"))


def apply_residual_matches() -> Dict[str, Any]:
    """Second pass for spelling aliases and unique Wikidata identities still awaiting a name source."""
    retrieved_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    export = json.loads(EXPORT_PATH.read_text(encoding="utf-8"))
    records = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    details = {}
    detail_path = OUT_DIR / "kuvendi_details.snapshot.json"
    if detail_path.exists():
        details = json.loads(detail_path.read_text(encoding="utf-8"))
    unresolved = []
    for profile in export["profiles"]:
        sources = profile.get("fieldSources") or {}
        if (sources.get("fullName") or {}).get("value"):
            continue
        record, reason = match_kuvendi_record(profile.get("name") or "", records)
        if record:
            api_url = f"{KUVENDI_API}/{record.get('id')}"
            set_field(profile, "fullName", profile.get("name") or "", api_url, retrieved_at, reason)
            if record.get("status") == 0 and not profile.get("primaryRole"):
                set_field(profile, "currentRole", "Deputet i Kuvendit të Shqipërisë", api_url, retrieved_at, reason)
            if not profile.get("dateOfBirth"):
                birth = civil_birth_date(record.get("ditlindje"))
                if birth:
                    set_field(profile, "dateOfBirth", birth, api_url, retrieved_at, "Kuvendi register")
            detail = details.get(record.get("id"))
            cv_url = cv_document(detail)
            if cv_url and not profile.get("education"):
                try:
                    parsed = parse_cv_text(read_pdf_text(cv_url))
                except Exception:
                    parsed = {}
                if parsed.get("education"):
                    set_field(profile, "education", parsed["education"], cv_url, retrieved_at, "Parliament CV")
                if parsed.get("dateOfBirth") and not profile.get("dateOfBirth"):
                    set_field(profile, "dateOfBirth", parsed["dateOfBirth"], cv_url, retrieved_at, "CV")
                if parsed.get("career") and not profile.get("careerSummary"):
                    profile.setdefault("mandates", []).append({"period": None, "role": parsed["career"], "current": False, "sourceUrl": cv_url})
                    profile["careerSummary"] = parsed["career"]
                    profile.setdefault("fieldSources", {})["mandates"] = {"value": str(len(profile["mandates"])), "sourceUrl": cv_url, "retrievedAt": retrieved_at, "notes": "Parliament CV biography"}
            continue
        query = re.sub(r"\s*\([^)]*\)", "", profile.get("name") or "").strip()
        qid = None
        try:
            data = http_json("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode({
                "action": "wbsearchentities", "search": query, "language": "sq", "type": "item", "limit": 5, "format": "json",
            }))
            folded = fold(query)
            candidates = []
            for hit in data.get("search") or []:
                label = fold(hit.get("label") or "")
                if label == folded or levenshtein(label, folded) <= 2:
                    candidates.append(hit.get("id"))
            if len(candidates) == 1:
                qid = candidates[0]
        except Exception:
            qid = None
        time.sleep(0.15)
        accepted = False
        if qid:
            entity = fetch_entities([qid]).get(qid) or {}
            claims = entity.get("claims") or {}
            if is_politician_entity(claims):
                accepted = True
                entity_url = f"https://www.wikidata.org/wiki/{qid}"
                set_field(profile, "fullName", profile.get("name") or "", entity_url, retrieved_at, "unique Wikidata politician; secondary to a missing Kuvendi row")
                if not profile.get("dateOfBirth"):
                    for statement in claims.get("P569") or []:
                        parsed = wd_time(statement.get("mainsnak", {}).get("datavalue", {}).get("value"))
                        if parsed:
                            set_field(profile, "dateOfBirth", parsed, entity_url, retrieved_at, "secondary Wikidata")
                            break
                if not profile.get("education") and claim_ids(claims, "P69"):
                    labels = {item: label_of(ent) for item, ent in fetch_entities(claim_ids(claims, "P69")).items()}
                    education = "; ".join(label for label in labels.values() if label)
                    if education:
                        set_field(profile, "education", education, entity_url, retrieved_at, "secondary Wikidata")
                if not profile.get("primaryRole") and claim_ids(claims, "P39"):
                    labels = {item: label_of(ent) for item, ent in fetch_entities(claim_ids(claims, "P39")).items()}
                    positions = [item for item in positions_from_claims(claims, labels) if item.get("current")]
                    if positions:
                        set_field(profile, "currentRole", positions[-1]["role"], entity_url, retrieved_at, "secondary Wikidata")
        if not accepted:
            unresolved.append({"vip_id": profile["id"], "name": profile["name"], "reason": reason if not qid else f"Wikidata {qid} is not a unique human politician"})
    with (OUT_DIR / "unresolved_names.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "reason"])
        writer.writeheader()
        writer.writerows(unresolved)
    export["official_sources_retrieved_at"] = retrieved_at
    EXPORT_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = rewrite_outputs_from_export()
    summary["unresolved"] = len(unresolved)
    COVERAGE_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def html_to_text(payload: bytes) -> str:
    import html as html_lib
    page = payload.decode("utf-8", "replace")
    page = re.sub(r"<script[\s\S]*?</script>", " ", page, flags=re.I)
    page = re.sub(r"<style[\s\S]*?</style>", " ", page, flags=re.I)
    page = re.sub(r"<[^>]+>", " ", page)
    return re.sub(r"\s+", " ", html_lib.unescape(page)).strip()


def fetch_bytes(url: str, accept: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(2_000_000)


def fetch_text(url: str) -> str:
    return html_to_text(fetch_bytes(url, "text/html"))


def fetch_json(url: str) -> Any:
    return json.loads(fetch_bytes(url, "application/json").decode("utf-8"))


def read_document_text(url: str) -> str:
    """Read a Parliament CV. PDF goes through pypdf. A docx zip yields its document XML."""
    import io
    import zipfile
    payload = fetch_bytes(quote_url(url), "*/*")
    if payload[:2] == b"PK":
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            xml = archive.read("word/document.xml").decode("utf-8", "replace")
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", xml))
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(payload))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


_OFFICE_NAME = r"([A-ZÇË][\wËÇëç'’.\-]+(?:\s+[A-ZÇË][\wËÇëç'’.\-]+){1,3})"


def offices_from_public_pages(pages: Dict[str, str]) -> List[Dict[str, str]]:
    """Titles copied from pages fetched on this run. No office is inferred from memory."""
    found: List[Dict[str, str]] = []
    socialist = pages.get("https://ps.al/") or ""
    match = re.search(
        rf"Kryeministr\w+,\s*njëherësh Kryetar i Partisë Socialiste,\s*{_OFFICE_NAME}",
        socialist,
    )
    if match:
        found.append({
            "name": match.group(1).strip(),
            "role": "Kryeministër, njëherësh Kryetar i Partisë Socialiste",
            "sourceUrl": "https://ps.al/",
            "notes": "Party homepage uses this title in the present tense",
        })
    democrat = pages.get("https://pd.al/") or ""
    match = re.search(
        rf"Kryetari i Partisë Demokratike,\s*(?:Prof\.\s*Dr\.\s*)?{_OFFICE_NAME}",
        democrat,
    )
    if match:
        found.append({
            "name": match.group(1).strip(),
            "role": "Kryetar i Partisë Demokratike",
            "sourceUrl": "https://pd.al/",
            "notes": "Party homepage uses this title in the present tense",
        })
    tirana = pages.get("https://www.tirana.al/faqe/kryetari-i-bashkise") or ""
    if "Erion Veliaj është Kryetar i Bashkisë së Tiranës" in tirana:
        found.append({
            "name": "Erion Veliaj",
            "role": "Kryetar i Bashkisë së Tiranës",
            "sourceUrl": "https://www.tirana.al/faqe/kryetari-i-bashkise",
            "notes": "Municipality page states the present-tense office",
        })
    return found


def roster_member(name: str) -> Optional[Dict[str, Any]]:
    import sys
    root = str(ROOT)
    if root not in sys.path:
        sys.path.insert(0, root)
    from services.parliament_roster_service import CERTIFIED_2025_ROSTER
    target = fold(name)
    for member in CERTIFIED_2025_ROSTER:
        if fold(member.get("name") or "") == target:
            return member
    return None


def kuvendi_id_of(profile: Dict[str, Any]) -> str:
    url = ((profile.get("fieldSources") or {}).get("fullName") or {}).get("sourceUrl") or ""
    marker = "/api/anetaret/"
    if marker not in url:
        return ""
    return url.rstrip("/").split("/")[-1]


def former_role_from_mandates(mandates: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    dated = [
        mandate for mandate in mandates
        if mandate.get("period")
        and len(mandate.get("role") or "") <= 80
        and not str(mandate.get("role") or "").startswith("Lista ")
    ]
    if not dated:
        return None
    return sorted(dated, key=lambda item: item.get("period") or "")[-1]


def profile_for_office(name: str, profiles: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Use an exact name. If several cards share it, keep the single active one."""
    target = fold(name)
    exact = [profile for profile in profiles if fold(profile.get("name") or "") == target]
    if len(exact) == 1:
        return exact[0]
    active = [profile for profile in exact if profile.get("parliamentaryStatus") == "active_mp"]
    if len(active) == 1:
        return active[0]
    return None


def remember_link(profile: Dict[str, Any], label: str, url: str) -> None:
    links = profile.setdefault("officialLinks", [])
    if url and not any((link.get("url") or "") == url for link in links):
        links.append({"label": label, "url": url})


def apply_specific_role(profile: Dict[str, Any], role: str, source_url: str, retrieved_at: str, notes: str) -> None:
    previous = profile.get("primaryRole")
    set_field(profile, "currentRole", role, source_url, retrieved_at, notes)
    if previous and previous != role and len(str(previous)) <= 80:
        secondary = [item for item in (profile.get("secondaryRoles") or []) if item != previous and item != role]
        profile["secondaryRoles"] = [previous, *secondary][:4]
    remember_link(profile, role, source_url)


def fill_cached_register_fields(profile: Dict[str, Any], detail: Dict[str, Any], api_url: str, retrieved_at: str) -> None:
    if not detail:
        return
    sources = profile.get("fieldSources") or {}
    if not profile.get("placeOfBirth") and (detail.get("vendlindje") or "").strip():
        set_field(profile, "placeOfBirth", title_case_source(detail["vendlindje"].strip()), api_url, retrieved_at, "Kuvendi register")
    if not profile.get("parliamentaryGroup"):
        for struct in detail.get("strukturat") or []:
            title = (struct.get("emer") or "").strip()
            if struct.get("tip") == 6 or "grupi parlamentar" in title.casefold():
                set_field(profile, "parliamentaryGroup", title, api_url, retrieved_at, "Kuvendi register")
                break
    if not (sources.get("party") or {}).get("value") and (detail.get("partia") or "").strip():
        set_field(profile, "party", detail["partia"].strip(), api_url, retrieved_at, "Kuvendi register")


def fill_cv_gaps(profile: Dict[str, Any], detail: Dict[str, Any], retrieved_at: str, stats: Dict[str, int]) -> None:
    if profile.get("education"):
        return
    cv_url = cv_document(detail)
    if not cv_url:
        return
    try:
        parsed = parse_cv_text(read_document_text(cv_url))
    except Exception:
        stats["cvFailed"] = stats.get("cvFailed", 0) + 1
        return
    stats["cvRead"] = stats.get("cvRead", 0) + 1
    if parsed.get("education"):
        set_field(profile, "education", parsed["education"], cv_url, retrieved_at, "Parliament CV")
        stats["educationFilled"] = stats.get("educationFilled", 0) + 1
    if parsed.get("placeOfBirth") and not profile.get("placeOfBirth"):
        set_field(profile, "placeOfBirth", parsed["placeOfBirth"], cv_url, retrieved_at, "Parliament CV")
    if parsed.get("dateOfBirth") and not profile.get("dateOfBirth"):
        set_field(profile, "dateOfBirth", parsed["dateOfBirth"], cv_url, retrieved_at, "Parliament CV")
    if parsed.get("career") and not profile.get("careerSummary"):
        profile.setdefault("mandates", []).append({
            "period": None,
            "role": parsed["career"],
            "current": False,
            "sourceUrl": cv_url,
        })
        profile["careerSummary"] = parsed["career"]
        profile.setdefault("fieldSources", {})["mandates"] = {
            "value": str(len(profile["mandates"])),
            "sourceUrl": cv_url,
            "retrievedAt": retrieved_at,
            "notes": "Parliament CV biography",
        }


def kuvendi_rows_for_name(name: str, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    target = base_name(name)
    return [record for record in records if fold(f"{record.get('emer') or ''} {record.get('mbiemer') or ''}") == target]


def choose_boci_row(name: str, zone: Optional[str], sitting: bool, records: List[Dict[str, Any]]) -> Tuple[Optional[Dict[str, Any]], str]:
    """Two Kuvendi rows share this name. Keep a row only when district and sitting status agree."""
    rows = kuvendi_rows_for_name(name, records)
    if fold(name) not in ("luciano boci", "luçiano boci"):
        return None, "not the duplicated Boçi register name"
    matched = []
    for record in rows:
        district = QARK_MAP.get(record.get("qarku"))
        if zone and district and fold(district) != fold(zone):
            continue
        matched.append(record)
    if sitting:
        current = [record for record in matched if record.get("status") == 0]
        if len(current) == 1:
            return current[0], "current Kuvendi row whose district matches the certified constituency Shkodër"
        return None, "no single current Shkodër row"
    return None, "the other Kuvendi row is Elbasan, which does not match this profile's Shkodër district"


MANUAL_RETRIEVED_AT = "2026-10-31"
RAMA_CABINET_URL = "https://kryeministria.al/ministrat/edi-rama/"
PIRDENI_OATH_URL = "https://president.al/adea-pirdeni-betohet-para-presidentit-te-republikes-si-minister-i-administrates-publike/"
BEGAJ_BIO_URL = "https://president.al/jeteshkrimi-presidentit/"
KQZ_CANDIDATE_DB_URL = "https://kqz.gov.al/kandidatet"
KQZ_NEGATIVE_SENTENCE = (
    "Manual search of https://kqz.gov.al/kandidatet on 2026-10-31 (filters 2023-09-24, 2024-08-04, "
    "2025-05-11, 2025-11-09) did not find this name. That database has no 2021 parliamentary list "
    "and no 2023-05-14 local list, and 2025 multi-name lists were not checked line by line. "
    "This is a negative search log, not a fact stored on the profile."
)
EXHAUSTED_IDENTITY = (
    "No row in the current Kuvendi register, not on the KQZ Decision No. 34 list of 140, "
    "and Wikidata search returned no entity. kryeministria.al and the ministry hosts on that "
    "network return an Incapsula challenge to this collector. " + KQZ_NEGATIVE_SENTENCE + " "
    "Fletorja Zyrtare (qbz.gov.al) is a JavaScript application whose act-search API is not in the "
    "public page. Earlier-legislature biography files are not in the current register snapshot."
)

# Titles on https://kryeministria.al/menu-qeveria/ were paired with names by page order and URL slug.
# Only rows with an independent prose source, or a Wikidata office that names the same post, are stored.
CONFIRMED_CABINET_ROLES = (
    {
        "name": "Adea Pirdeni",
        "role": "Ministër i Administratës Publike",
        "sourceUrl": PIRDENI_OATH_URL,
        "notes": (
            "president.al news of 23 October 2026 states that Adea Pirdeni takes the oath as "
            "Ministër i Administratës Publike. Retrieved 2026-10-31. The cabinet slug "
            "https://kryeministria.al/ministrat/adea-pirdeni/ was paired with that title by page order, "
            "so the oath article is the source. Wikidata Q130357788 has an undated broader label and was not used as the title."
        ),
    },
)
CABINET_ROLES_NOT_ADDED = (
    {"name": "diella", "reason": "Slug only. No person was created for this cabinet URL."},
    {"name": "Albana Koçiu", "reason": "In the 279. Deputy-prime-minister title is page-order only. Wikidata Q131409942 records an undated health-and-welfare ministry, which does not confirm that title."},
    {"name": "Ervin Demo", "reason": "In the 279. Interior-minister title is page-order only. Wikidata Q134542622 records an undated mayoralty of Berat, not this office."},
    {"name": "Ferit Hoxha", "reason": "Not in the 279. No profile was created."},
    {"name": "Petrit Malaj", "reason": "In the 279. Finance-minister title is page-order only. Wikidata Q135095772 has no position statement."},
    {"name": "Enea Karakaci", "reason": "Not in the 279. No profile was created."},
    {"name": "Ermal Nufi", "reason": "Not in the 279. No profile was created."},
    {"name": "Toni Gogu", "reason": "In the 279 (two cards). Justice-minister title is page-order only. Wikidata Q136351034 has no position statement."},
    {"name": "Mirela Kumbaro", "reason": "In the 279. Education-minister title is page-order only. Wikidata Q15724978 records undated culture and tourism posts, not education."},
    {"name": "Klodiana Spahiu", "reason": "In the 279. Health-minister title is page-order only. Wikidata Q31965321 has no matching office."},
    {"name": "Andis Salla", "reason": "Not in the 279. No profile was created."},
    {"name": "Delina Ibrahimaj", "reason": "In the 279. Economy-and-innovation title is page-order only. Wikidata Q108698181 records an undated finance post, not this office."},
    {"name": "Blendi Gonxhja", "reason": "In the 279. Tourism-culture-sport title is page-order only. Wikidata Q124972664 has no position statement."},
    {"name": "Sofjan Jaupaj", "reason": "Not in the 279. No profile was created."},
    {"name": "Majlinda Dhuka", "reason": "Not in the 279. No profile was created."},
    {"name": "Erjona Ismaili", "reason": "In the 279. Parliamentary-relations title is page-order only. Wikidata Q139088605 has no position statement."},
    {"name": "Bajram Begaj", "reason": "Verified biography on president.al was not attached because the 279 contains no profile with this name. No profile was created."},
)
KQZ_CANDIDATE_NEGATIVES = (
    {"name": "Gëzim Bara", "query": "Bara", "result": "No Bara row except Barbara Doda, MUNDËSIA, Tiranë, who is a different person."},
    {"name": "Ana Dhamo", "query": "Dhamo", "result": "No row."},
    {"name": "Artur Bushaj", "query": "Bushaj", "result": "No row."},
    {"name": "Prishela Gjoka", "query": "Gjoka", "result": "No row."},
    {"name": "Shpresa Marnikollaj", "query": "Marnikollaj", "result": "No row."},
    {"name": "Anila Agalliu", "query": "Agalliu", "result": "No row."},
    {"name": "Artemis Dralo", "query": "Dralo", "result": "No row."},
    {"name": "Sabina Jorgo", "query": "Jorgo", "result": "Only Jorgo Kaça, PARTIA SOCIALDEMOKRATE, Vlorë, a different person. Sabina Jorgo was not found."},
    {"name": "Marjeta Neli", "query": "Neli", "result": "Only Neli Demi, KOALICIONI EUROATLANTIK, Tiranë, a different person. Marjeta Neli was not found."},
    {"name": "Albana Pëllumbi", "query": "Pëllumbi", "result": "No row."},
    {"name": "Dhimitër Kruti", "query": "Kruti", "result": "No row."},
)


def begaj_biography() -> Dict[str, str]:
    """Quotes from the presidency biography. Applied only when a profile already has this name."""
    return {
        "name": "Bajram Begaj",
        "role": "President i Republikës së Shqipërisë",
        "dateOfBirth": "1967-03-20",
        "placeOfBirth": "Rrogozhinë",
        "education": "Ka përfunduar studimet për mjekësi në Universitetin e Tiranës; specializim Gastro-Hepatologji; studime doktorale; Profesor i Asociuar që nga 2016",
        "career": "Mjek ushtarak në Forcat e Armatosura, karrierë 32-vjeçare; më 2020, një muaj pas gradës Gjeneral Major, Shefi i Shtabit të Përgjithshëm të Forcave të Armatosura. Presidenti i 8-të i Republikës së Shqipërisë prej 24 korrik 2022.",
        "sourceUrl": BEGAJ_BIO_URL,
        "notes": "Biography page retrieved 2026-10-31. Born 20 mars 1967 in Rrogozhinë; president since 24 korrik 2022.",
    }


def apply_confirmed_browser_facts(profiles: List[Dict[str, Any]], retrieved_at: str = MANUAL_RETRIEVED_AT) -> Dict[str, List[str]]:
    """Store the 2026-10-31 browser reads that are independently confirmed. Do not create people."""
    applied: List[str] = []
    rama = profile_for_office("Edi Rama", profiles)
    if rama:
        remember_link(rama, "Kryeministër", RAMA_CABINET_URL)
        role = (rama.get("fieldSources") or {}).get("currentRole") or {}
        if role.get("value"):
            note = (
                f"Cabinet profile {RAMA_CABINET_URL} retrieved {retrieved_at} shows KRYEMINISTËR; the slug is edi-rama. "
                "The stored title also includes the party chair, which is stated in prose at https://ps.al/."
            )
            if RAMA_CABINET_URL not in (role.get("notes") or ""):
                role["notes"] = ((role.get("notes") or "").rstrip() + " " + note).strip()
            role.setdefault("retrievedAt", retrieved_at)
        applied.append("Edi Rama")
    for office in CONFIRMED_CABINET_ROLES:
        profile = profile_for_office(office["name"], profiles)
        if not profile:
            continue
        apply_specific_role(profile, office["role"], office["sourceUrl"], retrieved_at, office["notes"])
        applied.append(office["name"])
    biography = begaj_biography()
    president = profile_for_office(biography["name"], profiles)
    if president:
        set_field(president, "currentRole", biography["role"], biography["sourceUrl"], retrieved_at, biography["notes"])
        set_field(president, "dateOfBirth", biography["dateOfBirth"], biography["sourceUrl"], retrieved_at, biography["notes"])
        set_field(president, "placeOfBirth", biography["placeOfBirth"], biography["sourceUrl"], retrieved_at, biography["notes"])
        set_field(president, "education", biography["education"], biography["sourceUrl"], retrieved_at, biography["notes"])
        president["careerSummary"] = biography["career"]
        mandates = president.setdefault("mandates", [])
        if not any(item.get("sourceUrl") == biography["sourceUrl"] for item in mandates):
            mandates.append({"period": "2022-07-24 —", "role": biography["role"], "current": True, "sourceUrl": biography["sourceUrl"]})
        president.setdefault("fieldSources", {})["mandates"] = {
            "value": str(len(mandates)),
            "sourceUrl": biography["sourceUrl"],
            "retrievedAt": retrieved_at,
            "notes": biography["notes"],
        }
        remember_link(president, biography["role"], biography["sourceUrl"])
        applied.append(biography["name"])
    return {
        "applied": applied,
        "notAdded": [row["name"] for row in CABINET_ROLES_NOT_ADDED],
    }


def refresh_unresolved_kqz_note() -> None:
    """Keep the candidate-database miss in the name log. It is not written onto a profile."""
    path = OUT_DIR / "unresolved_names.csv"
    if not path.exists():
        return
    with path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    watched = {row["name"] for row in KQZ_CANDIDATE_NEGATIVES}
    stale = "kqz.gov.al has no public candidate-list search (/rezultatet and the 2023 local path return 404), and "
    for row in rows:
        if row.get("name") not in watched:
            continue
        reason = (row.get("reason") or "").replace(stale, "")
        if KQZ_CANDIDATE_DB_URL not in reason:
            reason = (reason.rstrip() + " " + KQZ_NEGATIVE_SENTENCE).strip()
        row["reason"] = reason
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "reason"])
        writer.writeheader()
        writer.writerows(rows)


def write_browser_finding_logs() -> None:
    """Negative KQZ searches and cabinet rows that were not stored on a card."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with (OUT_DIR / "kqz_kandidatet_negatives.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["name", "query", "result", "source_url", "retrieved_at", "scope"])
        writer.writeheader()
        for row in KQZ_CANDIDATE_NEGATIVES:
            writer.writerow({
                "name": row["name"],
                "query": row["query"],
                "result": row["result"],
                "source_url": KQZ_CANDIDATE_DB_URL,
                "retrieved_at": MANUAL_RETRIEVED_AT,
                "scope": "kandidatet year filters 2023-09-24, 2024-08-04, 2025-05-11, 2025-11-09; not a 2021 or 2023-05-14 list; not written onto the profile",
            })
    with (OUT_DIR / "cabinet_roles_not_added.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["name", "reason", "source_url", "retrieved_at"])
        writer.writeheader()
        for row in CABINET_ROLES_NOT_ADDED:
            writer.writerow({
                "name": row["name"],
                "reason": row["reason"],
                "source_url": "https://kryeministria.al/menu-qeveria/",
                "retrieved_at": MANUAL_RETRIEVED_AT,
            })
    refresh_unresolved_kqz_note()
BOCI_FORMER_REASON = (
    "Two Kuvendi rows share this name. The sitting row is Shkodër, status 0, and is used only "
    "for the active Shkodër profile. The other row is Elbasan, status 1, which does not match "
    "this profile's Shkodër district, so it was not used. Wikidata Q6706730 has one undated "
    "office and supplies no former-role dates."
)


def apply_role_round() -> Dict[str, Any]:
    """Fill current and former roles from sources that could be read on this run."""
    retrieved_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    export = json.loads(EXPORT_PATH.read_text(encoding="utf-8"))
    records = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    by_id = {record.get("id"): record for record in records}
    detail_path = OUT_DIR / "kuvendi_details.snapshot.json"
    details = json.loads(detail_path.read_text(encoding="utf-8")) if detail_path.exists() else {}
    cv_stats: Dict[str, int] = {}
    for profile in export["profiles"]:
        sources = profile.setdefault("fieldSources", {})
        certified = roster_member(profile.get("name") or "")
        if certified and certified.get("party") and not (sources.get("party") or {}).get("value"):
            set_field(
                profile,
                "party",
                certified["party"],
                "https://kqz.gov.al",
                retrieved_at,
                "KQZ Decision No. 34, 28 August 2025; electoral subject on the certified list",
            )
        if fold(profile.get("name") or "") in ("luciano boci", "luçiano boci"):
            sitting = profile.get("parliamentaryStatus") == "active_mp"
            chosen, note = choose_boci_row(profile.get("name") or "", profile.get("electoralZone"), sitting, records)
            if chosen:
                api_url = f"{KUVENDI_API}/{chosen.get('id')}"
                detail = details.get(chosen.get("id")) or {}
                if not detail:
                    try:
                        detail = fetch_json(api_url)
                    except Exception:
                        detail = {}
                set_field(profile, "fullName", profile.get("name") or "", api_url, retrieved_at, note)
                if not profile.get("primaryRole"):
                    set_field(profile, "currentRole", "Deputet i Kuvendit të Shqipërisë", api_url, retrieved_at, note)
                fill_cached_register_fields(profile, detail, api_url, retrieved_at)
                # Keep the certified electoral-subject code. The register may spell the same
                # subject differently (PD-ASHM versus PD-AMSH) and must not replace it.
                certified_party = (roster_member(profile.get("name") or "") or {}).get("party")
                if certified_party:
                    set_field(
                        profile,
                        "party",
                        certified_party,
                        "https://kqz.gov.al",
                        retrieved_at,
                        "KQZ Decision No. 34, 28 August 2025; electoral subject. The Kuvendi register spells this subject PD-ASHM.",
                    )
                    profile["party"] = certified_party
                fill_cv_gaps(profile, detail, retrieved_at, cv_stats)
                remember_link(profile, "Regjistri i Kuvendit / Parliament register", api_url)
            continue
        record_id = kuvendi_id_of(profile)
        record = by_id.get(record_id)
        if record_id:
            api_url = f"{KUVENDI_API}/{record_id}"
            fill_cached_register_fields(profile, details.get(record_id) or {}, api_url, retrieved_at)
            fill_cv_gaps(profile, details.get(record_id) or {}, retrieved_at, cv_stats)
        if profile.get("primaryRole"):
            continue
        if profile.get("parliamentaryStatus") == "active_mp" and roster_constituency(profile.get("name") or ""):
            set_field(
                profile,
                "currentRole",
                "Deputet i Kuvendit të Shqipërisë",
                "https://kqz.gov.al",
                retrieved_at,
                "KQZ Decision No. 34, 28 August 2025; certified elected member",
            )
            if not (sources.get("fullName") or {}).get("value"):
                set_field(profile, "fullName", profile.get("name") or "", "https://kqz.gov.al", retrieved_at, "KQZ Decision No. 34, 28 August 2025")
            continue
        if profile.get("parliamentaryStatus") != "active_mp":
            latest = former_role_from_mandates(profile.get("mandates") or [])
            if latest:
                set_field(
                    profile,
                    "currentRole",
                    f"{latest['role']} ({latest['period']})",
                    latest.get("sourceUrl") or "",
                    retrieved_at,
                    "former office; the period is taken from the cited source",
                )
                continue
        if record and record.get("status") != 0 and profile.get("parliamentaryStatus") != "active_mp":
            api_url = f"{KUVENDI_API}/{record.get('id')}"
            set_field(
                profile,
                "currentRole",
                "Ish-deputet i Kuvendit të Shqipërisë",
                api_url,
                retrieved_at,
                "Kuvendi register row is not marked sitting and the person is not on the KQZ 2025 list of 140; the row has no mandate dates",
            )
        elif record and record.get("status") == 0 and not profile.get("primaryRole"):
            api_url = f"{KUVENDI_API}/{record.get('id')}"
            set_field(
                profile,
                "currentRole",
                "Deputet i Kuvendit të Shqipërisë",
                api_url,
                retrieved_at,
                "Kuvendi register status marks a sitting member",
            )

    page_errors: List[str] = []
    pages: Dict[str, str] = {}
    for url in ("https://ps.al/", "https://pd.al/", "https://www.tirana.al/faqe/kryetari-i-bashkise"):
        try:
            pages[url] = fetch_text(url)
        except Exception as exc:
            page_errors.append(f"{url}: {exc.__class__.__name__}")
    for office in offices_from_public_pages(pages):
        profile = profile_for_office(office["name"], export["profiles"])
        if profile:
            apply_specific_role(profile, office["role"], office["sourceUrl"], retrieved_at, office["notes"])
    try:
        structures = fetch_json("https://kuvendiapi.azurewebsites.net/api/strukturat")
        deputies = next((item for item in structures if item.get("status") == 0 and fold(item.get("emer") or "") == "zevendeskryetaret"), None)
        if deputies:
            source_url = f"https://kuvendiapi.azurewebsites.net/api/strukturat/{deputies['id']}/anetaret"
            for member in fetch_json(source_url):
                full = f"{member.get('emer') or ''} {member.get('mbiemer') or ''}".strip()
                holders = [profile for profile in export["profiles"] if kuvendi_id_of(profile) == member.get("id")]
                profile = holders[0] if len(holders) == 1 else None
                if not profile or profile.get("parliamentaryStatus") != "active_mp":
                    profile = profile_for_office(full, export["profiles"])
                if profile and profile.get("parliamentaryStatus") == "active_mp":
                    apply_specific_role(
                        profile,
                        "Zëvendëskryetar i Kuvendit të Shqipërisë",
                        source_url,
                        retrieved_at,
                        "Current Kuvendi structure 'Zëvendëskryetarët' lists this sitting member",
                    )
        id_to_profiles: Dict[str, List[Dict[str, Any]]] = {}
        for profile in export["profiles"]:
            record_id = kuvendi_id_of(profile)
            if record_id:
                id_to_profiles.setdefault(record_id, []).append(profile)
        for structure in structures:
            if structure.get("tip") != 1 or structure.get("status") != 0:
                continue
            source_url = f"https://kuvendiapi.azurewebsites.net/api/strukturat/{structure['id']}/anetaret"
            try:
                members = fetch_json(source_url)
            except Exception:
                continue
            label = f"Anëtar, {structure.get('emer')}"
            for member in members:
                holders = id_to_profiles.get(member.get("id")) or []
                if len(holders) != 1:
                    continue
                profile = holders[0]
                secondary = [
                    ("Anëtar, " + item[len("Anëtar i "):]) if isinstance(item, str) and item.startswith("Anëtar i ") else item
                    for item in (profile.get("secondaryRoles") or [])
                ]
                secondary = [item for item in secondary if item != label]
                if len(secondary) < 4:
                    profile["secondaryRoles"] = [*secondary, label][:4]
                mandates = profile.setdefault("mandates", [])
                for item in mandates:
                    if isinstance(item.get("role"), str) and item["role"].startswith("Anëtar i "):
                        item["role"] = "Anëtar, " + item["role"][len("Anëtar i "):]
                if not any(item.get("role") == label and item.get("sourceUrl") == source_url for item in mandates):
                    mandates.append({"period": None, "role": label, "current": False, "sourceUrl": source_url})
                sources = profile.setdefault("fieldSources", {})
                if not (sources.get("mandates") or {}).get("value"):
                    sources["mandates"] = {
                        "value": str(len(mandates)),
                        "sourceUrl": source_url,
                        "retrievedAt": retrieved_at,
                        "notes": "Current Kuvendi committee membership",
                    }
    except Exception as exc:
        page_errors.append(f"kuvendi strukturat: {exc.__class__.__name__}")

    browser = apply_confirmed_browser_facts(export["profiles"], retrieved_at)
    write_browser_finding_logs()

    unresolved = []
    for profile in export["profiles"]:
        sourced_name = (profile.get("fieldSources") or {}).get("fullName", {}).get("value")
        if fold(profile.get("name") or "") in ("luciano boci", "luçiano boci") and profile.get("parliamentaryStatus") != "active_mp":
            unresolved.append({"vip_id": profile["id"], "name": profile["name"], "reason": BOCI_FORMER_REASON})
            continue
        if sourced_name:
            continue
        unresolved.append({"vip_id": profile["id"], "name": profile["name"], "reason": EXHAUSTED_IDENTITY})
    EXPORT_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (OUT_DIR / "unresolved_names.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "reason"])
        writer.writeheader()
        writer.writerows(unresolved)
    summary = rewrite_outputs_from_export()
    summary["unresolved"] = len(unresolved)
    summary["cvGaps"] = cv_stats
    summary["pageErrors"] = page_errors
    summary["browserFactsApplied"] = browser["applied"]
    summary["browserFactsNotAdded"] = browser["notAdded"]
    non_null_scores = sum(1 for profile in export["profiles"] if profile.get("composite") is not None or profile.get("dynamicScore") is not None)
    summary["nonNullScores"] = non_null_scores
    COVERAGE_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect citable official politician fields")
    parser.add_argument("--offline", action="store_true", help="Reuse the Kuvendi snapshot and skip network lookups")
    parser.add_argument("--enrich", action="store_true", help="Fill gaps with unique name variants and Parliament CVs")
    parser.add_argument("--residual", action="store_true", help="Match remaining names by documented spellings and unique Wikidata identities")
    parser.add_argument("--roles", action="store_true", help="Fill current and former roles from KQZ and the Kuvendi register")
    parser.add_argument("--browser", action="store_true", help="Apply the 2026-10-31 confirmed browser reads and write the negative logs")
    args = parser.parse_args()
    if args.browser:
        export = json.loads(EXPORT_PATH.read_text(encoding="utf-8"))
        browser = apply_confirmed_browser_facts(export["profiles"])
        write_browser_finding_logs()
        EXPORT_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        summary = rewrite_outputs_from_export()
        summary["browserFactsApplied"] = browser["applied"]
        summary["browserFactsNotAdded"] = browser["notAdded"]
        COVERAGE_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    elif args.roles:
        summary = apply_role_round()
    elif args.residual:
        summary = apply_residual_matches()
    elif args.enrich:
        summary = enrich()
    else:
        summary = collect(offline=args.offline)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
