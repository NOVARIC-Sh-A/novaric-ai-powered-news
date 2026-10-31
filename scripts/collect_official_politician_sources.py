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
    from services.parliament_roster_service import CERTIFIED_2025_ROSTER
    target = fold(name)
    for member in CERTIFIED_2025_ROSTER:
        if fold(member.get("name") or "") == target and member.get("zone"):
            return member["zone"]
    return None


def repair_open_ended_roles(profile: Dict[str, Any]) -> None:
    """Do not treat an old Wikidata office with no end date as the current role."""
    mandates = profile.get("mandates") or []
    for mandate in mandates:
        source = mandate.get("sourceUrl") or ""
        period = (mandate.get("period") or "").split("—")[0].strip()
        if "wikidata.org" in source and mandate.get("current") and (not period or period < "2021-09-01"):
            mandate["current"] = False
    current = [mandate for mandate in mandates if mandate.get("current")]
    wiki_current = [mandate for mandate in current if "wikidata.org" in (mandate.get("sourceUrl") or "")]
    kuvendi_current = [mandate for mandate in current if "kuvendiapi" in (mandate.get("sourceUrl") or "")]
    chosen = sorted(wiki_current, key=lambda item: item.get("period") or "")[-1] if wiki_current else (kuvendi_current[0] if kuvendi_current else None)
    sources = profile.setdefault("fieldSources", {})
    if chosen:
        profile["primaryRole"] = chosen["role"]
        sources["currentRole"] = {
            "value": chosen["role"],
            "sourceUrl": chosen.get("sourceUrl"),
            "retrievedAt": profile.get("sourceRetrievedAt"),
        }
        profile["secondaryRoles"] = [mandate["role"] for mandate in current if mandate is not chosen][:3]
    else:
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


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect citable official politician fields")
    parser.add_argument("--offline", action="store_true", help="Reuse the Kuvendi snapshot and skip network lookups")
    args = parser.parse_args()
    summary = collect(offline=args.offline)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
