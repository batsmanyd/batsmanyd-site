"use client";

import { guarantees } from "@/lib/wow-content";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Guarantees() {
  return (
    <AnimatedSection className="border-y border-white/5 bg-white/[0.02] py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 sm:gap-6 sm:px-8">
        {guarantees.map((g) => (
          <div key={g.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brick/15 text-brick-light">
              <g.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">{g.title}</p>
            <p className="mt-0.5 text-xs text-muted">{g.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}