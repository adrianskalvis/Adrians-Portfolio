import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hasPrecisePointer, setHasPrecisePointer] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const interactive = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
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
      if (interactive.current !== nextInteractive) {
        interactive.current = nextInteractive;
        setIsInteractive(nextInteractive);
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
      className="pointer-events-none fixed top-0 left-0 z-[1000]"
      style={{ willChange: "transform", opacity: 0 }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          transform: isPressed
            ? "scale(0.88)"
            : isInteractive
              ? "scale(1.24)"
              : "scale(1)",
          border: isDark
            ? `1.5px solid rgba(225, 235, 245, ${isInteractive ? "0.68" : "0.5"})`
            : `1.5px solid rgba(104, 185, 229, ${isInteractive ? "0.64" : "0.48"})`,
          background: isDark
            ? "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.28), transparent 35%), rgba(220, 232, 245, 0.16)"
            : "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.78), transparent 35%), rgba(187, 226, 247, 0.2)",
          backdropFilter: `blur(${isInteractive ? "9px" : "5px"}) saturate(${isInteractive ? "185%" : "160%"})`,
          WebkitBackdropFilter: `blur(${isInteractive ? "9px" : "5px"}) saturate(${isInteractive ? "185%" : "160%"})`,
          boxShadow: isDark
            ? `inset 1px 1px 0 rgba(255,255,255,0.45), inset -1px -1px 0 rgba(0,0,0,0.16), 0 ${isInteractive ? "10px 28px" : "6px 18px"} rgba(0,0,0,0.22)`
            : `inset 1px 1px 0 rgba(255,255,255,0.88), inset -1px -1px 0 rgba(75,150,195,0.14), 0 ${isInteractive ? "10px 28px" : "6px 18px"} rgba(75,150,195,0.19)`,
          transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, background 300ms ease, box-shadow 300ms ease, backdrop-filter 300ms ease",
        }}
      />
    </div>
  );
};

export default CustomCursor;
