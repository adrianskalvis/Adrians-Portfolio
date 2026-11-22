/* Phone pacing for the About row: each chapter rests aligned for a stretch of scroll,
   then glides to the next one. Desktop moves the row 1px per 1px scrolled instead.

   stops: how far the row must move to align each chapter, starting at 0, increasing.
   rest:  scroll distance each chapter stays still.
   A glide between two stops takes as much scroll as the distance it covers, eased with a
   smoothstep, so its peak speed is 1.5 times the scroll speed and it starts and ends at rest. */
export type SteppedPlan = { stops: number[]; rest: number };

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const steppedLength = ({ stops, rest }: SteppedPlan) =>
  stops.length * rest + (stops.length > 0 ? stops[stops.length - 1] - stops[0] : 0);

/* Row offset (positive = moved left) after `travel` px of pinned scroll. */
export const steppedOffset = (travel: number, { stops, rest }: SteppedPlan) => {
  if (stops.length === 0) return 0;
  let left = Math.max(0, travel);
  for (let i = 0; i < stops.length; i += 1) {
    if (left < rest || i === stops.length - 1) return stops[i];
    left -= rest;
    const distance = stops[i + 1] - stops[i];
    if (left < distance) return stops[i] + distance * smoothstep(left / distance);
    left -= distance;
  }
  return stops[stops.length - 1];
};
