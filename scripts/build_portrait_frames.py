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

# Nard Ndoka (vip282) is the reference card and is not re-cropped.
# His live frame is object-fit cover at 50% 30% on the original square.
# Measured there: the face box is 0.467 of the frame width and the eyes
# sit 0.313 from the top. Every other portrait is scaled to those two numbers.
REFERENCE_ID = "vip282"
TARGET_FACE_W = 0.467
TARGET_EYE_Y = 0.313
FRAME_ASPECT = 0.75
MODEL = Path("/tmp/portrait-models/yunet.onnx")


def framing(img_w: int, img_h: int, face: tuple[float, float, float, float, float, float]):
    """Ideal 3:4 window matching Ndoka, plus the real pixels that exist inside it.

    The returned crop is only original pixels. When the ideal window hangs off
    the photo, `padded` is true and `inset` is where those pixels sit in the frame.
    The missing margin is CSS background, not painted pixels.
    """
    _x, _y, face_w, _h, eye_x, eye_y = face
    crop_w = max(face_w / TARGET_FACE_W, 1.0)
    crop_h = crop_w / FRAME_ASPECT
    left = eye_x - crop_w / 2
    top = eye_y - TARGET_EYE_Y * crop_h
    # The window is never slid and the head is never shrunk. If it hangs off
    # the photo, those edges are padding and the eyes stay on Ndoka's line.
    ix0 = max(0.0, left)
    iy0 = max(0.0, top)
    ix1 = min(float(img_w), left + crop_w)
    iy1 = min(float(img_h), top + crop_h)
    iw = max(1.0, ix1 - ix0)
    ih = max(1.0, iy1 - iy0)
    inset = {
        "x": (ix0 - left) / crop_w,
        "y": (iy0 - top) / crop_h,
        "width": iw / crop_w,
        "height": ih / crop_h,
    }
    x = int(round(ix0))
    y = int(round(iy0))
    x = min(max(0, x), img_w - 1)
    y = min(max(0, y), img_h - 1)
    crop = {
        "x": x,
        "y": y,
        "width": max(1, min(int(round(iw)), img_w - x)),
        "height": max(1, min(int(round(ih)), img_h - y)),
    }
    padded = inset["width"] < 0.995 or inset["height"] < 0.995
    if not padded:
        inset = {"x": 0.0, "y": 0.0, "width": 1.0, "height": 1.0}
    return crop, inset, padded


def _choose_face(faces, vw: int, vh: int):
    """Pick the subject, not the parliament emblem behind them.

    The Kuvendi seal is often the largest box and a mediocre score. A clearly
    more confident face (the person) wins even when it is smaller. When scores
    are close, the larger face is the subject.
    """
    cands = []
    area_px = float(vw * vh) or 1.0
    for row in faces:
        conf = float(row[-1])
        area = float(row[2]) * float(row[3]) / area_px
        if conf < 0.3:
            continue
        cands.append((conf, area, row))
    if not cands:
        return None
    largest = max(cands, key=lambda item: item[1])
    confident = max(cands, key=lambda item: item[0])
    if confident[0] >= largest[0] + 0.15 and confident[1] >= 0.012:
        return confident[2]
    pool = [item for item in cands if item[0] >= 0.5] or cands
    return max(pool, key=lambda item: item[1])[2]


def detect_face(image: np.ndarray):
    """YuNet face box plus the two eye landmarks. Not a recognition model.

    Detection runs on a copy scaled so the long side is about 1400px. Full-resolution
    frames make the real face huge and the detector locks onto emblem details instead.
    """
    height, width = image.shape[:2]
    long_side = max(height, width)
    scale = 1400.0 / long_side if long_side > 1400 else 1.0
    if scale != 1.0:
        view = cv2.resize(image, (max(1, int(round(width * scale))), max(1, int(round(height * scale)))), interpolation=cv2.INTER_AREA)
    else:
        view = image
    vh, vw = view.shape[:2]
    found = None
    for score in (0.6, 0.45, 0.3):
        detector = cv2.FaceDetectorYN.create(str(MODEL), "", (vw, vh), score, 0.3, 5000)
        detector.setInputSize((vw, vh))
        _, faces = detector.detect(view)
        if faces is None or len(faces) == 0:
            continue
        found = _choose_face(faces, vw, vh)
        if found is not None and float(found[-1]) >= 0.5:
            break
    if found is None:
        return None
    inv = 1.0 / scale
    eye_x = (float(found[4]) + float(found[6])) / 2 * inv
    eye_y = (float(found[5]) + float(found[7])) / 2 * inv
    return (
        float(found[0]) * inv,
        float(found[1]) * inv,
        float(found[2]) * inv,
        float(found[3]) * inv,
        eye_x,
        eye_y,
    )


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


def write_thumbs(profile_id: str, image: np.ndarray, crop: dict, *, padded: bool) -> tuple[str, str] | None:
    height, width = image.shape[:2]
    x = min(max(0, int(crop["x"])), width - 1)
    y = min(max(0, int(crop["y"])), height - 1)
    w = min(int(crop["width"]), width - x)
    h = min(int(crop["height"]), height - y)
    if w < 8 or h < 8:
        return None
    view = image[y:y + h, x:x + w]
    if view.size == 0:
        return None
    rgb = cv2.cvtColor(view, cv2.COLOR_BGR2RGB)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    paths = {}
    source = Image.fromarray(rgb)
    for edge, name in ((600, "600"), (300, "300")):
        if padded:
            scale = edge / max(source.width, source.height)
            size = (max(1, int(round(source.width * scale))), max(1, int(round(source.height * scale))))
        else:
            size = (int(edge * 3 / 4), edge)
        thumb = source.resize(size, Image.Resampling.LANCZOS)
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
    padded_n = 0
    matched_n = 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = [pool.submit(ensure_cached, profile) for profile in export["profiles"]]
        ready = sum(1 for future in as_completed(futures) if future.result())
    print(f"cached originals {ready}", flush=True)
    for profile in export["profiles"]:
        pid = profile["id"]
        image = load_image(profile)
        original = image is not None
        manual = overrides.get(pid) if isinstance(overrides.get(pid), dict) else None
        if manual and image is not None and "eyeX" in manual and "eyeY" in manual:
            h, w = image.shape[:2]
            eye_x = float(manual["eyeX"]) * w
            eye_y = float(manual["eyeY"]) * h
            face_w = float(manual.get("faceW", 0.18)) * w
            face_h = face_w * 1.35
            face = (eye_x - face_w / 2, eye_y - face_h * 0.45, face_w, face_h, eye_x, eye_y)
        else:
            face = detect_face(image) if image is not None else None
        crop = None
        inset = None
        derived300 = None
        derived600 = None
        padded = False
        face_detected = face is not None
        reference = pid == REFERENCE_ID
        if reference:
            # Keep the live Ndoka card: original file, cover, object-position 50% 30%.
            face_detected = image is not None
        elif face is not None and image is not None:
            h, w = image.shape[:2]
            crop, inset, padded = framing(w, h, face)
            thumbs = write_thumbs(pid, image, crop, padded=padded)
            if thumbs:
                derived300, derived600 = thumbs
            else:
                padded = True
            detected += 1
            if padded:
                padded_n += 1
            else:
                matched_n += 1
        frames[pid] = {
            "focalPoint": {"x": 0.5, "y": 0.3 if reference else TARGET_EYE_Y},
            "uncertain": reference or not face_detected,
            "faceDetected": face_detected,
            "padded": padded,
            "inset": inset if padded else None,
            "crop": crop,
            "derived300": derived300,
            "derived600": derived600,
            "editorialOverride": pid in overrides,
            "reference": reference,
        }
        records[pid] = {
            "originalAvailable": original,
            "sourceVerified": source_verified(profile),
            "usageRightsReviewed": False,
            "faceDetected": face_detected,
            "cropAcceptable": bool(face_detected and not padded and not reference) or reference,
            "headFullyVisible": bool(face_detected and not padded),
            "shouldersVisible": bool(face_detected and not padded),
            "paddedBecauseSourceTooTight": padded,
            "creditDisplayed": True,
            "reviewer": None,
            "reviewedAt": None,
            "automatedAt": datetime.now(timezone.utc).date().isoformat(),
            "uncertain": bool(reference or not face_detected),
        }
        print(f"{pid} face={face_detected} padded={padded} reference={reference}", flush=True)
    now = datetime.now(timezone.utc).isoformat()
    FRAMES.write_text(json.dumps({
        "detector": "opencv-yunet-2023mar-face-detection",
        "recognition": False,
        "generatedAt": now,
        "note": "Face detection only. Crops scale each face to Nard Ndoka's measured frame: face width 0.467 of the frame, eyes 0.313 from the top. vip282 is the reference and is not re-cropped. Crops are not manually verified unless editorialOverride is true. Padding is only the part of that frame the original does not cover; the empty margin is CSS background and the head is not shrunk to fill it.",
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
    print(f"done profiles={len(export['profiles'])} matched={matched_n} padded={padded_n} detected={detected}")


if __name__ == "__main__":
    main()
