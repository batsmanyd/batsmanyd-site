"use client";

import { useEffect, useRef } from "react";
import { useSite } from "@/lib/site-context";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { hero } from "@/lib/content";
import { heroAccents } from "@/lib/wow-content";
import { getTimeGreeting } from "@/lib/greeting";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { MeshBackground } from "@/components/effects/MeshBackground";
import { RotatingText } from "@/components/effects/RotatingText";
import { SalesFunnel } from "@/components/effects/SalesFunnel";
import { MiniAudit } from "@/components/effects/MiniAudit";
import { Magnetic } from "@/components/effects/Magnetic";

const liveStats = [
  { value: 127, suffix: "+", label: "проектов запущено" },
  { value: 2400, suffix: "+", label: "заявок клиентам" },
  { value: 100, suffix: "%", label: "ручной разбор" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerSection } = useSite();

  useEffect(() => {
    registerSection("hero", sectionRef.current);
    return () => registerSection("hero", null);
  }, [registerSection]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <CursorGlow containerRef={sectionRef} />
      <MeshBackground />
      <div className="glow-orb -left-32 top-20 h-[500px] w-[500px] bg-brick/20" />
      <div className="glow-orb -right-20 top-40 h-[400px] w-[400px] bg-red/15" />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={item} className="mb-6 flex flex-col items-center gap-2">
            <span className="text-xs text-muted/80">{getTimeGreeting()} — добро пожаловать</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted backdrop-blur-sm sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 text-brick-light" />
              {hero.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl"
          >
            {hero.title}
            <br />
            <span className="text-gradient">
              <RotatingText words={heroAccents} />
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg lg:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Magnetic>
              <Button href="#audit" variant="primary" className="w-full sm:w-auto">
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button href="#process" variant="secondary" className="w-full sm:w-auto">
                {hero.ctaSecondary}
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div variants={item}>
            <SalesFunnel />
          </motion.div>

          <motion.div variants={item}>
            <MiniAudit />
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-white/5 pt-10 sm:gap-8"
          >
            {liveStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-brick-light sm:text-3xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border border-white/20 p-1.5"
        >
          <div className="mx-auto h-2 w-1 rounded-full bg-brick" />
        </motion.div>
      </motion.div>
    </section>
  );
}