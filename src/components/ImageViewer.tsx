import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import "./ImageViewer.css";

export interface ViewerImage {
  src: string;
  alt: string;
}

interface Props {
  image: ViewerImage | null;
  onClose: () => void;
}

const ImageDialog = ({ image, onClose }: { image: ViewerImage; onClose: () => void }) => {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
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

    return () => {
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
      className="image-viewer"
      data-lenis-prevent
      aria-label={image.alt}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        // The close control is the only interactive element in this viewer.
        if (event.key === "Tab") {
          event.preventDefault();
          closeRef.current?.focus({ preventScroll: true });
        }
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <motion.figure
        className="image-viewer__panel"
        initial={reduceMotion ? false : { scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={reduceMotion ? undefined : { scale: 0.97, y: 8 }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="image-viewer__header">
          <figcaption>{image.alt}</figcaption>
          <button
            ref={closeRef}
            type="button"
            className="image-viewer__close glass-icon-button glass-edge"
            onClick={onClose}
            aria-label={String(t("projects.closePreview"))}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="image-viewer__image">
          <img src={image.src} alt={image.alt} decoding="async" />
        </div>
      </motion.figure>
    </motion.dialog>
  );
};

const ImageViewer = ({ image, onClose }: Props) => (
  <AnimatePresence>
    {image && <ImageDialog key={image.src} image={image} onClose={onClose} />}
  </AnimatePresence>
);

export default ImageViewer;
