import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "lv";

type Translations = {
  [key: string]: { en: string; lv: string };
};

const translations: Translations = {
  // Nav
  "nav.home": { en: "Home", lv: "Sākums" },
  "nav.about": { en: "About", lv: "Par mani" },
  "nav.projects": { en: "Projects", lv: "Projekti" },
  "nav.skills": { en: "Skills", lv: "Prasmes" },
  "nav.contact": { en: "Contact", lv: "Kontakti" },

  // Hero
  "hero.subtitle": { en: "Software Engineer", lv: "Programmēšanas tehniķis" },
  "hero.heading.first": { en: "Alex", lv: "Alex" },
  "hero.heading.last": { en: "Johnson", lv: "Johnson" },
  "hero.description": {
    en: "Crafting clean, performant software with a passion for elegant solutions and modern web technologies.",
    lv: "Veidu tīru, ātrdarbīgu programmatūru ar aizraušanos par elegantiem risinājumiem un modernām tīmekļa tehnoloģijām.",
  },
  "hero.viewProjects": { en: "View Projects", lv: "Skatīt projektus" },
  "hero.getInTouch": { en: "Get in Touch", lv: "Sazināties" },

  // About
  "about.label": { en: "About Me", lv: "Par mani" },
  "about.heading": {
    en: "Passionate about building great software",
    lv: "Aizrautīgs par lielisku programmatūru",
  },
  "about.description": {
    en: "I'm a software engineer and programming technician with experience in full-stack development, system design, and delivering high-quality applications. I enjoy working across the stack — from crafting pixel-perfect interfaces to designing robust backend architectures.",
    lv: "Esmu programmēšanas tehniķis ar pieredzi pilna steka izstrādē, sistēmu projektēšanā un augstas kvalitātes lietojumprogrammu piegādē. Man patīk strādāt visā stekā — no pikseļu precīzu saskarņu izveides līdz stabilu aizmugursistēmu arhitektūru projektēšanai.",
  },
  "about.cleanCode": { en: "Clean Code", lv: "Tīrs kods" },
  "about.cleanCodeDesc": {
    en: "Writing maintainable, well-tested software that scales.",
    lv: "Uzturamas, labi testētas un mērogojamas programmatūras izstrāde.",
  },
  "about.problemSolver": { en: "Problem Solver", lv: "Problēmu risinātājs" },
  "about.problemSolverDesc": {
    en: "Turning complex challenges into elegant, simple solutions.",
    lv: "Sarežģītu izaicinājumu pārvēršana elegantā un vienkāršā risinājumā.",
  },
  "about.fastLearner": { en: "Fast Learner", lv: "Ātra mācīšanās" },
  "about.fastLearnerDesc": {
    en: "Quickly adapting to new technologies and frameworks.",
    lv: "Ātra pielāgošanās jaunām tehnoloģijām un ietvariem.",
  },

  // Projects
  "projects.label": { en: "Projects", lv: "Projekti" },
  "projects.heading": { en: "Selected work", lv: "Izvēlētie darbi" },
  "projects.cloudSync": { en: "CloudSync Dashboard", lv: "CloudSync panelis" },
  "projects.cloudSyncDesc": {
    en: "A real-time monitoring dashboard for cloud infrastructure with live metrics, alerts, and team collaboration features.",
    lv: "Reāllaika uzraudzības panelis mākoņinfrastruktūrai ar tiešsaistes metriku, brīdinājumiem un komandas sadarbības funkcijām.",
  },
  "projects.taskFlow": { en: "TaskFlow API", lv: "TaskFlow API" },
  "projects.taskFlowDesc": {
    en: "RESTful API for project management with authentication, role-based access, and automated workflow triggers.",
    lv: "RESTful API projektu pārvaldībai ar autentifikāciju, uz lomām balstītu piekļuvi un automatizētiem darbplūsmu trigeriem.",
  },
  "projects.devMetrics": { en: "DevMetrics CLI", lv: "DevMetrics CLI" },
  "projects.devMetricsDesc": {
    en: "Command-line tool that analyzes codebases and generates comprehensive reports on code quality and complexity.",
    lv: "Komandrindas rīks, kas analizē kodu bāzes un ģenerē visaptverošus pārskatus par koda kvalitāti un sarežģītību.",
  },
  "projects.pixelGrid": { en: "PixelGrid Editor", lv: "PixelGrid redaktors" },
  "projects.pixelGridDesc": {
    en: "Browser-based pixel art editor with layers, animation timeline, and export to multiple sprite formats.",
    lv: "Pārlūkprogrammā bāzēts pikseļu mākslas redaktors ar slāņiem, animāciju laika līniju un eksportu vairākos sprite formātos.",
  },

  // Skills
  "skills.label": { en: "Skills", lv: "Prasmes" },
  "skills.heading": {
    en: "Technologies I work with",
    lv: "Tehnoloģijas, ar kurām strādāju",
  },
  "skills.languages": { en: "Languages", lv: "Valodas" },
  "skills.frontend": { en: "Frontend", lv: "Priekšgals" },
  "skills.backend": { en: "Backend", lv: "Aizmugursistēma" },
  "skills.tools": { en: "Tools & DevOps", lv: "Rīki un DevOps" },

  // Contact
  "contact.label": { en: "Contact", lv: "Kontakti" },
  "contact.heading": { en: "Let's work together", lv: "Strādāsim kopā" },
  "contact.description": {
    en: "Have a project in mind or just want to chat? Feel free to reach out — I'm always open to new opportunities and conversations.",
    lv: "Ir prātā kāds projekts vai vienkārši vēlaties parunāties? Droši sazinieties — esmu vienmēr atvērts jaunām iespējām un sarunām.",
  },
  "contact.sayHello": { en: "Say Hello", lv: "Sveicināties" },

  // Footer
  "footer.rights": {
    en: "All rights reserved.",
    lv: "Visas tiesības aizsargātas.",
  },
  "footer.builtWith": {
    en: "Built with React & Tailwind CSS",
    lv: "Veidots ar React un Tailwind CSS",
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
