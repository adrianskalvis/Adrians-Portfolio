import AnimatedSection from "./AnimatedSection";

const skillGroups = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "C++", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "HTML/CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL"],
  },
  {
    category: "Tools & DevOps",
    skills: ["Git", "Docker", "CI/CD", "Linux", "AWS", "Figma"],
  },
];

const SkillsSection = () => (
  <section id="skills" className="section-padding max-w-6xl mx-auto">
    <AnimatedSection>
      <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Skills</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
        Technologies I work with
      </h2>
    </AnimatedSection>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {skillGroups.map((group, i) => (
        <AnimatedSection key={group.category} delay={i * 0.1}>
          <div className="card-sky p-6 h-full">
            <h3 className="font-display font-semibold text-foreground mb-4">{group.category}</h3>
            <ul className="space-y-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="text-sm text-muted-foreground flex items-center gap-2"
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
  </section>
);

export default SkillsSection;
