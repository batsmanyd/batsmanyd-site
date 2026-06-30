"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MousePointerClick, Eye, UserPlus, Handshake } from "lucide-react";

const METRICS = ["+245%", "−67%", "72%", "ROI +340%", "100%"];

const RINGS = [
  { size: 520, opacity: 0.12, duration: 28, x: "12%", y: "18%" },
  { size: 380, opacity: 0.1, duration: 22, x: "72%", y: "55%" },
  { size: 280, opacity: 0.14, duration: 18, x: "45%", y: "78%" },
];

const STAGES = [
  { icon: MousePointerClick, label: "Клик", x: "18%", y: "32%" },
  { icon: Eye, label: "Визит", x: "38%", y: "48%" },
  { icon: UserPlus, label: "Заявка", x: "58%", y: "38%" },
  { icon: Handshake, label: "Сделка", x: "78%", y: "58%" },
];

export function FunnelBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, -12]);
  const driftY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        style={{ rotateY, rotateX, y: driftY }}
        className="absolute inset-0 [perspective:1200px]"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {RINGS.map((ring, i) => (
            <motion.div
              key={ring.size}
              animate={{ rotateZ: 360 }}
              transition={{
                duration: ring.duration,
                repeat: Infinity,
                ease: "linear",
              }}
              className="funnel-bg-animate absolute rounded-full border border-brick/30"
              style={{
                width: ring.size,
                height: ring.size,
                left: ring.x,
                top: ring.y,
                opacity: ring.opacity,
                transform: `translateZ(${-80 + i * 40}px) rotateX(65deg)`,
                boxShadow: "0 0 60px rgba(196, 92, 62, 0.08), inset 0 0 40px rgba(229, 62, 62, 0.05)",
              }}
            />
          ))}

          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.label}
              animate={{ y: [0, -12, 0], opacity: [0.35, 0.65, 0.35] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
              className="absolute flex flex-col items-center gap-1"
              style={{
                left: stage.x,
                top: stage.y,
                transform: `translateZ(${20 + i * 15}px)`,
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brick/25 bg-brick/10 backdrop-blur-sm">
                <stage.icon className="h-4 w-4 text-brick-light/80" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider text-brick-light/50">
                {stage.label}
              </span>
            </motion.div>
          ))}

          {METRICS.map((metric, i) => (
            <motion.span
              key={metric}
              animate={{
                y: [0, -18, 0],
                opacity: [0.15, 0.45, 0.15],
              }}
              transition={{
                duration: 7 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
              className="absolute font-display text-sm font-bold text-brick-light/40 sm:text-base"
              style={{
                left: `${10 + i * 17}%`,
                top: `${20 + (i % 3) * 22}%`,
                transform: `translateZ(${30 + i * 8}px)`,
                textShadow: "0 0 24px rgba(196, 92, 62, 0.25)",
              }}
            >
              {metric}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
    </div>
  );
}