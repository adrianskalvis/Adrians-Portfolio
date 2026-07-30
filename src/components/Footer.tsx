import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-2 px-6 md:px-12 bg-[#f5f5f5] dark:bg-[#1a1c1e] relative z-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/10 pt-4 pb-2">
          <p className="text-[10px] text-muted-foreground/80">
            © {new Date().getFullYear()} Adrian Kalvis{t("footer.rights") ? `. ${t("footer.rights")}` : ""}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-[10px] text-muted-foreground/60 font-medium text-center sm:text-right">
            <span>{t("footer.builtWith")}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <a
              href="https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              {t("footer.inspiration")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
