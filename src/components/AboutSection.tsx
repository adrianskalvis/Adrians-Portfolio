import AnimatedSection from "./AnimatedSection";
import HardwareCarousel from "./HardwareCarousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const AboutSection = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const descriptionParts = t("about.description").split("\n\n");

  return (
    <section id="about" className="section-padding bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-divider !mt-0 !mb-12" />

        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <AnimatedSection>
            <div>
              <h2 className="text-4xl text-foreground">
                {t("about.label")}
              </h2>
              <div className="mt-8 aspect-square w-full max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-2xl border border-border/30">
                <img
                  src="/adrian-portrait-560.jpg"
                  alt={t("about.portraitAlt") as string}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  width="560"
                  height="560"
                />
              </div>
            </div>
          </AnimatedSection>

          <div className="max-w-[600px]">
            <div className="space-y-10 md:space-y-20">
              {descriptionParts.map((part, i) => (
                <motion.p
                  key={i}
                  initial={
                    shouldReduceMotion
                      ? false
                      : isMobile
                        ? { opacity: 0.42, y: 14, scale: 1, filter: "blur(0px)" }
                        : { opacity: 0.2, y: 30, scale: 0.95, filter: "blur(5px)" }
                  }
                  whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  viewport={{
                    once: isMobile,
                    amount: isMobile ? 0.14 : 0.62,
                    margin: isMobile ? "0px 0px -8% 0px" : "-6% 0px -42% 0px",
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: isMobile ? 0.48 : 0.78,
                          delay: isMobile ? 0 : i * 0.03,
                          ease: [0.16, 1, 0.3, 1],
                        }
                  }
                  className="about-reveal text-lg md:text-xl text-muted-foreground leading-relaxed"
                >
                  {part}
                </motion.p>
              ))}
            </div>

            <AnimatedSection delay={0.05}>
              <div className="mt-14 md:mt-20">
                <HardwareCarousel />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
