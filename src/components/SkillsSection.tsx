import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollCue from "./ScrollCue";
import "./SkillsSection.css";

/** A skill name, with an optional small line under it (the products used, or "currently studying"). */
type Skill = { name: string; note?: string };
type SkillGroup = { key: string; category: string; skills: Skill[]; wide?: boolean };

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

const names = (...list: string[]): Skill[] => list.map((name) => ({ name }));

/* Groups read like the project and About chapters: a roman numeral and a small capital label
   over a dotted blue rule, with open space instead of boxed cards. */
const SkillsSection = () => {
  const { t } = useLanguage();

  const skillGroups: SkillGroup[] = [
    {
      key: "frontend",
      category: String(t("skills.frontend")),
      skills: names("React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "SCSS", "Tailwind CSS", "Vite"),
    },
    {
      key: "backend",
      category: String(t("skills.backend")),
      skills: [...names("PHP", "Laravel", "Python", "C++"), { name: "R", note: String(t("skills.learning")) }],
    },
    { key: "databases", category: String(t("skills.databases")), skills: names("MySQL", "SQLite") },
    { key: "tools", category: String(t("skills.tools")), skills: names("Git", "Docker") },
    {
      key: "ai",
      category: String(t("skills.ai")),
      wide: true,
      skills: [
        { name: "Claude", note: "Code · Duet · Cowork" },
        { name: "ChatGPT", note: "Chat · Codex" },
        ...names("Higgsfield", "Gemini", "Suno", "ElevenLabs"),
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="section-padding min-h-[100svh] max-w-6xl mx-auto relative z-10 flex flex-col justify-center"
    >
      <AnimatedSection>
        <div className="section-divider !mt-0 !mb-6" />
        <p className="text-sm font-medium tracking-widest uppercase text-accent-foreground mb-3">
          {t("skills.label")}
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-12">
          {t("skills.heading")}
        </h2>
      </AnimatedSection>

      <div className="skills-groups">
        {skillGroups.map((group, i) => (
          <AnimatedSection
            key={group.key}
            delay={i * 0.06}
            className={group.wide ? "skills-groups__wide" : undefined}
          >
            <div className="skills-group">
              <h3 className="skills-group__name">
                <span className="skills-group__numeral">{NUMERALS[i]}</span>
                <span>{group.category}</span>
              </h3>
              <ul className={`skills-group__list${group.wide ? " skills-group__list--wide" : ""}`}>
                {group.skills.map((skill) => (
                  <li key={skill.name} className="skills-item">
                    <span className="skills-dot" aria-hidden="true" />
                    <span>
                      {skill.name}
                      {skill.note && <span className="skills-item__note">{skill.note}</span>}
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
