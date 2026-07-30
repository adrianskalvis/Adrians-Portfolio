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
  "hero.madeIn": { en: "From Latvia", lv: "No Latvijas", ru: "Из Латвии" },
  "hero.greeting": { en: "I'm Adrian,", lv: "Es esmu Adrians,", ru: "Я Адриан," },
  "hero.typewriter": {
    en: ["Programming Technician", "Web Developer", "Junior Full-Stack Developer"],
    lv: ["Programmēšanas tehniķis", "Tīmekļa izstrādātājs", "Jaunākais pilna cikla izstrādātājs"],
    ru: ["Техник-программист", "Веб-разработчик", "Младший full-stack разработчик"],
  },
  "hero.value": {
    en: "I build clear, responsive web applications across frontend and backend.",
    lv: "Veidoju skaidras un responsīvas tīmekļa lietotnes gan priekšgalā, gan aizmugursistēmā.",
    ru: "Создаю понятные и адаптивные веб-приложения — от интерфейса до серверной части.",
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
    lv: "Esmu Adrians, izstrādātājs no Latvijas ar 3 gadu programmēšanas pieredzi. Pašlaik Vidzemes Tehnoloģiju un dizaina tehnikumā (VTDT) apgūstu programmēšanas tehniķa kvalifikāciju, īpaši pievēršoties tīmekļa izstrādei.\n\nMan patīk pārvērst idejas noderīgos un pārdomātos digitālos risinājumos. Mani virza zinātkāre, patstāvīga mācīšanās un vēlme radīt skaidru, funkcionālu un ērti lietojamu rezultātu.\n\nJau kopš bērnības mani ir interesējusi robotika, un šī zinātkāre joprojām nosaka to, kā izzinu tehnoloģijas. Ārpus programmēšanas man patīk praktiski radoši darbi, tostarp CAD un PCB projektēšana, elektronika, CNC frēzēšana un 3D drukāšana, kā arī video montāža un grafiskais dizains. Šīs intereses palīdz man uz dizainu, detaļām un problēmu risināšanu paskatīties no cita skatpunkta.",
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
    en: "An interactive introduction to programming created for school outreach and designed for students with no prior experience.",
    lv: "Interaktīvs ievads programmēšanā skolas popularizēšanai, kas veidots skolēniem bez priekšzināšanām.",
    ru: "Интерактивное введение в программирование для школьных презентаций, рассчитанное на учеников без подготовки.",
  },
  "projects.viewGame": { en: "View Game", lv: "Skatīt spēli", ru: "Открыть игру" },
  "projects.vtdtCareer": {
    en: "VTDT Career Assistant",
    lv: "VTDT Karjeras palīgs",
    ru: "Карьерный помощник VTDT",
  },
  "projects.vtdtCareerDesc": {
    en: "A decision-tree career recommender that guides prospective students toward a fitting VTDT study program based on their answers.",
    lv: "Uz lēmumu koku balstīts karjeras rīks, kas pēc atbildēm palīdz topošajiem audzēkņiem atrast piemērotu VTDT mācību programmu.",
    ru: "Карьерный помощник на основе дерева решений, который по ответам подбирает будущим студентам подходящую программу VTDT.",
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
  "projects.swipeHint": {
    en: "Swipe",
    lv: "Velc",
    ru: "Листайте",
  },
  "projects.previous": { en: "Previous project", lv: "Iepriekšējais projekts", ru: "Предыдущий проект" },
  "projects.next": { en: "Next project", lv: "Nākamais projekts", ru: "Следующий проект" },
  "projects.role": { en: "Role", lv: "Loma", ru: "Роль" },
  "projects.challenge": { en: "Challenge", lv: "Uzdevums", ru: "Задача" },
  "projects.approach": { en: "Approach", lv: "Pieeja", ru: "Подход" },
  "projects.outcome": { en: "Outcome", lv: "Rezultāts", ru: "Результат" },
  "projects.independentDeveloper": {
    en: "Independent developer",
    lv: "Patstāvīgs izstrādātājs",
    ru: "Самостоятельный разработчик",
  },
  "projects.miniGameChallenge": {
    en: "Make programming approachable for students with no prior experience.",
    lv: "Padarīt programmēšanu saprotamu skolēniem bez priekšzināšanām.",
    ru: "Сделать программирование доступным ученикам без предварительного опыта.",
  },
  "projects.miniGameApproach": {
    en: "An interactive game supported by practical programming examples.",
    lv: "Interaktīva spēle kopā ar praktiskiem programmēšanas piemēriem.",
    ru: "Интерактивная игра с практическими примерами программирования.",
  },
  "projects.miniGameOutcome": {
    en: "Presented during school outreach in Līgatne, Gulbene and Madona.",
    lv: "Prezentēta skolas popularizēšanas pasākumos Līgatnē, Gulbenē un Madonā.",
    ru: "Представлена на школьных выездных мероприятиях в Лигатне, Гулбене и Мадоне.",
  },
  "projects.vtdtChallenge": {
    en: "Help prospective students navigate VTDT's available study programs.",
    lv: "Palīdzēt topošajiem audzēkņiem orientēties VTDT mācību programmās.",
    ru: "Помочь будущим студентам сориентироваться в учебных программах VTDT.",
  },
  "projects.vtdtApproach": {
    en: "A focused question path powered by a decision-tree script.",
    lv: "Mērķēts jautājumu ceļš, ko vada lēmumu koka skripts.",
    ru: "Последовательность точных вопросов на основе дерева решений.",
  },
  "projects.vtdtOutcome": {
    en: "Produces a tailored recommendation from the school's programs.",
    lv: "Sniedz individuāli pielāgotu ieteikumu no skolas programmām.",
    ru: "Формирует персональную рекомендацию из программ школы.",
  },

  // Skills
  "skills.label": { en: "Skills", lv: "Prasmes", ru: "Навыки" },
  "skills.heading": {
    en: "Technologies I work with",
    lv: "Tehnoloģijas, ar kurām strādāju",
    ru: "Технологии, с которыми я работаю",
  },
  "skills.scrollHint": { en: "Scroll to contact", lv: "Ritini uz kontaktiem", ru: "Листайте к контактам" },
  "skills.languages": { en: "Languages", lv: "Valodas", ru: "Языки" },
  "skills.frontend": { en: "Frontend", lv: "Priekšgals", ru: "Фронтенд" },
  "skills.backend": { en: "Backend & Programming", lv: "Aizmugursistēmas un programmēšana", ru: "Бэкенд и программирование" },
  "skills.databases": { en: "Databases", lv: "Datubāzes", ru: "Базы данных" },
  "skills.tools": { en: "Tools & DevOps", lv: "Rīki un DevOps", ru: "Инструменты и DevOps" },

  // Contact
  "contact.label": { en: "Contact", lv: "Kontakti", ru: "Контакты" },
  "contact.heading": { en: "Let's build something great", lv: "Uzbūvēsim kaut ko lielisku", ru: "Давайте создадим что-то отличное" },
  "contact.description": {
    en: "I'm looking for junior development opportunities where I can contribute, learn and grow.\nI'm also open to selected freelance projects and collaborations.\n\nFeel free to reach out.",
    lv: "Meklēju jaunākā izstrādātāja iespējas, kurās varu dot ieguldījumu, mācīties un augt.\nEsmu atvērts arī atsevišķiem ārštata projektiem un sadarbībai.\n\nDroši sazinieties.",
    ru: "Ищу возможности для младшего разработчика, где смогу приносить пользу, учиться и расти.\nТакже открыт для отдельных фриланс-проектов и сотрудничества.\n\nБуду рад вашему сообщению.",
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
    if (typeof window === "undefined") return "en";

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
