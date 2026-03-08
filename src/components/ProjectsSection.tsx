import AnimatedSection from "./AnimatedSection";
import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProjectsSection = () => {
  const { t } = useLanguage();

  const projects = [
    {
      title: t("projects.cloudSync"),
      desc: t("projects.cloudSyncDesc"),
      tags: ["React", "TypeScript", "WebSocket", "Tailwind"],
    },
    {
      title: t("projects.taskFlow"),
      desc: t("projects.taskFlowDesc"),
      tags: ["Node.js", "PostgreSQL", "Docker", "JWT"],
    },
    {
      title: t("projects.devMetrics"),
      desc: t("projects.devMetricsDesc"),
      tags: ["Python", "CLI", "AST Analysis"],
    },
    {
      title: t("projects.pixelGrid"),
      desc: t("projects.pixelGridDesc"),
      tags: ["Canvas API", "React", "IndexedDB"],
    },
  ];

  return (
    <section id="projects" className="section-padding sky-gradient-reverse">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
            {t("projects.label")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
            {t("projects.heading")}
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="card-sky p-6 h-full flex flex-col group">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/60 text-accent-foreground backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/adrianskalvis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <Github size={18} />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
