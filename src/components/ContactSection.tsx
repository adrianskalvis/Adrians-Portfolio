import AnimatedSection from "./AnimatedSection";
import { Mail, Github, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20 bg-[#f5f5f5] dark:bg-[#1a1c1e] relative z-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <AnimatedSection>
            <h2 className="text-4xl text-foreground">
              {t("contact.label")}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl">
              <h3 className="text-3xl text-foreground mb-6">
                {t("contact.heading")}
              </h3>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {t("contact.description")}
              </p>

              <div className="flex flex-wrap items-center gap-8 pb-12">
                <a
                  href="https://github.com/adrianskalvis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link text-xl"
                >
                  GitHub
                  <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-current ml-1" />
                </a>
                <a
                  href="mailto:adrians.kalvis2008@gmail.com"
                  className="text-link text-xl"
                >
                  Email
                  <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-current ml-1" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
