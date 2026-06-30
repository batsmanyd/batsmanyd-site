"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Gauge, Smartphone, MousePointerClick, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Score = { label: string; value: number; icon: React.ElementType };

function hashUrl(url: string): number {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function simulateScores(url: string): Score[] {
  const h = hashUrl(url);
  return [
    { label: "Скорость", value: 42 + (h % 35), icon: Gauge },
    { label: "Мобильная", value: 38 + ((h >> 3) % 40), icon: Smartphone },
    { label: "Конверсия", value: 35 + ((h >> 5) % 45), icon: MousePointerClick },
  ];
}

function getGrade(avg: number) {
  if (avg >= 75) return { text: "Хорошо", color: "text-green-400" };
  if (avg >= 55) return { text: "Средне", color: "text-yellow-400" };
  return { text: "Есть потери", color: "text-red" };
}

export function MiniAudit() {
  const [url, setUrl] = useState("");
  const [scores, setScores] = useState<Score[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setScores(null);
    await new Promise((r) => setTimeout(r, 1400));
    setScores(simulateScores(trimmed));
    setLoading(false);
  };

  const avg = scores ? Math.round(scores.reduce((s, x) => s + x.value, 0) / scores.length) : 0;
  const grade = scores ? getGrade(avg) : null;

  return (
    <div className="google-panel mt-8 bg-brick/5 p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brick-light">
        Экспресс-проверка за 10 сек
      </p>
      <p className="mt-1 text-[11px] text-muted">
        Симуляция скоринга — полный разбор бесплатно в блоке аудита
      </p>

      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="https://ваш-сайт.ru"
            className="input-field !py-2.5 !pl-9 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading || !url.trim()}
          className="shrink-0 rounded-xl bg-gradient-to-r from-brick to-red px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : "Проверить"}
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-2"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 animate-pulse rounded-full bg-white/10" style={{ width: `${90 - i * 15}%` }} />
            ))}
            <p className="text-center text-xs text-muted">Анализируем...</p>
          </motion.div>
        )}

        {scores && grade && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">Общий скоринг</span>
              <span className={cn("font-display text-lg font-bold", grade.color)}>
                {avg}/100 · {grade.text}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {scores.map((s) => (
                <div key={s.label} className="google-stat-box p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "h-full rounded-full",
                        s.value >= 70 ? "bg-green-500" : s.value >= 50 ? "bg-yellow-500" : "bg-red",
                      )}
                    />
                  </div>
                  <p className="mt-1 font-display text-sm font-bold">{s.value}%</p>
                </div>
              ))}
            </div>
            <a
              href="#audit"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brick-light hover:underline"
            >
              Получить полный аудит бесплатно
              <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}