#!/usr/bin/env python3
"""
build-me-card-v2.py
Canonical Card Generation Script for NOVARIC® AD (Montenegro) & Regional Entities.
Authority: NOVARIC-BRAND-CONTROL-MASTER.md §6.1 / §6.2 (amended 2026-08-20 / 2026-08-27)

Implements:
1. Canonical draw_registered() with 70% font scaling, cap-height optical alignment, FONT_BOLD.
2. EU Trademark 018313401 placement (17px, #C8AFAF on #861A1B crimson background, 14px gap).
3. Statutory legal entity naming: NOVARIC® AD Podgorica (Zakon o privrednim društvima).
"""

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    Image = None
    ImageDraw = None
    ImageFont = None

# Font path constants with graceful fallbacks
FONT_BOLD_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "Arial-Bold.ttf"
]

FONT_REGULAR_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "Arial.ttf"
]

FONT_BOLD = "bold"
FONT_REGULAR = "regular"

def font(font_style, size):
    """Load TrueType font or fallback to default."""
    if not ImageFont:
        return None
    candidates = FONT_BOLD_PATHS if font_style == FONT_BOLD else FONT_REGULAR_PATHS
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    try:
        return ImageFont.load_default()
    except Exception:
        return None

def text_width(draw, text, f):
    """Measure text width safely across Pillow versions."""
    if not text:
        return 0
    try:
        bbox = draw.textbbox((0, 0), text, font=f)
        return bbox[2] - bbox[0]
    except AttributeError:
        try:
            return draw.textsize(text, font=f)[0]
        except Exception:
            return len(text) * 8

def draw_registered(draw, x, y, text_before, main_font, main_size, fill):
    """
    Draws text followed by the canonical registered trademark symbol (®).
    Authority: NOVARIC-BRAND-CONTROL-MASTER.md §6.1 / §6.2 (2026-08-27 amendment)
    
    Key rules:
    - reg_size: 70% of parent font size (minimum 9px)
    - Vertically positioned at cap-height level (not mid-height), tight to top-right of last letter
    - Weight: FONT_BOLD used for ® even when parent text is regular
    - Color: Inherits fill from parent text
    """
    reg_size = max(int(main_size * 0.70), 9)          # ® at 70% of parent size; min 9px
    reg_font = font(FONT_BOLD, reg_size)
    parent_baseline = y + main_size * 0.73
    reg_baseline    = parent_baseline - 0.33 * main_size
    reg_top         = int(reg_baseline - reg_size * 0.73)
    draw.text((x, y), text_before, font=main_font, fill=fill)
    x_after = x + text_width(draw, text_before, main_font)
    reg_gap = max(int(main_size * 0.12), 2)           # Optical distance as per canonical NOVARIC®
    x_reg = x_after + reg_gap
    draw.text((x_reg, reg_top), "\u00ae", font=reg_font, fill=fill)
    return x_reg + text_width(draw, "\u00ae", reg_font)

def build_me_card(output_path="novaric_ad_montenegro_card.png"):
    """Build canonical crimson card for NOVARIC® AD (Montenegro)."""
    if not Image or not ImageDraw:
        print("PIL / Pillow is required to generate the image card.")
        return False

    width, height = 1200, 630
    bg_color = (134, 26, 27)  # #861A1B (Canonical Crimson)
    card = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(card)

    # Header / Main Brand Logo area
    logo_size = 64
    logo_font = font(FONT_BOLD, logo_size)
    x_start = 80
    y_start = 120

    # Draw NOVARIC® using canonical function
    brand_fill = (255, 255, 255, 255)
    end_x = draw_registered(draw, x_start, y_start, "NOVARIC", logo_font, logo_size, brand_fill)

    # Sub-entity: "AD Podgorica"
    sub_font = font(FONT_REGULAR, 42)
    draw.text((end_x + 16, y_start + 16), "AD Podgorica", font=sub_font, fill=(240, 240, 240, 240))

    # Right column / Placement: EU Trademark 018313401
    # 17px Arial Regular, #C8AFAF on #861A1B, 14px gap below logo bottom
    tm_text = "EU Trademark 018313401"
    tm_font = font(FONT_REGULAR, 17)
    tm_color = (200, 175, 175, 255)  # #C8AFAF
    logo_bottom = y_start + logo_size
    tm_y = logo_bottom + 14
    draw.text((x_start, tm_y), tm_text, font=tm_font, fill=tm_color)

    # Statutory & Governance Notice
    body_font = font(FONT_REGULAR, 22)
    gov_text = (
        "Statutory Entity: NOVARIC\u00ae AD Podgorica (Crna Gora)\n"
        "Operations Governance: Nexus Humanist AI Code (N-DOC-10010-092026)\n"
        "Statutory Law: Zakon o privrednim dru\u0161tvima (Sl. list CG, br. 65/20)"
    )
    draw.text((x_start, tm_y + 60), gov_text, font=body_font, fill=(240, 230, 230, 230))

    card.save(output_path)
    print(f"Card generated successfully: {output_path}")
    return True

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "novaric_ad_montenegro_card.png"
    build_me_card(out)
