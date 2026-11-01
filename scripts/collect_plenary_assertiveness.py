#!/usr/bin/env python3
"""Count named plenary turns in official Kuvendi procesverbale.

NOVARIC® Sh.A. Legislature XI minutes published since 2025-09-01.
A turn counts only when the transcript prints "Name – speech".
Questions, interpellations and motions count only when the file name or the
opening lines name that member. Unmatched text is dropped.
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

from scripts.collect_kuvendi_rollcalls import fold, match_name

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
OUT = ROOT / "data" / "official" / "plenary_assertiveness.json"
DOCS_URL = "https://kuvendiapi.azurewebsites.net/api/dokumentet"
SINCE = "2025-09-01"
RETRIEVED = "2026-10-31"
PLENARY_TYPE = "cc439e41-586a-45b0-a005-a505f6a141a4"
QUESTION_TYPE = "9e405b46-a84a-4621-ac26-d662da1529fd"
INTERPELLATION_TYPE = "82087d8b-dcce-4830-bdcb-c8d88cded624"
MOTION_TYPE = "5f34ea82-5e80-4d41-bfba-601412bb398f"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
TURN = re.compile(
    r"(?m)^([A-ZÇË][\wÇËçë'’.\-]+(?:\s+[A-ZÇË][\wÇËçë'’.\-]+){1,3})\s+[–—-]\s+(.*)$"
)
SKIP_NAME = re.compile(r"legjislatur|seanc|procesverbal|kuvend|rendi|projektligj|neni|faleminderit", re.I)


def quote_url(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(urllib.parse.unquote(parts.path), safe="/")
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, path, "", ""))


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


def speaker_turns(text: str):
    matches = list(TURN.finditer(text))
    turns = []
    for index, match in enumerate(matches):
        name = re.sub(r"\s+", " ", match.group(1)).strip(" .")
        if SKIP_NAME.search(name) or len(name) < 5:
            continue
        start = match.end(1)
        end = matches[index + 1].start() if index + 1 < len(matches) else min(len(text), match.end() + 4000)
        words = re.findall(r"\w+", text[start:end], flags=re.UNICODE)
        turns.append((name, len(words)))
    return turns


def is_plenary(filename: str, text: str) -> bool:
    low = filename.casefold()
    if any(token in low for token in ("kkie", "kepf", "komision", "nënkomision", "nenkomision")):
        return False
    head = text[:800].casefold()
    return "legjislatura" in head and "seanc" in head and "procesverbal" in head


def load_profiles():
    profiles = []
    for profile in json.loads(EXPORT.read_text(encoding="utf-8"))["profiles"]:
        if profile["id"] in ("vip190", "vip169"):
            continue
        bare = re.sub(r"\s*\([^)]*\)\s*", " ", profile["name"]).strip()
        profiles.append({"id": profile["id"], "name": profile["name"], "key": fold(bare)})
    by_key = defaultdict(list)
    for profile in profiles:
        by_key[profile["key"]].append(profile)
    return profiles, by_key


def resolve(raw_name: str, profiles, by_key):
    key = fold(raw_name)
    hits = by_key.get(key)
    if hits and len({item["key"] for item in hits}) == 1:
        return [item["id"] for item in hits]
    found = match_name(key, profiles, {})
    return [found["id"]] if found else []


def attributed_names(filename: str, text: str):
    blob = f"{filename}\n{text[:1200]}"
    found = []
    for match in re.finditer(
        r"deputet(?:i|ja|es|eve|ët|et)?\s+([A-ZÇË][\wÇËçë'’.\-]+(?:\s+[A-ZÇË][\wÇËçë'’.\-]+){1,2})",
        blob,
    ):
        found.append(match.group(1))
    return found


def main():
    docs = fetch_docs()
    plenary = []
    initiatives = []
    for doc in docs:
        if (doc.get("dateKrijimi") or "") < SINCE or not doc.get("url"):
            continue
        filename = doc.get("fileName") or ""
        tip = doc.get("tipDokumentId")
        if tip == PLENARY_TYPE and "proces" in filename.casefold():
            plenary.append(doc)
        elif tip in (QUESTION_TYPE, INTERPELLATION_TYPE, MOTION_TYPE) or "mocion" in filename.casefold():
            initiatives.append(doc)
    print(f"plenary candidates {len(plenary)} initiative files {len(initiatives)}", flush=True)
    profiles, by_key = load_profiles()
    people = defaultdict(lambda: {
        "interventions": 0,
        "words": 0,
        "questions": 0,
        "interpellations": 0,
        "motions": 0,
        "sources": set(),
    })
    kept = 0
    failed = []

    def read(doc):
        try:
            return doc, pdf_text(doc["url"]), ""
        except Exception as exc:
            return doc, "", str(exc)[:160]

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(read, doc) for doc in plenary]
        done = 0
        for future in as_completed(futures):
            doc, text, error = future.result()
            done += 1
            if error or not text.strip():
                failed.append({"id": doc["id"], "url": doc.get("url"), "error": error or "empty"})
            elif is_plenary(doc.get("fileName") or "", text):
                kept += 1
                for name, words in speaker_turns(text):
                    for vip in resolve(name, profiles, by_key):
                        stats = people[vip]
                        stats["interventions"] += 1
                        stats["words"] += words
                        stats["sources"].add(doc["url"])
            if done % 40 == 0:
                print(f"plenary {done}/{len(plenary)} kept {kept}", flush=True)

    initiative_kept = 0
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(read, doc) for doc in initiatives]
        for future in as_completed(futures):
            doc, text, error = future.result()
            if error or not text.strip():
                failed.append({"id": doc["id"], "url": doc.get("url"), "error": error or "empty"})
                continue
            filename = doc.get("fileName") or ""
            tip = doc.get("tipDokumentId")
            low = filename.casefold()
            if tip == QUESTION_TYPE or "pyetje" in low:
                bucket = "questions"
            elif tip == INTERPELLATION_TYPE or "interpel" in low:
                bucket = "interpellations"
            elif "mocion" in low or tip == MOTION_TYPE:
                bucket = "motions"
            else:
                continue
            names = attributed_names(filename, text)
            if not names:
                continue
            initiative_kept += 1
            for name in names:
                for vip in resolve(name, profiles, by_key):
                    people[vip][bucket] += 1
                    people[vip]["sources"].add(doc["url"])

    payload = {
        "retrievedAt": RETRIEVED,
        "since": SINCE,
        "method": "docs/PARAGON_ASERTIVITETI.md",
        "plenaryListed": len(plenary),
        "plenaryUsed": kept,
        "initiativeFiles": len(initiatives),
        "initiativeUsed": initiative_kept,
        "failed": len(failed),
        "people": {
            vip: {
                "interventions": stats["interventions"],
                "words": stats["words"],
                "questions": stats["questions"],
                "interpellations": stats["interpellations"],
                "motions": stats["motions"],
                "sourceUrls": sorted(stats["sources"])[:8],
            }
            for vip, stats in people.items()
            if stats["interventions"] or stats["questions"] or stats["interpellations"] or stats["motions"]
        },
        "failures": failed[:30],
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "plenaryListed": len(plenary),
        "plenaryUsed": kept,
        "initiativeUsed": initiative_kept,
        "failed": len(failed),
        "people": len(payload["people"]),
    }, indent=2))


if __name__ == "__main__":
    main()
