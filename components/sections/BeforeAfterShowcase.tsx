"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { beforeAfterCases } from "@/lib/wow-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { cn } from "@/lib/utils";

export function BeforeAfterShowcase() {
  const [active, setActive] = useState(0);
  const current = beforeAfterCases[active];

  return (
    <AnimatedSection id="showcase" sectionId="showcase" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge="Результаты"
          title="До и после — потяните ползунок"
          description="Три направления, один принцип: измеримый рост заявок без слива бюджета."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {beforeAfterCases.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active === i
                  ? "border-brick/50 bg-brick/15 text-brick-light"
                  : "border-white/10 bg-white/5 text-muted hover:text-foreground",
              )}
            >
              <c.icon className="h-4 w-4" />
              {c.label}
              <span className="hidden text-xs text-muted sm:inline">· {c.metric}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div className="google-stat-box p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-red">
                  <X className="h-3 w-3" /> Было
                </p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {current.beforeItems.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
              <div className="google-stat-box p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-brick-light">
                  <Check className="h-3 w-3" /> Стало
                </p>
                <ul className="space-y-1.5 text-sm text-foreground">
                  {current.afterItems.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <BeforeAfter />
          </motion.div>
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}