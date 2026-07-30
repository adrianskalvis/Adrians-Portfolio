import { ChevronDown } from "lucide-react";

interface ScrollCueProps {
  className?: string;
}

const ScrollCue = ({ className = "" }: ScrollCueProps) => (
  <span className={`scroll-cue ${className}`} aria-hidden="true">
    <ChevronDown className="scroll-cue__arrow scroll-cue__arrow--one" />
    <ChevronDown className="scroll-cue__arrow scroll-cue__arrow--two" />
    <ChevronDown className="scroll-cue__arrow scroll-cue__arrow--three" />
  </span>
);

export default ScrollCue;
