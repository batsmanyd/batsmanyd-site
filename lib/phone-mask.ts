import type { KeyboardEvent } from "react";

/**
 * Нормализует телефон без привязки к одной стране.
 * Подходит для Беларуси (+375), России/Казахстана (+7) и других международных номеров.
 */
export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "").slice(0, 15);

  if (!digits) return "";
  return `${hasPlus ? "+" : "+"}${digits}`;
}

/**
 * Лёгкая маска: не ломает международные номера и не подставляет +7 насильно.
 */
export function formatPhone(value: string): string {
  return normalizePhone(value);
}

export function isPhoneComplete(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^\+?\d{7,15}$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
}

// Обратная совместимость для уже подключённых форм.
export const normalizeRuPhoneDigits = normalizePhone;
export const formatRuPhone = formatPhone;
export const isRuPhoneComplete = isPhoneComplete;

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
  if (!/^[\d+\-()\s]$/.test(e.key)) e.preventDefault();
}