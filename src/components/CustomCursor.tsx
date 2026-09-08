import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hasPrecisePointer, setHasPrecisePointer] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isOverHeader, setIsOverHeader] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const interactive = useRef(false);
  const overHeader = useRef(false);
  const rafId = useRef<number>(0);

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
      el.style.transform = `translate3d(${mousePos.current.x - 22}px, ${mousePos.current.y - 22}px, 0)`;
      el.style.opacity = visible.current ? "1" : "0";
    }
    rafId.current = requestAnimationFrame(render);
  }, [hasPrecisePointer]);

  useEffect(() => {
    if (!hasPrecisePointer) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      visible.current = true;

      const target = e.target instanceof Element
        ? e.target.closest("a, button, label, [role='button'], [data-cursor-glass]")
        : null;
      const nextInteractive = Boolean(target);
      const nextOverHeader = e.target instanceof Element
        ? Boolean(e.target.closest(".site-navbar__bar"))
        : false;

      if (interactive.current !== nextInteractive) {
        interactive.current = nextInteractive;
        setIsInteractive(nextInteractive);
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
  }, [render, hasPrecisePointer]);

  if (!hasPrecisePointer) return null;

  return (
    <div
      ref={cursorRef}
      data-custom-cursor
      className="custom-cursor"
    >
      <div
        className={[
          "custom-cursor__bubble",
          isDark && "custom-cursor__bubble--dark",
          isInteractive && "custom-cursor__bubble--interactive",
          isPressed && "custom-cursor__bubble--pressed",
          isOverHeader && "custom-cursor__bubble--header",
        ].filter(Boolean).join(" ")}
      />
    </div>
  );
};

export default CustomCursor;
