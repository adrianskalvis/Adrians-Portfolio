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
  "hero.madeIn": { en: "Made in Latvia", lv: "Radīts Latvijā", ru: "Сделано в Латвии" },
  "hero.greeting": { en: "I'm Adrian,", lv: "Es esmu Adrians,", ru: "Я Адриан," },
  "hero.typewriter": {
    en: ["Programming Technician", "Web Developer", "Junior Full-Stack Developer"],
    lv: ["Programmēšanas tehniķis", "Tīmekļa izstrādātājs", "Jaunākais pilna cikla izstrādātājs"],
    ru: ["Техник-программист", "Веб-разработчик", "Младший full-stack разработчик"],
  },
  "hero.value": {
    en: "I like working fast, experimenting with CSS and turning ideas into websites that look good and load quickly.",
    lv: "Man patīk strādāt ātri, eksperimentēt ar CSS un pārvērst idejas tīmekļa vietnēs, kas labi izskatās un ātri ielādējas.",
    ru: "Мне нравится работать быстро, экспериментировать с CSS и превращать идеи в сайты, которые хорошо выглядят и быстро загружаются.",
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
    en: "I'm Adrian, a developer from Latvia with 3 years of programming experience. I'm currently pursuing a Programming Technician qualification at Vidzeme Technology and Design Vocational School (VTDT).\n\nI rarely run out of ideas. What I enjoy most is choosing one, opening my editor and making it real. Frontend is my favourite part, especially CSS, animation and the small visual details that give a page its character. I like working quickly, and I want the websites I build to feel quick too.\n\nI've been interested in robotics and technology in general from a young age, and that curiosity still shapes what I explore today. Away from programming, I enjoy creative work through CAD and PCB design, electronics, CNC machining and 3D printing, alongside video editing and graphic design. These interests give me different ways to think about design, detail and problem-solving.",
    lv: "Esmu Adrians, izstrādātājs no Latvijas ar 3 gadu programmēšanas pieredzi. Pašlaik Vidzemes Tehnoloģiju un dizaina tehnikumā (VTDT) apgūstu programmēšanas tehniķa kvalifikāciju.\n\nMan ideju gandrīz nekad netrūkst. Visvairāk man patīk izvēlēties kādu no tām, atvērt koda redaktoru un pārvērst to par kaut ko īstu. Mana mīļākā daļa ir lapas redzamās puses veidošana, īpaši CSS, animācijas un mazās vizuālās detaļas, kas lapai piešķir raksturu. Man patīk strādāt ātri, un vēlos, lai arī manas veidotās tīmekļa vietnes darbotos ātri.\n\nJau kopš bērnības mani interesē robotika un tehnoloģijas kopumā, un šī zinātkāre joprojām nosaka to, ko vēlos izzināt. Ārpus programmēšanas man patīk radoši darbi, tostarp CAD un PCB projektēšana, elektronika, CNC frēzēšana un 3D drukāšana, kā arī video montāža un grafiskais dizains. Šīs intereses palīdz man uz dizainu, detaļām un problēmu risināšanu paskatīties no cita skatpunkta.",
    ru: "Я Адриан, разработчик из Латвии с трёхлетним опытом программирования. Сейчас я получаю квалификацию техника-программиста в Видземской школе технологий и дизайна (VTDT).\n\nИдеи у меня почти никогда не заканчиваются. Больше всего мне нравится выбрать одну из них, открыть редактор кода и сделать её реальной. Моя любимая часть — фронтенд, особенно CSS, анимации и небольшие визуальные детали, которые придают странице характер. Мне нравится работать быстро, и я хочу, чтобы созданные мной сайты тоже работали быстро.\n\nРобототехника и технологии в целом интересуют меня с детства, и это любопытство до сих пор определяет, что я изучаю. В свободное от программирования время я занимаюсь творческими проектами: CAD- и PCB-проектированием, электроникой, обработкой на ЧПУ и 3D-печатью, а также видеомонтажом и графическим дизайном. Эти увлечения помогают мне по-разному смотреть на дизайн, детали и решение задач.",
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
    en: "A closer look at my PCB work: the routing, a 3D board view and a controller board I used as a reference while learning about robotics hardware.",
    lv: "Tuvāks ieskats manā PCB darbā: celiņu izkārtojums, plates 3D skats un kontrolplate, ko izmantoju kā atsauci, apgūstot robotikas aparatūru.",
    ru: "Моя работа с PCB: трассировка, 3D-вид платы и плата контроллера, которую я использовал как пример при изучении робототехники.",
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
    en: "I made this small browser game for school visits, giving students their first look at programming through something they could play.",
    lv: "Šo nelielo pārlūkprogrammas spēli izveidoju skolas izbraukuma pasākumiem, lai skolēni ar programmēšanu pirmoreiz iepazītos spēlējot.",
    ru: "Я сделал эту небольшую браузерную игру для школьных выездов, чтобы ученики впервые познакомились с программированием через игру.",
  },
  "projects.viewGame": { en: "View Game", lv: "Skatīt spēli", ru: "Открыть игру" },
  "projects.vtdtCareer": {
    en: "VTDT Career Assistant",
    lv: "VTDT Karjeras palīgs",
    ru: "Карьерный помощник VTDT",
  },
  "projects.vtdtCareerDesc": {
    en: "I built this quiz to help future VTDT students choose a study programme. A decision tree follows their answers and shows the closest match.",
    lv: "Šo testu izveidoju, lai topošajiem VTDT audzēkņiem palīdzētu izvēlēties mācību programmu. Lēmumu koks seko atbildēm un beigās parāda piemērotāko variantu.",
    ru: "Я сделал этот тест, чтобы будущим ученикам VTDT было проще выбрать учебную программу. Дерево решений учитывает ответы и показывает наиболее подходящий вариант.",
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
  "projects.moreDetails": { en: "Project details", lv: "Par projektu", ru: "О проекте" },
  "projects.lessDetails": { en: "Close details", lv: "Aizvērt aprakstu", ru: "Скрыть подробности" },
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
    en: "Most of the students had never programmed before.",
    lv: "Lielākā daļa skolēnu iepriekš nebija programmējuši.",
    ru: "Большинство учеников раньше никогда не программировали.",
  },
  "projects.miniGameApproach": {
    en: "I paired a simple game with programming examples I could explain in person.",
    lv: "Vienkāršu spēli papildināju ar programmēšanas piemēriem, kurus varēju izskaidrot klātienē.",
    ru: "Я объединил простую игру с примерами кода, которые мог объяснить ученикам лично.",
  },
  "projects.miniGameOutcome": {
    en: "I presented it to students in Līgatne, Gulbene and Madona.",
    lv: "To prezentēju skolēniem Līgatnē, Gulbenē un Madonā.",
    ru: "Я представил игру ученикам в Лигатне, Гулбене и Мадоне.",
  },
  "projects.vtdtChallenge": {
    en: "VTDT offers several programmes, and choosing between them can be difficult.",
    lv: "VTDT piedāvā vairākas programmas, un izvēlēties starp tām var būt grūti.",
    ru: "VTDT предлагает несколько программ, и выбрать между ними бывает непросто.",
  },
  "projects.vtdtApproach": {
    en: "I wrote a decision-tree script that narrows the options with each answer.",
    lv: "Uzrakstīju lēmumu koka skriptu, kas ar katru atbildi sašaurina izvēli.",
    ru: "Я написал скрипт с деревом решений, который с каждым ответом сужает выбор.",
  },
  "projects.vtdtOutcome": {
    en: "At the end, the student gets the programme that best matches their answers.",
    lv: "Beigās audzēknis saņem programmu, kas vislabāk atbilst viņa atbildēm.",
    ru: "В конце ученик получает программу, которая лучше всего подходит его ответам.",
  },

  "projects.swipeagamiDesc": {
    en: "Origami you learn by swiping, one fold per screen. The idea came to me on a bus while folding a gum wrapper, and I wanted a simple way for anyone to learn.",
    lv: "Origami, ko apgūst, pārvelkot ekrānu: viens locījums vienā solī. Ideja radās autobusā, locot košļājamās gumijas papīriņu, un es gribēju vienkāršu veidu, kā mācīties ikvienam.",
    ru: "Оригами, которое изучаешь свайпами: один сгиб на экран. Идея пришла мне в автобусе, когда я складывал обёртку от жвачки, и я хотел сделать простой способ учиться для всех.",
  },
  "projects.blog": { en: "Windows 95 Blog", lv: "Windows 95 emuārs", ru: "Блог Windows 95" },
  "projects.viewBlog": { en: "Visit blog", lv: "Apmeklēt emuāru", ru: "Открыть блог" },
  "projects.blogDesc": {
    en: "A blog with a Windows 95-inspired interface. Retro windows, a music player and Minesweeper turn browsing posts into a small desktop experience.",
    lv: "Emuārs ar Windows 95 iedvesmotu saskarni. Retro logi, mūzikas atskaņotājs un Minesweeper pārvērš ierakstu lasīšanu nelielā darbvirsmas pieredzē.",
    ru: "Блог с интерфейсом в духе Windows 95. Ретроокна, музыкальный плеер и «Сапёр» превращают чтение записей в небольшой рабочий стол.",
  },
  "projects.blogChallenge": {
    en: "Keep posts easy to browse within a playful retro interface.",
    lv: "Saglabāt ērtu ierakstu pārlūkošanu rotaļīgā retro saskarnē.",
    ru: "Сделать записи удобными для чтения в игровом ретроинтерфейсе.",
  },
  "projects.blogApproach": {
    en: "Desktop-style windows and controls, with post search, categories and a music player.",
    lv: "Darbvirsmas stila logi un vadīklas, ierakstu meklēšana, kategorijas un mūzikas atskaņotājs.",
    ru: "Окна и элементы управления в стиле рабочего стола, поиск записей, категории и музыкальный плеер.",
  },
  "projects.blogOutcome": {
    en: "A live blog that brings together writing and experiments with nostalgic web design.",
    lv: "Publicēts emuārs, kas apvieno rakstīšanu un eksperimentus ar nostalģisku tīmekļa dizainu.",
    ru: "Опубликованный блог, объединяющий записи и эксперименты с ностальгическим веб-дизайном.",
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

  // Portfolio additions
  "projects.kiberdrossDesc": {
    en: "A cybersecurity learning platform for people in Latvia. Interactive lessons and practical scenarios help users recognize online threats and practise safer decisions.",
    lv: "Kiberdrošības mācību platforma Latvijas iedzīvotājiem. Interaktīvas nodarbības un praktiski scenāriji palīdz atpazīt draudus internetā un mācīties pieņemt drošākus lēmumus.",
    ru: "Обучающая платформа по кибербезопасности для жителей Латвии. Интерактивные уроки и практические сценарии помогают распознавать угрозы в интернете и учиться принимать безопасные решения.",
  },
  "projects.workInProgress": { en: "Work in Progress", lv: "Izstrādes procesā", ru: "В разработке" },
  "projects.viewPreview": { en: "View preview", lv: "Skatīt priekšskatījumu", ru: "Смотреть превью" },
  "projects.kiberdrossChallenge": {
    en: "Make everyday online safety easier to practise in Latvian.",
    lv: "Padarīt ikdienas drošību internetā vieglāk apgūstamu latviešu valodā.",
    ru: "Сделать обучение повседневной безопасности в интернете доступнее на латышском языке.",
  },
  "projects.kiberdrossApproach": {
    en: "Laravel lessons and scenario-based training, with saved progress.",
    lv: "Nodarbības un situāciju treniņi Laravel platformā ar progresa saglabāšanu.",
    ru: "Уроки и ситуационные тренировки на Laravel с сохранением прогресса.",
  },
  "projects.kiberdrossOutcome": {
    en: "A working learning flow that I am still building and refining.",
    lv: "Darbojošs mācību process, ko turpinu izstrādāt un pilnveidot.",
    ru: "Работающий учебный процесс, который я продолжаю развивать и дорабатывать.",
  },
  "skills.learning": { en: "Currently studying", lv: "Pašlaik apgūstu", ru: "Сейчас изучаю" },

  "projects.closePreview": { en: "Close image", lv: "Aizvērt attēlu", ru: "Закрыть изображение" },

  // Contact
  "contact.label": { en: "Get in touch", lv: "Sazināties", ru: "Связаться" },
  "contact.description": {
    en: "A project, a question or just a hello. Leave a short note below and I'll get back to you.",
    lv: "Projekts, jautājums vai vienkārši sveiciens. Atstāj īsu ziņu zemāk, un es atbildēšu.",
    ru: "Проект, вопрос или просто привет. Оставьте короткое сообщение ниже, и я отвечу.",
  },
  "contact.emailLabel": { en: "Your email", lv: "Tavs e-pasts", ru: "Ваш email" },
  "contact.emailHint": {
    en: "Add a full email address so I can reply.",
    lv: "Ieraksti pilnu e-pasta adresi, lai varu atbildēt.",
    ru: "Укажите полный email, чтобы я мог ответить.",
  },
  "contact.messageHint": {
    en: "Write a few words first.",
    lv: "Vispirms uzraksti dažus vārdus.",
    ru: "Сначала напишите пару слов.",
  },
  "contact.copyEmail": { en: "Copy email", lv: "Kopēt e-pastu", ru: "Скопировать email" },
  "contact.copied": { en: "Copied", lv: "Nokopēts", ru: "Скопировано" },
  "contact.messageLabel": { en: "Message", lv: "Ziņa", ru: "Сообщение" },
  "contact.messagePlaceholder": {
    en: "Include your name and a few words about what you have in mind.",
    lv: "Pievieno savu vārdu un dažos vārdos pastāsti, ko vēlies.",
    ru: "Укажите своё имя и коротко опишите, что вы задумали.",
  },
  "contact.send": { en: "Send", lv: "Sūtīt", ru: "Отправить" },
  "contact.sending": { en: "Sending…", lv: "Sūta…", ru: "Отправка…" },
  "contact.sent": { en: "Sent, thanks!", lv: "Nosūtīts, paldies!", ru: "Отправлено, спасибо!" },
  "contact.error": {
    en: "That didn't go through. You can also email me at",
    lv: "Neizdevās nosūtīt. Vari arī rakstīt uz",
    ru: "Не удалось отправить. Можно написать на",
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
