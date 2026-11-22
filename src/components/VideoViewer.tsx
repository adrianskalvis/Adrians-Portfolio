import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import "./VideoViewer.css";

export interface ViewerVideo {
  src: string;
  poster: string;
  title: string;
}

interface Props {
  video: ViewerVideo | null;
  onClose: () => void;
}

/* Full-screen player for a project ad. It opens from a tap, so playback with sound is allowed. */
const VideoDialog = ({ video, onClose }: { video: ViewerVideo; onClose: () => void }) => {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /* Where the last press started. A seek drag that ends over the backdrop must not close the player. */
  const pressedBackdrop = useRef(false);
  const reduceMotion = useReducedMotion();

  // Sound stops at once; the dialog itself fades out over 0.2 s.
  const close = () => {
    videoRef.current?.pause();
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const player = videoRef.current;
    if (!dialog) return;

    const trigger = document.activeElement;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    // Keep the page width and scroll position stable while the modal is open.
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    // A blocked play() leaves the native controls visible, so the visitor can start it by hand.
    Promise.resolve(player?.play()).catch(() => undefined);

    return () => {
      player?.pause();
      dialog.close();
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <motion.dialog
      ref={dialogRef}
      className="video-viewer"
      data-lenis-prevent
      aria-label={video.title}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && pressedBackdrop.current) close();
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <motion.div
        className="video-viewer__panel"
        initial={reduceMotion ? false : { scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={reduceMotion ? undefined : { scale: 0.97, y: 8 }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          controls
          playsInline
          preload="auto"
          aria-label={video.title}
        />
        <button
          ref={closeRef}
          type="button"
          className="video-viewer__close glass-icon-button glass-edge"
          onClick={close}
          aria-label={String(t("projects.closeVideo"))}
        >
          <X size={22} aria-hidden="true" />
        </button>
      </motion.div>
    </motion.dialog>
  );
};

const VideoViewer = ({ video, onClose }: Props) => (
  <AnimatePresence>{video && <VideoDialog key={video.src} video={video} onClose={onClose} />}</AnimatePresence>
);

export default VideoViewer;
