import { SkyDrift } from "@/components/hero/skyDrift";
import type { DriftLayers } from "@/components/hero/sky";
import "./not-found.css";

/* The 404 sky: scripts/sky-drift.py --404 makes these files from raw-404/ and prints the sizes.
   Clouds show across the whole frame here (floor 1), so there is nothing to fade out. */
const STILL = { width: 2752, height: 1536, strip: 2257 };
const scenes: Record<"light" | "dark", DriftLayers> = {
  light: { plate: "/404/sky-day-plate.webp", clouds: "/404/sky-day-clouds.webp", ...STILL, floor: 1 },
  dark: { plate: "/404/sky-night-plate.webp", clouds: "/404/sky-night-clouds.webp", ...STILL, floor: 1 },
};
const EVERYWHERE = [-1, 0] as const;

const canvas = document.querySelector<HTMLCanvasElement>(".nf-sky__canvas");
const dark = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

if (canvas && !reduceMotion && !saveData) {
  const drift = SkyDrift.create(
    canvas,
    {
      scenes,
      speed: 14,
      focus: [0.5, 0.5],
      mask: { ramp: [0, 0], band: EVERYWHERE, portraitBand: EVERYWHERE },
      onVisible: (visible) => canvas.classList.toggle("is-ready", visible),
    },
    dark.matches ? "dark" : "light",
  );
  if (drift) {
    drift.setPlaying(true);
    dark.addEventListener("change", (event) => drift.setMode(event.matches ? "dark" : "light"));
  }
}
