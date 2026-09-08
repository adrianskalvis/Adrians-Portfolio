import AnimatedSection from "./AnimatedSection";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import "./ProjectsSection.css";

const projectCardVariants = {
  active: {
    opacity: 1,
    x: "0%",
    rotate: 0,
    rotateY: 0,
    scale: 1,
    zIndex: 2,
  },
  preview: {
    opacity: 0.48,
    x: "9%",
    rotate: 3.2,
    rotateY: -4,
    scale: 0.965,
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    x: "14%",
    rotate: 6,
    rotateY: -8,
    scale: 0.93,
    zIndex: 0,
  },
};

const ProjectsSection = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const deckRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const projects = [
    {
      title: String(t("projects.miniGame")),
      description: String(t("projects.miniGameDesc")),
      image: "/mini-game-preview-840.jpg",
      liveUrl: "https://adrianskalvis.github.io/minigame/",
      githubUrl: "https://github.com/adrianskalvis/minigame",
      tags: ["JavaScript", "HTML5", "CSS3", "Sprite Art"],
      featured: true,
      liveLabel: String(t("projects.viewGame")),
      details: [
        {
          label: String(t("projects.role")),
          value: String(t("projects.independentDeveloper")),
        },
        {
          label: String(t("projects.challenge")),
          value: String(t("projects.miniGameChallenge")),
        },
        {
          label: String(t("projects.approach")),
          value: String(t("projects.miniGameApproach")),
        },
        {
          label: String(t("projects.outcome")),
          value: String(t("projects.miniGameOutcome")),
        },
      ],
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
      details: [
        {
          label: String(t("projects.role")),
          value: String(t("projects.independentDeveloper")),
        },
        {
          label: String(t("projects.challenge")),
          value: String(t("projects.vtdtChallenge")),
        },
        {
          label: String(t("projects.approach")),
          value: String(t("projects.vtdtApproach")),
        },
        {
          label: String(t("projects.outcome")),
          value: String(t("projects.vtdtOutcome")),
        },
      ],
    },
  ];

  const showProject = useCallback(
    (index: number, focusDeck = false) => {
      const nextIndex = (index + projects.length) % projects.length;
      setHasInteracted(true);
      setActiveIndex(nextIndex);
      const focusedElement = document.activeElement;
      if (
        focusDeck &&
        focusedElement instanceof HTMLElement &&
        focusedElement !== deckRef.current &&
        deckRef.current?.contains(focusedElement)
      ) {
        deckRef.current?.focus({ preventScroll: true });
      }
    },
    [projects.length],
  );

  const finishDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    if (info.offset.x <= -55 || info.velocity.x <= -500) {
      showProject(activeIndex + 1, true);
    } else if (info.offset.x >= 55 || info.velocity.x >= 500) {
      showProject(activeIndex - 1, true);
    }

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 120);
  };

  const nextIndex = (activeIndex + 1) % projects.length;
  const activeProject = projects[activeIndex];

  return (
    <section id="projects" className="projects-section section-padding bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-divider !mt-0 !mb-12" />

        <div className="projects-layout grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <AnimatedSection>
            <h2 className="text-4xl text-foreground">
              {t("projects.label")}
            </h2>
          </AnimatedSection>

          <div className="min-w-0">
            <AnimatedSection delay={0.1}>
              <div className="project-carousel">
                <div className="project-carousel__switcher">
                  <div className="project-carousel__switcher-topline">
                    <div>
                      <span className="project-carousel__switcher-label">
                        {String(t("projects.heading"))}
                      </span>
                      <span className="project-carousel__hint">
                        {String(t("projects.carouselHint"))}
                      </span>
                    </div>

                    <div className="project-carousel__navigation">
                      <button
                        type="button"
                        className="project-carousel__arrow"
                        onClick={() => showProject(activeIndex - 1)}
                        aria-label={String(t("projects.previous"))}
                      >
                        <ArrowLeft size={18} aria-hidden="true" />
                      </button>

                      <span
                        className="project-carousel__count"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {activeIndex + 1} / {projects.length}
                        <span className="sr-only">: {activeProject.title}</span>
                      </span>

                      <button
                        type="button"
                        className="project-carousel__arrow"
                        onClick={() => showProject(activeIndex + 1)}
                        aria-label={String(t("projects.next"))}
                      >
                        <ArrowRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="project-carousel__choices"
                    role="group"
                    aria-label={String(t("projects.carouselLabel"))}
                  >
                    {projects.map((project, index) => (
                      <button
                        key={project.title}
                        type="button"
                        className={`project-carousel__choice ${
                          activeIndex === index ? "project-carousel__choice--active" : ""
                        }`}
                        aria-pressed={activeIndex === index}
                        onClick={() => showProject(index)}
                      >
                        <span className="project-carousel__choice-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{project.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  ref={deckRef}
                  className="project-carousel__deck"
                  data-cursor-glass
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={String(t("projects.carouselLabel"))}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;

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
                  {projects.map((project, index) => {
                    const isActive = activeIndex === index;
                    const position = isActive
                      ? "active"
                      : index === nextIndex
                        ? "preview"
                        : "hidden";

                    return (
                      <motion.article
                        key={project.title}
                        className={`project-carousel__slide project-carousel__slide--${position} ${
                          isDragging && isActive ? "project-carousel__slide--dragging" : ""
                        } ${isActive ? "group" : ""}`}
                        initial={false}
                        animate={position}
                        variants={projectCardVariants}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 260, damping: 28, mass: 0.82 }
                        }
                        drag={isActive ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.24}
                        dragMomentum={false}
                        dragSnapToOrigin
                        whileDrag={shouldReduceMotion ? undefined : { scale: 0.985 }}
                        onDragStart={() => {
                          suppressClickRef.current = true;
                          setIsDragging(true);
                        }}
                        onDragEnd={finishDrag}
                        onClickCapture={(event) => {
                          if (suppressClickRef.current) {
                            event.preventDefault();
                            event.stopPropagation();
                          }
                        }}
                        aria-label={`${index + 1} / ${projects.length}: ${project.title}`}
                        aria-hidden={!isActive}
                        role="group"
                        aria-roledescription="slide"
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
                            loading="lazy"
                            decoding="async"
                            width={project.image === "/mini-game-preview-840.jpg" ? 840 : 1280}
                            height={project.image === "/mini-game-preview-840.jpg" ? 494 : 720}
                          />
                          {isActive && !hasInteracted && (
                            <span className="project-carousel__swipe-cue" aria-hidden="true">
                              <MoveHorizontal />
                              {String(t("projects.swipeHint"))}
                            </span>
                          )}
                        </a>

                        <div className="project-carousel__content">
                          <div className="project-carousel__eyebrow flex items-center gap-2 text-primary text-sm uppercase tracking-widest mb-4">
                            {project.featured && <Star size={16} className="fill-primary" />}
                            {project.featured
                              ? String(t("projects.featured"))
                              : String(t("projects.project"))}
                          </div>
                          <h3 className="project-carousel__title text-3xl text-foreground mb-6">
                            {project.title}
                          </h3>
                          <p className="project-carousel__description text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                            {project.description}
                          </p>
                          <dl className="project-carousel__proof">
                            {project.details.map((detail) => (
                              <div key={detail.label} className="project-carousel__proof-item">
                                <dt>{detail.label}</dt>
                                <dd>{detail.value}</dd>
                              </div>
                            ))}
                          </dl>
                          <div className="project-carousel__tags flex flex-wrap gap-3 mb-10">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="project-carousel__tag text-sm font-medium px-4 py-1.5 rounded-full bg-accent/50 text-accent-foreground backdrop-blur-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="project-carousel__links flex flex-wrap items-center gap-x-8 gap-y-4">
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-carousel__link text-link text-xl"
                              tabIndex={activeIndex === index ? 0 : -1}
                            >
                              {project.liveLabel}
                              <ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-carousel__link text-link text-xl"
                              tabIndex={activeIndex === index ? 0 : -1}
                            >
                              {String(t("projects.viewOnGithub"))}
                              <ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}

                  <button
                    type="button"
                    className="project-carousel__peek-target"
                    onClick={() => showProject(activeIndex + 1)}
                    aria-label={String(t("projects.next"))}
                    title={String(t("projects.next"))}
                    data-cursor-glass
                  />
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
