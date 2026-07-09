import { NextResponse } from "next/server";
import {
  formatAuditMessage,
  sendTelegramMessage,
  type AuditPayload,
} from "@/lib/telegram";
import { auditWebsite, formatAuditResultForTelegram } from "@/lib/site-audit";

function validatePhone(phone: string): boolean {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");
  return /^\+?\d{7,15}$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

function validatePayload(body: unknown): AuditPayload | null {
  if (!body || typeof body !== "object") return null;

  const { website, name, phone, contact, company } = body as Record<string, unknown>;

  // Honeypot: обычный пользователь это поле не видит и не заполняет.
  if (typeof company === "string" && company.trim().length > 0) return null;

  if (
    typeof website !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof contact !== "string"
  ) {
    return null;
  }

  const trimmed = {
    website: website.trim(),
    name: name.trim(),
    phone: phone.trim(),
    contact: contact.trim(),
  };

  if (
    trimmed.name.length < 2 ||
    !validatePhone(trimmed.phone) ||
    trimmed.contact.length < 3 ||
    !/^https?:\/\/.+/.test(trimmed.website)
  ) {
    return null;
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = validatePayload(body);

    if (!payload) {
      return NextResponse.json(
        { error: "Проверьте правильность заполнения полей" },
        { status: 400 },
      );
    }

    let text = formatAuditMessage(payload);

    try {
      const audit = await auditWebsite(payload.website);
      text += formatAuditResultForTelegram(audit);
    } catch (auditError) {
      console.error("Website auto-audit error:", auditError);
      text += "\n\n⚠️ <b>Авто-аудит:</b> не удалось выполнить автоматически. Заявка сохранена, сайт нужно проверить вручную.";
    }

    await sendTelegramMessage(text);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Audit form error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте позже." },
      { status: 500 },
    );
  }
}