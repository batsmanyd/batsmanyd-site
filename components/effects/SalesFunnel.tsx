"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MousePointerClick,
  Eye,
  UserPlus,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: MousePointerClick, label: "Клик", pct: "100%" },
  { icon: Eye, label: "Визит", pct: "73%" },
  { icon: UserPlus, label: "Заявка", pct: "5.0%" },
  { icon: Handshake, label: "Сделка", pct: "28%" },
];

export function SalesFunnel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="google-panel mt-10 bg-white/[0.03] p-4 sm:p-5">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">
        Живая воронка продаж
      </p>
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center">
            <motion.div
              animate={{
                scale: active === i ? 1.05 : 1,
                borderColor: active === i ? "rgba(196, 92, 62, 0.6)" : "rgba(255,255,255,0.08)",
              }}
              className={cn(
                "flex w-full flex-col items-center rounded-xl border bg-white/[0.02] px-2 py-3 transition-colors sm:px-3",
                active === i && "bg-brick/10 shadow-lg shadow-brick/10",
              )}
            >
              <step.icon
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5",
                  active === i ? "text-brick-light" : "text-muted",
                )}
              />
              <span className="mt-1.5 text-[10px] font-medium text-muted sm:text-xs">
                {step.label}
              </span>
              <span className="font-display text-sm font-bold text-foreground sm:text-base">
                {step.pct}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <ArrowRight className="mx-0.5 h-3 w-3 shrink-0 text-white/20 sm:mx-1 sm:h-4 sm:w-4" />
            )}
          </div>
        ))}
      </div>
      <motion.div
        className="mt-3 h-1 overflow-hidden rounded-full bg-white/5"
        layout
      >
        <motion.div
          animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-brick to-red"
        />
      </motion.div>
    </div>
  );
}