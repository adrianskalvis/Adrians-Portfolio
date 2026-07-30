import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import "./HardwareCarousel.css";

const hardwareSlides = [
  {
    src: "/pcb-3d-design.jpg",
    titleKey: "about.hardwareSlide3d",
    width: 680,
    height: 496,
  },
  {
    src: "/pcb-routing-design.jpg",
    titleKey: "about.hardwareSlideRouting",
    width: 828,
    height: 496,
  },
  {
    src: "/robotics-controller-reference.jpg",
    titleKey: "about.hardwareSlideReference",
    width: 1520,
    height: 500,
    contain: true,
  },
];

const HardwareCarousel = () => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const showSlide = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, hardwareSlides.length - 1));
    const track = trackRef.current;

    if (!track) return;

    track.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track?.clientWidth) return;

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, hardwareSlides.length - 1)));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  };

  return (
    <figure className="hardware-gallery space-y-3">
      <div
        className="hardware-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={String(t("about.hardwareCarouselLabel"))}
      >
        <div
          ref={trackRef}
          className="hardware-carousel__track"
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {hardwareSlides.map((slide, index) => {
            const title = String(t(slide.titleKey));

            return (
              <div
                key={slide.src}
                className="hardware-carousel__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${hardwareSlides.length}: ${title}`}
              >
                <img
                  src={slide.src}
                  alt={title}
                  className={`hardware-carousel__image ${
                    slide.contain ? "hardware-carousel__image--contain" : ""
                  }`}
                  loading="lazy"
                  decoding="async"
                  width={slide.width}
                  height={slide.height}
                  draggable={false}
                />
                <div className="hardware-carousel__caption">
                  <span>{title}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="hardware-carousel__arrow hardware-carousel__arrow--previous"
          onClick={() => showSlide(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous image"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="hardware-carousel__arrow hardware-carousel__arrow--next"
          onClick={() => showSlide(activeIndex + 1)}
          disabled={activeIndex === hardwareSlides.length - 1}
          aria-label="Next image"
        >
          <ChevronRight aria-hidden="true" />
        </button>

        <span className="hardware-carousel__counter" aria-live="polite">
          {activeIndex + 1} / {hardwareSlides.length}
        </span>
      </div>

      <div
        className="hardware-carousel__previews"
        aria-label={String(t("about.hardwareCarouselHint"))}
      >
        {hardwareSlides.map((slide, index) => {
          const title = String(t(slide.titleKey));

          return (
            <button
              key={slide.src}
              type="button"
              className={`hardware-carousel__preview ${
                activeIndex === index ? "hardware-carousel__preview--active" : ""
              }`}
              onClick={() => showSlide(index)}
              aria-label={`Show ${title}`}
              aria-current={activeIndex === index ? "true" : undefined}
            >
              <img
                src={slide.src}
                alt=""
                loading="lazy"
                decoding="async"
                width={slide.width}
                height={slide.height}
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      <div className="hardware-carousel__hint">
        <span>{String(t("about.hardwareCarouselHint"))}</span>
        <span>{activeIndex + 1} / {hardwareSlides.length}</span>
      </div>

      <figcaption className="text-sm text-muted-foreground leading-relaxed">
        {String(t("about.hardwareCollageCaption"))}
      </figcaption>
    </figure>
  );
};

export default HardwareCarousel;
