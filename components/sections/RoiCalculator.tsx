"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export function RoiCalculator() {
  const [conversion, setConversion] = useState(1.2);
  const [growth, setGrowth] = useState(150);
  const [leadGrowth, setLeadGrowth] = useState(65);

  const result = useMemo(() => {
    const newConversion = conversion * (1 + growth / 100);
    const leadsIncrease = growth;
    const roiEstimate = Math.round(growth * (leadGrowth / 100) + growth * 0.4);
    const efficiencyGain = Math.round(
      ((newConversion - conversion) / Math.max(conversion, 0.1)) * 100,
    );

    return { newConversion, leadsIncrease, roiEstimate, efficiencyGain };
  }, [conversion, growth, leadGrowth]);

  return (
    <AnimatedSection id="roi" sectionId="roi" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge="Позитивный сценарий"
          title="Какой рост возможен"
          description="Пара к калькулятору потерь — оцените прирост конверсии и ROI в процентах."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="google-panel space-y-6 rounded-3xl bg-surface-elevated p-6 sm:p-8">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-foreground">Конверсия сейчас</span>
                <span className="font-bold text-brick-light">{conversion}%</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={5}
                step={0.1}
                value={conversion}
                onChange={(e) => setConversion(Number(e.target.value))}
                className="range-slider w-full"
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-foreground">Рост конверсии</span>
                <span className="font-bold text-green-400">+{growth}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={400}
                step={10}
                value={growth}
                onChange={(e) => setGrowth(Number(e.target.value))}
                className="range-slider w-full"
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-foreground">Доля заявок из рекламы</span>
                <span className="font-bold text-brick-light">{leadGrowth}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                step={5}
                value={leadGrowth}
                onChange={(e) => setLeadGrowth(Number(e.target.value))}
                className="range-slider w-full"
              />
            </div>
            <p className="text-xs text-muted/70">
              * Расчёт в процентах — без привязки к суммам. Реалистичный рост по кейсам: +150–245%.
            </p>
          </div>

          <motion.div
            key={`${result.newConversion}-${growth}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="google-panel flex flex-col justify-center rounded-3xl bg-green-500/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Потенциальный прирост
              </span>
            </div>

            <p className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
              +{result.leadsIncrease}%
            </p>
            <p className="text-sm text-muted">
              заявок при конверсии {result.newConversion.toFixed(1)}%
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="google-stat-box p-4">
                <p className="text-xs text-muted">ROI воронки</p>
                <p className="font-display text-2xl font-bold text-green-400">
                  +{result.roiEstimate}%
                </p>
              </div>
              <div className="google-stat-box p-4">
                <p className="text-xs text-muted">Рост эффективности</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  +{result.efficiencyGain}%
                </p>
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brick-light" />
              После оптимизации сайта и рекламы — по опыту клиентов +150–245% к конверсии
            </p>

            <Button href="#contact" variant="primary" className="mt-6 self-start">
              Хочу такой результат
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}