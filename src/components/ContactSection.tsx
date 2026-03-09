import AnimatedSection from "./AnimatedSection";
import { Mail, Github, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="section-padding sky-gradient-reverse">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
            {t("contact.label")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("contact.heading")}
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            {t("contact.description")}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <a
            href="mailto:alex@example.com"
            className="liquid-glass-btn-primary inline-flex items-center gap-2 mb-10"
          >
            <Send size={16} />
            {t("contact.sayHello")}
          </a>

          <div className="flex items-center justify-center gap-4 mt-2">
            {[
              { icon: Mail, href: "mailto:alex@example.com", label: "Email" },
              { icon: Github, href: "https://github.com/adrianskalvis", label: "GitHub" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-11 h-11 rounded-full liquid-glass-btn-icon flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <link.icon size={18} />
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
