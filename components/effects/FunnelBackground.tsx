"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const RINGS = [
  { size: 520, opacity: 0.12, duration: 28, x: "12%", y: "18%" },
  { size: 380, opacity: 0.1, duration: 22, x: "72%", y: "55%" },
  { size: 280, opacity: 0.14, duration: 18, x: "45%", y: "78%" },
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


        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
    </div>
  );
}