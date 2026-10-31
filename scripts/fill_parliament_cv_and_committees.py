#!/usr/bin/env python3
"""Fill empty profile fields from Kuvendi member records and CV PDFs.

NOVARIC® Sh.A. A field that already has a cited value is left unchanged.
A different CV value is appended to the conflict queue. Unreadable files stay empty.
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
import zipfile
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from ingestion.kuvendi_odata import QARK_MAP
from scripts.collect_official_politician_sources import (
    base_name,
    civil_birth_date,
    fold,
    parse_cv_text,
    quote_url,
    title_case_source,
)

EXPORT = ROOT / "db" / "paragon_scores_export.json"
DETAILS = ROOT / "data" / "official" / "kuvendi_details.snapshot.json"
CSV_PATH = ROOT / "data" / "official" / "politician_field_sources.csv"
CONFLICTS = ROOT / "data" / "official" / "dob_conflicts.csv"
UNRESOLVED = ROOT / "data" / "official" / "unresolved_names.csv"
RETRIEVED = "2026-10-31"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
API = "https://kuvendiapi.azurewebsites.net/api/anetaret"


def empty(value) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return not value.strip()
    if isinstance(value, list):
        return len(value) == 0
    return False


def read_document_text(url: str) -> str:
    import subprocess
    import tempfile
    request = urllib.request.Request(quote_url(url), headers={"User-Agent": UA, "Referer": "https://www.parlament.al/"})
    with urllib.request.urlopen(request, timeout=45) as response:
        payload = response.read(4_000_000)
    lower = url.lower().split("?")[0]
    if lower.endswith(".docx"):
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            xml = archive.read("word/document.xml").decode("utf-8", errors="ignore")
        text = re.sub(r"</w:p>", "\n", xml)
        return re.sub(r"<[^>]+>", "", text)
    if lower.endswith(".pdf"):
        with tempfile.NamedTemporaryFile(suffix=".pdf") as handle:
            handle.write(payload)
            handle.flush()
            return subprocess.check_output(["pdftotext", "-layout", handle.name, "-"], text=True, stderr=subprocess.DEVNULL)
    raise RuntimeError("unsupported document type")


def cv_url_for(detail: dict) -> str:
    for document in detail.get("dokumentat") or []:
        tip = ((document.get("tipDokument") or {}).get("emer") or "").casefold()
        url = document.get("url") or ""
        if not url.startswith("http"):
            continue
        if tip == "cv" or "jet" in tip:
            return url
    return ""


def zone_name(record: dict) -> str:
    qark = record.get("qarku")
    if isinstance(qark, int) and qark in QARK_MAP:
        return QARK_MAP[qark]
    return ""


def match_detail(profile: dict, records: list) -> tuple:
    target = base_name(profile.get("name") or "")
    exact = [record for record in records if f"{fold(record.get('emer') or '')} {fold(record.get('mbiemer') or '')}".strip() == target]
    if len(exact) == 1:
        return exact[0], "exact"
    if len(exact) > 1:
        zone = fold(profile.get("electoralZone") or "")
        zoned = [record for record in exact if zone and fold(zone_name(record)) == zone]
        if len(zoned) == 1:
            return zoned[0], "exact name and official district"
        return None, f"ambiguous: {len(exact)} Kuvendi rows named {target}"
    return None, "no exact Kuvendi detail row"


def upsert_csv(rows: list, vip_id: str, name: str, field: str, value: str, source_url: str, notes: str) -> None:
    for row in rows:
        if row["vip_id"] == vip_id and row["field"] == field:
            if not (row.get("value") or "").strip():
                row["value"] = value
                row["source_url"] = source_url
                row["retrieved_at"] = RETRIEVED
                row["notes"] = notes
            return
    rows.append({
        "vip_id": vip_id,
        "name": name,
        "field": field,
        "value": value,
        "source_url": source_url,
        "retrieved_at": RETRIEVED,
        "licence": "",
        "notes": notes,
    })


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    details = json.loads(DETAILS.read_text(encoding="utf-8"))
    records = list(details.values())
    with CSV_PATH.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames
        csv_rows = list(reader)
    conflicts = list(csv.DictReader(CONFLICTS.open(encoding="utf-8")))
    before = {field: sum(1 for profile in export["profiles"] if not empty(profile.get(field))) for field in (
        "education", "careerSummary", "placeOfBirth", "dateOfBirth", "mandates", "affiliations", "secondaryRoles", "email"
    )}

    jobs = []
    for profile in export["profiles"]:
        detail, reason = match_detail(profile, records)
        if detail and cv_url_for(detail):
            jobs.append((profile["id"], cv_url_for(detail)))

    texts = {}
    failures = []

    def fetch(job):
        vip_id, url = job
        try:
            return vip_id, url, read_document_text(url), ""
        except Exception as exc:
            return vip_id, url, "", str(exc)[:180]

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(fetch, job) for job in jobs]
        for future in as_completed(futures):
            vip_id, url, text, error = future.result()
            if error or not (text or "").strip():
                failures.append((vip_id, url, error or "no extractable text"))
            else:
                texts[vip_id] = (url, text)
    print(f"cv documents {len(jobs)} readable {len(texts)} unreadable {len(failures)}", flush=True)

    added = {field: 0 for field in before}
    new_conflicts = []
    for profile in export["profiles"]:
        detail, reason = match_detail(profile, records)
        if not detail:
            continue
        api = f"{API}/{detail.get('id')}"
        sources = profile.setdefault("fieldSources", {})
        cv = texts.get(profile["id"])
        parsed = parse_cv_text(cv[1]) if cv else {}
        cv_link = cv[0] if cv else ""
        if cv and not parsed.get("career"):
            kept = []
            for line in cv[1].splitlines():
                line = line.strip()
                if not line or re.match(r"^(Dat[eë]lindja|Vendlindja|E-?mail)\b", line, re.I):
                    continue
                if fold(line) == base_name(profile.get("name") or ""):
                    continue
                kept.append(line)
            career = re.sub(r"\s+", " ", " ".join(kept)).strip()
            if len(career) >= 80:
                parsed["career"] = career[:1200]

        def consider(field, new_value, source, notes, assign):
            if not new_value:
                return
            current = profile.get(field)
            if field == "dateOfBirth":
                current = profile.get("dateOfBirth")
            if not empty(current):
                if fold(str(current)) != fold(str(new_value)) and field in ("dateOfBirth", "placeOfBirth", "education", "careerSummary"):
                    new_conflicts.append({
                        "vip_id": profile["id"],
                        "name": profile["name"],
                        "field": field,
                        "chosen": str(current),
                        "rejected": str(new_value)[:300],
                        "reason": f"Existing cited value kept. CV or register value was not applied. Source {source}",
                    })
                return
            assign()
            sources[field] = {"value": new_value if not isinstance(new_value, list) else str(len(new_value)), "sourceUrl": source, "retrievedAt": RETRIEVED, "notes": notes}
            upsert_csv(csv_rows, profile["id"], profile["name"], field, sources[field]["value"], source, notes)
            added[field] += 1

        if parsed.get("dateOfBirth"):
            def assign_dob(value=parsed["dateOfBirth"], source=cv_link):
                profile["dateOfBirth"] = value
                profile["dateOfBirthSourceUrl"] = source
                profile["dateOfBirthVerifiedAt"] = RETRIEVED
                profile["dateOfBirthVerificationStatus"] = "verified"
            consider("dateOfBirth", parsed["dateOfBirth"], cv_link, "Parliament CV Datëlindja line", assign_dob)
        elif empty(profile.get("dateOfBirth")):
            register_dob = civil_birth_date(detail.get("ditlindje"))
            if register_dob:
                def assign_reg(value=register_dob):
                    profile["dateOfBirth"] = value
                    profile["dateOfBirthSourceUrl"] = api
                    profile["dateOfBirthVerifiedAt"] = RETRIEVED
                    profile["dateOfBirthVerificationStatus"] = "verified"
                consider("dateOfBirth", register_dob, api, "Kuvendi register ditlindje", assign_reg)

        if parsed.get("placeOfBirth"):
            place = title_case_source(parsed["placeOfBirth"])
            consider("placeOfBirth", place, cv_link, "Parliament CV Vendlindja line", lambda value=place: profile.__setitem__("placeOfBirth", value))
        elif empty(profile.get("placeOfBirth")) and (detail.get("vendlindje") or "").strip():
            place = title_case_source(detail["vendlindje"].strip())
            consider("placeOfBirth", place, api, "Kuvendi register vendlindje", lambda value=place: profile.__setitem__("placeOfBirth", value))

        if cv and not parsed.get("education"):
            flat = re.sub(r"\s+", " ", cv[1])
            studied = re.search(
                r"([^.]{0,50}(?:studimet universitare|ka kryer studimet|ka përfunduar studimet|është diplomuar|diplomuar në|gradën [^.]{0,40}Universitet\w*)[^.]{0,180})",
                flat,
                re.I,
            )
            if studied:
                parsed["education"] = studied.group(1).strip()[:500]
        if parsed.get("education"):
            consider("education", parsed["education"], cv_link, "Parliament CV", lambda value=parsed["education"]: profile.__setitem__("education", value))
        if parsed.get("career"):
            consider("careerSummary", parsed["career"], cv_link, "Parliament CV Jetëshkrimi. Biography fields shortBio and detailedBio were not written.", lambda value=parsed["career"]: profile.__setitem__("careerSummary", value))

        if empty(profile.get("mandates")) and detail.get("status") == 1:
            mandate = [{"period": None, "role": "Deputet i Kuvendit të Shqipërisë", "current": True, "sourceUrl": api}]
            profile["mandates"] = mandate
            sources["mandates"] = {"value": "1", "sourceUrl": api, "retrievedAt": RETRIEVED, "notes": "Current member row in the Kuvendi register"}
            upsert_csv(csv_rows, profile["id"], profile["name"], "mandates", "1", api, "Current member row in the Kuvendi register")
            added["mandates"] += 1

        email = (detail.get("email") or "").strip()
        if email and "@" in email and empty(profile.get("email")):
            profile["email"] = email
            profile.setdefault("bio", {})["email"] = email
            sources["email"] = {"value": email, "sourceUrl": api, "retrievedAt": RETRIEVED, "notes": "Kuvendi register email"}
            upsert_csv(csv_rows, profile["id"], profile["name"], "email", email, api, "Kuvendi register email")
            added["email"] += 1

        existing_roles = [role for role in (profile.get("secondaryRoles") or []) if isinstance(role, str)]
        existing_aff = {(item.get("label") or "").casefold() for item in (profile.get("affiliations") or []) if isinstance(item, dict)}
        added_roles = []
        for struct in detail.get("strukturat") or []:
            title = re.sub(r"\s+", " ", (struct.get("emer") or "").strip())
            if not title:
                continue
            lowered = title.casefold()
            if "grupi parlamentar" in lowered:
                kind = "parliamentary-group"
            elif lowered.startswith("komisioni") or "komisioni për" in lowered:
                kind = "committee"
            else:
                kind = "parliamentary-body"
            if lowered not in existing_aff:
                profile.setdefault("affiliations", []).append({"kind": kind, "label": title, "detail": None, "url": api})
                existing_aff.add(lowered)
            if kind in ("committee", "parliamentary-group") and title not in existing_roles:
                existing_roles.append(title)
                added_roles.append(title)
        if added_roles:
            profile["secondaryRoles"] = existing_roles
            sources["secondaryRoles"] = {
                "value": " | ".join(existing_roles),
                "sourceUrl": api,
                "retrievedAt": RETRIEVED,
                "notes": "Committee and parliamentary-group names from the member's Kuvendi strukturat list. " + "; ".join(added_roles),
            }
            upsert_csv(csv_rows, profile["id"], profile["name"], "secondaryRoles", " | ".join(existing_roles), api, sources["secondaryRoles"]["notes"])
            added["secondaryRoles"] += 1
        if detail.get("strukturat"):
            labels = [re.sub(r"\s+", " ", (item.get("emer") or "").strip()) for item in detail["strukturat"] if (item.get("emer") or "").strip()]
            if labels and (profile.get("id") and any(item.get("url") == api for item in profile.get("affiliations") or [])):
                sources["affiliations"] = {
                    "value": " | ".join(labels),
                    "sourceUrl": api,
                    "retrievedAt": RETRIEVED,
                    "notes": "Kuvendi member strukturat",
                }
                upsert_csv(csv_rows, profile["id"], profile["name"], "affiliations", " | ".join(labels), api, "Kuvendi member strukturat")
                added["affiliations"] += 1

    # Ilir Metaj's CV is a different person from Ilir Meta. Do not copy it onto vip3.
    meta = next(profile for profile in export["profiles"] if profile["id"] == "vip3")
    new_conflicts.append({
        "vip_id": "vip3",
        "name": meta["name"],
        "field": "dateOfBirth",
        "chosen": meta.get("dateOfBirth") or "",
        "rejected": "1973-12-01",
        "reason": "Kuvendi row ILIR METAJ, CV https://kuvendiwebfiles.blob.core.windows.net/webfiles/202409230731125159ILIR METAJ.pdf, is a Vlorë biography (Flamurtari, business administration) with Datëlindja 01.12.1973. The register ditlindje is the 2022-01-15 import timestamp. That row was not applied to Ilir Meta.",
    })

    for vip_id, url, error in failures:
        profile = next(item for item in export["profiles"] if item["id"] == vip_id)
        new_conflicts.append({
            "vip_id": vip_id,
            "name": profile["name"],
            "field": "cv",
            "chosen": "",
            "rejected": url,
            "reason": error or "no extractable text",
        })

    EXPORT.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with CSV_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(csv_rows)
    seen = {(row.get("vip_id"), row.get("field"), row.get("chosen"), row.get("rejected")) for row in conflicts}
    merged_conflicts = list(conflicts)
    for row in new_conflicts:
        key = (row.get("vip_id"), row.get("field"), row.get("chosen"), row.get("rejected"))
        if key in seen:
            continue
        seen.add(key)
        merged_conflicts.append(row)
    with CONFLICTS.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["vip_id", "name", "field", "chosen", "rejected", "reason"], lineterminator="\n")
        writer.writeheader()
        writer.writerows(merged_conflicts)

    after = {field: sum(1 for profile in export["profiles"] if not empty(profile.get(field))) for field in before}
    print(json.dumps({"before": before, "after": after, "added_events": added, "new_conflicts": len(new_conflicts), "cv_failures": len(failures)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
