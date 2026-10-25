import Lenis from "lenis";

/* Eased page scrolling, the same library landonorris.com uses. The page still scrolls
   natively underneath, so sticky sections, scroll-linked motion and anchor links keep working.
   Touch devices keep their own native momentum; people who ask for reduced motion get none. */
export function startSmoothScroll() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  new Lenis({
    autoRaf: true,
    lerp: 0.09,
    wheelMultiplier: 1,
  });
}
