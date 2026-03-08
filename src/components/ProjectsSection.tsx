import AnimatedSection from "./AnimatedSection";
import { ExternalLink, Github, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const ProjectsSection = () => {
  const { t } = useLanguage();

  const otherProjects = [
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

        {/* Featured Project */}
        <AnimatedSection delay={0.1}>
          <motion.div
            className="card-sky p-8 mb-10 relative overflow-hidden group"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Star size={14} className="fill-primary" />
              {t("projects.featured")}
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
              {t("projects.miniGame")}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              {t("projects.miniGameDesc")}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["JavaScript", "HTML5 Canvas", "CSS3", "Game Logic"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/60 text-accent-foreground backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/adrianskalvis/minigame"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm"
            >
              <Github size={16} />
              {t("projects.viewOnGithub")}
            </a>
          </motion.div>
        </AnimatedSection>

        {/* Other Projects */}
        <div className="grid md:grid-cols-3 gap-6">
          {otherProjects.map((project, i) => (
            <AnimatedSection key={i} delay={0.15 + i * 0.08}>
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
