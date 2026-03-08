import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // Hide default cursor
    document.body.style.cursor = "none";
    document.querySelectorAll("a, button, [role='button']").forEach((el) => {
      (el as HTMLElement).style.cursor = "none";
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.style.cursor = "";
    };
  }, []);

  // Re-apply cursor:none on DOM changes
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
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      animate={{
        x: pos.x - 12,
        y: pos.y - 12,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <div
        className="w-6 h-6 rounded-full"
        style={{
          border: `1.5px solid ${isDark ? "hsl(210 30% 65%)" : "hsl(210 25% 55%)"}`,
          background: isDark
            ? "hsl(210 30% 65% / 0.08)"
            : "hsl(205 60% 70% / 0.06)",
          backdropFilter: "blur(2px)",
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;
