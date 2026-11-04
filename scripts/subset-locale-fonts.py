"""Cut the Japanese and Traditional Chinese display fonts down to the characters the app uses.

Run again after changing ja / zh-TW UI text or cards, or new characters fall back to the device font.

    pip install fonttools brotli
    curl -LO https://raw.githubusercontent.com/google/fonts/main/ofl/zenmarugothic/ZenMaruGothic-Regular.ttf
    curl -LO https://raw.githubusercontent.com/google/fonts/main/ofl/lxgwwenkaitc/LXGWWenKaiTC-Regular.ttf
    python3 scripts/subset-locale-fonts.py ZenMaruGothic-Regular.ttf LXGWWenKaiTC-Regular.ttf
"""

import sys
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/fonts"

# Always keep punctuation and full-width forms, plus all kana for Japanese,
# so small text edits rarely need a new subset.
COMMON = [(0x3000, 0x303F), (0xFF01, 0xFF5E), (0x2010, 0x2027)]
LOCALES = {
    "ja": ("zen-maru-gothic-ja.woff2", COMMON + [(0x3040, 0x30FF), (0x31F0, 0x31FF)]),
    "zh-TW": ("lxgw-wenkai-tc-zh-tw.woff2", COMMON),
}


def used_text(locale):
    files = [ROOT / f"src/locales/{locale}.json", *sorted((ROOT / f"src/data/cards/{locale}").glob("*.js"))]
    return "".join(path.read_text(encoding="utf-8") for path in files)


def main(ja_source, zh_source):
    sources = {"ja": ja_source, "zh-TW": zh_source}
    for locale, (name, ranges) in LOCALES.items():
        # Latin letters come from the Latin display fonts, so only keep the rest.
        codepoints = {ord(ch) for ch in used_text(locale) if ord(ch) > 0x7F}
        for start, end in ranges:
            codepoints.update(range(start, end + 1))

        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        font = subset.load_font(sources[locale], options)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=codepoints)
        subsetter.subset(font)
        target = OUT / name
        subset.save_font(font, str(target), options)
        print(f"{target.relative_to(ROOT)}: {len(codepoints)} code points, {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
