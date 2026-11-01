#!/usr/bin/env python3
"""Narrativa from a published keyword lexicon over plenary turns.

Method narrative_topic_stability_v1. A turn counts only when its text contains
a stem from data/official/narrative_lexicon_v1.json. The score is the share of
classified turns that contain the member's most frequent topic. Fewer than the
lexicon minimum stays unscored. No model is used.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from scripts.collect_plenary_assertiveness import (
    PLENARY_TYPE,
    SINCE,
    SKIP_NAME,
    TURN,
    fetch_docs,
    fold,
    is_plenary,
    load_profiles,
    pdf_text,
    resolve,
)

ROOT = Path(__file__).resolve().parent.parent
LEXICON = ROOT / "data" / "official" / "narrative_lexicon_v1.json"
OUT = ROOT / "data" / "official" / "narrative_consistency.json"
RETRIEVED = "2026-11-01"


def load_lexicon():
    raw = json.loads(LEXICON.read_text(encoding="utf-8"))
    topics = {topic: [fold(word) for word in words] for topic, words in raw["topics"].items()}
    return raw, topics


def turn_windows(text: str):
    matches = list(TURN.finditer(text))
    for index, match in enumerate(matches):
        name = re.sub(r"\s+", " ", match.group(1)).strip(" .")
        if SKIP_NAME.search(name) or len(name) < 5:
            continue
        end = matches[index + 1].start() if index + 1 < len(matches) else min(len(text), match.end() + 2500)
        yield name, text[match.end():end]


def topics_in(snippet: str, topics: dict) -> list[str]:
    folded = fold(snippet)
    return [topic for topic, words in topics.items() if any(word in folded for word in words)]


def main():
    meta, topics = load_lexicon()
    minimum = int(meta["minimumClassifiedTurns"])
    docs = fetch_docs()
    plenary = [
        doc for doc in docs
        if (doc.get("dateKrijimi") or "") >= SINCE
        and doc.get("url")
        and doc.get("tipDokumentId") == PLENARY_TYPE
        and "proces" in (doc.get("fileName") or "").casefold()
    ]
    print(f"plenary candidates {len(plenary)}", flush=True)
    profiles, by_key = load_profiles()
    people = defaultdict(lambda: {"classified": 0, "topics": defaultdict(int), "sourceUrls": []})
    used = 0
    failed = 0

    def read(doc):
        try:
            return doc, pdf_text(doc["url"]), ""
        except Exception as exc:
            return doc, "", str(exc)[:160]

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(read, doc) for doc in plenary]
        for future in as_completed(futures):
            doc, text, error = future.result()
            if error or not text.strip() or not is_plenary(doc.get("fileName") or "", text):
                if error or not text.strip():
                    failed += 1
                continue
            used += 1
            for name, snippet in turn_windows(text):
                hit = topics_in(snippet, topics)
                if not hit:
                    continue
                for profile_id in resolve(name, profiles, by_key):
                    row = people[profile_id]
                    row["classified"] += 1
                    for topic in hit:
                        row["topics"][topic] += 1
                    if doc.get("url") and len(row["sourceUrls"]) < 6:
                        row["sourceUrls"].append(doc["url"])

    payload_people = {}
    for profile_id, row in people.items():
        classified = row["classified"]
        if classified < minimum or not row["topics"]:
            continue
        dominant = max(row["topics"], key=row["topics"].get)
        score = round(100.0 * row["topics"][dominant] / classified, 1)
        payload_people[profile_id] = {
            "classifiedTurns": classified,
            "dominantTopic": dominant,
            "dominantTurns": row["topics"][dominant],
            "score": score,
            "topics": dict(row["topics"]),
            "sourceUrls": row["sourceUrls"],
        }
    payload = {
        "retrievedAt": RETRIEVED,
        "since": SINCE,
        "method": meta["method"],
        "lexicon": "data/official/narrative_lexicon_v1.json",
        "lexiconVersion": meta["version"],
        "minimumClassifiedTurns": minimum,
        "plenaryListed": len(plenary),
        "plenaryUsed": used,
        "failed": failed,
        "people": payload_people,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "plenaryUsed": used,
        "failed": failed,
        "scored": len(payload_people),
    }, indent=2))


if __name__ == "__main__":
    main()
