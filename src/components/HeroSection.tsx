import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import ScrollCue from "./ScrollCue";
import HeroSky from "./hero/HeroSky";
import "./HeroSection.css";

const Typewriter = ({
  phrases,
  shouldReduceMotion,
}: {
  phrases: string[];
  shouldReduceMotion: boolean;
}) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(
    typeof window === "undefined" ? phrases[0] : "",
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDisplayText("");
    setIsDeleting(false);
  }, [phrases]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const currentPhrase = phrases[index];
    const typingSpeed = isDeleting ? 50 : 150;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setDisplayText(
          isDeleting
            ? currentPhrase.substring(0, displayText.length - 1)
            : currentPhrase.substring(0, displayText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, phrases, shouldReduceMotion]);

  return (
    <span className="text-primary min-h-[1.2em] inline-block">
      {shouldReduceMotion ? phrases[0] : displayText}
      {!shouldReduceMotion && <span className="animate-pulse ml-1">|</span>}
    </span>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const handleSectionScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute("href");
    if (!target) return;

    if (target === "#contact") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      return;
    }

    document.querySelector(target)?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const typewriterPhrases = t("hero.typewriter") as string[];

  return (
    <section
      id="hero"
      className="hero-section relative isolate min-h-[100svh] md:min-h-[92svh] flex flex-col pt-24 md:pt-28 pb-7 md:pb-12 px-6 md:px-12 sky-gradient overflow-hidden"
    >
      <HeroSky />

      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }
          className="max-w-4xl"
        >
          <h1
            className="mb-6 text-[clamp(3rem,13.5vw,3.6rem)] leading-[1.04] md:text-[64px] md:leading-[1.1]"
            aria-label={`${String(t("hero.greeting"))} ${typewriterPhrases[0]}`}
          >
            <span className="block">{t("hero.greeting")}</span>
            <span className="block mt-2" aria-hidden="true">
              <Typewriter
                phrases={typewriterPhrases}
                shouldReduceMotion={shouldReduceMotion}
              />
            </span>
          </h1>
          <p className="hero-value max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("hero.value")}
          </p>
          <div className="hero-actions mt-6 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={handleSectionScroll}
              className="hero-action hero-action--primary glass-edge"
            >
              {t("hero.viewProjects")}
              <ArrowDownRight size={16} aria-hidden="true" />
            </a>
            <a
              href="#contact"
              onClick={handleSectionScroll}
              className="hero-action glass-edge"
            >
              {t("hero.getInTouch")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="section-divider !mt-10 md:!mt-12 !mb-5 md:!mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-5 pb-2 md:pb-8">
          <p className="text-base text-muted-foreground">
            {t("hero.madeIn")}
          </p>
          <a
            href="#about"
            onClick={handleSectionScroll}
            className="group flex items-center gap-2 text-lg view-projects-link"
          >
            {t("hero.scrollPrompt")}
            <ScrollCue />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
