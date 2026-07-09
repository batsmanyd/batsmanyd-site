import { NextResponse } from "next/server";
import {
  formatContactMessage,
  sendTelegramMessage,
  type ContactPayload,
} from "@/lib/telegram";

function validatePhone(phone: string): boolean {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");
  return /^\+?\d{7,15}$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

function validatePayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;

  const { name, phone, contact, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof contact !== "string" ||
    typeof message !== "string"
  ) {
    return null;
  }

  const trimmed = {
    name: name.trim(),
    phone: phone.trim(),
    contact: contact.trim(),
    message: message.trim(),
  };

  if (
    trimmed.name.length < 2 ||
    !validatePhone(trimmed.phone) ||
    trimmed.contact.length < 3 ||
    trimmed.message.length < 10
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

    const text = formatContactMessage(payload);
    await sendTelegramMessage(text);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте позже." },
      { status: 500 },
    );
  }
}