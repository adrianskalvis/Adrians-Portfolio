import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hasPrecisePointer, setHasPrecisePointer] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isOverHeader, setIsOverHeader] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const interactive = useRef(false);
  const projectHover = useRef(false);
  const overHeader = useRef(false);
  const warmLight = useRef(0);
  const rafId = useRef<number>(0);
  const warmLightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const updatePointerType = () => {
      setHasPrecisePointer(pointerQuery.matches);
    };

    updatePointerType();
    pointerQuery.addEventListener("change", updatePointerType);

    return () => pointerQuery.removeEventListener("change", updatePointerType);
  }, []);

  const render = useCallback(() => {
    if (!hasPrecisePointer) return;
    const el = cursorRef.current;
    if (el) {
      el.style.transform = `translate3d(${mousePos.current.x - 38}px, ${mousePos.current.y - 38}px, 0)`;
      el.style.opacity = visible.current ? "1" : "0";
    }
    if (warmLightRef.current) {
      warmLightRef.current.style.opacity = visible.current && isDark
        ? String(warmLight.current * 0.72)
        : "0";
    }
    rafId.current = requestAnimationFrame(render);
  }, [hasPrecisePointer, isDark]);

  useEffect(() => {
    if (!hasPrecisePointer) return;
    const themeControl = document.querySelector<HTMLElement>(".switcher-frame");

    const onMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      visible.current = true;

      const target = e.target instanceof Element
        ? e.target.closest("a, button, label, [role='button'], [data-cursor-glass]")
        : null;
      const projectTarget = e.target instanceof Element
        ? e.target.closest("[data-cursor-project]")
        : null;
      const nextInteractive = Boolean(target);
      const nextProject = Boolean(projectTarget);
      const nextOverHeader = e.target instanceof Element
        ? Boolean(e.target.closest(".site-navbar__bar"))
        : false;

      if (isDark && themeControl) {
        const rect = themeControl.getBoundingClientRect();
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const distance = Math.hypot(dx, dy);
        warmLight.current = Math.max(0, Math.min(1, 1 - distance / 300));
      } else {
        warmLight.current = 0;
      }

      if (interactive.current !== nextInteractive) {
        interactive.current = nextInteractive;
        setIsInteractive(nextInteractive);
      }
      if (projectHover.current !== nextProject) {
        projectHover.current = nextProject;
        setIsProject(nextProject);
      }
      if (overHeader.current !== nextOverHeader) {
        overHeader.current = nextOverHeader;
        setIsOverHeader(nextOverHeader);
      }
    };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };
    const onPointerDown = () => setIsPressed(true);
    const onPointerUp = () => setIsPressed(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointercancel", onPointerUp, { passive: true });

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
      cancelAnimationFrame(rafId.current);
    };
  }, [render, hasPrecisePointer, isDark]);

  if (!hasPrecisePointer) return null;

  return (
    <div
      ref={cursorRef}
      data-custom-cursor
      className="custom-cursor"
    >
      <div
        ref={warmLightRef}
        className="custom-cursor__warm-light"
        aria-hidden="true"
      />
      <div
        className={[
          "custom-cursor__bubble",
          isDark && "custom-cursor__bubble--dark",
          isInteractive && "custom-cursor__bubble--interactive",
          isProject && "custom-cursor__bubble--project",
          isPressed && "custom-cursor__bubble--pressed",
          isOverHeader && "custom-cursor__bubble--header",
        ].filter(Boolean).join(" ")}
      />
    </div>
  );
};

export default CustomCursor;
