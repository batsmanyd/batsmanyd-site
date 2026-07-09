"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  formatRuPhone,
  handlePhoneKeyDown,
  isRuPhoneComplete,
} from "@/lib/phone-mask";

type AuditFormData = {
  website: string;
  name: string;
  phone: string;
  contact: string;
};

function validatePhone(value: string): true | string {
  if (!isRuPhoneComplete(value)) return "Введите телефон в международном формате: +375..., +7...";
  return true;
}

export function AuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormData>({
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: AuditFormData) => {
    setServerError(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error ?? "Ошибка отправки. Попробуйте позже.");
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Нет соединения с сервером. Проверьте интернет и попробуйте снова.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <CheckCircle2 className="h-12 w-12 text-brick-light" />
          <h3 className="mt-4 font-display text-xl font-semibold">
            Заявка принята!
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Разберу ваш сайт в течение 24 часов и пришлю персональные
            рекомендации на указанный контакт.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="audit-website" className="mb-1.5 block text-sm font-medium text-foreground">
              Адрес сайта
            </label>
            <input
              id="audit-website"
              type="url"
              placeholder="https://example.by"
              className="input-field"
              {...register("website", {
                required: "Укажите адрес сайта",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Введите корректный URL (https://...)",
                },
              })}
            />
            {errors.website && (
              <p className="mt-1 text-xs text-red">{errors.website.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="audit-name" className="mb-1.5 block text-sm font-medium text-foreground">
              Ваше имя
            </label>
            <input
              id="audit-name"
              type="text"
              autoComplete="name"
              placeholder="Как к вам обращаться"
              className="input-field"
              {...register("name", { required: "Укажите имя" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="audit-phone" className="mb-1.5 block text-sm font-medium text-foreground">
              Номер телефона
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Укажите номер телефона",
                validate: validatePhone,
              }}
              render={({ field }) => (
                <input
                  id="audit-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+375 29 123-45-67"
                  className="input-field"
                  value={field.value}
                  onBlur={field.onBlur}
                  onKeyDown={handlePhoneKeyDown}
                  onChange={(e) => {
                    field.onChange(formatRuPhone(e.target.value));
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData("text");
                    field.onChange(formatRuPhone(pasted));
                  }}
                />
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="audit-contact" className="mb-1.5 block text-sm font-medium text-foreground">
              Telegram или email
            </label>
            <input
              id="audit-contact"
              type="text"
              placeholder="@username или email@example.com"
              className="input-field"
              {...register("contact", { required: "Укажите контакт для связи" })}
            />
            {errors.contact && (
              <p className="mt-1 text-xs text-red">{errors.contact.message}</p>
            )}
          </div>

          {serverError && (
            <div className="flex items-start gap-2 rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Отправляем...
              </>
            ) : (
              "Получить бесплатный аудит"
            )}
          </Button>

          <p className="text-center text-xs text-muted/70">
            Никакого спама. Только персональный разбор вашего сайта.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}