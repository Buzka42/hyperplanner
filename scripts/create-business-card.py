from pathlib import Path

from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Arawn\Downloads\ChatGPT Image Aug 7, 2026, 11_30_19 PM.png")
LOGO = ROOT / "public" / "brand" / "hyperplanner-logo.png"
OUT = ROOT / "output" / "pdf" / "hypertraining-business-card-90x50-bleed2mm.pdf"
TMP = ROOT / "tmp" / "pdfs" / "business-card-unboxed.pdf"

PAGE_W, PAGE_H = 94 * mm, 54 * mm
TRIM = 2 * mm
BG = (3 / 255, 3 / 255, 3 / 255)


def draw_cover(canvas: Canvas, path: Path) -> None:
    with Image.open(path) as image:
        iw, ih = image.size
    scale = max(PAGE_W / iw, PAGE_H / ih)
    width, height = iw * scale, ih * scale
    canvas.drawImage(
        ImageReader(str(path)),
        (PAGE_W - width) / 2,
        (PAGE_H - height) / 2,
        width=width,
        height=height,
        preserveAspectRatio=True,
        mask="auto",
    )


def build() -> None:
    TMP.parent.mkdir(parents=True, exist_ok=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = Canvas(str(TMP), pagesize=(PAGE_W, PAGE_H), pageCompression=1)

    draw_cover(canvas, SOURCE)
    canvas.showPage()

    canvas.setFillColorRGB(*BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    logo_height = 29 * mm
    with Image.open(LOGO) as logo:
        lw, lh = logo.size
    logo_width = logo_height * lw / lh
    canvas.drawImage(
        ImageReader(str(LOGO)),
        (PAGE_W - logo_width) / 2,
        (PAGE_H - logo_height) / 2,
        width=logo_width,
        height=logo_height,
        preserveAspectRatio=True,
        mask="auto",
    )
    canvas.showPage()
    canvas.save()

    reader = PdfReader(str(TMP))
    writer = PdfWriter()
    trim_box = RectangleObject([TRIM, TRIM, PAGE_W - TRIM, PAGE_H - TRIM])
    bleed_box = RectangleObject([0, 0, PAGE_W, PAGE_H])
    for page in reader.pages:
        page.trimbox = trim_box
        page.bleedbox = bleed_box
        page.cropbox = bleed_box
        writer.add_page(page)
    with OUT.open("wb") as stream:
        writer.write(stream)


if __name__ == "__main__":
    build()
