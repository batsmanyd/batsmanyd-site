import { NextRequest, NextResponse } from "next/server";

const keyboard = {
  keyboard: [
    [{ text: "🌐 Нужен сайт" }, { text: "🤖 Telegram-бот / Mini App" }],
    [{ text: "📣 Реклама" }, { text: "⚙️ Автоматизация" }],
    [{ text: "🔎 Бесплатный разбор" }, { text: "📂 Примеры работ" }],
    [{ text: "📢 Канал" }, { text: "☎️ Связаться" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

async function sendMessage(chatId: number | string, text: string, replyMarkup?: unknown) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      reply_markup: replyMarkup,
    }),
  });

  if (!response.ok) throw new Error(await response.text());
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    const message = update?.message;
    if (!message?.chat?.id) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = String(message.text || "").trim();
    const username = message.from?.username ? `@${message.from.username}` : "не указан";
    const name = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") || "не указано";

    if (text === "/start" || text === "/menu") {
      await sendMessage(
        chatId,
        "Здравствуйте. Я помогу выбрать решение для сайта, рекламы, Telegram и автоматизации. Нажмите нужный раздел:",
        keyboard,
      );
      return NextResponse.json({ ok: true });
    }

    const replies: Record<string, string> = {
      "🌐 Нужен сайт": "Опишите нишу, задачу и пришлите ссылку на существующий сайт, если он есть.",
      "🤖 Telegram-бот / Mini App": "Опишите, что должен делать бот или Mini App и кто будет им пользоваться.",
      "📣 Реклама": "Укажите площадку, нишу, регион и текущую задачу по рекламе.",
      "⚙️ Автоматизация": "Опишите текущий процесс и что сейчас приходится делать вручную.",
      "🔎 Бесплатный разбор": "Пришлите ссылку на сайт и кратко напишите, что хотите улучшить.",
      "📂 Примеры работ": "Примеры и разборы публикую в канале: https://t.me/dudkovskii_ai",
      "📢 Канал": "Канал с проектами и полезными материалами: https://t.me/dudkovskii_ai",
      "☎️ Связаться": "Напишите здесь задачу и удобный контакт. Юрий лично ответит вам.",
    };

    if (replies[text]) {
      await sendMessage(chatId, replies[text], keyboard);
      return NextResponse.json({ ok: true });
    }

    const ownerChatId = process.env.TELEGRAM_CHAT_ID;
    if (ownerChatId) {
      await sendMessage(
        ownerChatId,
        `📩 НОВОЕ СООБЩЕНИЕ ИЗ БОТА\n\nИмя: ${name}\nTelegram: ${username}\nChat ID: ${chatId}\n\nСообщение:\n${text || "[не текстовое сообщение]"}`,
      );
    }

    await sendMessage(chatId, "Спасибо. Сообщение передано Юрию. Он свяжется с вами.", keyboard);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
