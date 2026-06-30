"use client";

import { techStack } from "@/lib/wow-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

export function TechStack() {
  return (
    <AnimatedSection className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge="Стек"
          title="Инструменты, с которыми работаю"
          description="Наведите — узнайте, зачем это вам в проекте."
          align="center"
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="google-stat-box group relative overflow-hidden p-4 transition-all"
            >
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-foreground",
                  tech.color,
                )}
              >
                {tech.abbr}
              </div>
              <p className="font-semibold text-foreground">{tech.name}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-70 sm:group-hover:opacity-100">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}