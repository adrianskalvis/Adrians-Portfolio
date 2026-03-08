import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center justify-center sky-gradient overflow-hidden"
  >
    {/* Decorative circles */}
    <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-sky-mid/30 blur-3xl animate-float" />
    <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full bg-primary/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} />

    <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-medium tracking-widest uppercase text-primary mb-4"
      >
        Software Engineer
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
      >
        Alex <span className="text-gradient-sky">Johnson</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
      >
        Crafting clean, performant software with a passion for elegant solutions
        and modern web technologies.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="flex items-center justify-center gap-4"
      >
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all duration-200 hover:shadow-lg"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground font-medium text-sm hover-lift"
        >
          Get in Touch
        </a>
      </motion.div>
    </div>

    <motion.a
      href="#about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
    >
      <ArrowDown size={22} className="animate-bounce" />
    </motion.a>
  </section>
);

export default HeroSection;
