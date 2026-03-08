import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 py-8 px-6 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Adrians Skalvis. {t("footer.rights")}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
