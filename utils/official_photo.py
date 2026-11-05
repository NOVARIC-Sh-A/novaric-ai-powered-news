"""Official politician photo rules (shared by the API and data scripts).

A photo may be shown only when it comes from an official source:
  * a local copy of a Wikimedia Commons file under /politicians/official/
  * Wikimedia (upload.wikimedia.org / commons.wikimedia.org)
  * the Parliament of Albania file store, or an official Albanian site.
Anything else (NOVARIC copies on media.novaric.al, novaric.co uploads,
generic placeholders) yields no photo, and the UI shows "Awaiting data".
"""
from __future__ import annotations

from typing import Any, Dict, Optional
from urllib.parse import quote, urlparse

AWAITING_PHOTO_STATUS = "Në pritje të të dhënave / Awaiting data"
OFFICIAL_PHOTO_STATUS = "Foto zyrtare / Official photo"
UNVERIFIED_PHOTO_CREDIT = "Burimi i fotografisë: Në verifikim"
LOCAL_OFFICIAL_PREFIX = "/politicians/official/"
LOCAL_SUPPLIED_PREFIX = "/photos/originals/"

OFFICIAL_PHOTO_HOSTS = (
    "kuvendiwebfiles.blob.core.windows.net",
    "parlament.al",
    "kryeministria.al",
    "president.al",
    "upload.wikimedia.org",
    "commons.wikimedia.org",
)


def _host(url: str) -> str:
    try:
        return (urlparse(url).hostname or "").lower()
    except ValueError:
        return ""


def is_editor_supplied_photo(url: Optional[str]) -> bool:
    """A local original from an editor. Shown, but not an official source and not a licence."""
    return isinstance(url, str) and url.startswith(LOCAL_SUPPLIED_PREFIX) and ".." not in url


def is_official_photo_source(url: Optional[str]) -> bool:
    if not url or not isinstance(url, str):
        return False
    if url.startswith(LOCAL_OFFICIAL_PREFIX):
        return True
    if not url.startswith("https://"):
        return False
    host = _host(url)
    if host.endswith(".gov.al"):
        return True
    return any(host == h or host.endswith("." + h) for h in OFFICIAL_PHOTO_HOSTS)


def official_image_url(official_photo_path: Optional[str], source_url: Optional[str]) -> Optional[str]:
    """URL the browser should load, or None when there is no official photo."""
    if official_photo_path and official_photo_path.startswith(LOCAL_OFFICIAL_PREFIX):
        return official_photo_path
    if not is_official_photo_source(source_url):
        return None
    if _host(source_url) == "commons.wikimedia.org":
        # A Commons file *page* is not an image; it needs a local copy or file URL.
        return None
    return quote(source_url, safe=":/?=&%#~+,;@!$'()*")


def apply_official_photo(card: Dict[str, Any], registry: Optional[Dict[str, Dict[str, Any]]] = None) -> Dict[str, Any]:
    """Rewrite a card's photo fields in place so they only point at an official source.

    `registry` maps profile id -> export profile (db/paragon_scores_export.json), which is the
    audited source of truth; DB rows may still carry NOVARIC mirror URLs.
    """
    ref = None
    if registry:
        keys = [card.get("id"), card.get("profile_id")]
        for num in (card.get("numericId"), card.get("politicianId"), card.get("numeric_id")):
            if num is not None:
                keys.append(f"vip{num}")
        keys.append("name:" + str(card.get("name") or card.get("full_name") or "").strip().lower())
        for k in keys:
            if k and str(k) in registry:
                ref = registry[str(k)]
                break
    if ref is not None:
        image = ref.get("imageUrl")
        source = ref.get("photo_source_url")
        path = ref.get("officialPhotoPath")
        licence = ref.get("photoLicence")
    else:
        path = card.get("officialPhotoPath")
        source = card.get("photo_source_url")
        image = official_image_url(path, source)
        if image is None and is_official_photo_source(card.get("imageUrl")):
            image = official_image_url(None, card.get("imageUrl"))
            source = card.get("imageUrl")
        licence = card.get("photoLicence")
    supplied = is_editor_supplied_photo(image)
    if image and not is_official_photo_source(image) and not supplied:
        image = None
        supplied = False
    card["imageUrl"] = image
    card["photo_source_url"] = source if image and not supplied else None
    card["officialPhotoPath"] = path if image and not supplied else None
    card["photoLicence"] = licence if image and not supplied else None
    card["photoPending"] = image is None
    if image is None:
        card["photoStatus"] = AWAITING_PHOTO_STATUS
    elif supplied:
        card["photoStatus"] = (ref or {}).get("photoStatus") or UNVERIFIED_PHOTO_CREDIT
    else:
        card["photoStatus"] = OFFICIAL_PHOTO_STATUS
    return card
