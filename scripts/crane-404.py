#!/usr/bin/env python3
"""Turns the green-screen crane clip into the flapping crane of the 404 page.

    python3 scripts/crane-404.py        reads raw-404/404-crane.mp4

Writes public/404/crane.webp (an endless animated WebP with transparency) and
public/404/crane-still.webp (one frame, for reduced motion).

1. Key: the green background becomes transparent. Alpha comes from how much greener than red
   and blue a pixel is, measured against the background colour taken from the frame edges.
   Green light spilled onto the white paper is removed (green is capped at max(red, blue)).
2. Loop: if a later frame matches the first one closely (one full wing beat), the clip loops
   on that beat; otherwise it plays forward and then backward, which suits a flap.
3. Crop to the crane over all frames, scale to WIDTH px and save at FPS frames per second.
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "raw-404" / "404-crane.mp4"
OUT = ROOT / "public" / "404"
WIDTH = 480
FPS = 20


def key(frame, bg_dom):
    f = frame.astype(np.float32)
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    dom = g - np.maximum(r, b)                       # how much greener than the rest
    lo, hi = 18.0, 0.55 * bg_dom
    alpha = np.clip((hi - dom) / (hi - lo), 0, 1)
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.6)
    g = np.minimum(g, np.maximum(r, b))              # spill: no pixel stays greener than its paper
    rgb = np.stack([r, g, b], -1)
    return np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)


def main():
    cap = cv2.VideoCapture(str(SRC))
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 24
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    frames = frames[1:]                              # Kling's first frame is the input still
    h, w = frames[0].shape[:2]
    edge = np.concatenate([frames[0][:8].reshape(-1, 3), frames[0][-8:].reshape(-1, 3),
                           frames[0][:, :8].reshape(-1, 3), frames[0][:, -8:].reshape(-1, 3)]).astype(np.float32)
    bgc = np.median(edge, axis=0)
    bg_dom = float(bgc[1] - max(bgc[0], bgc[2]))
    print(f"{len(frames)} frames at {src_fps:.0f} fps, {w}x{h}, background BGR {bgc.round()}, green lead {bg_dom:.0f}")
    rgba = [key(f, bg_dom) for f in frames]

    # resample to FPS
    step = src_fps / FPS
    idx = np.round(np.arange(0, len(rgba) - 0.5, step)).astype(int)
    rgba = [rgba[i] for i in idx if i < len(rgba)]

    # loop: best match to frame 0 after at least 0.8 s
    a0 = rgba[0][..., 3].astype(np.float32) / 255
    errs = [np.abs(r[..., 3].astype(np.float32) / 255 - a0).mean() for r in rgba]
    start = int(0.8 * FPS)
    k = start + int(np.argmin(errs[start:]))
    base = np.mean(errs[1:3]) + 1e-6                 # change between neighbouring frames
    if errs[k] < 1.5 * base:
        seq = rgba[:k]
        print(f"loops on one wing beat: frames 0..{k - 1} ({k / FPS:.2f} s), match {errs[k]:.4f} vs step {base:.4f}")
    else:
        seq = rgba + rgba[-2:0:-1]
        print(f"plays forward and back: {len(seq)} frames ({len(seq) / FPS:.2f} s); best beat match {errs[k]:.4f} vs step {base:.4f}")

    # crop to the crane across the whole loop
    union = np.max([s[..., 3] for s in seq], axis=0) > 12
    ys, xs = np.where(union)
    pad = int(0.04 * w)
    x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad)
    y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad)
    out_h = int(round(WIDTH * (y1 - y0) / (x1 - x0)))
    imgs = [Image.fromarray(cv2.resize(s[y0:y1, x0:x1], (WIDTH, out_h), interpolation=cv2.INTER_AREA), "RGBA") for s in seq]

    OUT.mkdir(parents=True, exist_ok=True)
    imgs[0].save(OUT / "crane.webp", "WEBP", save_all=True, append_images=imgs[1:], duration=int(1000 / FPS),
                 loop=0, quality=82, method=6, alpha_quality=90)
    imgs[0].save(OUT / "crane-still.webp", "WEBP", quality=88, method=6)
    kb = (OUT / "crane.webp").stat().st_size // 1024
    print(f"crane.webp: {WIDTH}x{out_h}, {len(imgs)} frames, {kb} KB (img width={WIDTH} height={out_h})")


if __name__ == "__main__":
    main()
