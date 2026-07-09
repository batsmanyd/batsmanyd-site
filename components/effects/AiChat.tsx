"use client";

import { useState, useRef, useEffect, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { AI_GREETING, getAiReply, getQuickQuestions } from "@/lib/ai-responses";
import { sectionAiHints } from "@/lib/wow-content";
import { useSite } from "@/lib/site-context";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "bot"; text: string };

function subscribeNoop() {
  return () => {};
}

export function AiChat() {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([AI_GREETING]);
  const [typing, setTyping] = useState(false);
  const [proactiveSent, setProactiveSent] = useState(false);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeSection } = useSite();
  const lastSection = useRef(activeSection);

  const fabBottom = stickyCtaVisible ? "5.5rem" : "1.5rem";
  const panelBottom = stickyCtaVisible ? "9.5rem" : "6rem";
  const panelStyle = {
    "--panel-bottom": panelBottom,
  } as CSSProperties;

  useEffect(() => {
    const onScroll = () => {
      setStickyCtaVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!proactiveSent && !open) {
        setProactiveSent(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [proactiveSent, open]);

  useEffect(() => {
    if (open || activeSection === lastSection.current) return;
    lastSection.current = activeSection;

    const hint = sectionAiHints[activeSection];
    if (!hint || activeSection === "hero") return;

    queueMicrotask(() => {
      setMessages((m) => {
        const last = m[m.length - 1];
        if (last?.role === "bot" && last.text === hint) return m;
        return [...m, { role: "bot", text: hint }];
      });
    });
  }, [activeSection, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    setMessages((m) => [...m, { role: "bot", text: getAiReply(trimmed) }]);
    setTyping(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-live="polite"
    >
      {proactiveSent && !open && (
        <div
          className="pointer-events-auto fixed right-4 hidden max-w-[200px] rounded-2xl border border-brick/30 bg-surface-elevated px-3 py-2 text-[11px] text-muted shadow-lg sm:block sm:right-6"
          style={{ bottom: panelBottom }}
        >
          <button type="button" onClick={() => setOpen(true)} className="text-left hover:text-foreground">
            💬 Есть вопрос? AI-помощник онлайн
          </button>
        </div>
      )}

      {open && (
        <>
          <button
            type="button"
            className="pointer-events-auto fixed inset-0 z-[9998] bg-black/70 sm:hidden"
            onClick={() => setOpen(false)}
            aria-label="Закрыть чат"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI-помощник"
            className="chat-panel-overlay pointer-events-auto fixed inset-x-0 bottom-0 z-[9999] flex h-[min(72dvh,calc(100dvh-env(safe-area-inset-top,0px)-0.75rem))] min-h-0 flex-col rounded-t-2xl pb-[env(safe-area-inset-bottom,0px)] shadow-2xl sm:inset-auto sm:right-6 sm:left-auto sm:bottom-[var(--panel-bottom)] sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-sm sm:rounded-2xl sm:pb-0"
            style={panelStyle}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-surface-elevated px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brick/20">
                  <Bot className="h-4 w-4 text-brick-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI-помощник</p>
                  <p className="flex items-center gap-1 text-[10px] text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    онлайн
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-foreground"
                aria-label="Закрыть чат"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-surface-elevated p-4 pt-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"}`}
                >
                  {msg.role === "bot" && (
                    <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-brick-light" />
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-white/15 text-foreground"
                        : "rounded-tl-sm border border-brick/25 bg-[#2a1f1c] text-foreground",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 px-6">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-brick-light"
                      style={{ animationDelay: `${d * 200}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-white/10 bg-surface-elevated p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {getQuickQuestions().map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-brick/30 hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ваш вопрос..."
                  className="input-field !py-2 text-xs"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brick to-red text-white"
                  aria-label="Отправить"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "pointer-events-auto fixed right-4 z-[10000] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brick to-red text-white shadow-xl shadow-brick/30 transition-transform active:scale-95 sm:right-6",
          open && "max-sm:hidden",
        )}
        style={{ bottom: fabBottom, touchAction: "manipulation" }}
        aria-label={open ? "Закрыть AI-чат" : "Открыть AI-чат"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>,
    document.body,
  );
}
