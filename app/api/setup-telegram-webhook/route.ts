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

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, drop_pending_updates: true }),
  });

  const result = await response.json();
  return NextResponse.json({ ...result, webhookUrl }, { status: response.ok ? 200 : 502 });
}
