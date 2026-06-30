"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed right-0 top-0 z-[60] h-full w-[3px] origin-top bg-gradient-to-b from-brick via-red to-transparent"
      style={{ scaleY }}
      aria-hidden
    />
  );
}