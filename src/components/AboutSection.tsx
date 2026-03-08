import AnimatedSection from "./AnimatedSection";
import { Code2, Lightbulb, Rocket } from "lucide-react";

const highlights = [
  { icon: Code2, title: "Clean Code", desc: "Writing maintainable, well-tested software that scales." },
  { icon: Lightbulb, title: "Problem Solver", desc: "Turning complex challenges into elegant, simple solutions." },
  { icon: Rocket, title: "Fast Learner", desc: "Quickly adapting to new technologies and frameworks." },
];

const AboutSection = () => (
  <section id="about" className="section-padding max-w-6xl mx-auto">
    <AnimatedSection>
      <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">About Me</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
        Passionate about building great software
      </h2>
      <p className="text-muted-foreground max-w-2xl leading-relaxed mb-12">
        I'm a software engineer and programming technician with experience in
        full-stack development, system design, and delivering high-quality
        applications. I enjoy working across the stack — from crafting pixel-perfect
        interfaces to designing robust backend architectures.
      </p>
    </AnimatedSection>

    <div className="grid md:grid-cols-3 gap-6">
      {highlights.map((item, i) => (
        <AnimatedSection key={item.title} delay={i * 0.1}>
          <div className="card-sky p-6 h-full">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
              <item.icon size={20} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </section>
);

export default AboutSection;
