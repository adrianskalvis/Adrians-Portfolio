import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const options = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
  ];

  return (
    <div className="liquid-glass-toggle flex items-center rounded-full p-1 gap-0.5">
      {options.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => { if (!active) toggleTheme(); }}
            className="relative px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 z-10 flex items-center gap-1.5"
            style={{
              color: active
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--muted-foreground))",
            }}
          >
            {active && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 rounded-full liquid-glass-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <opt.icon size={12} className="relative z-10" />
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
