"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/lib/site-context";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  User,
  Phone,
  MessageCircle,
  FileText,
  AlertCircle,
  ClipboardList,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  formatRuPhone,
  handlePhoneKeyDown,
  isRuPhoneComplete,
} from "@/lib/phone-mask";

type ContactFormData = {
  name: string;
  phone: string;
  contact: string;
  message: string;
};

function validatePhone(value: string): true | string {
  if (!isRuPhoneComplete(value)) return "Введите номер полностью: +7 (999) 123-45-67";
  return true;
}

function Field({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
      >
        <Icon className="h-4 w-4 text-brick-light" />
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-red"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { quizMessage } = useSite();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: { phone: "", message: "" },
  });

  useEffect(() => {
    if (quizMessage) {
      setValue("message", quizMessage, { shouldValidate: true });
    }
  }, [quizMessage, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
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
    <div className="google-panel mx-auto max-w-2xl rounded-3xl bg-surface-elevated">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-8 py-16 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/15">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
              Заявка отправлена!
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Получил вашу заявку. Вот что будет дальше:
            </p>

            <div className="mt-8 w-full max-w-sm space-y-0 text-left">
              {[
                { icon: CheckCircle2, label: "Заявка получена", time: "Сейчас", done: true },
                { icon: ClipboardList, label: "Изучаю вашу задачу", time: "В течение 2 ч", done: false },
                { icon: MessageSquare, label: "Свяжусь с вами", time: "Сегодня", done: false },
                { icon: Calendar, label: "Предложу план действий", time: "На созвоне", done: false },
              ].map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                  className="relative flex gap-3 pb-5 last:pb-0"
                >
                  {i < 3 && (
                    <span className="absolute left-[15px] top-8 h-full w-px bg-white/10" />
                  )}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-green-500/20 text-green-400"
                        : "border border-white/10 bg-white/5 text-muted"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-medium ${step.done ? "text-foreground" : "text-muted"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted/70">{step.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8"
          >
            <div className="mb-6 text-center sm:text-left">
              <p className="text-sm text-muted">
                Заполните форму — отвечу в течение рабочего дня
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="contact-name" label="Ваше имя" icon={User} error={errors.name?.message}>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Иван"
                    className="input-field"
                    {...register("name", {
                      required: "Укажите имя",
                      minLength: { value: 2, message: "Минимум 2 символа" },
                    })}
                  />
                </Field>

                <Field
                  id="contact-phone"
                  label="Номер телефона"
                  icon={Phone}
                  error={errors.phone?.message}
                >
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Укажите номер телефона",
                      validate: validatePhone,
                    }}
                    render={({ field }) => (
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="+7 (999) 123-45-67"
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
                </Field>
              </div>

              <Field
                id="contact-contact"
                label="Telegram или email"
                icon={MessageCircle}
                error={errors.contact?.message}
              >
                <input
                  id="contact-contact"
                  type="text"
                  autoComplete="email"
                  placeholder="@username или email@mail.ru"
                  className="input-field"
                  {...register("contact", {
                    required: "Укажите Telegram или email",
                    minLength: { value: 3, message: "Минимум 3 символа" },
                  })}
                />
              </Field>

              <Field
                id="contact-message"
                label="Опишите задачу"
                icon={FileText}
                error={errors.message?.message}
              >
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Что нужно сделать, какой результат ожидаете, есть ли сроки..."
                  className="input-field resize-none"
                  {...register("message", {
                    required: "Расскажите о задаче",
                    minLength: { value: 10, message: "Минимум 10 символов" },
                  })}
                />
              </Field>
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-start gap-2 rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              variant="primary"
              className="mt-6 w-full !py-4 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Отправляем заявку...
                </>
              ) : (
                "Оставить заявку"
              )}
            </Button>

            <p className="mt-4 text-center text-xs text-muted/60">
              Нажимая кнопку, вы соглашаетесь на обработку данных для связи по заявке
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}