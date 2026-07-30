import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollCue from "./ScrollCue";

const SkillsSection = () => {
  const { t } = useLanguage();

  const skillGroups = [
    {
      category: t("skills.label"),
      skills: [
        "C++",
        "CSS",
        "Docker",
        "Git",
        "HTML",
        "JavaScript",
        "Laravel",
        "MySQL",
        "Next.js",
        "PHP",
        "Python",
        "React",
        "SCSS",
        "SQLite",
        "Tailwind CSS",
        "TypeScript",
        "Vite",
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="section-padding min-h-[100svh] max-w-6xl mx-auto relative z-10 flex flex-col justify-center"
    >
      <AnimatedSection>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
          {t("skills.label")}
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-12">
          {t("skills.heading")}
        </h2>
      </AnimatedSection>

      <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-6">
        {skillGroups.map((group, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="card-sky p-6 h-full">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-base text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.15}>
        <div className="skills-scroll-cue" aria-hidden="true">
          <span>{String(t("skills.scrollHint"))}</span>
          <ScrollCue className="skills-scroll-cue__icon" />
        </div>
      </AnimatedSection>
    </section>
  );
};

export default SkillsSection;
