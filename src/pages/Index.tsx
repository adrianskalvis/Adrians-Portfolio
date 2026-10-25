import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutStory from "@/components/AboutStory";
import ProjectsScatter from "@/components/ProjectsScatter";
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
      <AboutStory />
      <ProjectsScatter />
      <SkillsSection />
    </main>
    <div className="contact-reveal z-0">
      <ContactSection />
      <Footer />
    </div>
  </>
);

export default Index;
