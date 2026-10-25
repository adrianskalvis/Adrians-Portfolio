import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollCue from "./ScrollCue";
import "./SkillsSection.css";

const SkillsSection = () => {
  const { t } = useLanguage();

  const skillGroups = [
    {
      category: t("skills.frontend"),
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "SCSS",
        "Tailwind CSS",
        "Vite",
      ],
    },
    {
      category: t("skills.backend"),
      skills: [
        "PHP",
        "Laravel",
        "Python",
        "C++",
        "R",
      ],
    },
    {
      category: t("skills.databases"),
      skills: [
        "MySQL",
        "SQLite",
      ],
    },
    {
      category: t("skills.tools"),
      skills: [
        "Git",
        "Docker",
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

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {skillGroups.map((group, i) => (
          <AnimatedSection key={String(group.category)} delay={i * 0.06}>
            <div className="card-sky p-5 md:p-6 h-full">
              <h3 className="font-body text-sm font-medium uppercase tracking-widest text-primary mb-5">
                {group.category}
              </h3>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-base text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>
                      {skill}
                      {skill === "R" && <span className="block text-xs leading-normal mt-0.5">{t("skills.learning")}</span>}
                    </span>
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
