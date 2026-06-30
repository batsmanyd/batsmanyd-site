import type { KeyboardEvent } from "react";

/** Извлекает только цифры и нормализует к формату 7XXXXXXXXXX */
export function normalizeRuPhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  } else if (digits.length > 0 && !digits.startsWith("7")) {
    digits = "7" + digits;
  }

  return digits.slice(0, 11);
}

/** Форматирует цифры в маску +7 (999) 123-45-67 */
export function formatRuPhone(value: string): string {
  const digits = normalizeRuPhoneDigits(value);
  if (digits.length === 0) return "";

  const local = digits.startsWith("7") ? digits.slice(1) : digits;

  if (local.length === 0) return "+7";
  if (local.length <= 3) return `+7 (${local}`;
  if (local.length <= 6) return `+7 (${local.slice(0, 3)}) ${local.slice(3)}`;
  if (local.length <= 8) {
    return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return `+7 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`;
}

export function isRuPhoneComplete(value: string): boolean {
  const digits = normalizeRuPhoneDigits(value);
  return digits.length === 11 && digits.startsWith("7");
}

const ALLOWED_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

export function handlePhoneKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (ALLOWED_KEYS.has(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}