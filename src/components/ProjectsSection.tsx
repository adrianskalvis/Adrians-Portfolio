import AnimatedSection from "./AnimatedSection";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const projects = [
    {
      title: String(t("projects.miniGame")),
      description: String(t("projects.miniGameDesc")),
      image: "/mini-game-preview.png",
      liveUrl: "https://adrianskalvis.github.io/minigame/",
      githubUrl: "https://github.com/adrianskalvis/minigame",
      tags: ["JavaScript", "HTML5", "CSS3", "Sprite Art"],
      featured: true,
      liveLabel: String(t("projects.viewGame")),
    },
    {
      title: String(t("projects.vtdtCareer")),
      description: String(t("projects.vtdtCareerDesc")),
      image: "/vtdt-karjera.jpg",
      liveUrl: "https://adrianskalvis.github.io/VTDT-Karjera/",
      githubUrl: "https://github.com/adrianskalvis/VTDT-Karjera",
      tags: ["JavaScript", "HTML5", "CSS3", "Decision Tree"],
      featured: false,
      liveLabel: String(t("projects.viewProject")),
    },
  ];

  const showProject = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;

      const nextIndex = Math.max(0, Math.min(projects.length - 1, index));
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior });
      setActiveIndex(nextIndex);
    },
    [projects.length],
  );

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.max(0, Math.min(projects.length - 1, nextIndex)));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    const track = trackRef.current;
    const didMove = dragRef.current.moved;
    dragRef.current.pointerId = -1;
    setIsDragging(false);

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    if (track && didMove) {
      const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
      suppressClickRef.current = true;
      showProject(nextIndex);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    const track = trackRef.current;
    if (!track) return;

    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 5) {
      dragRef.current.moved = true;
      if (!track.hasPointerCapture(event.pointerId)) {
        track.setPointerCapture(event.pointerId);
      }
    }

    if (dragRef.current.moved) {
      track.scrollLeft = dragRef.current.startScrollLeft - delta;
      event.preventDefault();
    }
  };

  return (
    <section id="projects" className="section-padding bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-divider !mt-0 !mb-12" />

        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <AnimatedSection>
            <h2 className="text-4xl text-foreground">
              {t("projects.label")}
            </h2>
          </AnimatedSection>

          <div className="min-w-0">
            <AnimatedSection delay={0.1}>
              <div className="project-carousel">
                <div
                  ref={trackRef}
                  className={`project-carousel__track ${
                    isDragging ? "project-carousel__track--dragging" : ""
                  }`}
                  data-cursor-glass
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={String(t("projects.carouselLabel"))}
                  tabIndex={0}
                  onScroll={handleScroll}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishDrag}
                  onPointerCancel={finishDrag}
                  onClickCapture={(event) => {
                    if (suppressClickRef.current) {
                      event.preventDefault();
                      event.stopPropagation();
                      suppressClickRef.current = false;
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      showProject(activeIndex - 1);
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      showProject(activeIndex + 1);
                    }
                  }}
                >
                  {projects.map((project, index) => (
                    <article
                      key={project.title}
                      className="project-carousel__slide group"
                      aria-label={`${index + 1} / ${projects.length}: ${project.title}`}
                      aria-hidden={activeIndex !== index}
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-carousel__image"
                        draggable={false}
                        tabIndex={activeIndex === index ? 0 : -1}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                          draggable={false}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </a>

                      <div className="project-carousel__content">
                        <div className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest mb-4">
                          {project.featured && <Star size={16} className="fill-primary" />}
                          {project.featured
                            ? String(t("projects.featured"))
                            : String(t("projects.project"))}
                        </div>
                        <h3 className="text-3xl text-foreground mb-6">
                          {project.title}
                        </h3>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mb-10">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-sm font-medium px-4 py-1.5 rounded-full bg-accent/50 text-accent-foreground backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link text-xl"
                            tabIndex={activeIndex === index ? 0 : -1}
                          >
                            {project.liveLabel}
                            <ArrowUpRight size={18} aria-hidden="true" />
                          </a>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link text-xl"
                            tabIndex={activeIndex === index ? 0 : -1}
                          >
                            {String(t("projects.viewOnGithub"))}
                            <ArrowUpRight size={18} aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="project-carousel__controls">
                  <p className="project-carousel__hint">
                    {String(t("projects.carouselHint"))}
                  </p>

                  <div className="project-carousel__navigation">
                    <button
                      type="button"
                      className="project-carousel__arrow"
                      onClick={() => showProject(activeIndex - 1)}
                      disabled={activeIndex === 0}
                      aria-label={String(t("projects.previous"))}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                    </button>

                    <div className="project-carousel__dots" aria-hidden="true">
                      {projects.map((project, index) => (
                        <span
                          key={project.title}
                          className={`project-carousel__dot ${
                            activeIndex === index ? "project-carousel__dot--active" : ""
                          }`}
                        />
                      ))}
                    </div>

                    <span className="project-carousel__count" aria-live="polite">
                      {activeIndex + 1} / {projects.length}
                    </span>

                    <button
                      type="button"
                      className="project-carousel__arrow"
                      onClick={() => showProject(activeIndex + 1)}
                      disabled={activeIndex === projects.length - 1}
                      aria-label={String(t("projects.next"))}
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
