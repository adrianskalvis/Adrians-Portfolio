#!/usr/bin/env python3
"""Turns the two sky stills into the drifting hero sky.

    python3 scripts/sky-drift.py              reads raw-sky/day.png and raw-sky/night.png
    pip install opencv-python numpy pillow    once, if they are missing

Writes three files per scene into public/sky/ and prints the numbers for
src/components/hero/sky.ts:

    sky-<scene>-plate.webp   the light of the sky, which stays put (half size, it is smooth)
    sky-<scene>-clouds.webp  the clouds as 128 + (still - plate), horizontally seamless
    sky-<scene>-wide.webp    poster: the first frame the page draws, shown before WebGL starts
                             and to visitors who ask for reduced motion
    sky-<scene>-tall.webp    the same for phones held upright

The page draws plate(x) + mask(x) * (clouds(x - drift) - 128): the clouds slide sideways
and the haze, the moon glow and the stars stay where they are.

Day: open sky is smooth and clouds are textured, so the plate is a smooth fill of the sky
that lies well away from any texture. Night: the clouds also have smooth dark bodies, so
the plate is modelled instead, as a colour per row taken from the left side plus a round
glow around the moon measured along the open sky of the top band. Stars are copied into
the plate, so clouds slide past them.

The clouds strip is the still minus its last OVERLAP of width: those columns dissolve into
the first ones, so the strip repeats without a seam.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "raw-sky"
OUT = ROOT / "public" / "sky"
OVERLAP = 0.18

# Same values as DRIFT_MASK and the scene floors in src/components/hero/sky.ts.
RAMP = (0.30, 0.58)    # clouds fade in from x = 30% (none) to 58% (full) of the hero width
BAND = (0.74, 0.88)    # ... but the low clouds along the bottom show across the whole width
PORTRAIT_BAND = (0.50, 0.74)   # phones held upright: clouds fade in from 50% to 74% of the height
FOCUS_X = 0.7          # SKY_FOCUS[0]: the crop keeps this point of the still in place
FLOOR = {"day": 0.0, "night": 0.5}


def fill(img, wt):
    """Smooth fill: normalized Gaussian convolution at growing scales, finest one with data."""
    est = np.zeros_like(img)
    have = np.zeros(wt.shape, np.float32)
    for sigma in (4, 8, 16, 32, 64, 128):
        num = cv2.GaussianBlur(img * wt[..., None], (0, 0), sigma)
        den = cv2.GaussianBlur(wt, (0, 0), sigma)
        val = num / np.maximum(den, 1e-6)[..., None]
        trust = np.clip(den / 0.25, 0, 1) * (1 - have)
        est += val * trust[..., None]
        have += trust
    return est / np.maximum(have, 1e-6)[..., None]


def luma(x):
    return 0.299 * x[..., 2] + 0.587 * x[..., 1] + 0.114 * x[..., 0]


def day_plate(sm, tex):
    textured = (tex > 1.2).astype(np.uint8)
    cloud = cv2.morphologyEx(textured, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))  # bright faces inside clouds
    cloud = cv2.dilate(cloud, np.ones((13, 13), np.uint8))
    # Pockets of "sky" enclosed by cloud are cloud faces or small gaps: they move with the cloud.
    _, lab = cv2.connectedComponents((cloud == 0).astype(np.uint8))
    sizes = np.bincount(lab.ravel())
    sizes[0] = 0
    sky = (lab == np.argmax(sizes)).astype(np.float32)
    return cv2.GaussianBlur(fill(sm, sky), (0, 0), 6)


def night_plate(sm, tex):
    h, w = sm.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    left = xx < 0.4 * w
    rows = np.array([np.median(sm[r][left[r]], axis=0) for r in range(h)])
    ty = np.arange(h) / (h - 1)
    flat = np.stack([np.polyval(np.polyfit(ty, rows[:, c], 3), ty) for c in range(3)], -1)
    res = sm - flat[:, None, :]
    sel = (yy < 0.28 * h) & (tex < 0.8)          # open sky of the top band
    best = None
    for cx in np.linspace(0.84, 1.08, 9) * w:
        for cy in np.linspace(-0.24, 0.16, 9) * h:
            r = np.hypot(xx - cx, yy - cy)[sel]
            bins = np.linspace(0, r.max() + 1, 60)
            idx = np.digitize(r, bins)
            prof, centers = [], []
            for i in range(1, len(bins)):
                if np.any(idx == i):
                    prof.append(np.median(res[sel][idx == i], axis=0))
                    centers.append(0.5 * (bins[i - 1] + bins[i]))
            prof, centers = np.array(prof), np.array(centers)
            pred = np.stack([np.interp(r, centers, prof[:, c]) for c in range(3)], -1)
            err = np.median(np.abs(pred - res[sel]))
            if best is None or err < best[0]:
                best = (err, cx, cy, centers, prof)
    err, cx, cy, centers, prof = best
    prof = np.minimum.accumulate(np.maximum(prof, 0), axis=0)   # the glow only fades with distance
    prof = cv2.GaussianBlur(prof[:, None, :], (0, 0), 1.5)[:, 0, :]
    r = np.hypot(xx - cx, yy - cy)
    glow = np.stack([np.interp(r, centers, prof[:, c], right=prof[-1, c]) for c in range(3)], -1) - prof[-1]
    print(f"  moon glow centred at ({cx / w:.2f}, {cy / h:.2f}) of the frame, fit error {err:.1f} levels")
    return flat[:, None, :] + glow


def add_stars(plate, im, tex):
    """Tiny bright points in open sky go into the plate, so clouds slide past them."""
    H, W = im.shape[:2]
    g = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
    top = g - cv2.morphologyEx(g, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    edges = cv2.dilate(cv2.resize((tex > 2.0).astype(np.uint8), (W, H), interpolation=cv2.INTER_NEAREST),
                       np.ones((25, 25), np.uint8))
    smooth = cv2.resize((tex < 1.0).astype(np.uint8), (W, H), interpolation=cv2.INTER_NEAREST)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(((top > 10) & (edges == 0)).astype(np.uint8))
    keep = np.zeros(n, bool)
    for i in range(1, n):
        x0, y0, bw, bh, area = stats[i]
        if area > 30 or bw > 7 or bh > 7:
            continue
        cx, cy = x0 + bw // 2, y0 + bh // 2
        keep[i] = smooth[max(0, cy - 20):cy + 21, max(0, cx - 20):cx + 21].mean() > 0.5
    mask = cv2.GaussianBlur(cv2.dilate(keep[lab].astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 1.2)
    print(f"  {int(keep.sum())} stars kept still")
    return plate * (1 - mask[..., None]) + im * mask[..., None]


def smoothstep(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def save_webp(bgr, path, quality=90):
    Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).save(path, "WEBP", quality=quality, method=6)
    return path.stat().st_size // 1024


def build(scene):
    print(scene)
    im = cv2.imread(str(RAW / f"{scene}.png"), cv2.IMREAD_COLOR).astype(np.float32)
    H, W = im.shape[:2]
    sm = cv2.resize(im, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    Y = luma(sm)
    hp = Y - cv2.GaussianBlur(Y, (0, 0), 2.0)
    tex = np.sqrt(cv2.GaussianBlur(hp * hp, (0, 0), 3.0))      # local texture at 1/4 size

    plate = day_plate(sm, tex) if scene == "day" else night_plate(sm, tex)
    plate = cv2.resize(plate, (W, H), interpolation=cv2.INTER_CUBIC)
    if scene == "night":
        plate = add_stars(plate, im, tex)

    diff = im - plate
    diff *= np.clip((np.abs(luma(diff)) - 1.0) / 1.5, 0, 1)[..., None]   # grain-level leftovers go to zero
    L = int(round(OVERLAP * W))
    x = (np.arange(L) + 0.5) / L
    s = (x * x * (3 - 2 * x))[None, :, None]
    strip = np.concatenate([diff[:, :L] * s + diff[:, W - L:] * (1 - s), diff[:, L:W - L]], axis=1)

    # Posters = the first frame the page draws (drift 0): on a 16:9 screen, and on a 9:16 one,
    # which shows a full-height slice of the still around the focus point.
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    first = np.concatenate([strip, strip[:, :W - strip.shape[1]]], axis=1)
    floor = FLOOR[scene]
    m = floor + (1 - floor) * np.maximum(smoothstep(*RAMP, xx / W), smoothstep(*BAND, yy / H))
    poster = cv2.resize(np.clip(plate + m[..., None] * first + 0.5, 0, 255).astype(np.uint8), (1920, 1080),
                        interpolation=cv2.INTER_AREA)
    tw = int(round(H * 9 / 16))
    tx = int(round(FOCUS_X * (W - tw)))
    mt = floor + (1 - floor) * smoothstep(*PORTRAIT_BAND, yy[:, :tw] / H)
    tall = cv2.resize(np.clip(plate[:, tx:tx + tw] + mt[..., None] * first[:, tx:tx + tw] + 0.5, 0, 255).astype(np.uint8),
                      (1080, 1920), interpolation=cv2.INTER_AREA)

    half = cv2.resize(np.clip(plate + 0.5, 0, 255).astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    kb = (save_webp(half, OUT / f"sky-{scene}-plate.webp"),
          save_webp(np.clip(strip + 128.5, 0, 255).astype(np.uint8), OUT / f"sky-{scene}-clouds.webp"),
          save_webp(poster, OUT / f"sky-{scene}-wide.webp"),
          save_webp(tall, OUT / f"sky-{scene}-tall.webp"))
    print(f"  plate {kb[0]} KB, clouds {kb[1]} KB, posters {kb[2]} + {kb[3]} KB")
    return {"width": W, "height": H, "strip": int(strip.shape[1])}


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    sizes = {scene: build(scene) for scene in sys.argv[1:] or ("day", "night")}
    print("for sky.ts:", json.dumps(sizes))
