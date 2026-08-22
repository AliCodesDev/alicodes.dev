#!/usr/bin/env python3
"""Build the record portrait: passport photo -> 1-bit dither on transparent ground.

    python3 scripts/dither-portrait.py

Reads assets/portrait-source.jpg (gitignored - it is a raw ID photo) and writes
public/portrait.png, white-on-transparent, which the site tints through a CSS
mask so the portrait follows the amber token instead of freezing it.

No image model is involved, deliberately: a generative pass subtly redraws a
face, and the person reading this site may later be sitting across from him.
No third-party libraries either - `sips` handles crop and resize, and the
dither, the vignette and the PNG encoder are all in here. Rerun after changing
the source photo or the frame size.
"""
import math
import struct
import subprocess
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "portrait-source.jpg"
OUT_MASK = ROOT / "public" / "portrait.png"
OUT_AMBER = ROOT / "assets" / "portrait-amber.png"   # canvas mockups only
AMBER = (0xE3, 0xA6, 0x3F)

FRAME_W, FRAME_H = 146, 172        # CSS px in the record panel
SCALE = 2                          # render at 2x for retina
CROP_W, CROP_H = 360, 424          # from the 360x468 source, centred


def sips(*args):
    subprocess.run(["sips", *args], check=True, capture_output=True)


def read_bmp(path):
    d = path.read_bytes()
    off = struct.unpack_from("<I", d, 10)[0]
    w, h = struct.unpack_from("<ii", d, 18)
    bpp = struct.unpack_from("<H", d, 28)[0]
    if bpp not in (24, 32):
        sys.exit(f"unexpected {bpp}bpp bitmap from sips")
    step, bottom_up, h = bpp // 8, h > 0, abs(h)
    row = ((w * step + 3) // 4) * 4
    px = []
    for y in range(h):
        base = off + ((h - 1 - y) if bottom_up else y) * row
        px.append([d[base + x * step + 2] * 0.299 + d[base + x * step + 1] * 0.587
                   + d[base + x * step] * 0.114 for x in range(w)])
    return w, h, px


def write_png(path, w, h, rgba):
    raw = b"".join(b"\x00" + bytes(rgba[y * w * 4:(y + 1) * w * 4]) for y in range(h))

    def chunk(tag, body):
        c = tag + body
        return struct.pack(">I", len(body)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def main():
    if not SRC.exists():
        sys.exit(f"missing {SRC.relative_to(ROOT)} - drop the raw photo there first")
    tmp = ROOT / "assets" / "_dither_tmp.bmp"
    sips("-c", str(CROP_H), str(CROP_W), str(SRC), "--out", str(tmp.with_suffix(".jpg")))
    sips("-z", str(FRAME_H * SCALE), str(FRAME_W * SCALE), str(tmp.with_suffix(".jpg")),
         "--out", str(tmp.with_suffix(".jpg")))
    sips("-s", "format", "bmp", str(tmp.with_suffix(".jpg")), "--out", str(tmp))

    w, h, g = read_bmp(tmp)

    # Autocontrast on the 1st/99th percentile, so the camera flash's blown
    # highlights don't get to set the white point on their own.
    flat = sorted(v for r in g for v in r)
    lo, hi = flat[len(flat) // 100], flat[-len(flat) // 100]
    span = max(hi - lo, 1.0)

    # The studio backdrop is brighter than his face, so a straight duotone puts
    # the emphasis on the wall. This vignette is normalised per axis, which
    # makes the falloff follow the frame rather than cutting an ellipse
    # through it, and drops the edges to black so he is the brightest thing.
    cx, cy = w * 0.5, h * 0.44
    for y in range(h):
        for x in range(w):
            v = 255.0 * (max(0.0, min(1.0, (g[y][x] - lo) / span)) ** 0.88)
            d = math.hypot((x - cx) / (w * 0.5), (y - cy) / (h * 0.5))
            g[y][x] = v * max(0.0, 1.0 - 1.15 * max(0.0, d - 0.42) ** 1.15)

    # Floyd-Steinberg, serpentine so flat areas don't grow directional worming.
    bits = [[0] * w for _ in range(h)]
    for y in range(h):
        fwd = 1 if y % 2 == 0 else -1
        for x in (range(w) if fwd == 1 else range(w - 1, -1, -1)):
            old = g[y][x]
            new = 255.0 if old >= 128 else 0.0
            bits[y][x] = 1 if new else 0
            err = old - new
            for dx, dy, k in ((fwd, 0, 7 / 16), (-fwd, 1, 3 / 16), (0, 1, 5 / 16), (fwd, 1, 1 / 16)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    g[ny][nx] += err * k

    def emit(path, rgb):
        buf = bytearray()
        for y in range(h):
            for x in range(w):
                buf += bytes(rgb + (255,)) if bits[y][x] else b"\x00\x00\x00\x00"
        write_png(path, w, h, buf)

    emit(OUT_MASK, (255, 255, 255))
    emit(OUT_AMBER, AMBER)
    tmp.unlink(missing_ok=True)
    tmp.with_suffix(".jpg").unlink(missing_ok=True)
    print(f"{w}x{h}  lit={sum(map(sum, bits)) / (w * h):.1%}  -> {OUT_MASK.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
