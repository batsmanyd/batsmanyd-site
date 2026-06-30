"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, ArrowRight, Calculator } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

function formatNum(n: number): string {
  return Math.round(n).toLocaleString("ru-RU");
}

type SliderFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
};

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: SliderFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="font-display text-sm font-bold text-brick-light">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider w-full"
      />
    </div>
  );
}

export function LossCalculator() {
  const [visitors, setVisitors] = useState(2000);
  const [conversion, setConversion] = useState(1.2);
  const [targetConversion, setTargetConversion] = useState(3.5);

  const result = useMemo(() => {
    const currentLeads = visitors * (conversion / 100);
    const potentialLeads = visitors * (targetConversion / 100);
    const lostLeads = Math.max(0, potentialLeads - currentLeads);
    const conversionGap =
      targetConversion > 0
        ? Math.round(((targetConversion - conversion) / targetConversion) * 100)
        : 0;
    const lostLeadsPct =
      potentialLeads > 0 ? Math.round((lostLeads / potentialLeads) * 100) : 0;
    const growthPotential =
      conversion > 0
        ? Math.round(((targetConversion - conversion) / conversion) * 100)
        : 0;
    const funnelEfficiency =
      targetConversion > 0
        ? Math.round((conversion / targetConversion) * 100)
        : 0;

    return {
      currentLeads,
      lostLeads,
      conversionGap,
      lostLeadsPct,
      growthPotential,
      funnelEfficiency,
    };
  }, [visitors, conversion, targetConversion]);

  return (
    <AnimatedSection id="calculator" sectionId="calculator" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge="Калькулятор"
          title="Сколько вы теряете без системы продаж?"
          description="Подвиньте ползунки — увидите разрыв в конверсии и упущенный потенциал в процентах."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="google-panel space-y-6 rounded-3xl bg-surface-elevated p-6 sm:p-8">
            <SliderField
              id="calc-visitors"
              label="Визитов на сайт в месяц"
              value={visitors}
              min={200}
              max={20000}
              step={100}
              display={formatNum(visitors)}
              onChange={setVisitors}
            />
            <SliderField
              id="calc-conversion"
              label="Текущая конверсия в заявку"
              value={conversion}
              min={0.3}
              max={5}
              step={0.1}
              display={`${conversion.toFixed(1)}%`}
              onChange={setConversion}
            />
            <SliderField
              id="calc-target"
              label="Целевая конверсия"
              value={targetConversion}
              min={1}
              max={8}
              step={0.1}
              display={`${targetConversion.toFixed(1)}%`}
              onChange={setTargetConversion}
            />
            <p className="text-xs text-muted/70">
              * Целевая конверсия — реалистичный показатель для оптимизированного сайта с рекламой.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <motion.div
              key={`${visitors}-${conversion}-${targetConversion}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className="google-panel rounded-3xl bg-gradient-to-br from-red/10 via-surface-elevated to-brick/10 p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-red">
                <TrendingDown className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Ваши потери
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-muted">Разрыв конверсии до цели</p>
                  <p className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                    −{result.conversionGap}%
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Сейчас {conversion}% → цель {targetConversion}%
                  </p>
                </div>

                <div className="border-t border-white/5 pt-5">
                  <p className="text-sm text-muted">Упущено заявок от потенциала</p>
                  <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                    −{result.lostLeadsPct}%
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    ~{formatNum(result.lostLeads)} заявок / мес не доходят до цели
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="google-stat-box px-4 py-3">
                    <p className="text-xs text-muted">Эффективность воронки</p>
                    <p className="font-display text-xl font-bold text-brick-light">
                      {result.funnelEfficiency}%
                    </p>
                  </div>
                  <div className="google-stat-box px-4 py-3">
                    <p className="text-xs text-muted">Потенциал роста</p>
                    <p className="font-display text-xl font-bold text-red">
                      +{result.growthPotential}%
                    </p>
                  </div>
                </div>
              </div>

              <Button href="#audit" variant="primary" className="mt-8 w-full">
                <Calculator className="h-4 w-4" />
                Получить бесплатный аудит
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}