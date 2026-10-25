import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type DriftProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Scroll speed relative to the page. 0 scrolls with the page, 1 drifts a full 160px against it. */
  speed?: number;
  /** Which side the element arrives from. */
  from?: "right" | "left" | "below";
  /** Tilt in degrees while arriving; the element settles to 0. */
  tilt?: number;
  /** Fade and lift away again as the element leaves the top of the viewport. */
  exit?: boolean;
};

/* One scroll-linked element: parallax drift, an arrival slide, and an optional exit fade.
   Everything is driven by the element's own position in the viewport, so nothing is pinned. */
const Drift = ({ children, className, style, speed = 0, from = "below", tilt = 0, exit = false }: DriftProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const parallax = wide ? speed * 160 : 0;
  const arriveX = from === "right" ? 90 : from === "left" ? -90 : 0;
  const arriveY = from === "below" ? 70 : 20;

  const opacity = useTransform(scrollYProgress, exit ? [0, 0.18, 0.8, 0.98] : [0, 0.2, 1, 1], exit ? [0, 1, 1, 0] : [0, 1, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 0.26], [arriveX, 0]);
  const y = useTransform(scrollYProgress, [0, 0.26, 1], [arriveY + parallax * 0.5, parallax * 0.4, -parallax * 0.5 + (exit ? -40 : 0)]);
  const rotate = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [tilt, 0, 0, exit ? -tilt * 0.5 : 0]);

  const motionStyle: MotionStyle = reduceMotion ? { ...style } : { ...style, opacity, x, y, rotate };

  return (
    <motion.div ref={ref} className={className} style={motionStyle}>
      {children}
    </motion.div>
  );
};

export default Drift;
