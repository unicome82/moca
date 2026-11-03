"""Subset Pretendard to the characters the app actually uses.

The app has no free-text input, so every glyph it can show is in the source.
Run `npm run fonts` after adding or changing any Korean text (requires
`pip install fonttools brotli`), then commit the regenerated files.
"""
import glob
import os

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEIGHTS = ["regular", "medium", "semibold", "bold", "black"]

sources = [
    path
    for path in glob.glob(os.path.join(ROOT, "src", "**", "*"), recursive=True)
    if path.endswith((".js", ".jsx", ".scss"))
] + [os.path.join(ROOT, "index.html")]
chars = set("".join(open(path, encoding="utf8").read() for path in sources))
chars |= {chr(code) for code in range(0x20, 0x7F)}  # always keep printable ASCII
text = "".join(sorted(chars))

for weight in WEIGHTS:
    source = os.path.join(ROOT, "fonts-src", f"pretendard-{weight}.subset.woff2")
    target = os.path.join(ROOT, "src", "assets", "fonts", f"pretendard-{weight}.woff2")
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    font = TTFont(source)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.save(target)
    print(f"{weight}: {os.path.getsize(source) // 1024} KB -> {os.path.getsize(target) // 1024} KB")
