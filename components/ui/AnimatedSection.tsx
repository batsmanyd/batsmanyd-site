"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSite } from "@/lib/site-context";
import { type SectionId } from "@/lib/wow-content";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: React.ReactNode;
  id?: string;
  sectionId?: SectionId;
  className?: string;
  delay?: number;
};

export function AnimatedSection({
  children,
  id,
  sectionId,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { registerSection } = useSite();

  useEffect(() => {
    if (!sectionId) return;
    registerSection(sectionId, ref.current);
    return () => registerSection(sectionId, null);
  }, [sectionId, registerSection]);

  return (
    <motion.section
      ref={ref}
      id={id ?? sectionId}
      data-section={sectionId}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative", className)}
    >
      {children}
    </motion.section>
  );
}