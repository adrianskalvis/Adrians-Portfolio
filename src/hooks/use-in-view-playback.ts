import { useEffect, useState, type RefObject } from "react";

/* Share of the video that must be on screen before it starts. */
const PLAY_THRESHOLD = 0.4;

/* Plays a muted, looping video only while it is on screen.
   The file is not requested until the first time it scrolls into view, so cards the
   visitor never reaches cost nothing. Returns true once frames are actually playing;
   it stays false when the browser blocks autoplay (iOS Low Power Mode, for example),
   so the caller keeps showing its poster. */
export function useInViewPlayback(ref: RefObject<HTMLVideoElement>, src: string, active: boolean) {
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    // A fast scroll can deliver enter and exit in one batch; the last entry is the current state.
    const observer = new IntersectionObserver((entries) => setInView(entries[entries.length - 1].isIntersecting), {
      threshold: PLAY_THRESHOLD,
    });
    observer.observe(video);
    // iOS pauses media for calls and Siri; the poster then comes back over the frozen frame.
    const onPause = () => setPlaying(false);
    video.addEventListener("pause", onPause);
    return () => {
      observer.disconnect();
      video.removeEventListener("pause", onPause);
    };
  }, [ref]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!active || !inView) {
      video.pause();
      setPlaying(false);
      return;
    }

    let cancelled = false;
    // Set as a property too: React only writes the attribute, and iOS checks the property.
    video.muted = true;
    if (video.getAttribute("src") !== src) video.src = src;
    Promise.resolve(video.play())
      .then(() => {
        if (!cancelled) setPlaying(true);
      })
      .catch(() => {
        if (!cancelled) setPlaying(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ref, src, active, inView]);

  return playing;
}
