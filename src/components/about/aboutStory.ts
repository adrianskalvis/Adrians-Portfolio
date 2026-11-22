import type { Lang } from "@/contexts/LanguageContext";

/* Draft story copy for the About section.
   English is the source text. Latvian and Russian fall back to English
   until the wording is final. */

type Copy = { en: string; lv?: string; ru?: string };

export type StoryChapter = {
  id: string;
  eyebrow: Copy;
  title: Copy;
  body: Copy;
};

export const storyChapters: StoryChapter[] = [
  {
    id: "start",
    eyebrow: { en: "Where it started" },
    title: { en: "My first line of code had to win a fight." },
    body: {
      en: "It ran inside a LEGO Mindstorms NXT 2.0 and told a small sumo robot how to find its opponent and push it out of the ring. I barely understood what I was writing, but watching it move intrigued me, and I kept going.",
    },
  },
  {
    id: "ideas",
    eyebrow: { en: "Limitless ideas" },
    title: { en: "What I enjoy most is making ideas real." },
    body: {
      en: "They show up in ordinary moments. Swipegami started on a bus while I folded a gum wrapper. The mini game started as a way to show school kids that code can be fun. I build a rough version first, then spend most of my time on CSS, motion and the small details. I'm studying to become a Programming Technician at VTDT.",
    },
  },
  {
    id: "hardware",
    eyebrow: { en: "Beyond the screen" },
    title: { en: "Not everything I build lives in a browser." },
    body: {
      en: "I design PCBs, model parts in CAD and make them with CNC machining and 3D printing. Video editing and graphic design fill in the rest, and each one sharpens my eye for detail.",
    },
  },
  {
    id: "now",
    eyebrow: { en: "Cyprus, 2026" },
    title: { en: "This autumn took me to Cyprus." },
    body: {
      en: "Through Erasmus+, I spent a month in a health lab at the Cyprus University of Technology. I had never imagined working somewhere like that. I adapted, worked on an API and R scripts, and came home with much broader horizons.",
    },
  },
];

export const portraitCaption: Copy = { en: "A picture of me", lv: "Mana bilde", ru: "Моё фото" };

export const printerBoardImage = {
  src: "/robotics-controller-reference.jpg",
  width: 1520,
  height: 500,
  caption: { en: "Controller board for a 3D printer", lv: "3D printera kontrolplate", ru: "Плата управления 3D-принтера" },
  alt: { en: "Labelled controller board for a 3D printer", lv: "3D printera kontrolplate ar apzīmējumiem", ru: "Плата управления 3D-принтера с подписями" },
};

export const hardwareImages = [
  {
    src: "/pcb-3d-design.jpg",
    width: 680,
    height: 496,
    caption: { en: "Smart socket board, 3D view", lv: "Viedās rozetes plate, 3D skats", ru: "Плата умной розетки, 3D вид" },
    alt: { en: "3D render of a green smart socket PCB with an ESP32 C3 Mini", lv: "Viedās rozetes plates 3D attēls", ru: "3D рендер платы умной розетки" },
  },
];

/* Chapter IV: arriving in Cyprus, September 2026. */
export const cyprusImage = {
  src: "/cyprus-flight.jpg",
  width: 1080,
  height: 1350,
  caption: { en: "On the way to Cyprus", lv: "Ceļā uz Kipru", ru: "По пути на Кипр" },
  alt: {
    en: "The Cyprus coast seen from a plane window, with the wing in front and clouds over the mountains",
    lv: "Kipras krasts no lidmašīnas loga ar spārnu priekšplānā un mākoņiem virs kalniem",
    ru: "Побережье Кипра из окна самолёта, на переднем плане крыло, над горами облака",
  },
};

export const pick = (copy: Copy, lang: Lang) => copy[lang] ?? copy.en;
