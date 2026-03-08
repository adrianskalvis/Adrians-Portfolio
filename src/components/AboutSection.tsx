import AnimatedSection from "./AnimatedSection";
import { Code2, Lightbulb, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const AboutSection = () => {
  const { t } = useLanguage();

  const highlights = [
    { icon: Code2, title: t("about.cleanCode"), desc: t("about.cleanCodeDesc") },
    { icon: Lightbulb, title: t("about.problemSolver"), desc: t("about.problemSolverDesc") },
    { icon: Rocket, title: t("about.fastLearner"), desc: t("about.fastLearnerDesc") },
  ];

  const experiences = [
    t("about.experience.tinkercad"),
    t("about.experience.sketchup"),
    t("about.experience.3dprint"),
    t("about.experience.premiere"),
    t("about.experience.capcut"),
    t("about.experience.picsart"),
  ];

  const descriptionParts = t("about.description").split("\n\n");

  return (
    <section id="about" className="section-padding">
      {/* Grey divider line with spacing */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="h-px bg-border" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Row 1: Title left, main text right */}
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20 mb-8">
          <AnimatedSection>
            <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
              {t("about.label")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {t("about.heading")}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-4">
              {descriptionParts.map((part, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {part}
                </p>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Row 2: Empty left, experience list + cards right */}
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20">
          {/* Empty left column for balance */}
          <div className="hidden md:block" />

          <div>
            <AnimatedSection delay={0.15}>
              <ul className="space-y-2 mb-12">
                {experiences.map((exp, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {exp}
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>

            <div className="flex flex-col gap-4">
              {highlights.map((item, i) => (
                <AnimatedSection key={i} delay={0.2 + i * 0.1}>
                  <div className="card-sky p-5 flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
