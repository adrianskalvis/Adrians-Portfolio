import AnimatedSection from "./AnimatedSection";
import { Mail, Github, Linkedin, Send } from "lucide-react";

const ContactSection = () => (
  <section id="contact" className="section-padding sky-gradient-reverse">
    <div className="max-w-2xl mx-auto text-center">
      <AnimatedSection>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Contact</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Let's work together
        </h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Have a project in mind or just want to chat? Feel free to reach out —
          I'm always open to new opportunities and conversations.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <a
          href="mailto:alex@example.com"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all duration-200 hover:shadow-lg mb-10"
        >
          <Send size={16} />
          Say Hello
        </a>

        <div className="flex items-center justify-center gap-6 mt-2">
          {[
            { icon: Mail, href: "mailto:alex@example.com", label: "Email" },
            { icon: Github, href: "https://github.com", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <link.icon size={18} />
            </a>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ContactSection;
