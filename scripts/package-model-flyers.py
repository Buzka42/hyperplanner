from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A6
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "output" / "pdf" / "model-final"
OUT = ROOT / "output" / "pdf"


def tracked_text(text: str, font: ImageFont.FreeTypeFont, color: tuple[int, int, int], tracking: int = 8) -> Image.Image:
    probe = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(probe)
    widths = [draw.textlength(char, font=font) for char in text]
    width = int(sum(widths) + tracking * (len(text) - 1))
    bbox = draw.textbbox((0, 0), text, font=font)
    height = bbox[3] - bbox[1]
    strip = Image.new("RGBA", (width + 8, height + 8), (0, 0, 0, 0))
    strip_draw = ImageDraw.Draw(strip)
    x = 4
    for char, char_width in zip(text, widths):
        strip_draw.text((x, 4 - bbox[1]), char, font=font, fill=(*color, 255))
        x += char_width + tracking
    return strip.rotate(-90, expand=True, resample=Image.Resampling.BICUBIC)


def brand_front() -> Path:
    source = ART / "front.png"
    target = ART / "front-branded.png"
    image = Image.open(source).convert("RGB")
    center_x = image.width // 2
    hyper = tracked_text(
        "HYPER",
        ImageFont.truetype(r"C:\Windows\Fonts\bahnschrift.ttf", 82),
        (235, 237, 238),
        tracking=14,
    )
    planner = tracked_text(
        "PLANNER",
        ImageFont.truetype(r"C:\Windows\Fonts\bahnschrift.ttf", 78),
        (139, 143, 146),
        tracking=12,
    )
    # The logo is centered in the source artwork and occupies roughly 150 px
    # vertically. Keep an identical clear gap above and below it.
    logo_half_height = 75
    logo_gap = 65
    center_y = image.height // 2
    placements = (
        (hyper, center_y - logo_half_height - logo_gap - hyper.height),
        (planner, center_y + logo_half_height + logo_gap),
    )
    for word, top in placements:
        image.paste(word, (center_x - word.width // 2, top), word)
    image.save(target, quality=95)
    return target


def build(name: str, reverse: str) -> None:
    width, height = A6
    canvas = Canvas(str(OUT / name), pagesize=A6, pageCompression=1)
    for image in (brand_front(), ART / reverse):
        canvas.drawImage(str(image), 0, 0, width=width, height=height, preserveAspectRatio=False, mask="auto")
        canvas.showPage()
    canvas.save()


build("hyperplanner-flyer-A6-PL.pdf", "back-pl.png")
build("hyperplanner-flyer-A6-EN.pdf", "back-en.png")
