import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const mousePos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const rafId = useRef<number>(0);

  const render = useCallback(() => {
    const el = cursorRef.current;
    if (el) {
      el.style.transform = `translate3d(${mousePos.current.x - 16}px, ${mousePos.current.y - 16}px, 0)`;
      el.style.opacity = visible.current ? "1" : "0";
    }
    rafId.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      visible.current = true;
    };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    document.body.style.cursor = "none";
    document.querySelectorAll("a, button, [role='button']").forEach((el) => {
      (el as HTMLElement).style.cursor = "none";
    });

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = "";
    };
  }, [render]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        (el as HTMLElement).style.cursor = "none";
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{ willChange: "transform", opacity: 0 }}
    >
      <div
        className="w-8 h-8 rounded-full"
        style={{
          border: `1.5px solid ${isDark ? "hsl(210 30% 65%)" : "hsl(210 50% 78%)"}`,
          background: isDark
            ? "hsl(210 30% 65% / 0.06)"
            : "hsl(205 60% 80% / 0.04)",
          backdropFilter: "blur(2px)",
        }}
      />
    </div>
  );
};

export default CustomCursor;
