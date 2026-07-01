"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { buildQuizRecommendation, quizSteps } from "@/lib/wow-content";
import { useSite } from "@/lib/site-context";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
export function ServiceQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const { setQuizMessage } = useSite();

  const current = quizSteps[step];
  const progress = done ? 100 : ((step + 1) / quizSteps.length) * 100;
  const result = done ? buildQuizRecommendation(answers) : null;

  const select = (optionId: string) => {
    const next = { ...answers, [current.id]: optionId };
    setAnswers(next);
    if (step < quizSteps.length - 1) {
      setStep((s) => s + 1);
    } else {
      const rec = buildQuizRecommendation(next);
      setQuizMessage(rec.message);
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setQuizMessage(null);
  };

  return (
    <AnimatedSection id="quiz" sectionId="quiz" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          badge="Подбор за 1 минуту"
          title="Что вам нужно?"
          description="Ответьте на 4 вопроса — подберу направления и предзаполню форму заявки."
          align="center"
        />

        <div className="google-panel mt-10 rounded-3xl bg-surface-elevated p-6 sm:p-8">
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-brick to-red"
            />
          </div>

          <AnimatePresence mode="wait">
            {!done && current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brick-light">
                  Вопрос {step + 1} из {quizSteps.length}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">
                  {current.question}
                </h3>
                <div className="mt-6 grid gap-3">
                  {current.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => select(opt.id)}
                      className="google-stat-box px-4 py-3.5 text-left text-sm font-medium text-foreground transition-all hover:bg-[rgba(66,133,244,0.08)]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brick/20">
                  <Sparkles className="h-7 w-7 text-brick-light" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold">{result.title}</h3>
                <p className="mt-2 text-sm text-muted">Рекомендую начать с:</p>
                <ul className="mt-4 space-y-2">
                  {result.services.map((s) => (
                    <li
                      key={s}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brick/20 bg-brick/5 px-4 py-2.5 text-sm font-medium text-foreground"
                    >
                      <Check className="h-4 w-4 text-brick-light" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button href="#contact" variant="primary">
                    Оставить заявку
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="secondary" onClick={reset}>
                    Пройти заново
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedSection>
  );
}