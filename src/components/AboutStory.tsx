import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { clearTone, setTone, type Tone } from "@/lib/page-tone";
import ImageViewer, { type ViewerImage } from "./ImageViewer";
import { cyprusImage, hardwareImages, pick, portraitCaption, printerBoardImage, storyChapters } from "./about/aboutStory";
import "./AboutStory.css";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

/* Pale sky tint for the page while the row travels (see src/lib/page-tone.ts). */
const ABOUT_TONE: Tone = { light: [205, 70, 96], dark: [214, 26, 14] };

/* How the row moves, modelled on landonorris.com:
   1. Entry: while the section rises into view, the row already slides left, so the first
      photo travels in diagonally from the lower middle of the screen.
   2. Pinned: the stage holds still and vertical scroll moves the row sideways.
   3. Exit: the row keeps sliding while the section scrolls away, and Projects rises underneath.
   Items fade and lift in as they cross the right edge; photos drift inside their frames.
   Each photo is paired with the chapter after it: on desktop the pair dissolves into the row,
   on phones the pair stacks so a photo and its text share the screen. */

type RowContext = {
  rowX: MotionValue<number>;
  viewportWidth: MotionValue<number>;
  pinned: boolean;
};

const Row = createContext<RowContext | null>(null);
/* The enclosing item's box, so a photo can tell where it sits on screen. */
const ItemBox = createContext<{ left: MotionValue<number>; width: MotionValue<number> } | null>(null);

const useRow = () => {
  const row = useContext(Row);
  if (!row) throw new Error("Row items must sit inside AboutStory");
  return row;
};

/* Left edge and width of an element in row coordinates, kept fresh on resize. */
const useRowBox = (ref: React.RefObject<HTMLElement>) => {
  const left = useMotionValue(0);
  const width = useMotionValue(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      left.set(node.offsetLeft);
      width.set(node.offsetWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, left, width]);
  return { left, width };
};

const Item = ({
  className,
  children,
  itemRef,
}: {
  className: string;
  children: ReactNode;
  itemRef?: (node: HTMLDivElement | null) => void;
}) => {
  const { rowX, viewportWidth, pinned } = useRow();
  const ref = useRef<HTMLDivElement>(null);
  const box = useRowBox(ref);
  const { left } = box;

  /* 0 while the item is still past the right edge, 1 once it is a fifth of the way in. */
  const arrival = useTransform([rowX, left, viewportWidth], ([x, l, vw]: number[]) => {
    if (!pinned || vw === 0) return 1;
    const screenLeft = l + x;
    return Math.min(1, Math.max(0, (vw - screenLeft) / (vw * 0.2)));
  });
  const opacity = useTransform(arrival, (a) => 0.15 + a * 0.85);
  const y = useTransform(arrival, (a) => (1 - a) * 56);

  return (
    <motion.div
      ref={(node) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        itemRef?.(node);
      }}
      className={`about-h__item ${className}`}
      style={pinned ? { opacity, y } : undefined}
    >
      <ItemBox.Provider value={box}>{children}</ItemBox.Provider>
    </motion.div>
  );
};

const Chapter = ({ index }: { index: number }) => {
  const { lang } = useLanguage();
  const chapter = storyChapters[index];
  return (
    <div className="about-chapter">
      <p className="about-chapter__eyebrow">
        <span className="about-chapter__numeral">{NUMERALS[index]}</span>
        <span>{pick(chapter.eyebrow, lang)}</span>
      </p>
      <h3 className="about-chapter__title">{pick(chapter.title, lang)}</h3>
      <p className="about-chapter__body">{pick(chapter.body, lang)}</p>
    </div>
  );
};

const Photo = ({
  src,
  alt,
  label,
  width,
  height,
  muted = false,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  muted?: boolean;
  onOpen?: () => void;
}) => {
  const { rowX, viewportWidth, pinned } = useRow();
  const box = useContext(ItemBox)!;

  /* The photo is slightly larger than its frame and slides from -5% to 5% across the screen. */
  const shift = useTransform([rowX, box.left, box.width, viewportWidth], ([x, l, w, vw]: number[]) => {
    if (!pinned || vw === 0) return "0%";
    const centre = l + x + w / 2;
    const t = Math.min(1, Math.max(-1, (centre - vw / 2) / vw));
    return `${t * 5}%`;
  });
  const imageStyle: MotionStyle = pinned ? { x: shift, scale: 1.14 } : {};

  const Tag = onOpen ? motion.button : motion.div;
  return (
    <figure className={`about-photo ${muted ? "about-photo--muted" : ""}`}>
      <p className="about-photo__label">{label}</p>
      <Tag
        type={onOpen ? "button" : undefined}
        className="about-photo__frame"
        onClick={onOpen}
        aria-haspopup={onOpen ? "dialog" : undefined}
        data-cursor-project={onOpen ? "" : undefined}
      >
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={imageStyle}
        />
      </Tag>
    </figure>
  );
};

const AboutStory = () => {
  const { t, lang } = useLanguage();
  const reduceMotion = useReducedMotion() ?? false;
  const pinned = !reduceMotion;
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastRef = useRef<HTMLDivElement | null>(null);
  const [viewerImage, setViewerImage] = useState<ViewerImage | null>(null);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [active, setActive] = useState(0);

  const viewportWidth = useMotionValue(0);
  const viewportHeight = useMotionValue(0);
  const height = useMotionValue(0);
  const entryOffset = useMotionValue(0);

  /* Section height = time spent pinned + one screen. Pinned travel ends when the last item
     sits at the right content edge; the entry and exit screens add the diagonal moves. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const last = lastRef.current;
      const itemsEnd = last ? last.offsetLeft + last.offsetWidth : track.scrollWidth;
      const next = Math.max(vh, itemsEnd - vw + padLeft + vh);
      /* How far right the row starts so the portrait's centre begins at the screen centre.
         Capped at half a screen so the entry never moves faster than the pinned scroll. */
      const portrait = portraitRef.current;
      const centre = portrait ? portrait.offsetLeft + portrait.offsetWidth / 2 : vw / 2;
      entryOffset.set(Math.min(vh / 2, Math.max(0, vw / 2 - centre)));
      viewportWidth.set(vw);
      viewportHeight.set(vh);
      height.set(next);
      setSectionHeight(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, viewportWidth, viewportHeight, height, entryOffset]);

  /* Progress runs from the section's top touching the bottom of the screen
     to the section's bottom leaving the top of the screen. */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const scrolled = useTransform([scrollYProgress, height, viewportHeight], ([p, h, vh]: number[]) => p * (h + vh));

  /* Entry eases out of rest: x = E(1 - (s/vh)^2), so the row starts still and reaches
     close to the pinned speed as the stage locks. After that it moves 1px per 1px scrolled. */
  const rowX = useTransform([scrolled, viewportHeight, entryOffset], ([s, vh, e]: number[]) => {
    if (!pinned || vh === 0) return 0;
    if (s < vh) {
      const t = s / vh;
      return e * (1 - t * t);
    }
    return -(s - vh);
  });

  /* The row fades in over the first 60% of the entry and out over the last 60% of the exit. */
  const rowOpacity = useTransform([scrolled, height, viewportHeight], ([s, h, vh]: number[]) => {
    if (!pinned || vh === 0) return 1;
    const fadeIn = Math.min(1, s / (vh * 0.6));
    const fadeOut = Math.min(1, Math.max(0, (h + vh - s) / (vh * 0.6)));
    return Math.min(fadeIn, fadeOut);
  });

  /* The page tint follows the same entry and exit, eased so it starts and ends gently. */
  const tint = useTransform([scrolled, height, viewportHeight], ([s, h, vh]: number[]) => {
    if (!pinned || vh === 0) return 0;
    const ease = (v: number) => v * v * (3 - 2 * v);
    if (s < vh) return ease(Math.max(0, s / vh));
    if (s > h) return ease(Math.max(0, 1 - (s - h) / vh));
    return 1;
  });

  useMotionValueEvent(tint, "change", (v) => setTone("about", ABOUT_TONE, v));
  useEffect(() => {
    setTone("about", ABOUT_TONE, tint.get());
    return () => clearTone("about");
  }, [tint]);

  const progressBar = useTransform([scrolled, height, viewportHeight], ([s, h, vh]: number[]) =>
    vh === 0 ? 0 : Math.min(1, Math.max(0, (s - vh) / Math.max(1, h - vh))),
  );

  /* The current chapter is the last one whose left edge has passed 60% of the screen width. */
  useMotionValueEvent(rowX, "change", (x) => {
    const line = window.innerWidth * 0.6;
    let next = 0;
    chapterRefs.current.forEach((node, i) => {
      if (node && node.offsetLeft + x < line) next = i;
    });
    setActive(next);
  });

  const [pcb3d] = hardwareImages;
  const open = (image: { src: string; alt: { en: string } }) => () =>
    setViewerImage({ src: image.src, alt: pick(image.alt, lang) });
  const chapterRef = (i: number) => (node: HTMLDivElement | null) => {
    chapterRefs.current[i] = node;
    if (i === storyChapters.length - 1) lastRef.current = node;
  };

  const sectionStyle = pinned ? { height: sectionHeight ? `${sectionHeight}px` : "100vh" } : undefined;

  return (
    <Row.Provider value={{ rowX, viewportWidth, pinned }}>
      <motion.section
        id="about"
        ref={sectionRef}
        className={`about-h relative z-10 ${pinned ? "about-h--pinned" : "about-h--native bg-background"}`}
        style={sectionStyle}
      >
        <div className="about-h__stage">
          <div className="about-h__head px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="section-divider !mt-0 !mb-6" />
              <div className="about-h__head-row">
                <h2 className="text-4xl text-foreground">{t("about.label")}</h2>
                <div className="about-h__progress" aria-hidden="true">
                  {storyChapters.map((chapter, i) => (
                    <span key={chapter.id} className={i === active ? "is-active" : ""}>
                      {NUMERALS[i]}
                    </span>
                  ))}
                  <span className="about-h__bar">
                    <motion.span style={{ scaleX: progressBar }} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-h__viewport">
            <motion.div
              ref={trackRef}
              className="about-h__track"
              style={pinned ? { x: rowX, opacity: rowOpacity } : undefined}
            >
              <div className="about-h__pair">
                <Item className="about-h__item--portrait" itemRef={(node) => {
                    portraitRef.current = node;
                  }}
                >
                  <Photo
                    src="/adrian-portrait-560.jpg"
                    alt={t("about.portraitAlt") as string}
                    label={pick(portraitCaption, lang)}
                    width={560}
                    height={560}
                  />
                </Item>
                <Item className="about-h__item--start" itemRef={chapterRef(0)}>
                  <Chapter index={0} />
                </Item>
              </div>
              <div className="about-h__pair">
                <Item className="about-h__item--robotics">
                  <Photo
                    src={printerBoardImage.src}
                    alt={pick(printerBoardImage.alt, lang)}
                    label={pick(printerBoardImage.caption, lang)}
                    width={printerBoardImage.width}
                    height={printerBoardImage.height}
                    muted
                    onOpen={open(printerBoardImage)}
                  />
                </Item>
                <Item className="about-h__item--ideas" itemRef={chapterRef(1)}>
                  <Chapter index={1} />
                </Item>
              </div>
              <div className="about-h__pair">
                <Item className="about-h__item--pcb3d">
                  <Photo
                    src={pcb3d.src}
                    alt={pick(pcb3d.alt, lang)}
                    label={pick(pcb3d.caption, lang)}
                    width={pcb3d.width}
                    height={pcb3d.height}
                    onOpen={open(pcb3d)}
                  />
                </Item>
                <Item className="about-h__item--hardware" itemRef={chapterRef(2)}>
                  <Chapter index={2} />
                </Item>
              </div>
              <div className="about-h__pair">
                <Item className="about-h__item--cyprus">
                  <Photo
                    src={cyprusImage.src}
                    alt={pick(cyprusImage.alt, lang)}
                    label={pick(cyprusImage.caption, lang)}
                    width={cyprusImage.width}
                    height={cyprusImage.height}
                    onOpen={open(cyprusImage)}
                  />
                </Item>
                <Item className="about-h__item--now" itemRef={chapterRef(3)}>
                  <Chapter index={3} />
                </Item>
              </div>
            </motion.div>
          </div>
        </div>
        <ImageViewer image={viewerImage} onClose={() => setViewerImage(null)} />
      </motion.section>
    </Row.Provider>
  );
};

export default AboutStory;
