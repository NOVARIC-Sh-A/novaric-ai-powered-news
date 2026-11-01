#!/usr/bin/env python3
"""Fill committee attendance only for profiles the earlier file does not already count.

Membership comes from the current Kuvendi committee lists
(https://kuvendiapi.azurewebsites.net/api/strukturat, status 0). A meeting counts
only when a procesverbal is assigned to exactly one of those committees and its
header lists "Marrin pjesë" or "Mungojnë". A name is used only when it folds to
exactly one member of that committee. No similarity match is applied.

A profile stays null when it has no current committee seat, its Kuvendi id is
absent, a minute for its committee could not be read, or its name is ambiguous.
Null is stored as JSON null, never as 0.
"""

from __future__ import annotations

import hashlib
import json
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from scripts.collect_committee_governance import attendance_lists, is_committee_minute
from scripts.collect_kuvendi_rollcalls import fold, quote_url

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
EXISTING = ROOT / "data" / "official" / "committee_governance.json"
OUT = ROOT / "data" / "official" / "committee_attendance_gap.json"
CACHE = Path("/tmp/committee-minute-text")
DOCS_URL = "https://kuvendiapi.azurewebsites.net/api/dokumentet"
STRUCTURES_URL = "https://kuvendiapi.azurewebsites.net/api/strukturat"
SINCE = "2025-09-01"
VERIFIED = "2026-11-01"
UA = "Mozilla/5.0 (compatible; NOVARIC-audit/1.0)"

# Folded substrings that identify one current committee and no other.
COMMITTEE_TOKENS = {
    "79a12b70-68b1-4842-88b3-28f801154b4c": ("jashtme", "evropen dhe punet"),
    "d4bdce12-ff27-4ac8-8e16-2b0e42805ab7": ("brendshme",),
    "6ac360ad-4c72-4f68-abf0-3a24913b4547": ("shendetesine", "shendetesi"),
    "e05ba580-b5ca-43e3-8b78-97e1d90ac7ad": ("kulturen", "turizmin", "diasporen"),
    "8cbf532f-365a-4757-a11c-b27e573d7386": ("drejtat e njeriut", "mjetet e informimit publik"),
    "9b45e1c9-cd13-4440-b1aa-b2bc685db025": ("kepf", "ekonomine", "punesimin dhe financat"),
    "ade07d9e-e391-41b0-a1bf-bb505f6b3b06": ("ligjore", "ligjeve"),
    "47fe240c-8972-457b-a05e-df3e67db1b26": ("burimet natyrore", "infrastrukturen"),
    "7d899ce1-2a7e-4b04-bdca-ffe2f447c148": ("edukimin", "edukimit", "shkencen dhe sportet"),
    "0b3ed4f2-4dca-41b8-b82a-5c14ee4db9d7": ("administrativo",),
    "bc859489-dc02-4943-94c5-a18503c0a195": ("zgjedhore",),
    "c6e6e070-54e5-466c-9e35-f0ec3f2237d8": ("tims",),
    "9102a23a-865c-43fb-b491-68238bee5b35": ("integritetin e informacionit", "dezinformimin dhe nderhyrj"),
}


def fetch_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.loads(response.read().decode())


def kuvendi_id(profile: dict) -> str | None:
    blobs = []
    for field in (profile.get("fieldSources") or {}).values():
        if isinstance(field, dict):
            blobs.append(field.get("sourceUrl") or "")
    for link in profile.get("officialLinks") or []:
        if isinstance(link, dict):
            blobs.append(link.get("url") or "")
    for blob in blobs:
        marker = "/api/anetaret/"
        if marker in blob:
            token = blob.split(marker, 1)[1].split("?", 1)[0].strip("/")
            if len(token) >= 36:
                return token[:36]
    return None


def assign_committee(filename: str, known_ids: set[str]) -> str | None:
    low = fold(filename)
    if "nenkomision" in low or low.startswith("n komision") or "n.komision" in low:
        # A subcommittee file is used only for the current subcommittee token.
        hits = [cid for cid, tokens in COMMITTEE_TOKENS.items() if cid in known_ids and any(token in low for token in tokens) and "integritet" in low or "dezinform" in low]
        hits = [cid for cid in hits if cid == "9102a23a-865c-43fb-b491-68238bee5b35"]
        return hits[0] if len(hits) == 1 else None
    hits = []
    for cid, tokens in COMMITTEE_TOKENS.items():
        if cid not in known_ids:
            continue
        if any(token in low for token in tokens):
            hits.append(cid)
    if len(hits) == 1:
        return hits[0]
    return None


def minute_text(url: str) -> str:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / (hashlib.sha256(url.encode()).hexdigest() + ".txt")
    if path.exists():
        return path.read_text(encoding="utf-8")
    request = urllib.request.Request(quote_url(url), headers={"User-Agent": UA, "Referer": "https://www.parlament.al/"})
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = response.read(8_000_000)
    import tempfile
    import subprocess
    with tempfile.NamedTemporaryFile(suffix=".pdf") as handle:
        handle.write(payload)
        handle.flush()
        text = subprocess.check_output(["pdftotext", handle.name, "-"], text=True, stderr=subprocess.DEVNULL)
    path.write_text(text, encoding="utf-8")
    return text


def main():
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    existing = json.loads(EXISTING.read_text(encoding="utf-8"))
    already = set(existing.get("people") or {})
    profiles = export["profiles"]
    by_uuid = defaultdict(list)
    for profile in profiles:
        member_id = kuvendi_id(profile)
        if member_id:
            by_uuid[member_id].append(profile)

    structures = fetch_json(STRUCTURES_URL)
    committees = []
    for item in structures:
        name = (item.get("emer") or "").strip()
        low = fold(name)
        if item.get("status") != 0 or item.get("tip") not in (1, 2, 3, 4):
            continue
        if "komision" not in low:
            continue
        if low.startswith("sherbimi") or low.startswith("interpelanc"):
            continue
        if item["id"] not in COMMITTEE_TOKENS:
            continue
        committees.append(item)
    known_ids = {item["id"] for item in committees}
    names = {item["id"]: item["emer"].strip() for item in committees}

    membership = defaultdict(list)  # profile_id -> [{committeeId, name, memberName, sourceUrl}]
    official_name = {}  # (committee_id, profile_id) -> folded official name
    unmatched_members = []
    ambiguous_members = []
    for committee in committees:
        source_url = f"{STRUCTURES_URL}/{committee['id']}/anetaret"
        members = fetch_json(source_url)
        for member in members:
            official = " ".join(part for part in (member.get("emer"), member.get("mbiemer")) if part).strip()
            holders = by_uuid.get(member.get("id")) or []
            folded_names = {fold(item["name"]) for item in holders}
            if len(holders) == 0:
                unmatched_members.append({
                    "name": official,
                    "memberId": member.get("id"),
                    "committee": names[committee["id"]],
                    "sourceUrl": source_url,
                })
                continue
            if len(folded_names) != 1:
                ambiguous_members.append({
                    "name": official,
                    "memberId": member.get("id"),
                    "committee": names[committee["id"]],
                    "profileIds": [item["id"] for item in holders],
                    "sourceUrl": source_url,
                })
                continue
            for profile in holders:
                membership[profile["id"]].append({
                    "committeeId": committee["id"],
                    "committee": names[committee["id"]],
                    "memberName": official,
                    "sourceUrl": source_url,
                })
                official_name[(committee["id"], profile["id"])] = fold(official)

    docs = fetch_json(DOCS_URL)
    selected = []
    unassigned_files = []
    seen_urls = set()
    for doc in docs:
        if (doc.get("dateKrijimi") or "") < SINCE or not doc.get("url"):
            continue
        filename = doc.get("fileName") or ""
        if not is_committee_minute(filename):
            continue
        if doc["url"] in seen_urls:
            continue
        seen_urls.add(doc["url"])
        committee_id = assign_committee(filename, known_ids)
        if not committee_id:
            unassigned_files.append({"fileName": filename, "url": doc.get("url")})
            continue
        selected.append({**doc, "committeeId": committee_id})

    failed = []

    def read(doc):
        try:
            return doc, minute_text(doc["url"]), ""
        except Exception as exc:
            return doc, "", str(exc)[:180]

    parsed = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(read, doc) for doc in selected]
        done = 0
        for future in as_completed(futures):
            done += 1
            doc, text, error = future.result()
            if error or not text.strip():
                failed.append({"fileName": doc.get("fileName"), "url": doc.get("url"), "committeeId": doc["committeeId"], "error": error or "empty"})
                continue
            present, absent = attendance_lists(text)
            if not present and not absent:
                continue
            parsed.append((doc, present, absent))
            if done % 40 == 0:
                print(f"read {done}/{len(selected)}", flush=True)

    failed_committees = {item["committeeId"] for item in failed}
    parsed_committees = {doc["committeeId"] for doc, _present, _absent in parsed}
    # Index members of each committee by folded official name.
    # folded official name -> member id -> profile cards. Two cards for one member are not ambiguous.
    members_by_committee = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for profile_id, seats in membership.items():
        for seat in seats:
            folded = official_name[(seat["committeeId"], profile_id)]
            member_key = f"{seat['committeeId']}|{folded}|{seat['memberName']}"
            members_by_committee[seat["committeeId"]][folded][member_key].append(profile_id)

    ambiguous_names = []
    unmatched_names = defaultdict(int)
    # profile -> committee -> {present, meetings, urls}
    tallies = defaultdict(lambda: defaultdict(lambda: {"present": 0, "meetings": 0, "urls": []}))
    blocked_profiles = set()

    for doc, present, absent in parsed:
        committee_id = doc["committeeId"]
        by_folded = members_by_committee.get(committee_id) or {}
        named = {}
        for raw_name, status in [(name, "present") for name in present] + [(name, "absent") for name in absent]:
            groups = by_folded.get(fold(raw_name)) or {}
            if len(groups) > 1:
                profile_ids = sorted({profile_id for ids in groups.values() for profile_id in ids})
                ambiguous_names.append({
                    "name": raw_name,
                    "committeeId": committee_id,
                    "profileIds": profile_ids,
                    "url": doc.get("url"),
                })
                blocked_profiles.update(profile_ids)
                continue
            if len(groups) == 0:
                unmatched_names[raw_name] += 1
                continue
            for profile_id in next(iter(groups.values())):
                named[profile_id] = status
        for folded, groups in by_folded.items():
            if len(groups) != 1:
                continue
            for profile_id in next(iter(groups.values())):
                if profile_id not in named:
                    continue
                row = tallies[profile_id][committee_id]
                row["meetings"] += 1
                if named[profile_id] == "present":
                    row["present"] += 1
                if doc.get("url") and doc["url"] not in row["urls"]:
                    row["urls"].append(doc["url"])

    people = {}
    reason_counts = defaultdict(int)
    for profile in profiles:
        profile_id = profile["id"]
        if profile_id in already:
            continue
        seats = membership.get(profile_id) or []
        record = {
            "present": None,
            "meetings": None,
            "periodStart": SINCE,
            "periodEnd": VERIFIED,
            "verifiedAt": VERIFIED,
            "sourceUrls": [],
            "committees": [seat["committee"] for seat in seats],
            "membershipUrls": sorted({seat["sourceUrl"] for seat in seats}),
            "reason": None,
        }
        if not kuvendi_id(profile):
            record["reason"] = "no_kuvendi_id"
        elif not seats:
            record["reason"] = "no_committee_membership"
        elif profile_id in blocked_profiles:
            record["reason"] = "ambiguous_name"
        elif any(seat["committeeId"] in failed_committees for seat in seats):
            record["reason"] = "minutes_missing"
        else:
            present = 0
            meetings = 0
            urls = []
            incomplete = None
            for seat in seats:
                if seat["committeeId"] not in parsed_committees:
                    incomplete = "minutes_missing"
                    break
                row = tallies[profile_id].get(seat["committeeId"])
                if not row or row["meetings"] <= 0:
                    incomplete = "name_not_on_rolls"
                    break
                present += row["present"]
                meetings += row["meetings"]
                urls.extend(row["urls"])
            if incomplete or meetings <= 0:
                record["reason"] = incomplete or "name_not_on_rolls"
            else:
                record["present"] = present
                record["meetings"] = meetings
                record["sourceUrls"] = urls
                record["reason"] = None
        reason_counts[record["reason"] or "counted"] += 1
        people[profile_id] = record

    payload = {
        "retrievedAt": VERIFIED,
        "since": SINCE,
        "until": VERIFIED,
        "method": "committee_membership_exact_v1",
        "source": STRUCTURES_URL,
        "documents": DOCS_URL,
        "note": "Exact folded name only. Profiles already present in committee_governance.json are not rewritten.",
        "committees": [{"id": item["id"], "name": names[item["id"]]} for item in committees],
        "minutesAssigned": len(selected),
        "minutesParsed": len(parsed),
        "minutesFailed": failed,
        "unassignedFiles": unassigned_files,
        "ambiguousMembers": ambiguous_members,
        "unmatchedMembers": unmatched_members,
        "ambiguousMinuteNames": ambiguous_names,
        "unmatchedMinuteNames": sorted(unmatched_names.items(), key=lambda item: -item[1]),
        "reasonCounts": dict(reason_counts),
        "people": people,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    counted = sum(1 for row in people.values() if isinstance(row.get("present"), int) and isinstance(row.get("meetings"), int))
    print(json.dumps({
        "assigned": len(selected),
        "parsed": len(parsed),
        "failed": len(failed),
        "gapProfiles": len(people),
        "counted": counted,
        "reasons": dict(reason_counts),
        "ambiguousMinuteNames": len(ambiguous_names),
        "unmatchedMinuteNames": len(unmatched_names),
        "unmatchedMembers": len(unmatched_members),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
