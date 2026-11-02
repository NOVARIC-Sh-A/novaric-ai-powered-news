#!/usr/bin/env python3
"""Merge duplicate politician profiles found on 2 November 2026.

Groups are the same person when the folded name matches (diacritics, case,
and a parenthetical suffix removed) or the Kuvendi member id matches.
Likaj (vip103) and Gogu (vip16) stay as already merged.

A score that differs between two cards is not overwritten. Both values are
written to the audit snapshot. Empty fields on the canonical card are filled
from the duplicate. Removed cards are kept in
data/paragon/duplicate_snapshots_2026-11-02.json.
"""

from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
SNAPSHOT = ROOT / "data" / "paragon" / "duplicate_snapshots_2026-11-02.json"
DOC = ROOT / "docs" / "paragon" / "duplicate-merges-2026-11-02.md"
SQL = ROOT / "db" / "migrations" / "20261102_paragon_duplicate_merges.sql"
REDIRECTS_TS = ROOT / "utils" / "profileRedirects.ts"
VITE = ROOT / "vite.config.ts"
OFFICIAL = [
    ROOT / "data" / "official" / "kuvendi_rollcall_scores.json",
    ROOT / "data" / "official" / "committee_governance.json",
    ROOT / "data" / "official" / "plenary_assertiveness.json",
    ROOT / "data" / "official" / "narrative_consistency.json",
    ROOT / "data" / "official" / "committee_attendance_gap.json",
]
DIMS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"]


def fold(value: str) -> str:
    text = unicodedata.normalize("NFKD", value or "")
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("ë", "e").replace("ç", "c")
    text = text.lower()
    text = re.sub(r"\([^)]*\)", " ", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def kuvendi_id(profile: dict) -> str | None:
    blobs = []
    for field in (profile.get("fieldSources") or {}).values():
        if isinstance(field, dict):
            blobs.append(field.get("sourceUrl") or "")
    for link in profile.get("officialLinks") or []:
        if isinstance(link, dict):
            blobs.append(link.get("url") or "")
    for blob in blobs:
        if "/api/anetaret/" in blob:
            token = blob.split("/api/anetaret/", 1)[1].split("?", 1)[0].strip("/")
            if len(token) >= 36:
                return token[:36]
    return None


def merge_lists(left, right):
    if not isinstance(left, list):
        left = []
    if not isinstance(right, list):
        return left
    if not right:
        return left
    if isinstance(right[0], str):
        seen = list(left)
        for item in right:
            if item not in seen:
                seen.append(item)
        return seen
    if isinstance(right[0], dict):
        seen = list(left)
        keys = set()
        for item in seen:
            if isinstance(item, dict):
                keys.add(item.get("label") or item.get("sourceUrl") or item.get("role") or json.dumps(item, sort_keys=True))
        for item in right:
            key = item.get("label") or item.get("sourceUrl") or item.get("role") or json.dumps(item, sort_keys=True)
            if key not in keys:
                seen.append(item)
                keys.add(key)
        return seen
    return left or right


class UnionFind:
    def __init__(self):
        self.parent = {}

    def add(self, item):
        self.parent.setdefault(item, item)

    def find(self, item):
        self.add(item)
        while self.parent[item] != item:
            self.parent[item] = self.parent[self.parent[item]]
            item = self.parent[item]
        return item

    def union(self, left, right):
        self.parent[self.find(left)] = self.find(right)


def choose_canonical(group: list[dict]) -> dict:
    def rank(profile):
        status = profile.get("parliamentaryStatus") or ""
        active = 0 if status == "active_mp" else 1
        suffixed = 1 if "(" in (profile.get("name") or "") else 0
        return (active, suffixed, profile.get("numericId") or 10_000)

    return sorted(group, key=rank)[0]


def number_or_none(value):
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    return None


def score_conflicts(canonical: dict, other: dict) -> list[dict]:
    found = []
    left = canonical.get("paragonDimensions") or []
    right = other.get("paragonDimensions") or []
    for index, label in enumerate(DIMS):
        a = number_or_none(left[index] if index < len(left) else None)
        b = number_or_none(right[index] if index < len(right) else None)
        if a is not None and b is not None and abs(a - b) > 0.05:
            found.append({
                "field": label,
                "canonical": a,
                "duplicate": b,
                "duplicateId": other["id"],
            })
    a = number_or_none(canonical.get("composite"))
    b = number_or_none(other.get("composite"))
    if a is not None and b is not None and abs(a - b) > 0.05:
        found.append({
            "field": "composite",
            "canonical": a,
            "duplicate": b,
            "duplicateId": other["id"],
        })
    return found


def fill_scores(canonical: dict, other: dict) -> list[str]:
    filled = []
    left = list(canonical.get("paragonDimensions") or [None] * 7)
    right = list(other.get("paragonDimensions") or [None] * 7)
    while len(left) < 7:
        left.append(None)
    changed = False
    for index, label in enumerate(DIMS):
        if number_or_none(left[index]) is None and number_or_none(right[index] if index < len(right) else None) is not None:
            left[index] = right[index]
            filled.append(f"{label} from {other['id']}")
            changed = True
    if changed and any(number_or_none(item) is not None for item in left):
        canonical["paragonDimensions"] = left
    if number_or_none(canonical.get("composite")) is None and number_or_none(other.get("composite")) is not None:
        canonical["composite"] = other["composite"]
        filled.append(f"composite from {other['id']}")
    if canonical.get("dynamicScore") is None and other.get("dynamicScore") is not None and number_or_none(canonical.get("composite")) == number_or_none(other.get("composite")):
        canonical["dynamicScore"] = other["dynamicScore"]
    return filled


def copy_observatory(canonical_id: str, duplicate_id: str, conflicts: list[dict]) -> list[str]:
    notes = []
    for path in OFFICIAL:
        payload = json.loads(path.read_text(encoding="utf-8"))
        people = payload.get("people")
        if not isinstance(people, dict):
            continue
        duplicate = people.get(duplicate_id)
        current = people.get(canonical_id)
        if duplicate is None:
            continue
        if current is None:
            people[canonical_id] = json.loads(json.dumps(duplicate))
            notes.append(f"{path.name}: copied {duplicate_id} onto {canonical_id}")
        elif json.dumps(current, sort_keys=True) != json.dumps(duplicate, sort_keys=True):
            conflicts.append({
                "field": f"observatory:{path.name}",
                "canonicalId": canonical_id,
                "duplicateId": duplicate_id,
                "canonical": current,
                "duplicate": duplicate,
            })
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return notes


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    profiles = export["profiles"]
    uf = UnionFind()
    for profile in profiles:
        uf.add(profile["id"])
    by_fold = defaultdict(list)
    by_kid = defaultdict(list)
    for profile in profiles:
        by_fold[fold(profile.get("name") or "")].append(profile["id"])
        member = kuvendi_id(profile)
        if member:
            by_kid[member].append(profile["id"])
    for ids in list(by_fold.values()) + list(by_kid.values()):
        for other in ids[1:]:
            uf.union(ids[0], other)

    groups = defaultdict(list)
    by_id = {profile["id"]: profile for profile in profiles}
    for profile in profiles:
        groups[uf.find(profile["id"])].append(profile)
    duplicate_groups = [group for group in groups.values() if len(group) > 1]

    redirects = dict(export.get("profileRedirects") or {})
    snapshots = []
    report_groups = []
    all_conflicts = []

    for group in sorted(duplicate_groups, key=lambda items: min(item.get("numericId") or 0 for item in items)):
        canonical = choose_canonical(group)
        duplicates = [item for item in group if item["id"] != canonical["id"]]
        group_conflicts = []
        filled = []
        field_conflicts = []
        for other in duplicates:
            group_conflicts.extend(score_conflicts(canonical, other))
            filled.extend(fill_scores(canonical, other))
            photo_fields = {"imageUrl", "officialPhotoPath", "photo_source_url"}
            for field in (
                "education", "careerSummary", "placeOfBirth", "dateOfBirth", "email",
                "electoralZone", "primaryRole", "parliamentaryGroup", "imageUrl",
                "officialPhotoPath", "photo_source_url", "dateOfBirthSourceUrl",
            ):
                if field in photo_fields and canonical.get("photoPending") is True:
                    continue
                current = canonical.get(field)
                incoming = other.get(field)
                if not current and incoming:
                    canonical[field] = incoming
                    filled.append(f"{field} from {other['id']}")
                elif current and incoming and str(current) != str(incoming):
                    field_conflicts.append({
                        "field": field,
                        "canonicalId": canonical["id"],
                        "duplicateId": other["id"],
                        "canonical": current,
                        "duplicate": incoming,
                    })
            if canonical.get("party") and other.get("party") and canonical.get("party") != other.get("party"):
                field_conflicts.append({
                    "field": "party",
                    "canonicalId": canonical["id"],
                    "duplicateId": other["id"],
                    "canonical": canonical.get("party"),
                    "duplicate": other.get("party"),
                })
            for field in ("secondaryRoles", "affiliations", "mandates", "officialLinks", "evidence"):
                canonical[field] = merge_lists(canonical.get(field), other.get(field))
            sources = canonical.setdefault("fieldSources", {})
            for field, source in (other.get("fieldSources") or {}).items():
                current = sources.get(field) or {}
                current_value = current.get("value") if isinstance(current, dict) else None
                incoming_value = source.get("value") if isinstance(source, dict) else None
                if not current_value and incoming_value:
                    sources[field] = source
                elif current_value and incoming_value and str(current_value) != str(incoming_value):
                    field_conflicts.append({
                        "field": f"fieldSources.{field}",
                        "canonicalId": canonical["id"],
                        "duplicateId": other["id"],
                        "canonical": current_value,
                        "duplicate": incoming_value,
                    })
            if isinstance(other.get("officialPhoto"), dict) and not canonical.get("officialPhoto"):
                canonical["officialPhoto"] = other["officialPhoto"]
            observatory_notes = copy_observatory(canonical["id"], other["id"], group_conflicts)
            filled.extend(observatory_notes)
            snapshots.append(other)
            redirects[other["id"]] = canonical["id"]
            redirects[str(other.get("numericId"))] = canonical["id"]
            canonical["mergedFrom"] = sorted(set((canonical.get("mergedFrom") or []) + [other["id"]]))
        report_groups.append({
            "canonical": canonical["id"],
            "name": canonical.get("name"),
            "kuvendiId": kuvendi_id(canonical),
            "duplicates": [item["id"] for item in duplicates],
            "filled": filled,
            "scoreConflicts": group_conflicts,
            "fieldConflicts": field_conflicts,
        })
        all_conflicts.extend(group_conflicts)
        all_conflicts.extend(field_conflicts)

    removed = {item["id"] for item in snapshots}
    export["profiles"] = [profile for profile in profiles if profile["id"] not in removed]
    export["profileRedirects"] = redirects
    export["total_profiles"] = len(export["profiles"])
    export["scored_count"] = sum(1 for profile in export["profiles"] if number_or_none(profile.get("composite")) is not None)
    EXPORT.write_text(json.dumps(export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SNAPSHOT.write_text(json.dumps({
        "recordedAt": "2026-11-02T20:30:00Z",
        "note": "Full cards removed from the public list. Scores were not overwritten on the canonical card when they disagreed.",
        "profiles": snapshots,
        "groups": report_groups,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Duplicate profile merges, 2 November 2026",
        "",
        "Approver: Dr Alban Gj. THIKA. Time: 21:30 Europe/Tirana (`2026-11-02T21:30:00+01:00`).",
        "",
        "Likaj stays `vip103` (old `vip190`) and Gogu stays `vip16` (old `vip169`). Those redirects were not changed.",
        "",
        f"Public profiles after the merge: {len(export['profiles'])}. Removed cards: {len(snapshots)}.",
        "Each removed card is stored in `data/paragon/duplicate_snapshots_2026-11-02.json`.",
        "A conflicting score was left on the canonical card and both values are listed here.",
        "",
    ]
    if not all_conflicts:
        lines.append("No stored D1–D7 score or composite disagreed inside a duplicate group.")
        lines.append("")
    for group in report_groups:
        lines.append(f"## {group['name']} → `{group['canonical']}`")
        lines.append("")
        lines.append(f"Kuvendi member id: `{group['kuvendiId'] or 'none on the card'}`.")
        lines.append("Merged ids: " + ", ".join(f"`{item}`" for item in group["duplicates"]) + ".")
        if group["filled"]:
            lines.append("Filled empty canonical fields: " + "; ".join(group["filled"]) + ".")
        if group["scoreConflicts"] or group["fieldConflicts"]:
            lines.append("")
            lines.append("Conflicts, canonical value kept:")
            for item in group["scoreConflicts"] + group["fieldConflicts"]:
                lines.append(f"- {item['field']}: canonical `{item.get('canonical')}` / {item['duplicateId']} `{item.get('duplicate')}`")
        lines.append("")
    DOC.write_text("\n".join(lines), encoding="utf-8")

    sql_rows = []
    for group in report_groups:
        note = (
            f"Merged {', '.join(group['duplicates'])} into {group['canonical']} ({group['name']}). "
            f"Score conflicts: {len(group['scoreConflicts'])}. Field conflicts: {len(group['fieldConflicts'])}. "
            "Snapshots kept in data/paragon/duplicate_snapshots_2026-11-02.json. No paragon_scores row was updated."
        ).replace("'", "''")
        sql_rows.append(
            "INSERT OR IGNORE INTO paragon_audit_history (\n"
            "    id, politician_id, audit_state, authorized, model_version, note, recorded_at, source_ref\n"
            ") VALUES (\n"
            f"    'hist-merge-{group['canonical']}-20261102',\n"
            f"    '{group['canonical']}',\n"
            "    'published',\n"
            "    1,\n"
            "    'duplicate_merge_2026-11-02',\n"
            f"    '{note}',\n"
            "    '2026-11-02T20:30:00Z',\n"
            "    'docs/paragon/duplicate-merges-2026-11-02.md'\n"
            ");"
        )
    SQL.write_text(
        "-- Insert-only record of the 2 November 2026 duplicate merges.\n"
        "-- Does not UPDATE or DELETE paragon_scores, politicians, or the certified roster.\n\n"
        + "\n\n".join(sql_rows)
        + "\n",
        encoding="utf-8",
    )

    pairs = []
    for source, target in sorted(redirects.items()):
        pairs.append(f"  {json.dumps(source)}: {json.dumps(target)},")
    body = "\n".join(pairs)
    REDIRECTS_TS.write_text(
        "/** Old card ids that now open the merged profile. */\n"
        "export const PROFILE_REDIRECTS: Record<string, string> = {\n"
        f"{body}\n"
        "};\n\n"
        "export function canonicalProfileId(id: string | number | null | undefined): string {\n"
        "  const raw = String(id ?? '').trim();\n"
        "  return PROFILE_REDIRECTS[raw] || PROFILE_REDIRECTS[raw.toLowerCase()] || raw;\n"
        "}\n",
        encoding="utf-8",
    )
    vite = VITE.read_text(encoding="utf-8")
    vite = re.sub(
        r"const PROFILE_REDIRECTS: Record<string, string> = \{.*?\n\};",
        "const PROFILE_REDIRECTS: Record<string, string> = {\n" + body + "\n};",
        vite,
        count=1,
        flags=re.S,
    )
    VITE.write_text(vite, encoding="utf-8")
    print(json.dumps({
        "profiles": len(export["profiles"]),
        "removed": len(snapshots),
        "groups": len(report_groups),
        "scoreConflicts": len([item for item in all_conflicts if item["field"] in DIMS or item["field"] == "composite"]),
        "fieldConflicts": len(all_conflicts),
        "canonicals": [group["canonical"] for group in report_groups],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
