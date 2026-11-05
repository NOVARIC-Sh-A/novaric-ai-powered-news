"""Draw the Figurat Politike Open Graph cards.

Listing card: public/og/figurat-politike.png
Profile cards (build output only): dist/og/profiles/<slug>.png

Portraits are existing derived 3:4 crops or the stored display photo.
No scores, no rankings, no generated faces.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
EXPORT = ROOT / "db" / "paragon_scores_export.json"
PUBLIC_OG = ROOT / "public" / "og" / "figurat-politike.png"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

NAVY = (48, 56, 75)
RED = (174, 34, 44)
WHITE = (255, 255, 255)
CYAN = (0, 154, 228)
DOMAIN = (0, 114, 169)
MUTED = (224, 228, 232)
W, H = 1200, 630
CONTENT_H = 520

# Official derived 3:4 crops already published for these profiles.
MONTAGE = ("vip1", "vip2", "vip4", "vip10")


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def text_width(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont) -> int:
    return int(draw.textlength(text, font=face))


def paste_rounded(base: Image.Image, image: Image.Image, xy: tuple[int, int], radius: int) -> None:
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.size[0] - 1, image.size[1] - 1), radius=radius, fill=255)
    base.paste(image, xy, mask)


def frame_portrait(path: Path, width: int, height: int, *, cover: bool) -> Image.Image:
    image = Image.open(path).convert("RGB")
    if cover:
        scale = max(width / image.width, height / image.height)
        resized = image.resize((max(1, int(round(image.width * scale))), max(1, int(round(image.height * scale)))), Image.Resampling.LANCZOS)
        left = int(round((resized.width - width) * 0.5))
        top = int(round((resized.height - height) * 0.3))
        left = max(0, min(left, resized.width - width))
        top = max(0, min(top, resized.height - height))
        return resized.crop((left, top, left + width, top + height))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def draw_chrome() -> Image.Image:
    card = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(card)
    draw.rectangle((0, 0, 64, CONTENT_H), fill=RED)
    slogan = "NOVARIC®"
    slogan_font = font(FONT_BOLD, 22)
    slogan_img = Image.new("RGBA", (int(text_width(draw, slogan, slogan_font)) + 8, 32), (0, 0, 0, 0))
    ImageDraw.Draw(slogan_img).text((0, 0), slogan, font=slogan_font, fill=MUTED)
    rotated = slogan_img.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
    card.paste(rotated, (32 - rotated.width // 2, (CONTENT_H - rotated.height) // 2), rotated)
    draw.rectangle((0, CONTENT_H, W, H), fill=WHITE)
    brand = font(FONT_BOLD, 28)
    domain = font(FONT_BOLD, 22)
    draw.text((60, 548), "NOVARIC® Sh.A.", font=brand, fill=NAVY)
    draw.text((60, 584), "media.novaric.al", font=domain, fill=DOMAIN)
    return card


def listing_card() -> Image.Image:
    card = draw_chrome()
    draw = ImageDraw.Draw(card)
    title_font = font(FONT_BOLD, 52)
    sub_font = font(FONT_BOLD, 26)
    para = font(FONT_BOLD, 24)
    draw.text((120, 156), "Figurat Politike", font=title_font, fill=WHITE)
    draw.text((120, 236), "Profilet e figurave", font=sub_font, fill=CYAN)
    draw.text((120, 274), "politike shqiptare", font=sub_font, fill=CYAN)
    draw.text((120, 330), "PARAGON®", font=para, fill=MUTED)

    tile_w, tile_h = 108, 144
    gap = 14
    tiles = []
    for pid in MONTAGE:
        path = ROOT / "public" / "politicians" / "portraits" / f"{pid}-600.webp"
        if path.exists():
            tiles.append(frame_portrait(path, tile_w, tile_h, cover=False))
    if not tiles:
        return card
    total = len(tiles) * tile_w + (len(tiles) - 1) * gap
    x = max(760, W - 40 - total)
    y = (CONTENT_H - tile_h) // 2
    for tile in tiles:
        paste_rounded(card, tile, (x, y), 8)
        x += tile_w + gap
    return card


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, limit: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if text_width(draw, trial, face) <= limit:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:3]


def profile_card(name: str, role: str, portrait: Path | None, *, cover: bool) -> Image.Image:
    card = draw_chrome()
    draw = ImageDraw.Draw(card)
    name_font = font(FONT_BOLD, 54)
    role_font = font(FONT_REG, 26)
    lines = wrap(draw, name, name_font, 620)
    while len(lines) > 2 and name_font.size > 36:
        name_font = font(FONT_BOLD, name_font.size - 4)
        lines = wrap(draw, name, name_font, 620)
    y = 150
    for line in lines[:2]:
        draw.text((120, y), line, font=name_font, fill=WHITE)
        y += name_font.size + 12
    role_lines = wrap(draw, role or "Profil politik", role_font, 620)
    yy = y + 8
    for line in role_lines[:2]:
        draw.text((128, yy), line, font=role_font, fill=CYAN)
        yy += 34

    box = (280, 373)
    left = W - 48 - box[0]
    top = (CONTENT_H - box[1]) // 2
    if portrait and portrait.exists():
        photo = frame_portrait(portrait, box[0], box[1], cover=cover)
        paste_rounded(card, photo, (left, top), 10)
    else:
        panel = Image.new("RGB", box, (36, 42, 58))
        pd = ImageDraw.Draw(panel)
        note = "Burimi i fotografisë:\nNë verifikim"
        note_font = font(FONT_BOLD, 22)
        pd.multiline_text((24, 150), note, font=note_font, fill=MUTED, spacing=8)
        paste_rounded(card, panel, (left, top), 10)
    return card


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)
    if path.stat().st_size > 300_000:
        quantized = image.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
        quantized.save(path, "PNG", optimize=True)


def portrait_for(profile: dict) -> tuple[Path | None, bool]:
    pid = profile["id"]
    derived = ROOT / "public" / "politicians" / "portraits" / f"{pid}-600.webp"
    if derived.exists():
        return derived, False
    url = profile.get("imageUrl") or ""
    if isinstance(url, str) and url.startswith("/photos/originals/"):
        local = ROOT / "public" / url.lstrip("/")
        if local.exists():
            return local, True
    if isinstance(url, str) and url.startswith("/politicians/official/"):
        local = ROOT / "public" / url.lstrip("/")
        if local.exists():
            return local, True
    return None, False


def write_listing() -> None:
    save_png(listing_card(), PUBLIC_OG)
    print(f"listing {PUBLIC_OG} {PUBLIC_OG.stat().st_size}")


def write_profiles(out_dir: Path) -> None:
    data = json.loads(EXPORT.read_text(encoding="utf-8"))
    for profile in data["profiles"]:
        slug = profile.get("slug")
        if not slug:
            continue
        photo, cover = portrait_for(profile)
        role = (profile.get("primaryRole") or "Profil politik").strip()
        image = profile_card(profile.get("name") or slug, role, photo, cover=cover)
        dest = out_dir / f"{slug}.png"
        save_png(image, dest)
    print(f"profiles {out_dir}")


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "listing"
    if mode == "listing":
        write_listing()
    elif mode == "profiles":
        dest = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "dist" / "og" / "profiles"
        write_profiles(dest)
    else:
        raise SystemExit(f"unknown mode {mode}")


if __name__ == "__main__":
    main()
