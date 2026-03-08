import { useState, useEffect } from "react";
import { Home, User, FolderOpen, Wrench, Mail, Menu, X, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dock, DockItem, DockIcon, DockLabel } from "@/components/ui/dock";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), href: "#hero", icon: Home },
    { label: t("nav.about"), href: "#about", icon: User },
    { label: t("nav.projects"), href: "#projects", icon: FolderOpen },
    { label: t("nav.skills"), href: "#skills", icon: Wrench },
    { label: t("nav.contact"), href: "#contact", icon: Mail },
    { label: "GitHub", href: "https://github.com/adrianskalvis", icon: Github, external: true },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string, external?: boolean) => {
    setMobileOpen(false);
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top-right controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Desktop Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <Dock
          magnification={70}
          distance={120}
          panelHeight={56}
          className="liquid-glass-dock border border-border/30 px-4 gap-2 rounded-2xl"
        >
          {navItems.map((item) => (
            <DockItem
              key={item.href}
              onClick={() => handleNav(item.href, (item as any).external)}
              className="cursor-pointer dock-icon-item"
            >
              <DockLabel className="glass-label">{item.label}</DockLabel>
              <DockIcon className="dock-icon-circle">
                <item.icon className="w-full h-full" strokeWidth={1.5} />
              </DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>

      {/* Mobile nav bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
          scrolled
            ? "glass-surface border-b border-border/40 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="px-6 flex items-center justify-between h-14">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNav("#hero"); }}
            className="font-display text-lg font-bold text-gradient-sky"
          >
            Portfolio
          </a>
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-surface border-b border-border/40 overflow-hidden"
            >
              <ul className="flex flex-col px-6 py-4 gap-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNav(item.href, (item as any).external)}
                      className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-full text-left"
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
