import React, { useState, useEffect, useRef } from "react";
import { useLanguage, Lang } from "@/contexts/LanguageContext";

const options: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "lv", label: "LV" },
];

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [optionRects, setOptionRects] = useState<{ left: number; width: number }[]>([]);
  const activeIndex = options.findIndex((o) => o.value === lang);

  useEffect(() => {
    if (!containerRef.current) return;
    const labels = containerRef.current.querySelectorAll<HTMLLabelElement>(".glass-switcher-option");
    const containerRect = containerRef.current.getBoundingClientRect();
    const rects = Array.from(labels).map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - containerRect.left, width: r.width };
    });
    setOptionRects(rects);
  }, [lang]);

  return (
    <div ref={containerRef} className="liquid-glass-switcher">
      <span className="liquid-glass-switcher__label">Language</span>
      {options.map((opt) => (
        <label key={opt.value} className="glass-switcher-option liquid-glass-switcher__option">
          <input
            type="radio"
            name="lang-toggle"
            value={opt.value}
            checked={lang === opt.value}
            onChange={() => setLang(opt.value)}
            className="sr-only"
          />
          <span className="liquid-glass-switcher__text">{opt.label}</span>
        </label>
      ))}
      <div className="liquid-glass-switcher__highlight" style={
        optionRects.length > 0 && optionRects[activeIndex]
          ? { left: optionRects[activeIndex].left, width: optionRects[activeIndex].width }
          : { left: 0, width: "50%" }
      }>
        <div className="liquid-glass-switcher__highlight-inner" />
      </div>
    </div>
  );
};

export default LanguageToggle;
