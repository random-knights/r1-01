#!/usr/bin/env python3
"""Generate the 01-mark favicon set from the checked-in owner source.

Run once by hand when the source mark changes; the outputs are committed,
not regenerated at build time (this repo is build-free per AGENTS.md).
"""
from pathlib import Path
from PIL import Image

OUT = Path(__file__).parent
SRC = OUT / "01.png"

SIZES_PNG = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}

ICO_SIZES = [16, 24, 32, 48, 64]


def main():
    src = Image.open(SRC).convert("RGBA")
    assert src.size == (1024, 1024), f"unexpected source size {src.size}"

    for name, size in SIZES_PNG.items():
        resized = src.resize((size, size), Image.LANCZOS)
        resized.save(OUT / name, format="PNG")
        print(f"wrote {name} ({size}x{size})")

    ico_path = OUT / "favicon.ico"
    src.save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ICO_SIZES],
    )
    print(f"wrote favicon.ico ({ICO_SIZES})")


if __name__ == "__main__":
    main()
