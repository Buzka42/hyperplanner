from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A6
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

W, H = A6
BG = HexColor("#080d18")
PANEL = HexColor("#101827")
INK = HexColor("#f5f7fb")
MUTED = HexColor("#aab4c4")
BLUE = HexColor("#4d8dff")
ORANGE = HexColor("#ff6b35")

font_dir = Path("C:/Windows/Fonts")
display_path = font_dir / "bahnschrift.ttf"
body_path = font_dir / "segoeui.ttf"
bold_path = font_dir / "segoeuib.ttf"
if display_path.exists(): pdfmetrics.registerFont(TTFont("FlyerDisplay", str(display_path)))
if body_path.exists(): pdfmetrics.registerFont(TTFont("FlyerBody", str(body_path)))
if bold_path.exists(): pdfmetrics.registerFont(TTFont("FlyerBold", str(bold_path)))
DISPLAY = "FlyerDisplay" if display_path.exists() else "Helvetica-Bold"
BODY = "FlyerBody" if body_path.exists() else "Helvetica"
BOLD = "FlyerBold" if bold_path.exists() else "Helvetica-Bold"

def cover_image(c, path, x, y, w, h):
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.saveState()
    p = c.beginPath(); p.rect(x, y, w, h); c.clipPath(p, stroke=0, fill=0)
    c.drawImage(img, x + (w-dw)/2, y + (h-dh)/2, dw, dh, mask='auto')
    c.restoreState()

def contain_image(c, path, x, y, w, h):
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(img, x + (w-dw)/2, y + (h-dh)/2, dw, dh, mask='auto')

def front(c):
    c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
    gap = 1.1*mm
    spine_w = 18*mm
    cell_w = (W-spine_w-2*gap)/2
    cell_h = (H-2*gap)/3
    right_x = cell_w + spine_w + 2*gap
    assets = [
        (ROOT/"public"/"benchdomination.png", 0, 2*(cell_h+gap)),
        (ROOT/"public"/"peachy.png", right_x, 2*(cell_h+gap)),
        (ROOT/"public"/"SKELETON.png", 0, cell_h+gap),
        (ROOT/"public"/"painglory.png", right_x, cell_h+gap),
        (ROOT/"public"/"supermutant.png", 0, 0),
        (ROOT/"public"/"trinary.png", right_x, 0),
    ]
    for path,x,y in assets:
        c.setFillColor(PANEL); c.rect(x,y,cell_w,cell_h,fill=1,stroke=0)
        contain_image(c,path,x,y,cell_w,cell_h)
    # Solid graphite spine reserves clear space for the logo; it never
    # overlaps the plan artwork.
    c.setFillColor(BG); c.rect(cell_w+gap,0,spine_w,H,fill=1,stroke=0)
    c.drawImage(str(ROOT/"public"/"brand"/"hyperplanner-logo.png"),W/2-7.5*mm,H/2-7.5*mm,15*mm,15*mm,preserveAspectRatio=True,mask='auto')

def wrap(c, text, font, size, max_w):
    words=text.split(); lines=[]; line=""
    for word in words:
        test=(line+" "+word).strip()
        if c.stringWidth(test,font,size)<=max_w: line=test
        else:
            if line: lines.append(line)
            line=word
    if line: lines.append(line)
    return lines

def paragraph(c, text, x, y, max_w, size=7.2, leading=9, color=MUTED, font=BODY):
    c.setFillColor(color); c.setFont(font,size)
    for line in wrap(c,text,font,size,max_w):
        c.drawString(x,y,line); y-=leading
    return y

COPY = {
"en": {
 "title":"YOUR PROGRAM. YOUR NUMBERS. ZERO GUESSWORK.",
 "intro":"HyperPlanner turns complete strength and physique programs into a clear workout system. Open the app, see today's task, enter your results and let the plan handle the calculations.",
 "steps":[
  ("1  ENTER YOUR KEYWORD","Your private keyword opens your profile. A new keyword starts with the available program selection."),
  ("2  CHOOSE A PROGRAM","Select a goal-driven protocol, enter the requested maxes and preferences, and the app sets your starting point."),
  ("3  EXECUTE THE SESSION","Every workout shows exercises, sets, reps, target loads, RPE or RIR when prescribed, rest guidance and progression notes."),
  ("4  LOG. ADAPT. PROGRESS.","Record each set. HyperPlanner stores your history, updates weights, respects deloads and recovery rules, and unlocks achievements."),
 ],
 "proof":"INSIDE THE APP",
 "bullets":["Multiple plans suited for different goals and experience levels", "Automatic weight and progression calculations", "Workout history, charts and personal records", "Bilingual on phone and desktop - built for the gym"],
 "trial":"FREE PLAN: Create a new keyword and get 30 Minute Adventure to test the app.",
 "cta":"READY TO START?",
 "price":"INDIVIDUAL PRICING",
 "priceBody":"Every plan is priced individually. Contact me before choosing or purchasing a program - we will match the protocol to your goal and experience.",
 "contact":"509 519 866   |   patryk@hypertraining.works\nhypertraining.works/hyperplanner"
},
"pl": {
 "title":"TWÓJ PLAN. TWOJE WYNIKI. ZERO ZGADYWANIA.",
 "intro":"HyperPlanner zamienia kompletne programy siłowe i sylwetkowe w przejrzysty system prowadzenia treningu. Otwierasz aplikację, widzisz dzisiejsze zadanie, wpisujesz wyniki, a plan wykonuje obliczenia.",
 "steps":[
  ("1  WPISZ SŁOWO KLUCZOWE","Prywatne słowo kluczowe otwiera Twój profil. Nowe słowo pozwala wybrać jeden z dostępnych programów."),
  ("2  WYBIERZ PROGRAM","Wybierz protokół dopasowany do celu, podaj wymagane maksy i preferencje, a aplikacja ustawi punkt startowy."),
  ("3  WYKONAJ TRENING","Każda sesja pokazuje ćwiczenia, serie, powtórzenia, ciężary docelowe, RPE lub RIR, czas odpoczynku i wskazówki progresji."),
  ("4  ZAPISUJ. ADAPTUJ. PROGRESUJ.","Zapisuj każdą serię. HyperPlanner prowadzi historię, aktualizuje ciężary, pilnuje deloadów i regeneracji oraz odblokowuje osiągnięcia."),
 ],
 "proof":"W APLIKACJI OTRZYMUJESZ",
 "bullets":["Wiele planów dopasowanych do różnych celów i poziomów doświadczenia", "Automatyczne obliczanie ciężarów i progresji", "Historię treningów, wykresy i rekordy", "Po polsku i angielsku, na telefonie i komputerze"],
 "trial":"DARMOWY PLAN: Wpisz nowe słowo kluczowe i odbierz 30 Minute Adventure, aby przetestować aplikację.",
 "cta":"ZACZNIJ TERAZ",
 "price":"CENA USTALANA INDYWIDUALNIE",
 "priceBody":"Cena zależy od wybranego planu. Skontaktuj się ze mną przed wyborem lub zakupem programu - wspólnie dopasujemy protokół do celu i doświadczenia.",
 "contact":"509 519 866   |   patryk@hypertraining.works\nhypertraining.works/hyperplanner"
}}

def reverse(c, lang):
    copy=COPY[lang]
    c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(BLUE); c.rect(0,H-3*mm,W,3*mm,fill=1,stroke=0)
    margin=8*mm; max_w=W-2*margin; y=H-12*mm
    c.setFillColor(INK); c.setFont(DISPLAY,13.5)
    for line in wrap(c,copy['title'],DISPLAY,13.5,max_w): c.drawString(margin,y,line); y-=14
    y-=2
    y=paragraph(c,copy['intro'],margin,y,max_w,7.0,8.2,MUTED,BODY)-3
    for title,body in copy['steps']:
        c.setFillColor(BLUE); c.setFont(BOLD,7.2); c.drawString(margin,y,title); y-=8.5
        y=paragraph(c,body,margin,y,max_w,6.5,7.4,INK,BODY)-2.6
    box_top = 74*mm
    c.setFillColor(PANEL); c.roundRect(margin,box_top-27*mm,max_w,27*mm,2.5*mm,fill=1,stroke=0)
    y = box_top
    c.setFillColor(ORANGE); c.setFont(BOLD,7); c.drawString(margin+4*mm,y-5*mm,copy['proof'])
    yy=y-9*mm
    for bullet in copy['bullets']:
        c.setFillColor(BLUE); c.circle(margin+5*mm,yy+1.4,1.1,fill=1,stroke=0)
        c.setFillColor(INK); c.setFont(BODY,6.35); c.drawString(margin+8*mm,yy,bullet); yy-=3.6*mm
    # Continue on the exact bullet grid so the highlighted free-plan item
    # shares the same dot column, text column, and baseline rhythm.
    trial_y = yy
    c.setFillColor(ORANGE); c.circle(margin+5*mm,trial_y+1.4,1.1,fill=1,stroke=0)
    paragraph(c,copy['trial'],margin+8*mm,trial_y,max_w-12*mm,5.4,6.2,ORANGE,BOLD)
    y-=31*mm
    c.setFillColor(HexColor("#21140f")); c.roundRect(margin,y-20*mm,max_w,20*mm,2*mm,fill=1,stroke=0)
    c.setStrokeColor(ORANGE); c.setLineWidth(.7); c.roundRect(margin,y-20*mm,max_w,20*mm,2*mm,fill=0,stroke=1)
    c.setFillColor(ORANGE); c.setFont(BOLD,7.2); c.drawString(margin+4*mm,y-5*mm,copy['price'])
    paragraph(c,copy['priceBody'],margin+4*mm,y-9.5*mm,max_w-8*mm,6.2,7.2,INK,BODY)
    y-=25*mm
    c.setFillColor(ORANGE); c.setFont(DISPLAY,12); c.drawString(margin,y,copy['cta'])
    y-=5*mm
    c.setFillColor(INK); c.setFont(BOLD,7.2)
    for line in copy['contact'].splitlines(): c.drawString(margin,y,line); y-=4.5*mm
    c.drawImage(str(ROOT/"public"/"brand"/"hyperplanner-logo.png"), W-25*mm, 5*mm, 17*mm,17*mm,preserveAspectRatio=True,mask='auto')

def make_pdf(lang):
    path=OUT/f"hyperplanner-flyer-A6-{lang.upper()}.pdf"
    c=canvas.Canvas(str(path),pagesize=A6,pageCompression=1)
    c.setTitle(f"HyperPlanner A6 Flyer {lang.upper()}")
    front(c); c.showPage(); reverse(c,lang); c.showPage(); c.save()
    return path

for language in ("pl","en"):
    print(make_pdf(language))
