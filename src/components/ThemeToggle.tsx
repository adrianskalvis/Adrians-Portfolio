import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ThemeOption = "light" | "dark";

const options: { value: ThemeOption; icon: React.ReactNode }[] = [
  {
    value: "light",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    value: "dark",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [optionRects, setOptionRects] = useState<{ left: number; width: number }[]>([]);
  const activeIndex = options.findIndex((o) => o.value === theme);

  useEffect(() => {
    if (!containerRef.current) return;
    const labels = containerRef.current.querySelectorAll<HTMLLabelElement>(".glass-switcher-option");
    const containerRect = containerRef.current.getBoundingClientRect();
    const rects = Array.from(labels).map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - containerRect.left, width: r.width };
    });
    setOptionRects(rects);
  }, [theme]);

  const handleChange = (value: ThemeOption) => {
    if (value !== theme) toggleTheme();
  };

  const highlightStyle: React.CSSProperties =
    optionRects.length > 0 && optionRects[activeIndex]
      ? {
          left: optionRects[activeIndex].left,
          width: optionRects[activeIndex].width,
        }
      : { left: 0, width: "50%" };

  return (
    <div ref={containerRef} className="liquid-glass-switcher">
      <span className="liquid-glass-switcher__label">Theme</span>
      {options.map((option) => (
        <label key={option.value} className="glass-switcher-option liquid-glass-switcher__option">
          <input
            type="radio"
            name="theme-toggle"
            value={option.value}
            checked={theme === option.value}
            onChange={() => handleChange(option.value)}
            className="sr-only"
          />
          <span className="liquid-glass-switcher__icon">{option.icon}</span>
        </label>
      ))}
      <div className="liquid-glass-switcher__highlight" style={highlightStyle}>
        <div className="liquid-glass-switcher__highlight-inner" />
      </div>
    </div>
  );
};

export default ThemeToggle;
