import { NextResponse } from "next/server";
import {
  formatAuditMessage,
  sendTelegramMessage,
  type AuditPayload,
} from "@/lib/telegram";

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}

function validatePayload(body: unknown): AuditPayload | null {
  if (!body || typeof body !== "object") return null;

  const { website, name, phone, contact } = body as Record<string, unknown>;

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

    const text = formatAuditMessage(payload);
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