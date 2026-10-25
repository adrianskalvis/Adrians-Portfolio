import AnimatedSection from "./AnimatedSection";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Expand, MoveHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion, useIsPresent, useReducedMotion, type PanInfo } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import ImageViewer, { type ViewerImage } from "./ImageViewer";
import "./ProjectsSection.css";

const imageVariants = {
  enter: (direction: number) => ({ x: `${direction * 100}%` }),
  center: { x: "0%" },
  exit: (direction: number) => ({ x: `${direction * -100}%` }),
};

interface ProjectImageProps {
  project: { image: string; title: string; width: number; height: number; tone: string };
  direction: number;
  reduceMotion: boolean;
  label: string;
  onOpen: () => void;
  onDragStart?: () => void;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  suppressClick: { current: boolean };
  detail?: boolean;
}

// Only the images travel. The glass frame, typography layout and controls stay put.
const ProjectImage = ({ project, direction, reduceMotion, label, onOpen, onDragStart, onDragEnd, suppressClick, detail = false }: ProjectImageProps) => {
  const isPresent = useIsPresent();
  return (
    <motion.button
      type="button"
      className={`project-carousel__photo project-carousel__photo--${project.tone}`}
      custom={direction}
      variants={reduceMotion ? undefined : imageVariants}
      initial={reduceMotion ? false : "enter"}
      animate="center"
      exit={reduceMotion ? { opacity: 0 } : "exit"}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      drag={!detail && isPresent ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.22}
      dragMomentum={false}
      dragSnapToOrigin
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={(event) => {
        if (suppressClick.current) { event.preventDefault(); return; }
        onOpen();
      }}
      tabIndex={isPresent ? 0 : -1}
      aria-hidden={!isPresent}
      aria-label={label}
      aria-haspopup="dialog"
      style={{ pointerEvents: isPresent ? "auto" : "none" }}
      data-cursor-project
    >
      <img src={project.image} alt={project.title} width={project.width} height={project.height}
        draggable={false} decoding="async" />
    </motion.button>
  );
};

const ProjectsSection = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const deckRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ViewerImage | null>(null);

  const projects = [
    {
      title: String(t("projects.miniGame")),
      description: String(t("projects.miniGameDesc")),
      image: "/project-previews/mini-game-portrait.jpg",
      width: 500,
      height: 900,
      tone: "game",
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
      image: "/project-previews/vtdt-career-portrait.jpg",
      width: 600,
      height: 900,
      tone: "career",
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
    {
      title: "KiberDrošs",
      description: String(t("projects.kiberdrossDesc")),
      image: "/work-samples/kiberdross.png",
      width: 1976,
      height: 1752,
      tone: "cyber",
      preview: true,
      tags: ["Laravel", "PHP", "MySQL"],
      featured: false,
      status: String(t("projects.workInProgress")),
      liveLabel: String(t("projects.viewPreview")),
      details: [
        { label: String(t("projects.role")), value: String(t("projects.independentDeveloper")) },
        { label: String(t("projects.challenge")), value: String(t("projects.kiberdrossChallenge")) },
        { label: String(t("projects.approach")), value: String(t("projects.kiberdrossApproach")) },
        { label: String(t("projects.outcome")), value: String(t("projects.kiberdrossOutcome")) },
      ],
    },
    {
      title: String(t("projects.blog")),
      description: String(t("projects.blogDesc")),
      image: "/project-previews/windows95-blog.jpg",
      width: 600,
      height: 900,
      tone: "blog",
      liveUrl: "https://window95.projekts.area.lv/",
      tags: ["Blog", "Retro UI", "CSS", "JavaScript"],
      featured: false,
      liveLabel: String(t("projects.viewBlog")),
      details: [
        { label: String(t("projects.role")), value: String(t("projects.independentDeveloper")) },
        { label: String(t("projects.challenge")), value: String(t("projects.blogChallenge")) },
        { label: String(t("projects.approach")), value: String(t("projects.blogApproach")) },
        { label: String(t("projects.outcome")), value: String(t("projects.blogOutcome")) },
      ],
    },
  ];

  const showProject = useCallback(
    (index: number, focusDeck = false) => {
      const nextIndex = (index + projects.length) % projects.length;
      if (nextIndex === activeIndex) return;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(nextIndex);
      setIsExpanded(false);
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
    [activeIndex, projects.length],
  );

  const finishDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -55 || info.velocity.x <= -500) {
      showProject(activeIndex + 1, true);
    } else if (info.offset.x >= 55 || info.velocity.x >= 500) {
      showProject(activeIndex - 1, true);
    }
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 120);
  };

  const activeProject = projects[activeIndex];

  return (
    <section id="projects" className="projects-section section-padding bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-divider !mt-0 !mb-12" />
        <AnimatedSection>
          <h2 className="text-4xl text-foreground mb-8 md:mb-10">{t("projects.label")}</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="project-stage">
          <div className="project-carousel glass-edge">
            <div className="project-carousel__composition">
              <div className="project-carousel__copy">
                <div className="project-carousel__header">
                  <span className="project-carousel__label">{String(t("projects.heading"))}</span>
                  <div className="project-carousel__position" role="group" aria-label={String(t("projects.carouselLabel"))}>
                    {projects.map((project, index) => (
                      <button key={project.image} type="button" className="project-carousel__dot"
                        aria-label={`${t("projects.viewProject")}: ${project.title}`}
                        aria-pressed={activeIndex === index} onClick={() => showProject(index)}>
                        <span />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="project-carousel__text-stack">
                  {projects.map((project, index) => {
                    const isActive = activeIndex === index;
                    return (
                      <motion.article key={project.image} className="project-carousel__story"
                        initial={false} animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: isActive && !shouldReduceMotion ? 0.12 : 0 }}
                        aria-hidden={!isActive} style={{ visibility: isActive ? "visible" : "hidden" }}>
                        <div className="project-carousel__eyebrow">
                          {project.status && <span className="project-carousel__status-dot" aria-hidden="true" />}
                          {project.status ?? String(t(project.featured ? "projects.featured" : "projects.project"))}
                        </div>
                        <h3 className="project-carousel__title">{project.title}</h3>
                        <div className="project-carousel__summary">
                          <p className="project-carousel__description">{project.description}</p>
                          <div className="project-carousel__tags">
                            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                          </div>
                          <div className="project-carousel__links">
                            {project.preview ? (
                              <button type="button" className="project-carousel__link text-link"
                                tabIndex={isActive ? 0 : -1} aria-haspopup="dialog"
                                onClick={() => setSelectedImage({ src: project.image, alt: project.title })}>
                                {project.liveLabel}<ArrowUpRight size={16} aria-hidden="true" />
                              </button>
                            ) : (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                className="project-carousel__link text-link" tabIndex={isActive ? 0 : -1}>
                                {project.liveLabel}<ArrowUpRight size={16} aria-hidden="true" />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                className="project-carousel__link project-carousel__link--secondary text-link" tabIndex={isActive ? 0 : -1}>
                                {String(t("projects.viewOnGithub"))}<ArrowUpRight size={16} aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                  <div className="project-carousel__detail-window">
                    <AnimatePresence initial={false} custom={direction}>
                      <ProjectImage key={activeProject.image} project={activeProject} direction={direction}
                        reduceMotion={!!shouldReduceMotion} detail suppressClick={suppressClickRef}
                        label={`${t("projects.viewPreview")}: ${activeProject.title}`}
                        onOpen={() => setSelectedImage({ src: activeProject.image, alt: activeProject.title })} />
                    </AnimatePresence>
                    <span className="project-carousel__detail-icon" aria-hidden="true"><ArrowUpRight size={26} /></span>
                  </div>
                </div>

                <div className="project-carousel__footer">
                  <span className="project-carousel__hint"><MoveHorizontal size={16} aria-hidden="true" />{String(t("projects.swipeHint"))}</span>
                  <button type="button" className="project-carousel__details-toggle" aria-expanded={isExpanded}
                    aria-controls="project-details" onClick={() => setIsExpanded(!isExpanded)}>
                    {String(t(isExpanded ? "projects.lessDetails" : "projects.moreDetails"))}<ChevronDown size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div ref={deckRef} className="project-carousel__media" role="region" aria-roledescription="carousel"
                aria-label={String(t("projects.carouselLabel"))} tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    showProject(activeIndex + (event.key === "ArrowRight" ? 1 : -1), true);
                  }
                }}>
                <div className="project-carousel__image-track">
                  <AnimatePresence initial={false} custom={direction}>
                    <ProjectImage key={activeProject.image} project={activeProject} direction={direction}
                      reduceMotion={!!shouldReduceMotion} suppressClick={suppressClickRef}
                      label={`${t("projects.viewPreview")}: ${activeProject.title}`}
                      onOpen={() => setSelectedImage({ src: activeProject.image, alt: activeProject.title })}
                      onDragStart={() => { suppressClickRef.current = true; }} onDragEnd={finishDrag} />
                  </AnimatePresence>
                </div>
                <span className="project-carousel__number" aria-hidden="true">{String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="sr-only" aria-live="polite" aria-atomic="true">{activeIndex + 1} / {projects.length}: {activeProject.title}</span>
                <span className="project-carousel__enlarge" aria-hidden="true"><Expand size={24} /></span>
                <div className="project-carousel__navigation">
                  <button type="button" className="project-carousel__arrow glass-edge"
                    onClick={() => showProject(activeIndex - 1)} aria-label={String(t("projects.previous"))}>
                    <ArrowLeft size={23} aria-hidden="true" />
                  </button>
                  <button type="button" className="project-carousel__arrow glass-edge"
                    onClick={() => showProject(activeIndex + 1)} aria-label={String(t("projects.next"))}>
                    <ArrowRight size={23} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <motion.div id="project-details" className="project-carousel__details" aria-hidden={!isExpanded}
              initial={false} animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <dl className="project-carousel__proof">
                {activeProject.details.map((detail) => (
                  <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>
                ))}
              </dl>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
      <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
};

export default ProjectsSection;
