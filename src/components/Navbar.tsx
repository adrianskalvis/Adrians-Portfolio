import { useState, useEffect } from "react";
import { Home, User, FolderOpen, Wrench, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dock, DockItem, DockIcon, DockLabel } from "@/components/ui/dock";

const navItems = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Projects", href: "#projects", icon: FolderOpen },
  { label: "Skills", href: "#skills", icon: Wrench },
  { label: "Contact", href: "#contact", icon: Mail },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Dock - fixed bottom center */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-100"
        }`}
      >
        <Dock
          magnification={70}
          distance={120}
          panelHeight={56}
          className="glass-dock border border-border/40 px-3 gap-3"
        >
          {navItems.map((item) => (
            <DockItem
              key={item.href}
              onClick={() => handleNav(item.href)}
              className="cursor-pointer"
            >
              <DockLabel className="glass-label">{item.label}</DockLabel>
              <DockIcon className="text-foreground/70 hover:text-primary transition-colors">
                <item.icon className="w-full h-full" strokeWidth={1.5} />
              </DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>

      {/* Mobile nav bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
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
                      onClick={() => handleNav(item.href)}
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
