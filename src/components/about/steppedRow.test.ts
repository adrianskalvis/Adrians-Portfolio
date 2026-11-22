import { describe, expect, it } from "vitest";
import { steppedLength, steppedOffset } from "./steppedRow";

/* Three chapters, 360px apart, each resting for 200px of scroll. */
const plan = { stops: [0, 360, 720], rest: 200 };

describe("steppedRow", () => {
  it("spends one rest per stop plus the full travel between stops", () => {
    expect(steppedLength(plan)).toBe(3 * 200 + 720);
  });

  it("holds the first chapter still during its rest", () => {
    expect(steppedOffset(0, plan)).toBe(0);
    expect(steppedOffset(199, plan)).toBe(0);
  });

  it("glides to the next chapter after the rest, halfway at the midpoint", () => {
    expect(steppedOffset(200 + 180, plan)).toBeCloseTo(180);
  });

  it("starts and ends each glide gently", () => {
    const early = steppedOffset(200 + 18, plan);
    const late = steppedOffset(200 + 342, plan);

    expect(early).toBeLessThan(18);
    expect(late).toBeGreaterThan(342);
  });

  it("rests exactly on each later chapter", () => {
    expect(steppedOffset(200 + 360 + 100, plan)).toBe(360);
    expect(steppedOffset(steppedLength(plan), plan)).toBe(720);
  });

  it("never moves backwards", () => {
    let previous = -Infinity;
    for (let u = 0; u <= steppedLength(plan); u += 7) {
      const x = steppedOffset(u, plan);
      expect(x).toBeGreaterThanOrEqual(previous);
      previous = x;
    }
  });

  it("clamps outside the pinned range", () => {
    expect(steppedOffset(-50, plan)).toBe(0);
    expect(steppedOffset(steppedLength(plan) + 500, plan)).toBe(720);
  });
});
