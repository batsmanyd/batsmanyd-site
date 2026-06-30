import {
  Globe,
  Megaphone,
  Workflow,
  Bot,
  BarChart3,
  Clock,
  Shield,
  MessageSquare,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export const heroAccents = [
  "с AI и рекламой",
  "с CRM-автоматизацией",
  "с лидогенерацией",
  "с аналитикой ROI",
  "под ключ за 2 дня",
] as const;

export type Guarantee = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const guarantees: Guarantee[] = [
  {
    icon: Clock,
    title: "Аудит за 24 часа",
    description: "Персональный разбор, не автоматический скан",
  },
  {
    icon: MessageSquare,
    title: "Ответ в день заявки",
    description: "Связываюсь в рабочее время без задержек",
  },
  {
    icon: Shield,
    title: "Поддержка 30 дней",
    description: "После запуска сайта — техпомощь включена",
  },
  {
    icon: LineChart,
    title: "Прозрачная отчётность",
    description: "Видите цифры по каналам и воронке",
  },
];

export type Testimonial = {
  name: string;
  niche: string;
  quote: string;
  metric: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Алексей В.",
    niche: "Строительство",
    quote: "Сайт запустили за 2 дня, конверсия выросла в 3.5 раза. Реклама окупилась на второй неделе.",
    metric: "конверсия +245%",
    initials: "АВ",
  },
  {
    name: "Марина К.",
    niche: "Клиника",
    quote: "CPL упал на 67%, заявки выросли в 4 раза. Наконец вижу, откуда приходят клиенты.",
    metric: "CPL −67%",
    initials: "МК",
  },
  {
    name: "Дмитрий С.",
    niche: "B2B-логистика",
    quote: "Ни одна заявка не теряется — Telegram, CRM, SLA. Менеджеры работают по процессу.",
    metric: "0% потерь",
    initials: "ДС",
  },
  {
    name: "Елена Р.",
    niche: "Онлайн-школа",
    quote: "AI-бот закрывает 72% диалогов. Менеджеры занимаются продажами, а не FAQ.",
    metric: "заявки +31%",
    initials: "ЕР",
  },
  {
    name: "Игорь П.",
    niche: "E-commerce",
    quote: "Сквозная аналитика показала, куда уходит 40% бюджета. Перераспределили — ROI +180%.",
    metric: "ROI +180%",
    initials: "ИП",
  },
];

export type TechItem = {
  name: string;
  abbr: string;
  description: string;
  color: string;
};

export const techStack: TechItem[] = [
  {
    name: "Next.js",
    abbr: "NX",
    description: "Быстрые сайты с SEO и готовностью к рекламе",
    color: "from-white/20 to-white/5",
  },
  {
    name: "n8n",
    abbr: "n8",
    description: "Автоматизация процессов без ручной рутины",
    color: "from-orange-500/25 to-orange-600/10",
  },
  {
    name: "amoCRM",
    abbr: "amo",
    description: "Путь заявки от клика до сделки",
    color: "from-blue-500/25 to-blue-600/10",
  },
  {
    name: "Meta Ads",
    abbr: "Meta",
    description: "Facebook + Instagram — лидогенерация",
    color: "from-indigo-500/25 to-indigo-600/10",
  },
  {
    name: "Google Ads",
    abbr: "G",
    description: "Поиск и Performance Max под ROI",
    color: "from-green-500/25 to-green-600/10",
  },
  {
    name: "OpenAI",
    abbr: "AI",
    description: "Боты квалификации и автоответы 24/7",
    color: "from-emerald-500/25 to-emerald-600/10",
  },
  {
    name: "Яндекс.Метрика",
    abbr: "М",
    description: "Сквозная аналитика и цели на сайте",
    color: "from-yellow-500/25 to-yellow-600/10",
  },
  {
    name: "TikTok Ads",
    abbr: "TT",
    description: "Все регионы — охват и лиды",
    color: "from-pink-500/25 to-pink-600/10",
  },
];

export type BeforeAfterCase = {
  id: string;
  label: string;
  icon: LucideIcon;
  beforeItems: string[];
  afterItems: string[];
  metric: string;
};

export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: "site",
    label: "Сайт",
    icon: Globe,
    beforeItems: [
      "Загрузка 4.2 сек",
      "Конверсия 1.1%",
      "Нет мобильной оптимизации",
      "Форма без трекинга",
    ],
    afterItems: [
      "Загрузка 0.8 сек (−81%)",
      "Конверсия 3.8% (+245%)",
      "PageSpeed 96",
      "Заявки в CRM за 2 мин",
    ],
    metric: "+245% конверсия",
  },
  {
    id: "ads",
    label: "Реклама",
    icon: Megaphone,
    beforeItems: [
      "CPL на 67% выше нормы",
      "Нет UTM и целей",
      "Бюджет без атрибуции",
      "Слив на нерабочие каналы",
    ],
    afterItems: [
      "CPL −67% за 30 дней",
      "Заявки +422%",
      "ROI +340%",
      "Оптимизация еженедельно",
    ],
    metric: "ROI +340%",
  },
  {
    id: "crm",
    label: "CRM",
    icon: Workflow,
    beforeItems: [
      "23% лидов без ответа",
      "Ответ через 2+ часа",
      "Хаос в статусах",
      "Нет воронки в реальном времени",
    ],
    afterItems: [
      "100% обработка заявок",
      "Ответ за 4 мин (−78%)",
      "Telegram + amoCRM",
      "Конверсия в сделку +158%",
    ],
    metric: "0% потерь",
  },
  {
    id: "ai",
    label: "AI-бот",
    icon: Bot,
    beforeItems: [
      "80% времени на FAQ",
      "Ответ через часы",
      "Лиды без квалификации",
      "Нет интеграции с CRM",
    ],
    afterItems: [
      "Бот закрывает 72% диалогов",
      "Ответ за 2.4 сек",
      "Квалификация 87%",
      "Заявки +31%",
    ],
    metric: "−72% рутины",
  },
];

export type QuizOption = {
  id: string;
  label: string;
};

export const quizSteps = [
  {
    id: "goal",
    question: "Какая главная цель?",
    options: [
      { id: "site", label: "Новый сайт или редизайн" },
      { id: "ads", label: "Запуск рекламы и лиды" },
      { id: "automation", label: "Автоматизация и AI" },
      { id: "full", label: "Всё вместе — система продаж" },
    ],
  },
  {
    id: "niche",
    question: "Ваша ниша?",
    options: [
      { id: "services", label: "Услуги / B2B" },
      { id: "ecom", label: "E-commerce" },
      { id: "medical", label: "Медицина / красота" },
      { id: "education", label: "Образование" },
      { id: "other", label: "Другое" },
    ],
  },
  {
    id: "timeline",
    question: "Когда нужен результат?",
    options: [
      { id: "urgent", label: "Срочно — до 2 недель" },
      { id: "month", label: "В течение месяца" },
      { id: "plan", label: "Планирую наперёд" },
    ],
  },
  {
    id: "status",
    question: "Что есть сейчас?",
    options: [
      { id: "nothing", label: "С нуля" },
      { id: "site-only", label: "Есть сайт, нет рекламы" },
      { id: "ads-only", label: "Есть реклама, слабый сайт" },
      { id: "chaos", label: "Всё есть, но хаос" },
    ],
  },
] as const;

export const sectionNavItems = [
  { id: "hero", href: "#hero", label: "Главная" },
  { id: "services", href: "#services", label: "Услуги" },
  { id: "showcase", href: "#showcase", label: "Кейсы" },
  { id: "quiz", href: "#quiz", label: "Квиз" },
  { id: "calculator", href: "#calculator", label: "Калькулятор" },
  { id: "roi", href: "#roi", label: "ROI" },
  { id: "audit", href: "#audit", label: "Аудит" },
  { id: "contact", href: "#contact", label: "Заявка" },
] as const;

export type SectionId = (typeof sectionNavItems)[number]["id"];

export const sectionAiHints: Record<SectionId, string> = {
  hero: "Привет! Расскажу, как превратить сайт в систему продаж. Спросите о сроках или бесплатном аудите.",
  services: "Вижу, вы смотрите услуги — могу подсказать, с чего начать в вашей нише. Сайт, реклама или AI?",
  showcase: "Интересуют результаты? Могу разобрать похожий кейс для вашей ниши — оставьте заявку.",
  quiz: "Пройдите квиз — подберу оптимальный пакет услуг под вашу задачу.",
  calculator: "Калькулятор показывает потери в процентах. Хотите оценку, какой рост конверсии реалистичен для вашей ниши?",
  roi: "ROI-калькулятор — позитивная сторона. Спросите, какой рост реалистичен для вашей ниши.",
  audit: "Бесплатный аудит за 24 часа — оставьте ссылку на сайт, разберу лично.",
  contact: "Готовы начать? Опишите задачу в форме — отвечу в течение рабочего дня.",
};

export function buildQuizRecommendation(answers: Record<string, string>): {
  title: string;
  services: string[];
  message: string;
} {
  const goal = answers.goal ?? "full";
  const niche = answers.niche ?? "other";
  const timeline = answers.timeline ?? "month";
  const status = answers.status ?? "nothing";

  const nicheLabel =
    quizSteps[1].options.find((o) => o.id === niche)?.label ?? "бизнес";
  const timelineLabel =
    quizSteps[2].options.find((o) => o.id === timeline)?.label ?? "гибко";

  const services: string[] = [];
  if (goal === "site" || goal === "full" || status === "ads-only" || status === "nothing") {
    services.push("Сайт на Next.js (2 дня)");
  }
  if (goal === "ads" || goal === "full" || status === "site-only" || status === "chaos") {
    services.push("Реклама + лидогенерация");
  }
  if (goal === "automation" || goal === "full" || status === "chaos") {
    services.push("CRM + AI-автоматизация");
  }
  if (services.length === 0) services.push("Экспресс-аудит + стратегия");

  const unique = [...new Set(services)];

  return {
    title: `Рекомендация для: ${nicheLabel}`,
    services: unique,
    message: [
      "Задача из квиза на сайте:",
      `• Ниша: ${nicheLabel}`,
      `• Цель: ${quizSteps[0].options.find((o) => o.id === goal)?.label ?? goal}`,
      `• Срок: ${timelineLabel}`,
      `• Рекомендую: ${unique.join(", ")}`,
    ].join("\n"),
  };
}