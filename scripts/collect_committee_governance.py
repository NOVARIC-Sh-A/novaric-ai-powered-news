#!/usr/bin/env python3
"""Score Qeverisja inputs from Kuvendi committee minutes.

A member is counted only when a committee procesverbal lists them under
"Marrin pjesë" or "Mungojnë". Guests under "Të ftuar" are ignored.
The attendance percentage is published only when that member is named in
at least three distinct minutes. Everyone else stays unscored.
"""

from __future__ import annotations

import json
import re
import subprocess
import tempfile
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from scripts.collect_kuvendi_rollcalls import fold, quote_url

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
OUT = ROOT / "data" / "official" / "committee_governance.json"
DOCS_URL = "https://kuvendiapi.azurewebsites.net/api/dokumentet"
SINCE = "2025-09-01"
RETRIEVED = "2026-11-01"
MIN_MEETINGS = 3
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

PRESENT_MARK = re.compile(r"marrin\s+pjes[eë]", re.I)
ABSENT_MARK = re.compile(r"mungojn[eë]", re.I)
STOP_MARK = re.compile(
    r"t[eë]\s+ftuar|hapet\s+mbledhja|rendi\s+i\s+dit[eë]s|drejton\s+mbledhjen",
    re.I,
)
SKIP_FILE = (
    "raport",
    "kalendar",
    "njoftim",
    "perberja",
    "perberje",
    "lista",
    "vendim",
    "kerkese",
    "projekt",
    "program",
    "relacion",
    "flete",
)


def is_committee_minute(filename: str) -> bool:
    if not filename.lower().endswith(".pdf"):
        return False
    low = fold(filename)
    if any(token in low for token in SKIP_FILE):
        return False
    if low.startswith("komisioni"):
        return True
    committee = any(token in low for token in ("kepf", "kkie", "komision", "nenkomision"))
    return "procesverbal" in low and committee


def fetch_docs():
    request = urllib.request.Request(DOCS_URL, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.loads(response.read().decode())


def pdf_text(url: str) -> str:
    request = urllib.request.Request(quote_url(url), headers={"User-Agent": UA, "Referer": "https://www.parlament.al/"})
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = response.read(8_000_000)
    with tempfile.NamedTemporaryFile(suffix=".pdf") as handle:
        handle.write(payload)
        handle.flush()
        return subprocess.check_output(["pdftotext", handle.name, "-"], text=True, stderr=subprocess.DEVNULL)


def _window(text: str, start: re.Match, limit: int = 1600) -> str:
    rest = text[start.end():start.end() + limit]
    stop = STOP_MARK.search(rest)
    other = ABSENT_MARK.search(rest) if start.re is PRESENT_MARK else PRESENT_MARK.search(rest)
    end = len(rest)
    if stop:
        end = min(end, stop.start())
    if other and other.start() < end:
        end = other.start()
    return rest[:end]


def split_names(blob: str) -> list[str]:
    blob = re.sub(r"[\x00-\x1f]+", " ", blob)
    blob = re.sub(r"\s+", " ", blob)
    blob = re.sub(r"\bdhe\b", ",", blob, flags=re.I)
    names = []
    for part in blob.split(","):
        part = part.strip()
        part = re.sub(r"\s*\(.*$", "", part)
        part = re.sub(r"\s+[–—-]\s+.*$", "", part).strip()
        part = re.sub(r"[.\s]+\d+$", "", part).strip(" .:;()[]")
        if re.search(r"\d", part):
            continue
        words = [word for word in part.split() if word]
        if not (2 <= len(words) <= 4):
            continue
        if not words[0][:1].isupper():
            continue
        if any(fold(word) in {"kryetar", "kryetare", "zv", "z", "znj"} for word in words):
            continue
        names.append(" ".join(words))
    return names


def attendance_lists(text: str) -> tuple[list[str], list[str]]:
    """Read only the header roll, before the meeting is opened.

    A later sentence that says "mungojnë" inside a speech is not an attendance list.
    """
    present_mark = PRESENT_MARK.search(text)
    if not present_mark:
        return [], []
    header_stop = STOP_MARK.search(text, present_mark.end())
    header_end = header_stop.start() if header_stop else min(len(text), present_mark.end() + 1600)
    header = text[present_mark.start():header_end]
    present = split_names(_window(header, PRESENT_MARK.search(header)))
    absent_mark = ABSENT_MARK.search(header, present_mark.end() - present_mark.start())
    absent = split_names(_window(header, absent_mark)) if absent_mark else []
    return present, absent


def load_profiles():
    profiles = []
    for profile in json.loads(EXPORT.read_text(encoding="utf-8"))["profiles"]:
        bare = re.sub(r"\s*\([^)]*\)\s*", " ", profile["name"]).strip()
        profiles.append({"id": profile["id"], "name": profile["name"], "key": fold(bare)})
    by_key = defaultdict(list)
    for profile in profiles:
        by_key[profile["key"]].append(profile)
    return profiles, by_key


def resolve_ids(raw_name: str, profiles, by_key):
    """Return every profile id that is this person.

    The export keeps a former-legislature card and a current card under the same
    name. A minute names the person once, so both cards receive the same count.
    """
    key = fold(raw_name)
    hits = by_key.get(key) or []
    if hits:
        return sorted({item["id"] for item in hits})
    from difflib import SequenceMatcher
    best_key = None
    best_score = 0.0
    second = 0.0
    seen = set()
    for profile in profiles:
        if profile["key"] in seen:
            continue
        seen.add(profile["key"])
        score = SequenceMatcher(None, key, profile["key"]).ratio()
        if score > best_score:
            second = best_score
            best_score = score
            best_key = profile["key"]
        elif score > second:
            second = score
    if best_key and best_score >= 0.90 and best_score - second >= 0.08:
        return sorted({item["id"] for item in by_key[best_key]})
    return []


def main():
    docs = fetch_docs()
    selected = []
    seen_names = set()
    for doc in docs:
        if (doc.get("dateKrijimi") or "") < SINCE or not doc.get("url"):
            continue
        filename = doc.get("fileName") or ""
        if not is_committee_minute(filename):
            continue
        key = fold(filename)
        if key in seen_names:
            continue
        seen_names.add(key)
        selected.append(doc)
    print(f"committee minutes {len(selected)}", flush=True)
    profiles, by_key = load_profiles()
    people = defaultdict(lambda: {"meetings": 0, "present": 0, "absent": 0, "sourceUrls": [], "unmatched": 0})
    used = 0
    failed = []
    unmatched_names = defaultdict(int)

    def read(doc):
        try:
            return doc, pdf_text(doc["url"]), ""
        except Exception as exc:
            return doc, "", str(exc)[:160]

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(read, doc) for doc in selected]
        for future in as_completed(futures):
            doc, text, error = future.result()
            if error or not text.strip():
                failed.append({"fileName": doc.get("fileName"), "url": doc.get("url"), "error": error or "empty"})
                continue
            present, absent = attendance_lists(text)
            if not present and not absent:
                failed.append({"fileName": doc.get("fileName"), "url": doc.get("url"), "error": "no attendance list"})
                continue
            used += 1
            url = doc.get("url")
            seen_here = set()
            for raw_name, status in [(name, "present") for name in present] + [(name, "absent") for name in absent]:
                profile_ids = resolve_ids(raw_name, profiles, by_key)
                if not profile_ids:
                    unmatched_names[raw_name] += 1
                    continue
                for profile_id in profile_ids:
                    if profile_id in seen_here:
                        continue
                    seen_here.add(profile_id)
                    row = people[profile_id]
                    row["meetings"] += 1
                    row[status] += 1
                    if url and len(row["sourceUrls"]) < 8:
                        row["sourceUrls"].append(url)

    payload = {
        "retrievedAt": RETRIEVED,
        "since": SINCE,
        "method": "docs/PARAGON_REMAINING_DIMENSIONS.md",
        "source": DOCS_URL,
        "minutesListed": len(selected),
        "minutesUsed": used,
        "minutesSkipped": len(failed),
        "minimumMeetings": MIN_MEETINGS,
        "failedSample": failed[:40],
        "unmatchedSample": sorted(unmatched_names.items(), key=lambda item: -item[1])[:40],
        "people": {
            profile_id: row
            for profile_id, row in sorted(people.items(), key=lambda item: (-item[1]["meetings"], item[0]))
        },
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    scored = sum(1 for row in people.values() if row["meetings"] >= MIN_MEETINGS)
    print(json.dumps({
        "minutesListed": len(selected),
        "minutesUsed": used,
        "minutesSkipped": len(failed),
        "peopleNamed": len(people),
        "peopleWithMinimum": scored,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
