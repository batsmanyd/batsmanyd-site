import { NextRequest, NextResponse } from "next/server";

const APPLICATIONS_CHANNEL_ID = "-1004260640319";
const PUBLIC_CHANNEL_URL = "https://t.me/dudkovskii_ai";

const menuKeyboard = {
  keyboard: [
    [{ text: "🌐 Нужен сайт" }, { text: "🤖 Telegram-бот / Mini App" }],
    [{ text: "📣 Реклама" }, { text: "⚙️ Автоматизация" }],
    [{ text: "🔎 Бесплатный разбор" }, { text: "📂 Примеры работ" }],
    [{ text: "📢 Канал" }, { text: "☎️ Связаться" }],
    [{ text: "📱 Поделиться номером", request_contact: true }],
  ],
  resize_keyboard: true,
  is_persistent: true,
  input_field_placeholder: "Выберите нужный раздел",
};

const serviceFlows: Record<string, { service: string; prompt: string }> = {
  "🌐 Нужен сайт": {
    service: "Создание или переделка сайта",
    prompt:
      "Опишите задачу одним сообщением: чем занимается бизнес, какой сайт нужен и пришлите ссылку на существующий сайт, если он есть.",
  },
  "🤖 Telegram-бот / Mini App": {
    service: "Telegram-бот / Mini App",
    prompt:
      "Опишите одним сообщением: что должен делать бот или Mini App, кто им будет пользоваться и какой результат нужен.",
  },
  "📣 Реклама": {
    service: "Реклама",
    prompt:
      "Укажите одним сообщением: площадку, нишу, регион, текущий бюджет и главную задачу по рекламе.",
  },
  "⚙️ Автоматизация": {
    service: "Автоматизация",
    prompt:
      "Опишите одним сообщением текущий процесс: что сейчас делается вручную, где теряются время или заявки и какой результат нужен.",
  },
  "🔎 Бесплатный разбор": {
    service: "Бесплатный разбор",
    prompt:
      "Пришлите ссылку на сайт и одним сообщением напишите, что хотите улучшить: скорость, заявки, реклама, ИИ-поиск или другое.",
  },
  "☎️ Связаться": {
    service: "Связаться с Юрием",
    prompt:
      "Кратко опишите задачу и укажите удобный контакт или время связи. Ваш Telegram уже будет приложен к заявке автоматически.",
  },
};

const promptToService = Object.fromEntries(
  Object.values(serviceFlows).map(({ service, prompt }) => [prompt, service]),
) as Record<string, string>;

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function sendMessage(chatId: number | string, text: string, replyMarkup?: unknown) {
  return telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    reply_markup: replyMarkup,
  });
}

async function copyMessage(chatId: number | string, fromChatId: number | string, messageId: number) {
  return telegramApi("copyMessage", {
    chat_id: chatId,
    from_chat_id: fromChatId,
    message_id: messageId,
  });
}

function forceReply(placeholder: string) {
  return {
    force_reply: true,
    selective: true,
    input_field_placeholder: placeholder,
  };
}

function linkKeyboard(text: string, url: string) {
  return {
    inline_keyboard: [[{ text, url }]],
  };
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    if (update?.channel_post?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const message = update?.message;
    if (!message?.chat?.id) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = String(message.text || message.caption || "").trim();
    const username = message.from?.username ? `@${message.from.username}` : "не указан";
    const name = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") || "не указано";

    if (message.contact?.phone_number) {
      const phone = String(message.contact.phone_number);
      const contactName = [message.contact.first_name, message.contact.last_name].filter(Boolean).join(" ") || name;

      await sendMessage(
        APPLICATIONS_CHANNEL_ID,
        `📱 НОВЫЙ КОНТАКТ ИЗ БОТА\n\nИмя: ${contactName}\nТелефон: ${phone}\nTelegram: ${username}\nChat ID: ${chatId}`,
      );

      await sendMessage(
        chatId,
        "Спасибо. Номер телефона передан Юрию. Он свяжется с вами.",
        menuKeyboard,
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/start" || text === "/menu" || text === "◀️ Главное меню") {
      await sendMessage(
        chatId,
        "Здравствуйте. Выберите, что вам нужно. После выбора бот задаст один вопрос и передаст оформленную заявку Юрию.",
        menuKeyboard,
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/help") {
      await sendMessage(
        chatId,
        "Как пользоваться ботом:\n1. Выберите раздел кнопкой.\n2. Ответьте одним сообщением на уточняющий вопрос.\n3. Заявка поступит Юрию.\n\n/menu — открыть меню\n/cancel — отменить заполнение",
        menuKeyboard,
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/cancel") {
      await sendMessage(chatId, "Заполнение отменено. Выберите другой раздел:", menuKeyboard);
      return NextResponse.json({ ok: true });
    }

    if (text === "📢 Канал") {
      await sendMessage(
        chatId,
        "Канал с проектами, разборами сайтов, рекламой и ИИ-автоматизацией:",
        linkKeyboard("Открыть канал", PUBLIC_CHANNEL_URL),
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "📂 Примеры работ") {
      await sendMessage(
        chatId,
        "Примеры проектов и рабочие разборы публикуются здесь:",
        linkKeyboard("Посмотреть примеры", PUBLIC_CHANNEL_URL),
      );
      return NextResponse.json({ ok: true });
    }

    const selectedFlow = serviceFlows[text];
    if (selectedFlow) {
      await sendMessage(
        chatId,
        selectedFlow.prompt,
        forceReply("Опишите задачу одним сообщением"),
      );
      return NextResponse.json({ ok: true });
    }

    const repliedPrompt = String(message.reply_to_message?.text || "").trim();
    const service = promptToService[repliedPrompt];

    if (service) {
      const hasAttachment = Boolean(
        message.photo || message.document || message.video || message.voice || message.audio || message.animation,
      );

      await sendMessage(
        APPLICATIONS_CHANNEL_ID,
        `📩 НОВАЯ ЗАЯВКА\n\nУслуга: ${service}\nИмя: ${name}\nTelegram: ${username}\nChat ID: ${chatId}\n\nОписание:\n${text || "Вложение отправлено следующим сообщением"}`,
      );

      if (hasAttachment) {
        await copyMessage(APPLICATIONS_CHANNEL_ID, chatId, message.message_id);
      }

      await sendMessage(
        chatId,
        `Готово. Заявка по разделу «${service}» передана Юрию. При необходимости нажмите «📱 Поделиться номером».`,
        menuKeyboard,
      );
      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/")) {
      await sendMessage(chatId, "Такой команды нет. Используйте /menu или кнопки ниже.", menuKeyboard);
      return NextResponse.json({ ok: true });
    }

    await sendMessage(
      chatId,
      "Чтобы сообщение не потерялось, сначала выберите нужный раздел кнопкой ниже, затем ответьте на уточняющий вопрос.",
      menuKeyboard,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
