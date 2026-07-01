"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useSpring } from "framer-motion";

type CursorGlowProps = {
  containerRef: RefObject<HTMLElement | null>;
};

export function CursorGlow({ containerRef }: CursorGlowProps) {
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );

  const springConfig = { stiffness: 150, damping: 25, mass: 0.4 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, containerRef]);

  if (isTouch) {
    return (
      <>
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"], y: ["0%", "5%", "0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/4 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brick/15 blur-[100px]"
        />
        <motion.div
          animate={{ x: ["10%", "-5%", "10%"], y: ["5%", "-5%", "5%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-1/4 top-1/3 h-[360px] w-[360px] rounded-full bg-red/10 blur-[100px]"
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="pointer-events-none absolute z-[1] h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{
          x,
          y,
          background:
            "radial-gradient(circle, rgba(196,92,62,0.22) 0%, rgba(229,62,62,0.08) 40%, transparent 70%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute z-[1] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{
          x,
          y,
          background:
            "radial-gradient(circle, rgba(229,62,62,0.15) 0%, transparent 65%)",
        }}
      />
    </>
  );
}