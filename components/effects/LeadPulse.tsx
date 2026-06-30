"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export function LeadPulse() {
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setCount((c) => c + (Math.random() > 0.6 ? 1 : 0));
    }, 8000 + Math.random() * 6000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-4 top-24 z-[60] hidden sm:block"
        >
          <div className="flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/10 px-3 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <Zap className="h-3.5 w-3.5 text-green-400" />
            <div>
              <p className="text-[10px] font-semibold text-green-400">
                +{count} заявок сегодня
              </p>
              <p className="text-[9px] text-muted/70">на сайтах клиентов*</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}