#!/usr/bin/env python3
"""Merge duplicate politician cards without dropping a sourced field.

NOVARIC® Sh.A. Ramadan Likaj keeps the Kuvendi party PD-ASHM, stored as PD-AMSH.
Toni Gogu keeps the Kuvendi party Partia Socialiste, stored as PS.
The removed ids stay in profileRedirects.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
CSV_PATH = ROOT / "data" / "official" / "politician_field_sources.csv"

# canonical, duplicate, official party slug
PAIRS = (
    ("vip103", "vip190", "PD-AMSH"),
    ("vip16", "vip169", "PS"),
)


def merge_lists(left, right):
    if not isinstance(left, list):
        left = []
    if not isinstance(right, list):
        return left
    if right and isinstance(right[0], str):
        seen = list(left)
        for item in right:
            if item not in seen:
                seen.append(item)
        return seen
    if right and isinstance(right[0], dict):
        seen = list(left)
        keys = {(item.get("label") or item.get("sourceUrl") or item.get("role") or "") for item in seen if isinstance(item, dict)}
        for item in right:
            key = item.get("label") or item.get("sourceUrl") or item.get("role") or ""
            if key not in keys:
                seen.append(item)
                keys.add(key)
        return seen
    return left or right


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    by_id = {profile["id"]: profile for profile in export["profiles"]}
    redirects = dict(export.get("profileRedirects") or {})
    for canonical_id, duplicate_id, party in PAIRS:
        kept = by_id[canonical_id]
        other = by_id[duplicate_id]
        kept["party"] = party
        for field in ("education", "careerSummary", "placeOfBirth", "dateOfBirth", "email", "electoralZone", "primaryRole", "parliamentaryGroup"):
            if not kept.get(field) and other.get(field):
                kept[field] = other[field]
        for field in ("secondaryRoles", "affiliations", "mandates", "officialLinks", "evidence"):
            kept[field] = merge_lists(kept.get(field), other.get(field))
        sources = kept.setdefault("fieldSources", {})
        for field, source in (other.get("fieldSources") or {}).items():
            current = sources.get(field) or {}
            if not (current.get("value") or "") and (source.get("value") or ""):
                sources[field] = source
        kept["mergedFrom"] = sorted(set((kept.get("mergedFrom") or []) + [duplicate_id]))
        redirects[duplicate_id] = canonical_id
        redirects[duplicate_id.replace("vip", "")] = canonical_id
        export["profiles"] = [profile for profile in export["profiles"] if profile["id"] != duplicate_id]
        by_id.pop(duplicate_id, None)
    export["profileRedirects"] = redirects
    export["total_profiles"] = len(export["profiles"])
    EXPORT.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    with CSV_PATH.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames
        rows = list(reader)
    for canonical_id, duplicate_id, _party in PAIRS:
        kept_fields = {(row["field"]) for row in rows if row["vip_id"] == canonical_id and (row.get("value") or "").strip()}
        for row in rows:
            if row["vip_id"] != duplicate_id:
                continue
            note = row.get("notes") or ""
            marker = f"Merged into {canonical_id}."
            if marker not in note:
                row["notes"] = (note + " " + marker).strip()
            if (row.get("value") or "").strip() and row["field"] not in kept_fields:
                rows.append({
                    **row,
                    "vip_id": canonical_id,
                    "notes": f"Copied from {duplicate_id} during merge. {row.get('notes') or ''}".strip(),
                })
                kept_fields.add(row["field"])
    with CSV_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({"profiles": len(export["profiles"]), "redirects": redirects}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
