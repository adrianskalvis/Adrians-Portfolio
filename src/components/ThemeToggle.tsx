import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="glass-toggle-container relative flex items-center rounded-full p-1 w-14 h-8 cursor-pointer"
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        animate={{ x: isDark ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {isDark ? (
          <Moon size={12} className="text-primary-foreground" />
        ) : (
          <Sun size={12} className="text-primary-foreground" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
