"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { AI_GREETING, getAiReply, getQuickQuestions } from "@/lib/ai-responses";
import { sectionAiHints } from "@/lib/wow-content";
import { useSite } from "@/lib/site-context";

type Message = { role: "user" | "bot"; text: string };

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([AI_GREETING]);
  const [typing, setTyping] = useState(false);
  const [proactiveSent, setProactiveSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeSection } = useSite();
  const lastSection = useRef(activeSection);

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

    setMessages((m) => {
      const last = m[m.length - 1];
      if (last?.role === "bot" && last.text === hint) return m;
      return [...m, { role: "bot", text: hint }];
    });
  }, [activeSection, open]);

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

  return (
    <>
      <AnimatePresence>
        {proactiveSent && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 right-4 z-[69] hidden max-w-[200px] rounded-2xl border border-brick/30 bg-surface-elevated px-3 py-2 text-[11px] text-muted shadow-lg sm:block sm:right-6"
          >
            <button type="button" onClick={() => setOpen(true)} className="text-left hover:text-foreground">
              💬 Есть вопрос? AI-помощник онлайн
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="google-panel fixed bottom-24 right-4 z-[70] flex h-[420px] w-[calc(100vw-2rem)] max-w-sm flex-col rounded-2xl bg-surface-elevated shadow-2xl shadow-[rgba(66,133,244,0.15)] sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-white/5 bg-brick/10 px-4 py-3">
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

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"}`}
                >
                  {msg.role === "bot" && (
                    <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-brick-light" />
                  )}
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-white/10 text-foreground"
                        : "rounded-tl-sm border border-brick/20 bg-brick/10 text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 px-6">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-brick-light"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 p-3">
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brick to-red text-white shadow-xl shadow-brick/30 sm:right-6"
        aria-label="Открыть AI-чат"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>
    </>
  );
}