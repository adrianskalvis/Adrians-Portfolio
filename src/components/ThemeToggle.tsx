import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ThemeOption = "light" | "dark";

const options: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndex = options.findIndex((o) => o.value === theme);

  const handleChange = (value: ThemeOption) => {
    if (value === theme) return;
    setPrevIndex(activeIndex);
    if (value !== theme) toggleTheme();
  };

  // Compute highlight position
  const getHighlightStyle = (): React.CSSProperties => {
    const width = `${100 / options.length}%`;
    const left = `${(activeIndex / options.length) * 100}%`;
    return { width, left };
  };

  return (
    <div
      ref={containerRef}
      className="liquid-glass-switcher"
      data-active={activeIndex + 1}
      data-prev={prevIndex !== null ? prevIndex + 1 : undefined}
    >
      <span className="liquid-glass-switcher__label">Theme</span>
      {options.map((option) => (
        <label key={option.value} className="liquid-glass-switcher__option">
          <input
            type="radio"
            name="theme-toggle"
            value={option.value}
            checked={theme === option.value}
            onChange={() => handleChange(option.value)}
            className="sr-only"
          />
          <span className="liquid-glass-switcher__icon">{option.icon}</span>
          <span className="liquid-glass-switcher__text">{option.label}</span>
        </label>
      ))}
      {/* Highlight slider */}
      <div className="liquid-glass-switcher__highlight" style={getHighlightStyle()}>
        <div className="liquid-glass-switcher__highlight-inner" />
      </div>
    </div>
  );
};

export default ThemeToggle;
