/* Media for the hero sky. scripts/sky-drift.py makes every file in public/sky/ from the two
   stills in raw-sky/ (see docs/hero-sky.md) and prints the sizes used below.

   Each scene has a poster, painted at once and kept for reduced motion, and the two layers
   the drifting sky is drawn from. Leave a scene as null and the hero keeps its plain
   gradient for that theme. */

export type DriftLayers = {
  /** The light of the sky, which stays put: haze, sun or moon glow, stars. Half size. */
  plate: string;
  /** The clouds as 128 + (still - plate), a strip that repeats sideways without a seam. */
  clouds: string;
  /** Size of the still in px. The plate covers it; the strip is `strip` px wide. */
  width: number;
  height: number;
  strip: number;
  /** How much of the clouds shows behind the text: 0 clear sky, 1 all of it. */
  floor: number;
};

export type SkyScene = {
  /** The first frame of the drift, shown before WebGL starts and for reduced motion.
      `tall` is the same frame for phones held upright (screens of 4:5 and narrower). */
  poster: { wide: string; tall?: string };
  drift?: DriftLayers;
};

export const SKY: { light: SkyScene | null; dark: SkyScene | null } = {
  light: {
    poster: { wide: "/sky/sky-day-wide.webp", tall: "/sky/sky-day-tall.webp" },
    drift: {
      plate: "/sky/sky-day-plate.webp",
      clouds: "/sky/sky-day-clouds.webp",
      width: 2752,
      height: 1536,
      strip: 2257,
      floor: 0,
    },
  },
  dark: {
    poster: { wide: "/sky/sky-night-wide.webp", tall: "/sky/sky-night-tall.webp" },
    drift: {
      plate: "/sky/sky-night-plate.webp",
      clouds: "/sky/sky-night-clouds.webp",
      width: 2752,
      height: 1536,
      strip: 2257,
      floor: 0.5,
    },
  },
};

/** Which point of the still stays in view when the screen crops it (like object-position).
    The clouds sit on the right, so the crop keeps that side. */
export const SKY_FOCUS: readonly [number, number] = [0.7, 0.5];

/** Drift speed in px of the still per second. One full loop of the strip takes about
    strip / speed seconds (2257 / 30, about 75 s). */
export const DRIFT_SPEED = 30;

/** Where the clouds show, in fractions of the hero. Across the width they fade in from
    ramp[0] (none, behind the text) to ramp[1] (all), and from band[0] to band[1] of the height
    they show across the whole width. Phones held upright have the text on top, so there the
    clouds fade in from portraitBand[0] to portraitBand[1] of the height instead.
    Same values as scripts/sky-drift.py. */
export const DRIFT_MASK = { ramp: [0.3, 0.58], band: [0.74, 0.88], portraitBand: [0.5, 0.74] } as const;
