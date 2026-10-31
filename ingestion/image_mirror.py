"""
NOVARIC® PARAGON official photo resolver (formerly the media.novaric.al mirror).

Photo audit 2026-10-31: the media.novaric.al/politicians/{id}.jpg copies returned an HTML page
instead of an image, and some had no recorded upstream source. Photos are now loaded directly
from their official source:
  * local copies of Wikimedia Commons files under /politicians/official/
  * the Parliament of Albania file store (kuvendiwebfiles.blob.core.windows.net)
Profiles without an official photo get imageUrl = None and the UI shows
"Në pritje të të dhënave / Awaiting data". No NOVARIC copies, no placeholders.
"""

import json
import logging
import os
import sqlite3
from typing import Any, Dict, Optional, Tuple

from utils.official_photo import (
    AWAITING_PHOTO_STATUS,
    OFFICIAL_PHOTO_STATUS,
    is_official_photo_source,
    official_image_url,
)

logger = logging.getLogger("novaric.ingestion.image_mirror")

# Hosts that must never be served as a politician photo.
FORBIDDEN_PHOTO_HOSTS = ("media.novaric.al", "novaric.co", "novaricstorage.blob.core.windows.net")


def is_missing_or_generic_photo(url: Optional[str], vip_id: Optional[str] = None, name: Optional[str] = None) -> bool:
    """True when `url` is not an official photo source (missing, NOVARIC copy, placeholder...)."""
    return not is_official_photo_source(url)


def resolve_official_photo(
    vip_id: str,
    current_photo_url: Optional[str],
    current_source_url: Optional[str] = None,
    name: Optional[str] = None,
    official_photo_path: Optional[str] = None,
) -> Tuple[Optional[str], Optional[str], bool]:
    """Returns (photo_url, photo_source_url, is_pending). photo_url is None when no official photo."""
    source = None
    for candidate in (current_source_url, current_photo_url):
        if is_official_photo_source(candidate):
            source = candidate
            break
    photo = official_image_url(official_photo_path, source)
    if photo is None:
        return None, None, True
    return photo, source, False


# Backwards-compatible name.
resolve_mirrored_photo = resolve_official_photo


class ImageMirrorWorker:
    """Idempotently enforces official-source photos in SQLite and the JSON export."""

    def __init__(self, db_path: str = "db/novaric.db", export_path: str = "db/paragon_scores_export.json"):
        self.db_path = db_path
        self.export_path = export_path

    def run_sqlite_mirror(self, dry_run: bool = False) -> Dict[str, Any]:
        if not os.path.exists(self.db_path):
            return {"status": "skipped", "reason": f"{self.db_path} not found", "updated_count": 0}
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("PRAGMA table_info(politicians)")
        if "photo_source_url" not in [r["name"] for r in cur.fetchall()]:
            cur.execute("ALTER TABLE politicians ADD COLUMN photo_source_url TEXT")
            conn.commit()
        cur.execute("SELECT id, numeric_id, full_name, photo_url, photo_source_url FROM politicians")
        updated = pending = 0
        rows = cur.fetchall()
        for r in rows:
            vip_id = f"vip{r['numeric_id']}" if r["numeric_id"] else r["id"]
            photo, source, is_pending = resolve_official_photo(vip_id, r["photo_url"], r["photo_source_url"], r["full_name"])
            pending += int(is_pending)
            if (r["photo_url"], r["photo_source_url"]) != (photo, source):
                updated += 1
                if not dry_run:
                    cur.execute("UPDATE politicians SET photo_url = ?, photo_source_url = ? WHERE id = ?", (photo, source, r["id"]))
        if not dry_run and updated:
            conn.commit()
        conn.close()
        return {"total_scanned": len(rows), "updated_count": updated, "pending_count": pending, "dry_run": dry_run}

    def run_json_export_mirror(self, dry_run: bool = False) -> Dict[str, Any]:
        if not os.path.exists(self.export_path):
            return {"status": "skipped", "reason": f"{self.export_path} not found", "updated_count": 0}
        with open(self.export_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        profiles = data.get("profiles", [])
        updated = 0
        for p in profiles:
            op = p.get("officialPhoto") or {}
            photo, source, is_pending = resolve_official_photo(
                p.get("id") or f"vip{p.get('numericId')}",
                p.get("imageUrl"),
                p.get("photo_source_url") or op.get("sourceUrl"),
                p.get("name"),
                official_photo_path=p.get("officialPhotoPath"),
            )
            if p.get("officialPhotoPath") and op.get("sourceUrl"):
                source = op["sourceUrl"]
            new = {
                "imageUrl": photo,
                "photo_source_url": source,
                "photoPending": is_pending,
                "photoStatus": AWAITING_PHOTO_STATUS if is_pending else OFFICIAL_PHOTO_STATUS,
            }
            if any(p.get(k) != v for k, v in new.items()):
                updated += 1
                p.update(new)
        official = sum(1 for p in profiles if p.get("imageUrl"))
        if not dry_run and updated:
            with open(self.export_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        return {
            "total_profiles": len(profiles),
            "official_count": official,
            "awaiting_count": len(profiles) - official,
            "updated_count": updated,
            "dry_run": dry_run,
        }

    def execute_all(self, dry_run: bool = False) -> Dict[str, Any]:
        sqlite_res = self.run_sqlite_mirror(dry_run=dry_run)
        json_res = self.run_json_export_mirror(dry_run=dry_run)
        return {"sqlite": sqlite_res, "json_export": json_res}


if __name__ == "__main__":
    print(json.dumps(ImageMirrorWorker().execute_all(dry_run=False), indent=2))
