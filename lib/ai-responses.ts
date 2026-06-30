const QUICK_QUESTIONS = [
  "Сколько стоит сайт?",
  "Нужна реклама",
  "Внедрение n8n",
  "Автоматизация Google",
  "Бесплатный аудит",
] as const;

type Message = { role: "user" | "bot"; text: string };

function matchResponse(input: string): string {
  const q = input.toLowerCase();

  if (q.includes("аудит") || q.includes("разбор")) {
    return "Оставьте ссылку на сайт в блоке «Экспресс-аудит» — разберу за 24 часа бесплатно: конверсия, UX, скорость и точки потери заявок.";
  }

  if (
    q.includes("n8n") ||
    q.includes("н8н") ||
    (q.includes("внедр") && q.includes("n8n"))
  ) {
    return (
      "Внедрение n8n под ваши процессы:\n\n" +
      "• Аудит рутины и карта автоматизаций\n" +
      "• Сценарии: заявки, CRM, уведомления, отчёты\n" +
      "• Интеграция с сайтом, мессенджерами и таблицами\n" +
      "• Тестирование, документация и обучение команды\n\n" +
      "Стоимость считается индивидуально под объём задач — напишите, что автоматизировать, и предложу план."
    );
  }

  if (
    q.includes("google") ||
    q.includes("гугл") ||
    q.includes("gmail") ||
    q.includes("таблиц") ||
    q.includes("sheets") ||
    q.includes("экосистем")
  ) {
    return (
      "Автоматизация в экосистеме Google — от 500 руб.:\n\n" +
      "• Почта Gmail — автообработка писем и заявок\n" +
      "• Google Таблицы — сбор данных, статусы, отчёты\n" +
      "• Подключение мессенджеров (Telegram, WhatsApp и др.)\n" +
      "• Дашборды для контроля процессов\n" +
      "• Автоотправка отчётов по работе систем\n" +
      "• Мониторинг и контроль автоматизаций\n\n" +
      "Всё связывается в единую систему — без ручной рутины."
    );
  }

  if (
    q.includes("tiktok") ||
    q.includes("тик ток") ||
    q.includes("meta") ||
    q.includes("facebook") ||
    q.includes("instagram") ||
    q.includes("фейсбук") ||
    q.includes("инстаграм") ||
    q.includes("реклам") ||
    q.includes("директ") ||
    q.includes("лид")
  ) {
    return (
      "Реклама и лидогенерация — от 300 руб. (настройка) + бюджет на каналы:\n\n" +
      "• Яндекс.Директ\n" +
      "• Google Ads\n" +
      "• Meta Ads (Facebook + Instagram)\n" +
      "• TikTok Ads — все регионы\n" +
      "• VK и Telegram Ads\n\n" +
      "Настраиваю трекинг, UTM и оптимизацию под стоимость заявки и ROI."
    );
  }

  if (q.includes("бот") || q.includes("ai") || (q.includes("автомат") && !q.includes("google"))) {
    return "AI-бот квалифицирует лидов 24/7, отвечает за 2–3 сек и передаёт тёплые заявки в CRM. Срок запуска — 7–10 дней. Стоимость — после уточнения сценария.";
  }

  if (q.includes("сайт") || q.includes("лендинг") || q.includes("next")) {
    return (
      "Сайт на Next.js — от 400 руб.:\n\n" +
      "• Быстрая загрузка и адаптив под мобильные\n" +
      "• Продающая структура и формы заявок\n" +
      "• Готовность к SEO и рекламе\n" +
      "• Срок — 2 дня\n\n" +
      "Могу начать с бесплатного аудита текущего сайта."
    );
  }

  if (q.includes("crm") || q.includes("заявк")) {
    return "Настрою путь заявки: сайт → Telegram → CRM → сделка. Время первого ответа — от 4 минут, потерянных лидов — 0%.";
  }

  if (q.includes("цен") || q.includes("стоим") || q.includes("бюджет") || q.includes("прайс")) {
    return (
      "Ориентиры по стоимости:\n\n" +
      "• Сайт — от 400 руб.\n" +
      "• Реклама (Meta, TikTok, Директ и др.) — от 300 руб. + бюджет\n" +
      "• Google-автоматизация — от 500 руб.\n" +
      "• n8n — индивидуально под задачу\n" +
      "• Аудит сайта — бесплатно\n\n" +
      "Напишите в форму заявки — предложу точный план."
    );
  }

  return "Расскажите подробнее о задаче — сайт, реклама, n8n, Google-автоматизация или всё вместе? Или оставьте заявку внизу страницы.";
}

export function getAiReply(userText: string): string {
  return matchResponse(userText);
}

export function getQuickQuestions(): readonly string[] {
  return QUICK_QUESTIONS;
}

export const AI_GREETING: Message = {
  role: "bot",
  text:
    "Привет! Я AI-помощник batsmanyd. Спросите о сайте (от 400 руб.), рекламе (Meta, TikTok — от 300 руб.), n8n или автоматизации Google (от 500 руб.) — или выберите вопрос ниже.",
};