"use client";

import { Check } from "lucide-react";
import { audit } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AuditForm } from "@/components/forms/AuditForm";

export function Audit() {
  return (
    <AnimatedSection id="audit" sectionId="audit" className="py-24 sm:py-32">
      <div className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-brick/5 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="google-panel rounded-3xl bg-surface-elevated">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <SectionHeading
                badge={audit.badge}
                title={audit.title}
                description={audit.description}
                align="left"
              />

              <ul className="mt-8 space-y-4">
                {audit.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brick/20">
                      <Check className="h-3 w-3 text-brick-light" />
                    </span>
                    <span className="text-sm text-muted sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/5 bg-background/50 p-8 sm:p-12 lg:border-l lg:border-t-0">
              <AuditForm />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}