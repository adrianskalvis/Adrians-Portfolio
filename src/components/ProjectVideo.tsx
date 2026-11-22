import { useReducedMotion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInViewPlayback } from "@/hooks/use-in-view-playback";

type Props = {
  src: string;
  poster: string;
  title: string;
  /** True while the full-screen player is open, so the card stops playing behind it. */
  suspended: boolean;
  onOpen: () => void;
};

type NetworkInformation = { saveData?: boolean };

/* Data Saver on Android Chrome sets this; the card then keeps its poster. */
const wantsToSaveData = () =>
  (navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData === true;

/* A project frame whose ad plays muted while it is on screen, over a still poster.
   Tapping it opens the full ad with sound. */
const ProjectVideo = ({ src, poster, title, suspended, onOpen }: Props) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [saveData, setSaveData] = useState(false);
  useEffect(() => setSaveData(wantsToSaveData()), []);
  const playing = useInViewPlayback(videoRef, src, !reduceMotion && !saveData && !suspended);

  return (
    <button
      type="button"
      className={`project-shard__frame${playing ? " is-playing" : ""}`}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${title}: ${t("projects.playVideo")}`}
      data-cursor-project=""
    >
      <img src={poster} alt="" width={720} height={1280} loading="lazy" decoding="async" />
      <video ref={videoRef} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      {/* Expand arrows say "open this bigger"; the label slides out on hover with a pointer. */}
      <span className="project-shard__expand glass-icon-button" aria-hidden="true">
        <Maximize2 />
        <span className="project-shard__expand-label">{t("projects.watchWithSound")}</span>
      </span>
    </button>
  );
};

export default ProjectVideo;
