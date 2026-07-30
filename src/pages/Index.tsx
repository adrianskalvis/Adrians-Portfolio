import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const Index = () => (
  <>
    <CustomCursor />
    <Navbar />
    <main className="relative z-10 bg-background">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
    </main>
    <div className="sticky bottom-0 z-0">
      <ContactSection />
      <Footer />
    </div>
  </>
);

export default Index;
