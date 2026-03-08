import AnimatedSection from "./AnimatedSection";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "CloudSync Dashboard",
    desc: "A real-time monitoring dashboard for cloud infrastructure with live metrics, alerts, and team collaboration features.",
    tags: ["React", "TypeScript", "WebSocket", "Tailwind"],
  },
  {
    title: "TaskFlow API",
    desc: "RESTful API for project management with authentication, role-based access, and automated workflow triggers.",
    tags: ["Node.js", "PostgreSQL", "Docker", "JWT"],
  },
  {
    title: "DevMetrics CLI",
    desc: "Command-line tool that analyzes codebases and generates comprehensive reports on code quality and complexity.",
    tags: ["Python", "CLI", "AST Analysis"],
  },
  {
    title: "PixelGrid Editor",
    desc: "Browser-based pixel art editor with layers, animation timeline, and export to multiple sprite formats.",
    tags: ["Canvas API", "React", "IndexedDB"],
  },
];

const ProjectsSection = () => (
  <section id="projects" className="section-padding sky-gradient-reverse">
    <div className="max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Projects</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
          Selected work
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <AnimatedSection key={project.title} delay={i * 0.08}>
            <div className="card-sky p-6 h-full flex flex-col">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-accent-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
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

export default ProjectsSection;
