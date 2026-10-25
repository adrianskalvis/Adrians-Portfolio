# Hero sky: two stills, clouds that drift forever

Goal: a calm sky behind the hero text, light blue with white clouds for the light theme and
a moonlit version for the dark theme, with the clouds sliding sideways in an endless loop.

## How it works

The page needs no video. `scripts/sky-drift.py` splits each still into two layers:

- **plate**: the light of the sky, which stays put: the haze and sun glow by day, the moon
  glow and the stars at night.
- **clouds**: the still minus the plate, saved as a strip whose right end dissolves into its
  left end, so it repeats sideways without a seam.

`src/components/hero/skyDrift.ts` draws `plate + clouds shifted by the drift` with WebGL2 on
every frame. The clouds slide right while the light stays where it is, the loop never shows
a seam, and the motion runs at the screen's refresh rate. A mask fades the clouds out behind
the text (fully by day, to half at night) and keeps the low clouds along the bottom.

The page also:

- paints the poster (the first frame of the drift) at once, then fades the canvas in over it;
- crossfades day and night on the theme switch, on one shared clock, so the clouds line up;
- draws only while the hero is on screen;
- keeps the poster for reduced motion, Save-Data and browsers without a GPU or WebGL2;
- lays a wash in the page colour behind the text and fades the sky into the next section;
- adds fine grain over the sky against colour banding.

Each theme downloads three files (poster, plate, clouds): about 130 KB by day, 90 KB at night.

## Knobs (`src/components/hero/sky.ts`)

| Setting | What it does |
|---|---|
| `DRIFT_SPEED` | px of the still per second. 30 means one loop of the strip in about 75 s. |
| `DRIFT_MASK.ramp` | across the width, clouds fade in from 30% (none) to 58% (all) |
| `DRIFT_MASK.band` | from 74% to 88% of the height, clouds show across the whole width |
| `DRIFT_MASK.portraitBand` | phones held upright: clouds fade in from 50% to 74% of the height |
| `floor` per scene | how much cloud shows behind the text: 0 by day, 0.5 at night |
| `SKY_FOCUS` | the point of the still that stays in view when the screen crops it |

The mask values also live at the top of `scripts/sky-drift.py`, which bakes them into the
posters. Change both, then run the script again.

## Making new stills

Higgsfield → Image, Nano Banana Pro, 16:9, quality 2K (about 2752×1536).

Day, batch 4. Keep the take with the emptiest upper left:

```
Wide 16:9 photograph of a calm, clean daytime sky for a website background.
Soft pastel sky blue (#B3D6EF) at the top, fading to almost white (#F5F9FC) at the bottom.
Fluffy white cumulus clouds with soft blue-grey shading sit on the right third of the frame,
and a low, soft bank of white clouds runs along the very bottom edge.
The left half and the upper left are open, empty, pale hazy sky with no clouds.
Gentle diffused daylight from the upper left, light haze.
No sun disc, no lens flare, no birds, no planes, no ground, no horizon line, no text, no people.
Minimal, airy, high-key, fine detail, photographic.
```

Night, batch 2, with the chosen day still as the reference image:

```
Turn this exact image into a calm night sky. Keep every cloud in the same position and shape.
Sky: deep navy (#0D111C) at the top fading to dark slate (#15181E) at the bottom.
Clouds: dark blue-grey (#191E29) with soft, cool moonlight on their upper edges (#50637C).
A faint moon glow beyond the top right corner and a few small, faint stars in the open sky.
No moon disc in frame, no text. Quiet, minimal, photographic.
```

Save them as `raw-sky/day.png` and `raw-sky/night.png` (the folder is ignored by git), then:

```
pip install opencv-python numpy pillow    # once
python3 scripts/sky-drift.py
```

The script writes the plate, the clouds strip and two posters per theme into `public/sky/`
and prints the sizes to copy into `SKY` in `sky.ts`.

A wider still (21:9) gives a longer strip, so the same clouds come back less often.

## Why not a video

The first try animated the stills with Kling 4.0. Its clips push in slowly, the clouds mostly
billow in place, and a clip can only loop by dissolving its end into its start: clouds that
travel sideways would have to jump back. Sliding the clouds in the page loops with no seam,
moves at 60 to 120 fps instead of 24, and downloads a few hundred KB instead of about 4 MB.
