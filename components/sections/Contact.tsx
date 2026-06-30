"use client";

import { contact } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ContactForm } from "@/components/forms/ContactForm";

export function Contact() {
  return (
    <AnimatedSection id="contact" sectionId="contact" className="py-24 sm:py-32">
      <div className="glow-orb left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-red/10" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge={contact.badge}
          title={contact.title}
          description={contact.description}
        />

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </AnimatedSection>
  );
}