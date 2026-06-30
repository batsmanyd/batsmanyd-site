"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Process() {
  return (
    <AnimatedSection id="process" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge="Процесс"
          title="Как я превращаю сайт в систему продаж"
          description="Пошаговая методология: от аудита до масштабирования. Каждый этап измерим и привязан к бизнес-результату."
        />

        <div className="relative mt-16 border-t border-white/5 pt-20">
          <p className="mb-12 text-center font-display text-lg font-semibold text-foreground">
            6 шагов к результату
          </p>
          <div className="absolute left-8 top-28 hidden h-[calc(100%-7rem)] w-px bg-gradient-to-b from-brick/50 via-red/30 to-transparent lg:left-1/2 lg:block lg:-translate-x-px" />

          <div className="space-y-8 lg:space-y-12">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-stretch ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 min-w-0 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                    <div
                      className={`glass-card rounded-2xl p-6 sm:p-8 ${
                        isEven ? "lg:ml-auto lg:max-w-md" : "lg:mr-auto lg:max-w-md"
                      }`}
                    >
                      <span className="font-display text-sm font-bold text-brick-light">
                        {step.step}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brick/40 bg-background font-display text-sm font-bold text-brick-light shadow-lg shadow-brick/20 lg:flex">
                    {step.step}
                  </div>

                  <div className="hidden flex-1 lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}