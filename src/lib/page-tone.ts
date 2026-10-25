/* Shared page background tint.
   Sections register a tone and how strongly it applies (0 to 1). The blend is written to
   --page-bg-light and --page-bg-dark on <html>; index.css picks one by theme, so switching
   theme mid-scroll needs no script and cannot flash the wrong colour. */

type HSL = readonly [number, number, number];
export type Tone = { light: HSL; dark: HSL };

const REST: Tone = { light: [210, 33, 99], dark: [220, 16, 10] };

const sources = new Map<string, { tone: Tone; amount: number }>();
let frame = 0;

const toRgb = ([h, s, l]: HSL): [number, number, number] => {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
};

const toHsl = ([r, g, b]: number[]): string => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d > 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return `${h.toFixed(2)} ${(s * 100).toFixed(2)}% ${(l * 100).toFixed(2)}%`;
};

/* Colours mix in RGB. Mixing hues directly would pass through green on the way from
   sand (40) to periwinkle (228). The strongest source sets how far the page moves from
   rest; weights are raised to the 4th power so the closer project dominates an overlap. */
const blend = (mode: "light" | "dark", strength: number, weights: Map<string, number>) => {
  const rest = toRgb(REST[mode]);
  const out = [...rest];
  sources.forEach(({ tone }, id) => {
    const w = (weights.get(id) ?? 0) * strength;
    const rgb = toRgb(tone[mode]);
    for (let i = 0; i < 3; i++) out[i] += (rgb[i] - rest[i]) * w;
  });
  return toHsl(out);
};

const flush = () => {
  frame = 0;
  const root = document.documentElement;
  let strength = 0;
  let total = 0;
  sources.forEach(({ amount }) => {
    strength = Math.max(strength, amount);
    total += amount ** 4;
  });
  if (strength < 0.002 || total === 0) {
    root.style.removeProperty("--page-bg-light");
    root.style.removeProperty("--page-bg-dark");
    return;
  }
  const weights = new Map<string, number>();
  sources.forEach(({ amount }, id) => weights.set(id, amount ** 4 / total));
  root.style.setProperty("--page-bg-light", blend("light", strength, weights));
  root.style.setProperty("--page-bg-dark", blend("dark", strength, weights));
};

const schedule = () => {
  if (typeof window === "undefined" || frame) return;
  frame = requestAnimationFrame(flush);
};

export const setTone = (id: string, tone: Tone, amount: number) => {
  if (amount <= 0.001) sources.delete(id);
  else sources.set(id, { tone, amount: Math.min(1, amount) });
  schedule();
};

export const clearTone = (id: string) => {
  sources.delete(id);
  schedule();
};
