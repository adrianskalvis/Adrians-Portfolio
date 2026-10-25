import AnimatedSection from "./AnimatedSection";
import ContactForm from "./ContactForm";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20 bg-[#f5f5f5] dark:bg-[#1a1c1e] relative z-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <AnimatedSection>
            <h2 className="text-4xl text-foreground">{t("contact.label")}</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl pb-10">
              <p className="contact-intro text-muted-foreground mb-7">{t("contact.description")}</p>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
