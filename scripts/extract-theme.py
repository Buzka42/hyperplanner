"""
extract-theme

Derives a plan's colour theme from its cover artwork.

Each new plan ships a cover image; rather than hand-picking theme colours,
this samples the artwork, clusters the dominant hues, and emits CSS custom
properties matching the token structure already used by the theme-* blocks
in src/index.css.

Colours lifted straight from artwork are routinely unreadable as UI, so every
derived colour is contrast-checked against the surface it lands on and
lightened until it clears WCAG AA.

Usage:  python scripts/extract-theme.py [image ...]
Writes: output/plan-themes.css and output/plan-themes.json
"""

import colorsys
import json
import os
import sys
from collections import Counter

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
OUTPUT = os.path.join(ROOT, "output")

# Artwork for plans that do not exist yet, mapped to the slug they will use.
DEFAULT_IMAGES = {
    "squatking.png": "king-of-the-squat",
    "gravityoptional.png": "gravity-is-optional",
    "armsrace.png": "arms-race",
    "tenfold.png": "tenfold",
    "dominion.png": "overhead-dominion",
    "hamstringfoundry.png": "hamstring-foundry",
    "neuraloverload.png": "neural-overload",
    "purgatorio.png": "purgatorio",
    "imamculate.png": "imamculate",
    "workhorse.png": "workhorse",
}


def relative_luminance(rgb):
    """WCAG relative luminance."""
    channels = []
    for value in rgb:
        c = value / 255.0
        channels.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    r, g, b = channels
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(a, b):
    la, lb = relative_luminance(a), relative_luminance(b)
    lighter, darker = max(la, lb), min(la, lb)
    return (lighter + 0.05) / (darker + 0.05)


def to_hsl(rgb):
    r, g, b = [v / 255.0 for v in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h * 360, s * 100, l * 100


def from_hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return tuple(round(v * 255) for v in (r, g, b))


def css_hsl(rgb):
    """Emitted as bare `H S% L%` to match the existing hsl(var(--token)) usage."""
    h, s, l = to_hsl(rgb)
    return "%d %d%% %d%%" % (round(h), round(s), round(l))


def ensure_contrast(rgb, against, target=4.5, step=4):
    """Lighten (or darken) until the pair clears `target`."""
    h, s, l = to_hsl(rgb)
    bg_is_dark = relative_luminance(against) < 0.18
    for _ in range(26):
        candidate = from_hsl(h, s, max(0, min(100, l)))
        if contrast_ratio(candidate, against) >= target:
            return candidate
        l = l + step if bg_is_dark else l - step
        if l <= 0 or l >= 100:
            break
    return from_hsl(h, s, max(0, min(100, l)))


def best_text_on(rgb):
    """Near-black or near-white, whichever reads better on `rgb`."""
    dark, light = (12, 12, 14), (250, 250, 252)
    return dark if contrast_ratio(dark, rgb) >= contrast_ratio(light, rgb) else light


def make_legible_fill(rgb, background, bg_target=4.5, text_target=4.5):
    """
    Find a fill that clears `bg_target` against the page *and* carries legible
    text of its own.

    A colour tuned only against the background often lands in the mid-luminance
    dead zone, where neither black nor white text reaches 4.5:1 on it. This
    walks lightness outward from the tuned value and takes the first stop that
    satisfies both constraints, so buttons are readable rather than merely
    visible.
    """
    tuned = ensure_contrast(rgb, background, bg_target)
    h, s, l = to_hsl(tuned)

    best, best_score = tuned, -1.0
    for delta in range(0, 62, 3):
        for direction in ((1, -1) if relative_luminance(background) < 0.18 else (-1, 1)):
            cand_l = l + direction * delta
            if not 0 <= cand_l <= 100:
                continue
            cand = from_hsl(h, s, cand_l)
            on_bg = contrast_ratio(cand, background)
            on_text = contrast_ratio(best_text_on(cand), cand)
            if on_bg >= bg_target and on_text >= text_target:
                return cand
            # Track the least-bad option in case nothing fully satisfies both.
            score = min(on_bg / bg_target, on_text / text_target)
            if score > best_score:
                best, best_score = cand, score
    return best


def dominant_colours(path, buckets=24):
    """
    Quantised colour histogram, ranked for *accent suitability* rather than raw
    frequency.

    Ranking by frequency alone returns the artwork's dark background — these
    covers are mostly near-black, so the top bucket is always a muddy brown that
    is useless as a UI accent. Candidates are therefore restricted to colours
    that could actually carry a button or a chart series, and scored by
    frequency weighted by saturation and mid-range lightness.
    """
    image = Image.open(path).convert("RGBA")
    image.thumbnail((220, 220))
    pixels = [p for p in image.getdata() if p[3] >= 128]

    darkest = None
    for r, g, b, _ in pixels:
        l = to_hsl((r, g, b))[2]
        if l < 8 and (darkest is None or l < to_hsl(darkest)[2]):
            darkest = (r, g, b)

    def histogram(min_sat, min_l, max_l):
        counter = Counter()
        for r, g, b, _ in pixels:
            _, s, l = to_hsl((r, g, b))
            if s < min_sat or l < min_l or l > max_l:
                continue
            counter[(r // (256 // buckets), g // (256 // buckets), b // (256 // buckets))] += 1
        return counter

    # Preferred: genuinely chromatic mid-tones. Some covers are near-monochrome
    # (Tenfold is essentially greyscale), so fall back through progressively
    # looser filters rather than returning nothing and losing the theme.
    counter = histogram(22, 18, 88)
    if not counter:
        counter = histogram(8, 14, 92)
    if not counter:
        counter = histogram(0, 10, 96)
    if not counter:
        return [], darkest or (10, 10, 12)

    scale = 256 // buckets

    def score(item):
        key, count = item
        rgb = tuple(min(255, c * scale + scale // 2) for c in key)
        _, s, l = to_hsl(rgb)
        # Favour saturated colours sitting near the middle of the lightness
        # range, where an accent reads cleanly on a dark surface.
        vividness = (s / 100.0) ** 1.5
        centrality = 1.0 - abs(l - 55) / 55.0
        return count * vividness * max(0.15, centrality)

    ranked = [
        tuple(min(255, c * scale + scale // 2) for c in key)
        for key, _ in sorted(counter.items(), key=score, reverse=True)[:12]
    ]
    return ranked, darkest or (10, 10, 12)


def spread(colours, min_hue_gap=25):
    """Keep colours that are meaningfully different in hue."""
    kept = []
    for c in colours:
        h = to_hsl(c)[0]
        if all(min(abs(h - to_hsl(k)[0]), 360 - abs(h - to_hsl(k)[0])) >= min_hue_gap for k in kept):
            kept.append(c)
    return kept


def build_theme(path, slug):
    ranked, darkest = dominant_colours(path)
    if not ranked:
        return None

    distinct = spread(ranked) or ranked

    # Background: the artwork's own darkness, floored so it stays a dark theme
    # consistent with the rest of the app.
    bh, bs, bl = to_hsl(darkest)
    background = from_hsl(bh, min(bs, 40), max(4, min(bl, 10)))
    card = from_hsl(bh, min(bs, 38), to_hsl(background)[2] + 4)
    muted = from_hsl(bh, min(bs, 30), to_hsl(background)[2] + 9)
    border = from_hsl(bh, min(bs, 32), to_hsl(background)[2] + 14)

    primary_raw = distinct[0]
    accent_raw = distinct[1] if len(distinct) > 1 else distinct[0]

    # Saturate a little: artwork colours are often muddier than UI wants.
    ph, ps, pl = to_hsl(primary_raw)
    primary = make_legible_fill(from_hsl(ph, min(100, ps + 12), pl), background)

    ah, asat, al = to_hsl(accent_raw)
    accent = make_legible_fill(from_hsl(ah, min(100, asat + 8), al), background, 3.0)

    foreground = ensure_contrast((245, 245, 248), background, 12.0)
    muted_fg = ensure_contrast(from_hsl(bh, 12, 62), background, 4.5)

    on_primary = best_text_on(primary)

    secondary = from_hsl(bh, min(bs, 30), to_hsl(background)[2] + 10)
    on_accent = best_text_on(accent)

    # Instrument surfaces: the panel/rule tokens the shell chrome is built from.
    inst_surface = from_hsl(bh, min(bs, 34), to_hsl(background)[2] + 3)
    inst_raised = from_hsl(bh, min(bs, 30), to_hsl(background)[2] + 7)
    inst_cut = from_hsl(bh, min(bs, 36), max(0, to_hsl(background)[2] - 2))

    # Chart series: rotate hues off the artwork's own primary so dashboard
    # widgets stay in the plan's world instead of falling back to generic blues.
    charts = []
    for i in range(5):
        ch = (to_hsl(primary)[0] + 42 * i) % 360
        charts.append(ensure_contrast(from_hsl(ch, max(45, min(88, ps + 10)), 58), background, 3.0))

    return {
        "slug": slug,
        "image": os.path.basename(path),
        "palette": ["#%02x%02x%02x" % c for c in distinct[:5]],
        "tokens": {
            # Core surfaces
            "background": css_hsl(background),
            "foreground": css_hsl(foreground),
            "card": css_hsl(card),
            "card-foreground": css_hsl(foreground),
            "popover": css_hsl(card),
            "popover-foreground": css_hsl(foreground),
            # Brand
            "primary": css_hsl(primary),
            "primary-foreground": css_hsl(on_primary),
            "secondary": css_hsl(secondary),
            "secondary-foreground": css_hsl(foreground),
            "accent": css_hsl(accent),
            "accent-foreground": css_hsl(on_accent),
            # Support
            "muted": css_hsl(muted),
            "muted-foreground": css_hsl(muted_fg),
            "border": css_hsl(border),
            "input": css_hsl(border),
            "ring": css_hsl(primary),
            "destructive": css_hsl(ensure_contrast(from_hsl(0, 72, 48), background, 4.5)),
            "destructive-foreground": "0 0% 100%",
        },
        # Shell chrome + widget tokens, emitted as concrete colours because the
        # instrument-* properties are used directly rather than via hsl().
        "instrument": {
            "instrument-surface": "#%02x%02x%02x" % inst_surface,
            "instrument-raised": "#%02x%02x%02x" % inst_raised,
            "instrument-cut": "#%02x%02x%02x" % inst_cut,
            "instrument-rule": css_hsl(border),
            "instrument-rule-soft": css_hsl(muted),
        },
        "charts": {("chart-%d" % (i + 1)): css_hsl(c) for i, c in enumerate(charts)},
        "cover": {
            "bg": "#%02x%02x%02x" % background,
            "gradient": "#%02x%02x%02x" % background,
        },
        "contrast": {
            "primary_on_background": round(contrast_ratio(primary, background), 2),
            "foreground_on_background": round(contrast_ratio(foreground, background), 2),
            "muted_on_background": round(contrast_ratio(muted_fg, background), 2),
            "on_primary": round(contrast_ratio(on_primary, primary), 2),
            "accent_on_background": round(contrast_ratio(accent, background), 2),
            "on_accent": round(contrast_ratio(on_accent, accent), 2),
            "worst_chart_on_background": round(
                min(contrast_ratio(c, background) for c in charts), 2
            ),
        },
    }


def main():
    args = sys.argv[1:]
    targets = (
        [(a, os.path.splitext(os.path.basename(a))[0]) for a in args]
        if args
        else [(os.path.join(PUBLIC, f), slug) for f, slug in DEFAULT_IMAGES.items()]
    )

    themes = []
    for path, slug in targets:
        if not os.path.exists(path):
            print("  skip (missing): %s" % path)
            continue
        theme = build_theme(path, slug)
        if theme:
            themes.append(theme)

    os.makedirs(OUTPUT, exist_ok=True)

    with open(os.path.join(OUTPUT, "plan-themes.json"), "w", encoding="utf-8") as fh:
        json.dump(themes, fh, indent=2)

    lines = [
        "/* Generated by scripts/extract-theme.py from plan cover artwork.",
        "   Every colour is contrast-checked against its own background. */",
        "",
    ]
    for t in themes:
        lines.append("/* %s - from %s | palette %s */" % (t["slug"], t["image"], " ".join(t["palette"])))
        lines.append(".theme-%s {" % t["slug"])
        for token, value in t["tokens"].items():
            lines.append("    --%s: %s;" % (token, value))
        lines.append("")
        lines.append("    /* shell chrome + widget surfaces */")
        for token, value in t["instrument"].items():
            lines.append("    --%s: %s;" % (token, value))
        lines.append("")
        lines.append("    /* dashboard chart series */")
        for token, value in t["charts"].items():
            lines.append("    --%s: %s;" % (token, value))
        lines.append("}")
        lines.append("")

    with open(os.path.join(OUTPUT, "plan-themes.css"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    print("  extract-theme: %d themes -> output/plan-themes.css" % len(themes))
    for t in themes:
        c = t["contrast"]
        flag = "" if c["primary_on_background"] >= 4.5 and c["on_primary"] >= 4.5 else "  <-- CHECK"
        print(
            "   %-22s primary %s  contrast %.2f / text-on-primary %.2f%s"
            % (t["slug"], t["palette"][0], c["primary_on_background"], c["on_primary"], flag)
        )


if __name__ == "__main__":
    main()
