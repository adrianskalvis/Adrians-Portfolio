import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { clearTone, setTone, type Tone } from "@/lib/page-tone";
import Drift from "./Drift";
import ProjectVideo from "./ProjectVideo";
import VideoViewer, { type ViewerVideo } from "./VideoViewer";
import "./ProjectsScatter.css";

type Project = {
  key: string;
  title: string;
  blurb: string;
  /** 720p vertical ad and a still from it, in public/project-videos. */
  video: string;
  poster: string;
  link?: { href: string; label: string };
  status?: string;
  /** Page tint while this project is in the middle of the screen, taken from its screenshot. */
  tone: Tone;
};

/* Each project tints the page towards its own colours, the same way About tints it sky blue.
   Swipegami stays close to white: a faint warm beige like the paper in its ad. Peach and
   pink tints were both rejected. */
const TONES: Record<string, Tone> = {
  swipeagami: { light: [38, 34, 96], dark: [34, 10, 12] },
  "mini-game": { light: [100, 48, 91], dark: [118, 24, 13] },
  kiberdross: { light: [40, 58, 91.5], dark: [36, 24, 13.5] },
  blog: { light: [228, 45, 91.5], dark: [228, 28, 15] },
};

const media = (name: string) => ({
  video: `/project-videos/${name}.mp4`,
  poster: `/project-videos/${name}-poster.jpg`,
});

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

/* Phones show one project at a time, so each card lingers briefly as it arrives.
   Progress runs from the card's top at 32% of the screen to 6% above it; the card is slowest
   with its top at 13%, just under the 68px navbar, where the whole card is in view.
   The shift goes from -0.5 to 0.5 of --project-hold (22svh on phones, 0 on desktop and with
   reduced motion). A smoothstep keeps it from stopping dead: the card slows to about 13% of
   the scroll speed, then picks up again. */
const HOLD_OFFSET: ["start 32%", "start -6%"] = ["start 32%", "start -6%"];

const useArrivalHold = (ref: React.RefObject<HTMLElement>) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: HOLD_OFFSET });
  return useTransform(scrollYProgress, (p) => {
    const t = Math.min(1, Math.max(0, p));
    return t * t * (3 - 2 * t) - 0.5;
  });
};

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const firstSentence = (text: string) => {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return match ? match[0].trim() : text;
};

type ShardProps = {
  project: Project;
  index: number;
  tilt: number;
  videoOpen: boolean;
  onPlay: (video: ViewerVideo) => void;
};

/* The frame opens the ad and the link opens the live project, so they are separate controls. */
const Shard = ({ project, index, tilt, videoOpen, onPlay }: ShardProps) => {
  const slotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  usePageTone(cardRef, `project-${project.key}`, project.tone);
  const holdShift = useArrivalHold(slotRef);
  return (
    <motion.div ref={slotRef} className="project-slot" style={{ "--project-hold-shift": holdShift } as MotionStyle}>
      <Drift className="project-shard" tilt={tilt} from="below" exit>
        <div ref={cardRef} className="project-shard__card">
          <p className="project-shard__name">
            <span className="project-shard__numeral">{NUMERALS[index]}</span>
            <span>{project.title}</span>
            {project.status && <span className="project-shard__status">{project.status}</span>}
          </p>
          <ProjectVideo
            src={project.video}
            poster={project.poster}
            title={project.title}
            suspended={videoOpen}
            onOpen={() => onPlay({ src: project.video, poster: project.poster, title: project.title })}
          />
          <p className="project-shard__blurb">{project.blurb}</p>
          {project.link && (
            <a className="project-shard__more" href={project.link.href} target="_blank" rel="noopener noreferrer">
              {project.link.label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </Drift>
    </motion.div>
  );
};

const ProjectsScatter = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [openVideo, setOpenVideo] = useState<ViewerVideo | null>(null);
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
      ...media("swipegami"),
      link: { href: "https://adrianskalvis.github.io/swipeagami/", label: String(t("projects.viewProject")) },
    },
    {
      key: "blog",
      tone: TONES.blog,
      title: String(t("projects.blog")),
      blurb: firstSentence(String(t("projects.blogDesc"))),
      ...media("blog95"),
      link: { href: "https://window95.projekts.area.lv/", label: String(t("projects.viewBlog")) },
    },
    {
      key: "kiberdross",
      tone: TONES.kiberdross,
      title: "KiberDrošs",
      blurb: firstSentence(String(t("projects.kiberdrossDesc"))),
      ...media("kiberdross"),
      status: String(t("projects.workInProgress")),
    },
    {
      key: "mini-game",
      tone: TONES["mini-game"],
      title: String(t("projects.miniGame")),
      blurb: firstSentence(String(t("projects.miniGameDesc"))),
      ...media("mini-game"),
      link: { href: "https://adrianskalvis.github.io/minigame/", label: String(t("projects.viewGame")) },
    },
  ];

  /* Even projects go in the left column, odd ones in the right; reading order stays I, II, III, IV. */
  const left = projects.map((p, i) => ({ p, i })).filter(({ i }) => i % 2 === 0);
  const right = projects.map((p, i) => ({ p, i })).filter(({ i }) => i % 2 === 1);

  return (
    <section id="projects" ref={sectionRef} className="projects-scatter section-padding relative z-10 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-divider !mt-0 !mb-12" />
        <h2 className="text-4xl text-foreground">{t("projects.exploreTitle")}</h2>

        <div className="projects-columns">
          <motion.div className="projects-col projects-col--left" style={parallax ? { y: leftY } : undefined}>
            {left.map(({ p, i }) => (
              <Shard key={p.key} project={p} index={i} tilt={-2.5} videoOpen={openVideo !== null} onPlay={setOpenVideo} />
            ))}
          </motion.div>
          <motion.div className="projects-col projects-col--right" style={parallax ? { y: rightY } : undefined}>
            {right.map(({ p, i }) => (
              <Shard key={p.key} project={p} index={i} tilt={2.5} videoOpen={openVideo !== null} onPlay={setOpenVideo} />
            ))}
          </motion.div>
        </div>
      </div>
      <VideoViewer video={openVideo} onClose={() => setOpenVideo(null)} />
    </section>
  );
};

export default ProjectsScatter;
