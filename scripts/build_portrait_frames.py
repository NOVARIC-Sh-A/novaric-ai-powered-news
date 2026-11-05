"""Detect faces and write portrait crop metadata.

Face detection only (OpenCV YuNet). No recognition, no retouching.
Original files are read and never modified. Derived 3:4 WebP thumbnails
are written under public/politicians/portraits/.
"""
from __future__ import annotations

import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
EXPORT = ROOT / "db" / "paragon_scores_export.json"
FRAMES = ROOT / "data" / "official" / "portrait_frames.json"
REVIEW = ROOT / "data" / "official" / "portrait_editorial_review.json"
OVERRIDES = ROOT / "data" / "official" / "portrait_focal_overrides.json"
OUT_DIR = ROOT / "public" / "politicians" / "portraits"
CACHE = Path("/tmp/portrait-src")

EYE_FRACTION = 0.385
MODEL = Path("/tmp/portrait-models/yunet.onnx")


def crop_window(img_w: int, img_h: int, face: tuple[float, float, float, float, float, float]):
    x, y, w, h, eye_x, eye_y = face
    top = y - 0.28 * h
    crop_h = max((eye_y - top) / EYE_FRACTION, (y + h + 0.45 * h) - top)
    crop_w = crop_h * 0.75
    uncertain = False
    if crop_w > img_w:
        crop_w = float(img_w)
        crop_h = crop_w / 0.75
        uncertain = True
    if crop_h > img_h:
        crop_h = float(img_h)
        crop_w = min(img_w, crop_h * 0.75)
        uncertain = True
    left = eye_x - crop_w / 2
    top = eye_y - EYE_FRACTION * crop_h
    if left < 0:
        left = 0
        uncertain = True
    if left + crop_w > img_w:
        left = img_w - crop_w
        uncertain = True
    if top < 0:
        top = 0
        uncertain = True
    if top + crop_h > img_h:
        top = max(0, img_h - crop_h)
        uncertain = True
    face_clipped = x < left - 1 or x + w > left + crop_w + 1 or y < top - 1 or y + h > top + crop_h + 1
    if face_clipped:
        uncertain = True
    return {
        "x": int(round(left)),
        "y": int(round(top)),
        "width": int(round(crop_w)),
        "height": int(round(crop_h)),
    }, uncertain


def detect_face(image: np.ndarray):
    """YuNet face box plus the two eye landmarks. Not a recognition model."""
    height, width = image.shape[:2]
    for score in (0.6, 0.4):
        detector = cv2.FaceDetectorYN.create(str(MODEL), "", (width, height), score, 0.3, 5000)
        detector.setInputSize((width, height))
        _, faces = detector.detect(image)
        if faces is not None and len(faces) > 0:
            best = max(faces, key=lambda row: row[2] * row[3])
            eye_x = (float(best[4]) + float(best[6])) / 2
            eye_y = (float(best[5]) + float(best[7])) / 2
            return (float(best[0]), float(best[1]), float(best[2]), float(best[3]), eye_x, eye_y)
    return None


def cache_path(profile: dict) -> Path | None:
    url = profile.get("imageUrl")
    if not url or profile.get("photoPending"):
        return None
    if str(url).startswith("/"):
        path = ROOT / "public" / str(url).lstrip("/")
        return path if path.exists() else None
    CACHE.mkdir(parents=True, exist_ok=True)
    safe = urllib.parse.quote(str(url), safe="")[:180]
    return CACHE / f"{profile['id']}-{safe[-40:]}"


def ensure_cached(profile: dict) -> bool:
    path = cache_path(profile)
    if path is None:
        return False
    if path.exists() and path.stat().st_size > 0:
        return True
    url = profile.get("imageUrl")
    try:
        req = urllib.request.Request(str(url), headers={"User-Agent": "novaric-portrait-ingest"})
        with urllib.request.urlopen(req, timeout=25) as response:
            path.write_bytes(response.read())
        return path.stat().st_size > 0
    except Exception:
        return False


def load_image(profile: dict) -> np.ndarray | None:
    path = cache_path(profile)
    if path is None or not path.exists():
        return None
    data = path.read_bytes()
    array = np.frombuffer(data, dtype=np.uint8)
    return cv2.imdecode(array, cv2.IMREAD_COLOR)


def write_thumbs(profile_id: str, image: np.ndarray, crop: dict) -> tuple[str, str] | None:
    x, y, w, h = crop["x"], crop["y"], crop["width"], crop["height"]
    if w < 8 or h < 8:
        return None
    view = image[y:y + h, x:x + w]
    if view.size == 0:
        return None
    rgb = cv2.cvtColor(view, cv2.COLOR_BGR2RGB)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    paths = {}
    for edge, name in ((600, "600"), (300, "300")):
        thumb = Image.fromarray(rgb).resize((int(edge * 3 / 4), edge), Image.Resampling.LANCZOS)
        rel = f"/politicians/portraits/{profile_id}-{name}.webp"
        thumb.save(ROOT / "public" / rel.lstrip("/"), "WEBP", quality=82, method=6)
        paths[name] = rel
    return paths["300"], paths["600"]


def source_verified(profile: dict) -> bool:
    photo = (profile.get("fieldSources") or {}).get("photo") or {}
    notes = photo.get("notes") or ""
    licence = photo.get("licence") or profile.get("photoLicence") or ""
    url = profile.get("imageUrl") or ""
    if str(url).startswith("/photos/originals/"):
        return False
    if "Publisher:" in notes and (photo.get("sourceUrl") or profile.get("photo_source_url")):
        return True
    return "Parliament of Albania" in licence and "kuvendiwebfiles.blob.core.windows.net" in url


def main() -> None:
    if not MODEL.exists():
        MODEL.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(
            "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
            MODEL,
        )
    export = json.loads(EXPORT.read_text(encoding="utf-8"))
    overrides = {}
    if OVERRIDES.exists():
        overrides = json.loads(OVERRIDES.read_text(encoding="utf-8")).get("overrides") or {}
    frames = {}
    records = {}
    detected = 0
    uncertain_n = 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = [pool.submit(ensure_cached, profile) for profile in export["profiles"]]
        ready = sum(1 for future in as_completed(futures) if future.result())
    print(f"cached originals {ready}", flush=True)
    for profile in export["profiles"]:
        pid = profile["id"]
        image = load_image(profile)
        original = image is not None
        face = detect_face(image) if image is not None else None
        crop = None
        derived300 = None
        derived600 = None
        uncertain = True
        face_detected = face is not None
        if face is not None and image is not None:
            h, w = image.shape[:2]
            crop, uncertain = crop_window(w, h, face)
            thumbs = None if uncertain else write_thumbs(pid, image, crop)
            if thumbs:
                derived300, derived600 = thumbs
            else:
                uncertain = True
            detected += 1
        if pid in overrides:
            uncertain = False
        if uncertain:
            uncertain_n += 1
        eye_y = 0.3
        eye_x = 0.5
        if face is not None and image is not None and not uncertain:
            eye_x = 0.5
            eye_y = EYE_FRACTION
        frames[pid] = {
            "focalPoint": {"x": eye_x, "y": eye_y},
            "uncertain": uncertain if pid not in overrides else False,
            "faceDetected": face_detected,
            "crop": crop,
            "derived300": derived300,
            "derived600": derived600,
            "editorialOverride": pid in overrides,
        }
        records[pid] = {
            "originalAvailable": original,
            "sourceVerified": source_verified(profile),
            "usageRightsReviewed": False,
            "faceDetected": face_detected,
            "cropAcceptable": bool(face_detected and not uncertain),
            "headFullyVisible": bool(face_detected and not uncertain),
            "shouldersVisible": bool(face_detected and not uncertain),
            "creditDisplayed": True,
            "reviewer": None,
            "reviewedAt": None,
            "automatedAt": datetime.now(timezone.utc).date().isoformat(),
            "uncertain": bool(uncertain and pid not in overrides),
        }
        print(f"{pid} face={face_detected} uncertain={frames[pid]['uncertain']}", flush=True)
    now = datetime.now(timezone.utc).isoformat()
    FRAMES.write_text(json.dumps({
        "detector": "opencv-yunet-2023mar-face-detection",
        "recognition": False,
        "generatedAt": now,
        "note": "Face detection only. Crops are not manually verified unless editorialOverride is true.",
        "frames": frames,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    REVIEW.write_text(json.dumps({
        "generatedAt": now,
        "reviewer": None,
        "note": "Automated flags only. A human reviewer has not signed these records. usageRightsReviewed stays false.",
        "records": records,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    keep = set()
    for frame in frames.values():
        for key in ("derived300", "derived600"):
            if frame.get(key):
                keep.add(Path(frame[key]).name)
    if OUT_DIR.exists():
        for path in OUT_DIR.glob("*.webp"):
            if path.name not in keep:
                path.unlink()
    print(f"done profiles={len(export['profiles'])} detected={detected} uncertain={uncertain_n}")


if __name__ == "__main__":
    main()
