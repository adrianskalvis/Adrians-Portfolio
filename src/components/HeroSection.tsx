import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import ScrollCue from "./ScrollCue";

const Typewriter = ({ phrases }: { phrases: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
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
  }, [displayText, isDeleting, index, phrases]);

  return (
    <span className="text-primary min-h-[1.2em] inline-block">
      {displayText}
      <span className="animate-pulse ml-1">|</span>
    </span>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();

  const handleScrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  const typewriterPhrases = t("hero.typewriter") as string[];

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] md:min-h-[92svh] flex flex-col pt-24 md:pt-28 pb-7 md:pb-12 px-6 md:px-12 sky-gradient overflow-hidden"
    >
      {/* Bubble orbs */}
      <div
        className="absolute top-20 md:top-16 -right-16 md:right-[10%] w-48 h-48 md:w-72 md:h-72 rounded-full glass-orb-liquid animate-float opacity-20 md:opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-36 md:bottom-28 -left-12 md:left-[8%] w-36 h-36 md:w-52 md:h-52 rounded-full glass-orb-liquid animate-float opacity-[0.14] md:opacity-30"
        data-delay="2"
        aria-hidden="true"
      />
      <div
        className="absolute top-[44%] md:top-1/3 left-[76%] md:left-[60%] w-24 h-24 md:w-36 md:h-36 rounded-full glass-orb-liquid animate-float opacity-20 md:opacity-50"
        data-delay="4"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="mb-6 text-[clamp(3.25rem,15vw,4rem)] md:text-[64px]">
            <span className="block">{t("hero.greeting")}</span>
            <span className="block mt-2">
              <Typewriter phrases={typewriterPhrases} />
            </span>
          </h1>
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
            onClick={handleScrollToAbout}
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
