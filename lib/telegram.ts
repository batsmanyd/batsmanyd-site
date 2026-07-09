export type ContactPayload = {
  name: string;
  phone: string;
  contact: string;
  message: string;
};

export type AuditPayload = {
  website: string;
  name: string;
  phone: string;
  contact: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getSiteLabel(): string {
  return process.env.SITE_LABEL || process.env.NEXT_PUBLIC_SITE_URL || "batsmanyd-site";
}

export function formatContactMessage(data: ContactPayload): string {
  const now = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Minsk",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const siteLabel = escapeHtml(getSiteLabel());

  return [
    "🚀 <b>Новая заявка с сайта batsmanyd</b>",
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `👤 <b>Имя:</b> ${escapeHtml(data.name)}`,
    `📱 <b>Телефон:</b> ${escapeHtml(data.phone)}`,
    `💬 <b>Telegram / Email:</b> ${escapeHtml(data.contact)}`,
    "",
    "📝 <b>Задача:</b>",
    escapeHtml(data.message),
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `🕐 <i>${now} (Минск)</i>`,
    `🌐 <i>${siteLabel} → финальная форма</i>`,
  ].join("\n");
}

export function formatAuditMessage(data: AuditPayload): string {
  const now = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Minsk",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const siteLabel = escapeHtml(getSiteLabel());

  return [
    "🔍 <b>Заявка на экспресс-аудит</b>",
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `🌐 <b>Сайт:</b> ${escapeHtml(data.website)}`,
    `👤 <b>Имя:</b> ${escapeHtml(data.name)}`,
    `📱 <b>Телефон:</b> ${escapeHtml(data.phone)}`,
    `💬 <b>Telegram / Email:</b> ${escapeHtml(data.contact)}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `🕐 <i>${now} (Минск)</i>`,
    `🌐 <i>${siteLabel} → экспресс-аудит</i>`,
  ].join("\n");
}

export async function sendTelegramMessage(text: string): Promise<void> {
  // Настройка переменных в Vercel:
  // TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, опционально SITE_LABEL или NEXT_PUBLIC_SITE_URL
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.description ?? "Не удалось отправить сообщение в Telegram");
  }
}