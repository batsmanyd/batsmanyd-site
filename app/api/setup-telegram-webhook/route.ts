import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN is missing in Vercel" },
      { status: 500 },
    );
  }

  const origin = request.nextUrl.origin;
  const webhookUrl = `${origin}/api/telegram-webhook`;
  const apiUrl = `https://api.telegram.org/bot${token}`;

  const callTelegram = async (method: string, payload: Record<string, unknown>) => {
    const response = await fetch(`${apiUrl}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return { ok: response.ok && Boolean(result?.ok), result };
  };

  const webhook = await callTelegram("setWebhook", {
    url: webhookUrl,
    drop_pending_updates: true,
    allowed_updates: ["message", "channel_post"],
  });

  const commands = await callTelegram("setMyCommands", {
    commands: [
      { command: "start", description: "Запустить бота" },
      { command: "menu", description: "Открыть главное меню" },
      { command: "help", description: "Как пользоваться ботом" },
      { command: "cancel", description: "Отменить заполнение" },
    ],
  });

  const menuButton = await callTelegram("setChatMenuButton", {
    menu_button: { type: "commands" },
  });

  const ok = webhook.ok && commands.ok && menuButton.ok;

  return NextResponse.json(
    {
      ok,
      webhookUrl,
      webhook: webhook.result,
      commands: commands.result,
      menuButton: menuButton.result,
    },
    { status: ok ? 200 : 502 },
  );
}
