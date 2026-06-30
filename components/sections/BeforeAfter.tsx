"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Check,
  Gauge,
  BarChart3,
  Bot,
  Workflow,
} from "lucide-react";

const BEFORE_ITEMS = [
  { icon: Gauge, text: "Загрузка 4.2 сек", bad: true },
  { icon: BarChart3, text: "Конверсия 1.1%", bad: true },
  { icon: Workflow, text: "40% лидов теряется", bad: true },
  { icon: X, text: "Нет сквозной аналитики", bad: true },
];

const AFTER_ITEMS = [
  { icon: Gauge, text: "Загрузка 0.8 сек", bad: false },
  { icon: BarChart3, text: "Конверсия 4.2%", bad: false },
  { icon: Bot, text: "AI + CRM автоматизация", bad: false },
  { icon: Check, text: "ROI виден по каналам", bad: false },
];

function Panel({
  type,
  items,
}: {
  type: "before" | "after";
  items: typeof BEFORE_ITEMS;
}) {
  const isBefore = type === "before";

  return (
    <div
      className={`flex h-full min-h-[340px] flex-col p-5 sm:min-h-[380px] sm:p-7 ${
        isBefore ? "bg-[#1a1010]" : "bg-[#141218]"
      }`}
    >
      <span
        className={`mb-3 inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
          isBefore ? "bg-red/15 text-red" : "bg-brick/20 text-brick-light"
        }`}
      >
        {isBefore ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
        {isBefore ? "Типичный сайт" : "Система продаж"}
      </span>

      <div className="mb-3 shrink-0 space-y-2">
        {isBefore ? (
          <>
            <div className="h-5 w-3/4 max-w-[220px] rounded bg-white/10" />
            <div className="h-2.5 w-full max-w-[280px] rounded bg-white/5" />
            <div className="h-2.5 w-2/3 max-w-[200px] rounded bg-white/5" />
            <div className="mt-2 h-8 w-28 rounded-lg bg-white/10" />
          </>
        ) : (
          <>
            <p className="max-w-[260px] font-display text-base font-bold leading-snug text-foreground sm:text-lg">
              Сайт, который{" "}
              <span className="text-gradient">продаёт 24/7</span>
            </p>
            <p className="max-w-[240px] text-xs text-muted">
              Быстрый · измеримый · автоматизированный
            </p>
            <div className="mt-1 inline-flex rounded-lg bg-gradient-to-r from-brick to-red px-3 py-1.5 text-xs font-semibold text-white">
              Оставить заявку →
            </div>
          </>
        )}
      </div>

      <ul className="mt-auto space-y-2">
        {items.map(({ icon: Icon, text, bad }) => (
          <li key={text} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                bad ? "bg-red/15 text-red" : "bg-brick/20 text-brick-light"
              }`}
            >
              <Icon className="h-3 w-3" />
            </span>
            <span className={`leading-tight ${bad ? "text-muted" : "text-foreground"}`}>
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [width, setWidth] = useState(0);
  const dragging = useRef(false);
  const lastHaptic = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setWidth(el.offsetWidth);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setPosFromX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(95, Math.max(5, pct)));

    if (dragging.current && typeof navigator !== "undefined" && navigator.vibrate) {
      const now = Date.now();
      if (now - lastHaptic.current > 60) {
        navigator.vibrate(4);
        lastHaptic.current = now;
      }
    }
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPosFromX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPosFromX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative mt-16 isolate">
      <p className="mb-4 text-center text-sm text-muted">
        Потяните разделитель или кликните — сравните «до» и «после»
      </p>

      <div
        ref={containerRef}
        className="google-panel relative mx-auto h-[340px] w-full max-w-3xl touch-none select-none overflow-hidden rounded-2xl bg-surface-elevated sm:h-[380px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Слой «После» — фон */}
        <div className="absolute inset-0 z-0">
          <Panel type="after" items={AFTER_ITEMS} />
        </div>

        {/* Слой «До» — обрезается по ширине */}
        <div
          className="absolute inset-y-0 left-0 z-[1] overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div
            className="h-full"
            style={{ width: width > 0 ? width : "100%" }}
          >
            <Panel type="before" items={BEFORE_ITEMS} />
          </div>
          <div className="absolute inset-y-0 right-0 w-0.5 bg-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Ручка */}
        <div
          className="pointer-events-none absolute inset-y-0 z-[2] flex w-0 -translate-x-1/2 items-center justify-center"
          style={{ left: `${position}%` }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 bg-background shadow-xl">
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              className="text-foreground"
              aria-hidden
            >
              <path
                d="M5 4L1 8L5 12M11 4L15 8L11 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 z-[3] rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
          До
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 z-[3] rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
          После
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-4 text-center text-xs text-muted"
      >
        Средний результат клиентов после внедрения системы
      </motion.p>
    </div>
  );
}