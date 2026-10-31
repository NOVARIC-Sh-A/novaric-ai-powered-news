#!/usr/bin/env python3
"""Point every politician photo at its official source (photo audit 2026-10-31).

Card and profile photos are served straight from the official source:
  * local copies of Wikimedia Commons files in public/politicians/official/, or
  * the Parliament of Albania file store (kuvendiwebfiles.blob.core.windows.net).
NOVARIC copies (media.novaric.al/politicians/vipN.jpg, novaric.co uploads) and
generic placeholders are never used. Profiles with no official photo get
imageUrl = null and the "Awaiting data" state.

Idempotent: re-running produces no changes.
"""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from utils.official_photo import (  # noqa: E402
    AWAITING_PHOTO_STATUS,
    OFFICIAL_PHOTO_STATUS,
    is_official_photo_source,
    official_image_url,
)

EXPORT = ROOT / "db" / "paragon_scores_export.json"
CSV_PATH = ROOT / "data" / "official" / "politician_field_sources.csv"
RETRIEVED = "2026-10-31"

# Commons files verified by reading the file page description and categories.
MANUAL_COMMONS = {
    "vip19": {
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tom-Doshi-2021.jgp.jpg",
        "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Tom-Doshi-2021.jgp.jpg/500px-Tom-Doshi-2021.jgp.jpg",
        "licence": "CC BY-SA 4.0",
        "artist": "Mirditor22",
        "verification": "Commons description 'Tom Doshi'; category 'Politicians of Albania'",
    },
    "vip54": {
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Erion_Veliaj.jpg",
        "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Erion_Veliaj.jpg/500px-Erion_Veliaj.jpg",
        "licence": "CC BY 2.0",
        "artist": "Medill DC (Roshan Nebhrajani/Medill News Service)",
        "verification": "Commons category 'Erion Veliaj'",
    },
    "vip232": {
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bardh_Spahia.jpg",
        "fileUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bardh_Spahia.jpg/500px-Bardh_Spahia.jpg",
        "licence": "CC BY-SA 4.0",
        "artist": "Wikipdsh",
        "verification": "Commons description 'Bardh Spahia'; used as the portrait on sq.wikipedia 'Bardh Spahia'",
    },
}

# Candidates checked and rejected (recorded so nobody re-adds them blindly).
REJECTED = {
    "vip106": "Commons candidate File:Zija_Ismaili.jpg rejected 2026-10-31: file is in Commons category "
    "'Unidentified men', identity not confirmed",
}


def apply(profile: dict) -> None:
    vid = profile.get("id")
    if vid in MANUAL_COMMONS:
        m = MANUAL_COMMONS[vid]
        local = f"/politicians/official/{vid}.jpg"
        profile["officialPhoto"] = {
            "sourceUrl": m["sourceUrl"],
            "fileUrl": m["fileUrl"],
            "licence": m["licence"],
            "artist": m["artist"],
            "retrievedAt": RETRIEVED,
            "copied": True,
            "localPath": local,
        }
        profile["officialPhotoPath"] = local
        profile["photoLicence"] = m["licence"]
        profile["photoRetrievedAt"] = RETRIEVED
        fs = profile.get("fieldSources") or {}
        fs["photo"] = {"value": local, "sourceUrl": m["sourceUrl"], "retrievedAt": RETRIEVED, "licence": m["licence"]}
        profile["fieldSources"] = fs

    op = profile.get("officialPhoto") or {}
    source = None
    if profile.get("officialPhotoPath") and op.get("sourceUrl"):
        source = op["sourceUrl"]
    elif is_official_photo_source(op.get("sourceUrl")):
        source = op["sourceUrl"]
    elif is_official_photo_source(profile.get("photo_source_url")):
        source = profile["photo_source_url"]

    image = official_image_url(profile.get("officialPhotoPath"), source)
    if image:
        profile["imageUrl"] = image
        profile["photo_source_url"] = source
        profile["photoPending"] = False
        profile["photoStatus"] = OFFICIAL_PHOTO_STATUS
        if op.get("licence") and not profile.get("photoLicence"):
            profile["photoLicence"] = op["licence"]
        if not profile.get("photoRetrievedAt"):
            profile["photoRetrievedAt"] = op.get("retrievedAt") or RETRIEVED
    else:
        profile["imageUrl"] = None
        profile["photo_source_url"] = None
        profile["officialPhotoPath"] = None
        profile["photoPending"] = True
        profile["photoStatus"] = AWAITING_PHOTO_STATUS
        profile["photoLicence"] = None
    if "photo_url" in profile:
        profile["photo_url"] = profile["imageUrl"]


def update_csv() -> int:
    with CSV_PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fields = reader.fieldnames
        rows = list(reader)
    changed = 0
    for r in rows:
        if r["field"] != "photo":
            continue
        vid = r["vip_id"]
        if vid in MANUAL_COMMONS:
            m = MANUAL_COMMONS[vid]
            new = dict(r, value=f"/politicians/official/{vid}.jpg", source_url=m["sourceUrl"],
                       retrieved_at=RETRIEVED, licence=m["licence"],
                       notes=f"Wikimedia Commons; author {m['artist']}; verified: {m['verification']}")
        elif vid in REJECTED:
            new = dict(r, value="", source_url="", retrieved_at=RETRIEVED, licence="",
                       notes=f"no official photo; {REJECTED[vid]}")
        else:
            continue
        if new != r:
            r.update(new)
            changed += 1
    if changed:
        with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=fields, lineterminator="\r\n")
            w.writeheader()
            w.writerows(rows)
    return changed


def main() -> None:
    data = json.loads(EXPORT.read_text(encoding="utf-8"))
    before = json.dumps(data, sort_keys=True)
    for p in data.get("profiles", []):
        apply(p)
    if json.dumps(data, sort_keys=True) != before:
        EXPORT.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    csv_changed = update_csv()
    profiles = data.get("profiles", [])
    awaiting = [p["id"] for p in profiles if p.get("imageUrl") is None]
    print(json.dumps({"profiles": len(profiles), "with_official_photo": len(profiles) - len(awaiting),
                      "awaiting": len(awaiting), "csv_rows_changed": csv_changed}))


if __name__ == "__main__":
    main()
