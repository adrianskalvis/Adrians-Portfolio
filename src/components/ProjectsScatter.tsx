import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { clearTone, setTone, type Tone } from "@/lib/page-tone";
import Drift from "./Drift";
import "./ProjectsScatter.css";

type Project = {
  key: string;
  title: string;
  blurb: string;
  image: string;
  width: number;
  height: number;
  /** Which part of the screenshot stays in view inside the 4:5 frame. */
  focus?: string;
  href?: string;
  linkLabel: string;
  status?: string;
  /** Page tint while this project is in the middle of the screen, taken from its screenshot. */
  tone: Tone;
};

/* Each project tints the page towards its own colours, the same way About tints it sky blue. */
const TONES: Record<string, Tone> = {
  swipeagami: { light: [16, 72, 94], dark: [14, 26, 14] },
  "mini-game": { light: [100, 48, 91], dark: [118, 24, 13] },
  "vtdt-career": { light: [256, 72, 94], dark: [254, 30, 16] },
  kiberdross: { light: [40, 58, 91.5], dark: [36, 24, 13.5] },
  blog: { light: [228, 45, 91.5], dark: [228, 28, 15] },
};

/* 0 when the project is half a screen away from the centre line, 1 when it sits on it. */
const usePageTone = (ref: React.RefObject<HTMLElement>, id: string, tone: Tone) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const amount = useTransform(scrollYProgress, (p) => {
    const v = Math.max(0, 1 - Math.abs(p - 0.5) / 0.36);
    return v * v * (3 - 2 * v);
  });
  useMotionValueEvent(amount, "change", (v) => setTone(id, tone, v));
  useEffect(() => {
    setTone(id, tone, amount.get());
    return () => clearTone(id);
  }, [id, tone, amount]);
};

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const firstSentence = (text: string) => {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return match ? match[0].trim() : text;
};

const Shard = ({ project, index, tilt }: { project: Project; index: number; tilt: number }) => {
  const Shell = project.href ? "a" : "div";
  const shellRef = useRef<HTMLElement>(null);
  usePageTone(shellRef, `project-${project.key}`, project.tone);
  return (
    <Drift className="project-shard" tilt={tilt} from="below" exit>
      <Shell
        ref={shellRef as React.Ref<HTMLAnchorElement & HTMLDivElement>}
        className="project-shard__link"
        href={project.href}
        target={project.href ? "_blank" : undefined}
        rel={project.href ? "noopener noreferrer" : undefined}
        data-cursor-project={project.href ? "" : undefined}
      >
        <p className="project-shard__name">
          <span className="project-shard__numeral">{NUMERALS[index]}</span>
          <span>{project.title}</span>
          {project.status && <span className="project-shard__status">{project.status}</span>}
        </p>
        <span className="project-shard__frame">
          <img
            src={project.image}
            alt={project.title}
            width={project.width}
            height={project.height}
            style={{ objectPosition: project.focus ?? "50% 0%" }}
            loading="lazy"
            decoding="async"
          />
        </span>
        <p className="project-shard__blurb">{project.blurb}</p>
        {project.href && (
          <span className="project-shard__more">
            {project.linkLabel}
            <ArrowUpRight size={14} aria-hidden="true" />
          </span>
        )}
      </Shell>
    </Drift>
  );
};

const ProjectsScatter = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 1024px)");

  /* The right column travels faster than the page, so the two columns slide past each other. */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [20, -10]);
  const rightY = useTransform(scrollYProgress, [0, 1], [180, -20]);
  const parallax = wide && !reduceMotion;

  const projects: Project[] = [
    {
      key: "swipeagami",
      tone: TONES.swipeagami,
      /* The app's own title; its URL keeps the original "swipeagami" spelling. */
      title: "Swipegami",
      /* Two sentences on purpose: the bus and gum wrapper story is the point of this card. */
      blurb: String(t("projects.swipeagamiDesc")),
      image: "/project-previews/swipeagami-cover.svg",
      width: 800,
      height: 1000,
      focus: "50% 50%",
      href: "https://adrianskalvis.github.io/swipeagami/",
      linkLabel: String(t("projects.viewProject")),
    },
    {
      key: "mini-game",
      tone: TONES["mini-game"],
      title: String(t("projects.miniGame")),
      blurb: firstSentence(String(t("projects.miniGameDesc"))),
      image: "/project-previews/mini-game-portrait.jpg",
      width: 500,
      height: 900,
      href: "https://adrianskalvis.github.io/minigame/",
      linkLabel: String(t("projects.viewGame")),
    },
    {
      key: "vtdt-career",
      tone: TONES["vtdt-career"],
      title: String(t("projects.vtdtCareer")),
      blurb: firstSentence(String(t("projects.vtdtCareerDesc"))),
      image: "/project-previews/vtdt-career-portrait.jpg",
      width: 600,
      height: 900,
      href: "https://adrianskalvis.github.io/VTDT-Karjera/",
      linkLabel: String(t("projects.viewProject")),
    },
    {
      key: "kiberdross",
      tone: TONES.kiberdross,
      title: "KiberDrošs",
      blurb: firstSentence(String(t("projects.kiberdrossDesc"))),
      image: "/work-samples/kiberdross.png",
      width: 1976,
      height: 1752,
      focus: "0% 0%",
      linkLabel: String(t("projects.viewPreview")),
      status: String(t("projects.workInProgress")),
    },
    {
      key: "blog",
      tone: TONES.blog,
      title: String(t("projects.blog")),
      blurb: firstSentence(String(t("projects.blogDesc"))),
      image: "/project-previews/windows95-blog.jpg",
      width: 600,
      height: 900,
      href: "https://window95.projekts.area.lv/",
      linkLabel: String(t("projects.viewBlog")),
    },
  ];

  /* Even projects go in the left column, odd ones in the right; reading order stays I, II, III, IV. */
  const left = projects.map((p, i) => ({ p, i })).filter(({ i }) => i % 2 === 0);
  const right = projects.map((p, i) => ({ p, i })).filter(({ i }) => i % 2 === 1);

  return (
    <section id="projects" ref={sectionRef} className="projects-scatter section-padding relative z-10 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-divider !mt-0 !mb-12" />
        <h2 className="text-4xl text-foreground">{t("projects.label")}</h2>

        <div className="projects-columns">
          <motion.div className="projects-col projects-col--left" style={parallax ? { y: leftY } : undefined}>
            {left.map(({ p, i }) => (
              <Shard key={p.key} project={p} index={i} tilt={-2.5} />
            ))}
          </motion.div>
          <motion.div className="projects-col projects-col--right" style={parallax ? { y: rightY } : undefined}>
            {right.map(({ p, i }) => (
              <Shard key={p.key} project={p} index={i} tilt={2.5} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsScatter;
