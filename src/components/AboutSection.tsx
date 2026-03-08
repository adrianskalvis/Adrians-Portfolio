import AnimatedSection from "./AnimatedSection";
import { Code2, Lightbulb, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  const highlights = [
    { icon: Code2, title: t("about.cleanCode"), desc: t("about.cleanCodeDesc") },
    { icon: Lightbulb, title: t("about.problemSolver"), desc: t("about.problemSolverDesc") },
    { icon: Rocket, title: t("about.fastLearner"), desc: t("about.fastLearnerDesc") },
  ];

  return (
    <section id="about" className="section-padding max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
          {t("about.label")}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          {t("about.heading")}
        </h2>
        <p className="text-muted-foreground max-w-2xl leading-relaxed mb-12">
          {t("about.description")}
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-6">
        {highlights.map((item, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="card-sky p-6 h-full">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                <item.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
