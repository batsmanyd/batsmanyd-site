"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  motion,
  LayoutGroup,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  X,
  ChevronRight,
  Check,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Zap,
  Shield,
  MousePointerClick,
  Gauge,
  Search,
  Users,
  Send,
  Target,
  UserPlus,
  Phone,
  FileText,
  Handshake,
  Bot,
  Sparkles,
  Video,
  ImageIcon,
  PenLine,
  Eye,
  BarChart3,
  Filter,
  ShoppingCart,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";
import { services, type Service } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 280, damping: 28 };

function ParallaxCard({
  index,
  enabled,
  children,
}: {
  index: number;
  enabled: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const shift = (index % 3) * 6 + 12;
  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift]);

  if (!enabled) return <>{children}</>;

  return (
    <motion.div ref={ref} style={{ y }} className="h-full">
      {children}
    </motion.div>
  );
}

export function Services() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const order = useMemo(() => {
    if (expanded === null) return services.map((_, i) => i);
    return [expanded, ...services.map((_, i) => i).filter((i) => i !== expanded)];
  }, [expanded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleExpand = (index: number) => {
    setExpanded(index);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <AnimatedSection id="services" sectionId="services" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          badge="Что я делаю"
          title="Шесть направлений — одна цель: заявки"
          description="Нажмите на карточку — она развернётся прямо здесь с подробностями, инструментами и примерами результатов."
        />

        <LayoutGroup>
          <div
            ref={gridRef}
            className="mt-16 grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {order.map((index) => {
              const service = services[index];
              const isExpanded = expanded === index;
              const isDimmed = expanded !== null && !isExpanded;

              return (
                <motion.div
                  key={service.title}
                  layout
                  transition={spring}
                  className={cn(
                    isExpanded ? "col-span-full" : "col-span-1",
                    isDimmed && "opacity-35 hover:opacity-55 transition-opacity",
                  )}
                >
                  <ParallaxCard index={index} enabled={expanded === null}>
                  <motion.div
                    layout
                    transition={spring}
                    className={cn(
                      "gradient-border overflow-hidden rounded-2xl bg-surface-elevated",
                      isExpanded
                        ? "min-h-[66vh] shadow-2xl shadow-brick/10"
                        : "glass-card cursor-pointer hover:shadow-lg hover:shadow-brick/10",
                    )}
                    onClick={!isExpanded ? () => handleExpand(index) : undefined}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isExpanded ? (
                        <ExpandedContent
                          key="expanded"
                          service={service}
                          onClose={() => setExpanded(null)}
                        />
                      ) : (
                        <CompactContent key="compact" service={service} />
                      )}
                    </AnimatePresence>
                  </motion.div>
                  </ParallaxCard>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </AnimatedSection>
  );
}

function CompactContent({ service }: { service: Service }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="group p-6"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brick/20 to-red/10 text-brick-light transition-colors group-hover:from-brick/30 group-hover:to-red/20">
        <service.icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {service.tagline}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brick-light opacity-0 transition-opacity group-hover:opacity-100">
        Развернуть
        <ChevronRight className="h-3 w-3" />
      </span>
    </motion.div>
  );
}

function ExpandedContent({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-[66vh] flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/30 to-red/20 text-brick-light">
            <service.icon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {service.title}
            </h3>
            <p className="mt-1 text-sm text-brick-light sm:text-base">
              {service.tagline}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-muted transition-colors hover:border-brick/40 hover:text-foreground"
          aria-label="Свернуть"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="grid flex-1 gap-6 p-6 lg:grid-cols-5 lg:gap-8 lg:p-8">
        {/* Left: text */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-brick-light">
              Что вы получаете
            </h4>
            <p className="text-sm leading-relaxed text-foreground sm:text-base">
              {service.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {service.details}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brick-light">
              Входит в работу
            </h4>
            <ul className="space-y-2">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brick-light" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brick-light">
              Инструменты
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Case study */}
          <div className="rounded-xl border border-brick/20 bg-brick/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brick-light">
              Кейс: {service.caseStudy.niche}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted">Было</p>
                <p className="mt-0.5 font-medium text-red/90">
                  {service.caseStudy.before}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Стало</p>
                <p className="mt-0.5 font-medium text-brick-light">
                  {service.caseStudy.after}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: metrics + visual demo */}
        <div className="flex flex-col gap-5 lg:col-span-3">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {service.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                className="google-stat-box p-3 sm:p-4"
              >
                <p className="text-xs text-muted">{m.label}</p>
                <p className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl">
                  {m.value}
                </p>
                {m.trend && (
                  <p className="mt-0.5 flex items-center gap-0.5 text-xs text-brick-light">
                    {m.trend.startsWith("−") || m.trend.startsWith("-") ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : m.trend.startsWith("+") ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : null}
                    {m.trend}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Visual demo */}
          <div className="flex-1">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brick-light">
              Как это выглядит
            </h4>
            <ServiceDemo type={service.demoType} />
          </div>

          <a
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-brick to-red px-6 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Обсудить этот проект
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Visual mini-demos ─── */

function DemoShell({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-h-[280px] overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-surface-elevated to-background">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
        <span className="text-xs font-semibold text-muted">{label}</span>
        {badge}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function DemoStat({
  icon: Icon,
  label,
  value,
  sub,
  accent = "brick",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: "brick" | "green" | "blue" | "yellow";
}) {
  const colors = {
    brick: "bg-brick/15 text-brick-light border-brick/20",
    green: "bg-green-500/15 text-green-400 border-green-500/20",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  };
  return (
    <div className={cn("rounded-xl border p-3", colors[accent])}>
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
        <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
          {label}
        </span>
      </div>
      <p className="mt-1.5 font-display text-lg font-bold leading-none text-foreground">
        {value}
      </p>
      {sub && <p className="mt-1 text-[10px] opacity-70">{sub}</p>}
    </div>
  );
}

function ServiceDemo({ type }: { type: Service["demoType"] }) {
  switch (type) {
    case "browser":
      return (
        <DemoShell
          label="Превью сайта клиента"
          badge={
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-[10px] font-semibold text-green-400">
              <Gauge className="h-3 w-3" />
              PageSpeed 96
            </span>
          }
        >
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Browser preview */}
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-xl border border-white/8 bg-background shadow-lg">
                <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-red/50" />
                    <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
                    <span className="h-2 w-2 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white/5 px-2 py-1">
                    <Shield className="h-2.5 w-2.5 text-green-400" />
                    <span className="text-[10px] text-muted">stroyproekt-msk.ru</span>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-brick/8 to-transparent p-4">
                  <p className="font-display text-sm font-bold leading-tight text-foreground sm:text-base">
                    Строим дома под ключ
                    <span className="text-gradient"> за 4 месяца</span>
                  </p>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-muted sm:text-xs">
                    120+ проектов · гарантия 10 лет · бесплатный расчёт за 24 ч
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { icon: Zap, title: "0.8 сек", sub: "загрузка" },
                      { icon: Shield, title: "10 лет", sub: "гарантия" },
                      { icon: MousePointerClick, title: "4.2%", sub: "конверсия" },
                    ].map(({ icon: Icon, title, sub }) => (
                      <div
                        key={sub}
                        className="rounded-lg border border-white/8 bg-white/[0.04] p-2 text-center"
                      >
                        <Icon className="mx-auto h-3.5 w-3.5 text-brick-light" />
                        <p className="mt-1 text-[10px] font-bold text-foreground">{title}</p>
                        <p className="text-[9px] text-muted">{sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brick to-red px-3 py-1.5 text-[10px] font-semibold text-white">
                    <MousePointerClick className="h-3 w-3" />
                    Получить расчёт
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics panel */}
            <div className="grid grid-cols-2 gap-2 lg:col-span-2 lg:grid-cols-1">
              <DemoStat icon={Zap} label="Загрузка" value="−81%" sub="быстрее" accent="green" />
              <DemoStat icon={Target} label="Конверсия" value="+245%" sub="рост" accent="brick" />
              <DemoStat icon={Eye} label="Отказы" value="−52%" sub="bounce rate" accent="blue" />
              <DemoStat icon={Star} label="PageSpeed" value="+34%" sub="к былому" accent="yellow" />
            </div>
          </div>
        </DemoShell>
      );

    case "ads":
      return (
        <DemoShell
          label="Дашборд рекламы · 30 дней"
          badge={
            <span className="flex items-center gap-1 rounded-full bg-brick/15 px-2.5 py-1 text-[10px] font-semibold text-brick-light">
              <TrendingDown className="h-3 w-3" />
              CPL −44%
            </span>
          }
        >
          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              { icon: TrendingDown, label: "CPL", value: "−67%", sub: "за 30 дней" },
              { icon: Target, label: "Заявки", value: "+422%", sub: "рост" },
              { icon: BarChart3, label: "ROI", value: "+340%", sub: "окупаемость" },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center"
              >
                <Icon className="mx-auto h-4 w-4 text-brick-light" />
                <p className="mt-1 text-[9px] text-muted">{label}</p>
                <p className="font-display text-base font-bold text-foreground">{value}</p>
                <p className="text-[9px] text-brick-light">{sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              {
                icon: Search,
                ch: "Яндекс.Директ",
                color: "from-yellow-500/20 to-yellow-600/10",
                iconColor: "text-yellow-400",
                result: "+422%",
                pct: 85,
                share: "48% трафика",
                trend: "CPL −38%",
              },
              {
                icon: Users,
                ch: "VK Ads",
                color: "from-blue-500/20 to-blue-600/10",
                iconColor: "text-blue-400",
                result: "+280%",
                pct: 55,
                share: "30% трафика",
                trend: "CPL −29%",
              },
              {
                icon: Send,
                ch: "Telegram Ads",
                color: "from-sky-500/20 to-sky-600/10",
                iconColor: "text-sky-400",
                result: "+190%",
                pct: 40,
                share: "22% трафика",
                trend: "CPL −18%",
              },
            ].map((row) => (
              <div
                key={row.ch}
                className={cn(
                  "rounded-xl border border-white/8 bg-gradient-to-r p-3",
                  row.color,
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <row.icon className={cn("h-4 w-4", row.iconColor)} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{row.ch}</p>
                      <p className="text-[10px] text-muted">{row.share}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-foreground">
                      {row.result}
                    </p>
                    <p className="flex items-center justify-end gap-0.5 text-[10px] text-green-400">
                      <TrendingDown className="h-2.5 w-2.5" />
                      {row.trend}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
                    className="h-full rounded-full bg-gradient-to-r from-brick to-red"
                  />
                </div>
              </div>
            ))}
          </div>
        </DemoShell>
      );

    case "crm":
      return (
        <DemoShell
          label="Воронка продаж · live"
          badge={
            <span className="flex items-center gap-1 text-[10px] text-green-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              100% обработка
            </span>
          }
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: UserPlus, stage: "Новая", share: "43%", color: "border-blue-500/30 bg-blue-500/10", iconColor: "text-blue-400", metric: "−78% ответ" },
              { icon: Phone, stage: "В работе", share: "29%", color: "border-yellow-500/30 bg-yellow-500/10", iconColor: "text-yellow-400", metric: "SLA 100%" },
              { icon: FileText, stage: "КП", share: "18%", color: "border-brick/30 bg-brick/10", iconColor: "text-brick-light", metric: "+65% CR" },
              { icon: Handshake, stage: "Сделка", share: "10%", color: "border-green-500/30 bg-green-500/10", iconColor: "text-green-400", metric: "+158% CR" },
            ].map((col) => (
              <div
                key={col.stage}
                className={cn("rounded-xl border p-2.5 text-center sm:p-3", col.color)}
              >
                <col.icon className={cn("mx-auto h-4 w-4", col.iconColor)} />
                <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted">
                  {col.stage}
                </p>
                <p className="font-display text-xl font-bold text-foreground">{col.share}</p>
                <p className="mt-1 text-[9px] text-muted">{col.metric}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {[
              { name: "Анна К.", phone: "+7 916 ***", action: "Форма на сайте", time: "2 мин", status: "Новая", statusColor: "text-blue-400 bg-blue-500/15" },
              { name: "ООО «Строй»", phone: "B2B", action: "Звонок → amoCRM", time: "8 мин", status: "В работе", statusColor: "text-yellow-400 bg-yellow-500/15" },
              { name: "Игорь М.", phone: "+7 903 ***", action: "Telegram-бот", time: "14 мин", status: "КП", statusColor: "text-brick-light bg-brick/15" },
            ].map((lead) => (
              <div
                key={lead.name}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brick/30 to-red/20 text-[10px] font-bold text-foreground">
                  {lead.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{lead.name}</p>
                  <p className="text-[10px] text-muted">
                    {lead.action} · {lead.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-medium", lead.statusColor)}>
                    {lead.status}
                  </span>
                  <p className="mt-0.5 flex items-center justify-end gap-0.5 text-[9px] text-muted">
                    <Clock className="h-2.5 w-2.5" />
                    {lead.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DemoShell>
      );

    case "ai-chat":
      return (
        <DemoShell
          label="AI-бот квалификации"
          badge={
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-400">
              <Bot className="h-3 w-3" />
              онлайн · 2.4 сек
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="space-y-2.5 sm:col-span-3">
              {[
                { from: "user", text: "Сколько стоит сайт для клиники?" },
                { from: "bot", text: "Уточню: сколько услуг на сайте и нужна ли онлайн-запись?" },
                { from: "user", text: "8 услуг, запись нужна" },
                { from: "bot", text: "Отлично! Лид квалифицирован на 87%. Передаю менеджеру ✓" },
              ].map((msg, i) => (
                <div
                  key={i}
                  className={cn("flex", msg.from === "user" ? "justify-end" : "justify-start gap-2")}
                >
                  {msg.from === "bot" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brick/20">
                      <Sparkles className="h-3 w-3 text-brick-light" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                      msg.from === "user"
                        ? "rounded-tr-sm bg-white/10 text-foreground"
                        : "rounded-tl-sm border border-brick/20 bg-brick/10 text-foreground",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 sm:col-span-2">
              {[
                { icon: Bot, label: "Закрытие диалогов", value: "72%", accent: "brick" as const },
                { icon: Check, label: "Без менеджера", value: "38%", accent: "green" as const },
                { icon: Clock, label: "Экономия времени", value: "−72%", accent: "blue" as const },
                { icon: Target, label: "Рост заявок", value: "+31%", accent: "yellow" as const },
              ].map(({ icon: Icon, label, value, accent }) => (
                <DemoStat key={label} icon={Icon} label={label} value={value} accent={accent} />
              ))}
              <div className="flex items-center gap-2 rounded-xl border border-green-500/25 bg-green-500/8 px-3 py-2">
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-[10px] text-green-400">Лид в amoCRM · готовность 87%</span>
              </div>
            </div>
          </div>
        </DemoShell>
      );

    case "content":
      return (
        <DemoShell
          label="Контент-план · неделя 12"
          badge={
            <span className="flex items-center gap-1 text-[10px] font-semibold text-brick-light">
              <Eye className="h-3 w-3" />
              охват +290%
            </span>
          }
        >
          <div className="grid grid-cols-7 gap-1.5">
            {[
              { day: "Пн", type: "Кейс", icon: FileText, reach: "+42%", active: true },
              { day: "Вт", type: null, icon: null, reach: null, active: false },
              { day: "Ср", type: "Reels", icon: Video, reach: "+81%", active: true },
              { day: "Чт", type: null, icon: null, reach: null, active: false },
              { day: "Пт", type: "Пост", icon: PenLine, reach: "+28%", active: true },
              { day: "Сб", type: null, icon: null, reach: null, active: false },
              { day: "Вс", type: "Сторис", icon: ImageIcon, reach: "+14%", active: true },
            ].map((cell) => (
              <div key={cell.day} className="text-center">
                <p className="text-[9px] text-muted">{cell.day}</p>
                <div
                  className={cn(
                    "mt-1 flex h-14 flex-col items-center justify-center rounded-lg border sm:h-16",
                    cell.active
                      ? "border-brick/30 bg-brick/10"
                      : "border-white/5 bg-white/[0.02]",
                  )}
                >
                  {cell.active && cell.icon ? (
                    <>
                      <cell.icon className="h-3.5 w-3.5 text-brick-light" />
                      <span className="mt-0.5 text-[9px] font-medium text-foreground">
                        {cell.type}
                      </span>
                      <span className="text-[8px] text-brick-light">{cell.reach}</span>
                    </>
                  ) : (
                    <span className="text-[9px] text-muted/30">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-brick/20 bg-brick/5 p-3">
              <div className="flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-b from-brick/40 to-red/20">
                <Video className="h-4 w-4 text-white" />
                <span className="mt-1 text-[8px] font-bold text-white/80">0:32</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Reels: до/после за 2 дня
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  Охват +290% · конверсия в заявку +72%
                </p>
                <div className="mt-2 flex gap-3 text-[10px]">
                  <span className="text-brick-light">ER +156%</span>
                  <span className="text-green-400">заявки +850%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <DemoStat icon={Eye} label="Охват" value="+290%" sub="рост" accent="brick" />
              <DemoStat icon={Target} label="Заявки" value="+850%" sub="из соцсетей" accent="green" />
            </div>
          </div>
        </DemoShell>
      );

    case "analytics":
      return (
        <DemoShell
          label="Сквозная аналитика · март 2026"
          badge={
            <span className="rounded-full bg-brick/15 px-2.5 py-1 text-[10px] font-semibold text-brick-light">
              ROI 340%
            </span>
          }
        >
          <div className="space-y-2">
            {[
              { icon: MousePointerClick, stage: "Клики", pct: 100, conv: "100%" },
              { icon: Eye, stage: "Визиты", pct: 73, conv: "73%" },
              { icon: Filter, stage: "Заявки", pct: 45, conv: "5.0%" },
              { icon: ShoppingCart, stage: "Сделки", pct: 28, conv: "27.9%" },
            ].map((step) => (
              <div key={step.stage} className="flex items-center gap-2">
                <div className="flex w-20 items-center gap-1.5">
                  <step.icon className="h-3 w-3 shrink-0 text-brick-light" />
                  <span className="text-[10px] text-muted">{step.stage}</span>
                </div>
                <div className="flex-1">
                  <div className="h-6 overflow-hidden rounded-lg bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.pct}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                      className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-brick/70 to-red/50 px-2"
                    >
                      <span className="text-[10px] font-bold text-white">
                        {step.conv}
                      </span>
                    </motion.div>
                  </div>
                </div>
                <span className="w-10 text-right text-[10px] font-medium text-brick-light">
                  {step.pct}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Search, ch: "Директ", metric: "ROI +280%", share: "42% сделок", color: "text-yellow-400" },
              { icon: Users, ch: "VK Ads", metric: "ROI +190%", share: "31% сделок", color: "text-blue-400" },
              { icon: ArrowRight, ch: "Органика", metric: "ROI +420%", share: "27% сделок", color: "text-green-400" },
            ].map((c) => (
              <div
                key={c.ch}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-3"
              >
                <c.icon className={cn("h-4 w-4", c.color)} />
                <p className="mt-1.5 text-[10px] text-muted">{c.ch}</p>
                <p className="font-display text-sm font-bold text-foreground">{c.metric}</p>
                <p className="text-[9px] text-muted">{c.share}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5">
            <span className="text-xs text-muted">Экономия бюджета после оптимизации</span>
            <span className="font-display text-sm font-bold text-green-400">−40% слива</span>
          </div>
        </DemoShell>
      );
  }
}