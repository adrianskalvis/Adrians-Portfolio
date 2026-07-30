import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

export type Lang = "en" | "lv" | "ru";

type Translations = {
  [key: string]: {
    en: string | string[];
    lv: string | string[];
    ru?: string | string[];
  };
};

const translations: Translations = {
  // Nav
  "nav.home": { en: "Home", lv: "Sākums", ru: "Главная" },
  "nav.about": { en: "About", lv: "Par mani", ru: "Обо мне" },
  "nav.projects": { en: "Projects", lv: "Projekti", ru: "Проекты" },
  "nav.skills": { en: "Skills", lv: "Prasmes", ru: "Навыки" },
  "nav.contact": { en: "Contact", lv: "Kontakti", ru: "Контакты" },
  "nav.language": { en: "Language", lv: "Valoda", ru: "Язык" },
  "nav.location": { en: "Latvia", lv: "Latvija", ru: "Латвия" },

  // Hero
  "hero.madeIn": { en: "Located in Latvia", lv: "Atrodos Latvijā", ru: "Нахожусь в Латвии" },
  "hero.greeting": { en: "I'm Adrian,", lv: "Es esmu Adrians,", ru: "Я Адриан," },
  "hero.typewriter": {
    en: ["Web Developer", "Programming Technician", "Creative Problem Solver"],
    lv: ["Tīmekļa izstrādātājs", "Programmēšanas tehniķis", "Radošs problēmu risinātājs"],
    ru: ["Веб-разработчик", "Техник-программист", "Творческий специалист"],
  },
  "hero.viewProjects": { en: "View Projects", lv: "Skatīt projektus", ru: "Смотреть проекты" },
  "hero.scrollPrompt": { en: "Scroll to explore", lv: "Ritini, lai apskatītu", ru: "Листайте дальше" },
  "hero.getInTouch": { en: "Get in Touch", lv: "Sazināties", ru: "Связаться" },

  // About
  "about.label": { en: "About Me", lv: "Par mani", ru: "Обо мне" },
  "about.heading": {
    en: "Passionate about building great software",
    lv: "Aizrautīgs par lielisku programmatūru",
    ru: "Увлечён созданием качественного программного обеспечения",
  },
  "about.description": {
    en: "I'm Adrian, a developer from Latvia with 3 years of programming experience. I'm currently pursuing a Programming Technician qualification at Vidzeme Technology and Design Vocational School (VTDT), with a strong focus on web development.\n\nI enjoy turning ideas into useful, well-considered digital experiences. I'm naturally curious, enjoy learning independently, and care about making work that is clear, functional and easy to use.\n\nI've been interested in robotics from a young age, and that curiosity still shapes how I explore technology today. Away from programming, I enjoy hands-on creative work through CAD and PCB design, electronics, CNC machining and 3D printing, alongside video editing and graphic design. These interests give me different ways to think about design, detail and problem-solving.",
    lv: "Esmu Adrians, izstrādātājs no Latvijas ar 3 gadu programmēšanas pieredzi. Pašlaik Vidzemes Tehnoloģiju un dizaina tehnikumā (VTDT) apgūstu programmēšanas tehniķa kvalifikāciju, īpaši pievēršoties tīmekļa izstrādei.\n\nMan patīk pārvērst idejas noderīgos un pārdomātos digitālos risinājumos. Mani virza zinātkāre, patstāvīga mācīšanās un vēlme radīt skaidru, funkcionālu un ērti lietojamu rezultātu.\n\nJau kopš bērnības mani ir interesējusi robotika, un šī zinātkāre joprojām nosaka to, kā izzinu tehnoloģijas. Ārpus programmēšanas man patīk praktiski radoši darbi — CAD un PCB projektēšana, elektronika, CNC frēzēšana un 3D drukāšana, kā arī video montāža un grafiskais dizains. Šīs intereses palīdz man uz dizainu, detaļām un problēmu risināšanu paskatīties no cita skatpunkta.",
    ru: "Я Адриан, разработчик из Латвии с трёхлетним опытом программирования. Сейчас я получаю квалификацию техника-программиста в Видземской школе технологий и дизайна (VTDT), уделяя особое внимание веб-разработке.\n\nМне нравится превращать идеи в полезные и продуманные цифровые продукты. Я любознателен, умею учиться самостоятельно и стремлюсь создавать понятные, функциональные и удобные решения.\n\nРобототехника интересует меня с детства, и это любопытство до сих пор влияет на то, как я изучаю технологии. В свободное от программирования время я занимаюсь практическими творческими проектами: CAD- и PCB-проектированием, электроникой, обработкой на ЧПУ и 3D-печатью, а также видеомонтажом и графическим дизайном. Эти увлечения помогают мне по-разному смотреть на дизайн, детали и решение задач.",
  },
  "about.portraitAlt": {
    en: "Portrait of Adrian Kalvis",
    lv: "Adriana Kalvja portrets",
    ru: "Портрет Адриана Калвиса",
  },
  "about.hardwareCollageAlt": {
    en: "PCB design views and a controller-board reference used while exploring robotics hardware",
    lv: "PCB dizaina skati un kontrolplates atsauces attēls, pētot robotikas aparatūru",
    ru: "Виды проекта печатной платы и справочное изображение платы управления, использованное при изучении робототехники",
  },
  "about.hardwareCarouselLabel": {
    en: "PCB and robotics image gallery",
    lv: "PCB un robotikas attēlu galerija",
    ru: "Галерея печатных плат и робототехники",
  },
  "about.hardwareCarouselHint": {
    en: "Swipe or use the arrows to explore",
    lv: "Velc vai izmanto bultiņas, lai apskatītu",
    ru: "Листайте или используйте стрелки",
  },
  "about.hardwareSlide3d": {
    en: "PCB 3D board view",
    lv: "PCB plates 3D skats",
    ru: "3D-вид печатной платы",
  },
  "about.hardwareSlideRouting": {
    en: "PCB routing layout",
    lv: "PCB celiņu izkārtojums",
    ru: "Трассировка печатной платы",
  },
  "about.hardwareSlideReference": {
    en: "Controller-board reference",
    lv: "Kontrolplates atsauces attēls",
    ru: "Справочная плата управления",
  },
  "about.hardwareCollageCaption": {
    en: "PCB design exploration: routing and 3D board views, alongside a controller-board reference studied while learning about robotics hardware.",
    lv: "PCB dizaina izpēte: celiņu izkārtojuma un plates 3D skati kopā ar kontrolplates atsauces attēlu, ko pētīju, apgūstot robotikas aparatūru.",
    ru: "Изучение проектирования печатных плат: трассировка и 3D-виды платы, а также справочная плата управления, изученная при знакомстве с аппаратной частью робототехники.",
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
  "projects.label": { en: "Projects", lv: "Projekti", ru: "Проекты" },
  "projects.heading": { en: "Selected work", lv: "Izvēlētie darbi", ru: "Избранные работы" },
  "projects.featured": { en: "Featured Project", lv: "Galvenais projekts", ru: "Главный проект" },
  "projects.miniGame": { en: "Mini Game", lv: "Mini Spēle", ru: "Мини-игра" },
  "projects.miniGameDesc": {
    en: "An interactive introduction to programming created for school outreach. I presented the game and programming examples to students in Līgatne, Gulbene and Madona, learning how to explain technical ideas to people with no prior experience.",
    lv: "Interaktīvs ievads programmēšanā, kas izveidots skolas popularizēšanai. Spēli un programmēšanas piemērus demonstrēju skolēniem Līgatnē, Gulbenē un Madonā, gūstot pieredzi tehnisku ideju izskaidrošanā cilvēkiem bez priekšzināšanām.",
    ru: "Интерактивное введение в программирование, созданное для школьных презентаций. Я демонстрировал игру и примеры программирования ученикам в Лигатне, Гулбене и Мадоне, получая опыт объяснения технических идей людям без подготовки.",
  },
  "projects.viewGame": { en: "View Game", lv: "Skatīt spēli", ru: "Открыть игру" },
  "projects.vtdtCareer": {
    en: "VTDT Career Assistant",
    lv: "VTDT Karjeras palīgs",
    ru: "Карьерный помощник VTDT",
  },
  "projects.vtdtCareerDesc": {
    en: "A decision-tree career recommender for VTDT. It asks a focused series of questions, follows the user's answer path, and recommends the best-fitting study profession from the school's available programs.",
    lv: "Uz lēmumu koku balstīts karjeras rekomendāciju rīks VTDT. Tas uzdod mērķētus jautājumus, seko lietotāja atbilžu ceļam un iesaka piemērotāko profesiju no skolā pieejamajām programmām.",
    ru: "Карьерный рекомендатель VTDT на основе дерева решений. Он задаёт последовательность вопросов, следует по пути ответов и предлагает наиболее подходящую профессию из программ школы.",
  },
  "projects.project": { en: "Project", lv: "Projekts", ru: "Проект" },
  "projects.viewProject": { en: "View Project", lv: "Skatīt projektu", ru: "Открыть проект" },
  "projects.viewOnGithub": { en: "View on GitHub", lv: "Skatīt GitHub", ru: "Открыть GitHub" },
  "projects.carouselLabel": {
    en: "Selected projects",
    lv: "Izvēlētie projekti",
    ru: "Избранные проекты",
  },
  "projects.carouselHint": {
    en: "Swipe, drag or use the arrows",
    lv: "Velc vai izmanto bultiņas",
    ru: "Листайте, перетаскивайте или используйте стрелки",
  },
  "projects.previous": { en: "Previous project", lv: "Iepriekšējais projekts", ru: "Предыдущий проект" },
  "projects.next": { en: "Next project", lv: "Nākamais projekts", ru: "Следующий проект" },

  // Skills
  "skills.label": { en: "Skills", lv: "Prasmes", ru: "Навыки" },
  "skills.heading": {
    en: "Technologies I work with",
    lv: "Tehnoloģijas, ar kurām strādāju",
    ru: "Технологии, с которыми я работаю",
  },
  "skills.scrollHint": { en: "Scroll to contact", lv: "Ritini uz kontaktiem", ru: "Листайте к контактам" },
  "skills.languages": { en: "Languages", lv: "Valodas" },
  "skills.frontend": { en: "Frontend", lv: "Priekšgals" },
  "skills.backend": { en: "Backend", lv: "Aizmugursistēma" },
  "skills.tools": { en: "Tools & DevOps", lv: "Rīki un DevOps" },

  // Contact
  "contact.label": { en: "Contact", lv: "Kontakti", ru: "Контакты" },
  "contact.heading": { en: "Let's build something great", lv: "Uzbūvēsim kaut ko lielisku", ru: "Давайте создадим что-то отличное" },
  "contact.description": {
    en: "Have a project in mind or need help bringing an idea to life?\nI'm open to new opportunities, collaborations, and challenging projects.\n\nFeel free to reach out.",
    lv: "Vai jums ir padomā projekts vai nepieciešama palīdzība idejas īstenošanai?\nEsmu atvērts jaunām iespējām, sadarbībai un izaicinājumiem pilniem projektiem.\n\nDroši sazinieties.",
    ru: "Есть идея проекта или нужна помощь в её реализации?\nЯ открыт для новых возможностей, сотрудничества и интересных задач.\n\nБуду рад вашему сообщению.",
  },
  "contact.sayHello": { en: "Say Hello", lv: "Sveicināties", ru: "Написать" },

  // Footer
  "footer.rights": {
    en: "",
    lv: "",
    ru: "",
  },
  "footer.builtWith": {
    en: "Built with React & Tailwind CSS",
    lv: "Veidots ar React un Tailwind CSS",
    ru: "Создано с React и Tailwind CSS",
  },
  "footer.inspiration": {
    en: "Independent interface inspired by Liquid Glass, introduced by Apple with iOS 26",
    lv: "Neatkarīgs interfeiss, iedvesmots no Liquid Glass, ko Apple ieviesa ar iOS 26",
    ru: "Независимый интерфейс, вдохновлённый Liquid Glass, представленным Apple в iOS 26",
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string | string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const savedLanguage = localStorage.getItem("portfolio-language");
    return savedLanguage === "lv" || savedLanguage === "ru" ? savedLanguage : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("portfolio-language", lang);
  }, [lang]);

  const t = useCallback(
    (key: string): string | string[] => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] ?? entry.en;
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
