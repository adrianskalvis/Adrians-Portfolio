import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({ children, className = "", delay = 0 }: Props) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 18 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: isMobile, margin: isMobile ? "-24px" : "-60px" }}
      transition={{
        duration: isMobile ? 0.5 : 0.7,
        delay: isMobile ? Math.min(delay, 0.05) : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
