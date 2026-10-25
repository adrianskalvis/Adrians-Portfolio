import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { DRIFT_MASK, DRIFT_SPEED, SKY, SKY_FOCUS } from "./sky";
import { SkyDrift } from "./skyDrift";
import "./HeroSky.css";

type Mode = "light" | "dark";

const scenes = {
  ...(SKY.light?.drift ? { light: SKY.light.drift } : {}),
  ...(SKY.dark?.drift ? { dark: SKY.dark.drift } : {}),
};
const hasDrift = Object.keys(scenes).length > 0;

/* Background sky for the hero. The poster of each theme paints first; then a WebGL canvas
   takes over and slides the clouds sideways in an endless loop (skyDrift.ts). Light and dark
   crossfade on theme change. The canvas only draws while the hero is on screen. Reduced
   motion, Save-Data and browsers without WebGL2 keep the poster. */
const HeroSky = () => {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const driftRef = useRef<SkyDrift | null>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const [mounted, setMounted] = useState<Mode[]>([theme]);
  const [allowMotion, setAllowMotion] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [inView, setInView] = useState(true);

  /* A poster mounts the first time its theme is shown and then stays, so later switches
     crossfade without reloading anything. */
  useEffect(() => {
    setMounted((current) => (current.includes(theme) ? current : [...current, theme]));
  }, [theme]);

  /* Motion is decided on the client only, so the prerendered HTML holds just the poster. */
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setAllowMotion(hasDrift && !reduceMotion && !connection?.saveData);
  }, [reduceMotion]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!allowMotion || !canvas) return;
    const drift = SkyDrift.create(
      canvas,
      { scenes, speed: DRIFT_SPEED, focus: SKY_FOCUS, mask: DRIFT_MASK, onVisible: setCanvasReady },
      themeRef.current,
    );
    if (!drift) return;
    driftRef.current = drift;
    return () => {
      drift.destroy();
      driftRef.current = null;
      setCanvasReady(false);
    };
  }, [allowMotion]);

  useEffect(() => {
    driftRef.current?.setMode(theme);
  }, [theme]);

  useEffect(() => {
    driftRef.current?.setPlaying(inView);
  }, [inView, allowMotion]);

  if (!SKY.light && !SKY.dark) return null;

  return (
    <div
      ref={rootRef}
      className="hero-sky"
      aria-hidden="true"
      style={{ ["--sky-focus" as string]: `${SKY_FOCUS[0] * 100}% ${SKY_FOCUS[1] * 100}%` }}
    >
      {(["light", "dark"] as const).map((mode) => {
        const scene = SKY[mode];
        if (!scene || !mounted.includes(mode)) return null;
        return (
          <picture key={mode} className={`hero-sky__layer ${theme === mode ? "is-active" : ""}`}>
            {scene.poster.tall && <source media="(max-aspect-ratio: 4/5)" srcSet={scene.poster.tall} />}
            <img className="hero-sky__media" src={scene.poster.wide} alt="" decoding="async" draggable={false} />
          </picture>
        );
      })}
      {allowMotion && <canvas ref={canvasRef} className={`hero-sky__canvas ${canvasReady ? "is-ready" : ""}`} />}
      <div className="hero-sky__wash" />
      <div className="hero-sky__grain" />
    </div>
  );
};

export default HeroSky;
