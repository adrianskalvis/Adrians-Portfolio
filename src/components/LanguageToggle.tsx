import { motion } from "framer-motion";
import { useLanguage, Lang } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  const options: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "lv", label: "LV" },
  ];

  return (
    <div className="liquid-glass-toggle flex items-center rounded-full p-1 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          className="relative px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 z-10"
          style={{
            color:
              lang === opt.value
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--muted-foreground))",
          }}
        >
          {lang === opt.value && (
            <motion.div
              layoutId="lang-indicator"
              className="absolute inset-0 rounded-full liquid-glass-indicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
