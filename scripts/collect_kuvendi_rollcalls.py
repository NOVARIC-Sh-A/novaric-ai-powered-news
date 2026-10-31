#!/usr/bin/env python3
"""Read Parliament roll-call PDFs and keep only rows that match a known profile.

Source: Kuvendi document type "Votimi i deputetëve"
(https://kuvendiapi.azurewebsites.net/api/dokumentet). The files are scanned
pages. A row is kept only when the name matches a profile and the result is one
of Pro, Kundër, Abstenim, Nuk votoi, Jo i pranishëm.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import unicodedata
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = ROOT / "db" / "paragon_scores_export.json"
OUT = ROOT / "data" / "official" / "kuvendi_rollcall_scores.json"
DOCS_URL = "https://kuvendiapi.azurewebsites.net/api/dokumentet"
VOTE_TYPE = "007c261b-d399-43d8-bb88-845aea26f354"
SINCE = "2025-09-01"
RETRIEVED = "2026-10-31"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
TESSDATA = os.environ.get("TESSDATA_PREFIX", "/tmp/tessdata")

RESULT_SUFFIXES = (
    ("jo i pranishem", "absent"),
    ("joi pranishem", "absent"),
    ("nuk votoi", "novote"),
    ("nuk votol", "novote"),
    ("abstenim", "abstain"),
    ("kunder", "no"),
    ("kunde", "no"),
    ("pro", "yes"),
)


def fold(text: str) -> str:
    text = unicodedata.normalize("NFKD", text or "")
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("ë", "e").replace("Ë", "E").replace("ç", "c").replace("Ç", "C")
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def quote_url(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(urllib.parse.unquote(parts.path), safe="/")
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, path, "", ""))


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.loads(resp.read().decode())


MAX_BYTES = 12_000_000


def download(url: str, dest: Path) -> int:
    req = urllib.request.Request(quote_url(url), headers={"User-Agent": UA, "Referer": "https://www.parlament.al/"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        length = int(resp.headers.get("Content-Length") or 0)
        if length and length > MAX_BYTES:
            raise RuntimeError(f"skip large file {length}")
        data = resp.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise RuntimeError(f"skip large file {len(data)}")
        dest.write_bytes(data)
        return len(data)


def classify_tail(folded_line: str):
    for suffix, choice in RESULT_SUFFIXES:
        if folded_line.endswith(suffix):
            name = folded_line[: -len(suffix)].strip()
            name = re.sub(r"^\d{3}\s+", "", name).strip()
            if len(name) >= 5:
                return name, choice
    return None, None


def parse_page(text: str):
    vote_no = None
    match = re.search(r"(\d{1,3})\s*\.\s*votim", text, re.I)
    if match:
        vote_no = match.group(1)
    rows = []
    for raw in text.splitlines():
        line = raw.strip()
        ident = re.match(r"^(\d{3})\b", line)
        if not ident:
            continue
        name, choice = classify_tail(fold(line))
        if name and choice:
            rows.append((name, choice, vote_no, int(ident.group(1))))
    return rows


def ocr_pdf(pdf_path: Path) -> list:
    """OCR every page. Returns one list of rows per page so a bundle can be split into votes."""
    info = subprocess.run(["pdfinfo", str(pdf_path)], check=False, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    pages = 0
    for line in (info.stdout or "").splitlines():
        if line.startswith("Pages:"):
            pages = int(line.split()[1])
    if pages <= 0:
        pages = 8
    page_rows = []
    with tempfile.TemporaryDirectory() as tmp:
        start = 1
        while start <= pages:
            end = min(pages, start + 5)
            prefix = Path(tmp) / f"p{start}"
            subprocess.run(
                ["pdftoppm", "-png", "-r", "110", "-f", str(start), "-l", str(end), str(pdf_path), str(prefix)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            for image in sorted(Path(tmp).glob(f"p{start}*.png")):
                env = os.environ.copy()
                env["OMP_THREAD_LIMIT"] = "1"
                proc = subprocess.run(
                    ["timeout", "30", "tesseract", str(image), "stdout", "-l", "sqi", "--psm", "6", "--tessdata-dir", TESSDATA],
                    env=env,
                    check=False,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.DEVNULL,
                    text=True,
                )
                page_rows.append(parse_page(proc.stdout or ""))
                image.unlink(missing_ok=True)
            start = end + 1
    return page_rows


def split_vote_pages(page_rows: list) -> list:
    """Split a multi-vote PDF when the member id restarts or the vote number changes."""
    groups = []
    current = []
    current_vote = None
    for page in page_rows:
        if not page:
            continue
        vote_nos = {row[2] for row in page if row[2]}
        vote_no = next(iter(vote_nos)) if len(vote_nos) == 1 else None
        first_id = page[0][3]
        last_id = current[-1][3] if current else 0
        restarted = current and first_id <= 3 and last_id > 15
        vote_changed = current and vote_no and current_vote and vote_no != current_vote
        if restarted or vote_changed:
            groups.append(current)
            current = []
        current.extend(page)
        if vote_no:
            current_vote = vote_no
    if current:
        groups.append(current)
    return groups or [[]]


def process_doc(doc: dict) -> dict:
    doc_id = doc["id"]
    url = doc.get("url") or ""
    with tempfile.TemporaryDirectory() as tmp:
        pdf = Path(tmp) / "vote.pdf"
        try:
            download(url, pdf)
            page_rows = ocr_pdf(pdf)
        except Exception as exc:
            return {"id": doc_id, "url": url, "error": str(exc)[:180], "rows": [], "votes": []}
    votes = []
    for group in split_vote_pages(page_rows):
        flat = [(name, choice, vote_no) for name, choice, vote_no, _member_id in group]
        if len(flat) >= 8:
            votes.append(flat)
    rows = [row for vote in votes for row in vote]
    return {
        "id": doc_id,
        "url": url,
        "fileName": doc.get("fileName"),
        "dateKrijimi": (doc.get("dateKrijimi") or "")[:10],
        "rows": rows,
        "votes": votes,
    }


def load_names():
    data = json.loads(EXPORT.read_text(encoding="utf-8"))
    profiles = []
    for profile in data["profiles"]:
        bare = re.sub(r"\s*\([^)]*\)\s*", " ", profile["name"]).strip()
        profiles.append({
            "id": profile["id"],
            "name": profile["name"],
            "party": profile.get("party") or "",
            "key": fold(bare),
        })
    return profiles


def match_name(folded_name: str, profiles: list, by_key: dict):
    exact = by_key.get(folded_name)
    if exact:
        return exact
    best = None
    best_score = 0.0
    second = 0.0
    for profile in profiles:
        score = SequenceMatcher(None, folded_name, profile["key"]).ratio()
        if score > best_score:
            second = best_score
            best_score = score
            best = profile
        elif score > second:
            second = score
    if best and best_score >= 0.9 and best_score - second >= 0.03:
        return best
    return None


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids-file", help="JSON list of document ids or objects with id")
    parser.add_argument("--merge", action="store_true", help="Add these votes onto the existing score file")
    args = parser.parse_args()

    docs = fetch_json(DOCS_URL)
    selected = [
        d for d in docs
        if d.get("tipDokumentId") == VOTE_TYPE and (d.get("dateKrijimi") or "") >= SINCE and d.get("url")
    ]
    if args.ids_file:
        raw_ids = json.loads(Path(args.ids_file).read_text(encoding="utf-8"))
        wanted = {item["id"] if isinstance(item, dict) else item for item in raw_ids}
        selected = [d for d in selected if d["id"] in wanted]
    print(f"roll-call files since {SINCE}: {len(selected)}", flush=True)
    profiles = load_names()
    by_key = defaultdict(list)
    for profile in profiles:
        by_key[profile["key"]].append(profile)

    parsed = []
    workers = 2
    with ProcessPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(process_doc, doc) for doc in selected]
        done = 0
        for fut in as_completed(futures):
            parsed.append(fut.result())
            done += 1
            if done % 20 == 0:
                print(f"ocr {done}/{len(selected)}", flush=True)

    # Group rows into votes. Page ranges of one vote share the vote number and day.
    votes = defaultdict(list)
    errors = []
    for doc in parsed:
        if doc.get("error"):
            errors.append({"id": doc["id"], "error": doc["error"], "url": doc.get("url")})
            continue
        if len(doc["rows"]) < 8:
            continue
        day = doc.get("dateKrijimi") or "unknown"
        vote_groups = doc.get("votes") or [doc["rows"]]
        for index, group in enumerate(vote_groups):
            vote_nos = {row[2] for row in group if row[2]}
            vote_no = next(iter(vote_nos)) if len(vote_nos) == 1 else f"{doc['id']}-{index}"
            for name, choice, _ in group:
                votes[(day, str(vote_no), doc["url"])].append((name, choice, doc["url"]))

    # A vote can span several PDFs. Merge by (day, vote number), keeping source URLs.
    merged = defaultdict(lambda: {"rows": [], "urls": set(), "day": None})
    for (day, vote_no, url), rows in votes.items():
        bucket = merged[(day, vote_no)]
        bucket["day"] = day
        bucket["urls"].add(url)
        bucket["rows"].extend(rows)

    per_person = defaultdict(lambda: {
        "rollcalls": 0,
        "present": 0,
        "participated": 0,
        "aligned": 0,
        "comparable": 0,
        "sources": set(),
    })
    used_votes = 0
    unmatched = 0
    matched_rows = 0
    for (_day, _vote_no), bucket in merged.items():
        assigned = {}
        for name, choice, url in bucket["rows"]:
            hits = by_key.get(name)
            profile = None
            if hits and len({p["key"] for p in hits}) == 1:
                profile = hits[0]
            else:
                profile = match_name(name, profiles, {})
            if not profile:
                unmatched += 1
                continue
            assigned.setdefault(profile["id"], {"choice": choice, "party": profile["party"], "url": url, "ids": [p["id"] for p in (hits or [profile])]})
            matched_rows += 1
        if len(assigned) < 20:
            continue
        used_votes += 1
        party_choices = defaultdict(list)
        for info in assigned.values():
            if info["choice"] in ("yes", "no", "abstain"):
                party_choices[info["party"]].append(info["choice"])
        majority = {}
        for party, choices in party_choices.items():
            if len(choices) < 3:
                continue
            top = max(set(choices), key=choices.count)
            if choices.count(top) > len(choices) / 2:
                majority[party] = top
        for pid, info in assigned.items():
            targets = info["ids"] if info["ids"] else [pid]
            for target in targets:
                stats = per_person[target]
                stats["rollcalls"] += 1
                stats["sources"].add(info["url"])
                if info["choice"] != "absent":
                    stats["present"] += 1
                if info["choice"] in ("yes", "no", "abstain"):
                    stats["participated"] += 1
                    if info["party"] in majority:
                        stats["comparable"] += 1
                        if info["choice"] == majority[info["party"]]:
                            stats["aligned"] += 1

    people = {}
    for pid, stats in per_person.items():
        people[pid] = {
            "rollcalls": stats["rollcalls"],
            "present": stats["present"],
            "participated": stats["participated"],
            "aligned": stats["aligned"],
            "comparable": stats["comparable"],
            "sourceCount": len(stats["sources"]),
            "sourceUrls": sorted(stats["sources"])[:12],
        }

    previous = None
    if args.merge and OUT.exists():
        previous = json.loads(OUT.read_text(encoding="utf-8"))
        for pid, stats in people.items():
            prev = previous["people"].get(pid)
            if not prev:
                previous["people"][pid] = stats
                continue
            for key in ("rollcalls", "present", "participated", "aligned", "comparable"):
                prev[key] = int(prev.get(key) or 0) + int(stats[key])
            urls = list(dict.fromkeys((prev.get("sourceUrls") or []) + stats["sourceUrls"]))
            prev["sourceUrls"] = urls[:12]
            prev["sourceCount"] = len(urls)
        people = previous["people"]
        used_votes += int(previous.get("votesUsed") or 0)
        matched_rows += int(previous.get("matchedRows") or 0)
        unmatched += int(previous.get("unmatchedRows") or 0)

    listed = int(previous.get("filesListed") or 0) if previous else len(selected)
    if previous:
        listed = int(previous.get("filesListed") or listed)
    failed_now = len(errors)
    parsed_now = len(selected) - failed_now
    payload = {
        "retrievedAt": RETRIEVED,
        "source": DOCS_URL,
        "documentType": "Votimi i deputetëve",
        "documentTypeId": VOTE_TYPE,
        "since": SINCE,
        "filesListed": listed if previous else len(selected),
        "filesFailed": failed_now if previous else len(errors),
        "filesParsed": (int(previous.get("filesListed") or 0) - int(previous.get("filesFailed") or 0) + parsed_now) if previous else parsed_now,
        "votesUsed": used_votes,
        "matchedRows": matched_rows,
        "unmatchedRows": unmatched,
        "minimumRollcalls": 8,
        "people": people,
        "failures": errors[:40],
        "blocked": [
            {
                "source": "http://www.ildkpki.al",
                "reason": "Connection timed out on 2026-10-31. deklarimi.ildkpki.al shows a login page, not a public declaration register.",
            },
            {
                "source": "https://kuvendiapi.azurewebsites.net/api/mbledhjet",
                "reason": "Meeting records have an agenda and a time, not a per-member attendance list.",
            },
            {
                "source": "https://kuvendiapi.azurewebsites.net/api/aktet",
                "reason": "Acts name an institutional proposer code, not the sponsoring member.",
            },
        ],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "files": len(selected),
        "failed": len(errors),
        "votesUsed": used_votes,
        "people": len(people),
        "matchedRows": matched_rows,
        "unmatchedRows": unmatched,
    }, indent=2))


if __name__ == "__main__":
    main()
