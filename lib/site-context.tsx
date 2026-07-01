"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type SectionId } from "@/lib/wow-content";

type SiteContextValue = {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  quizMessage: string | null;
  setQuizMessage: (msg: string | null) => void;
  registerSection: (id: SectionId, el: HTMLElement | null) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [quizMessage, setQuizMessage] = useState<string | null>(null);
  const sectionsRef = useRef(new Map<SectionId, HTMLElement>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerSection = useCallback((id: SectionId, el: HTMLElement | null) => {
    const sections = sectionsRef.current;
    const prev = sections.get(id);
    if (prev && observerRef.current) observerRef.current.unobserve(prev);

    if (el) {
      sections.set(id, el);
      observerRef.current?.observe(el);
    } else {
      sections.delete(id);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-section") as SectionId;
          if (id) setActiveSection(id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    observerRef.current = observer;
    sectionsRef.current.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({
      activeSection,
      setActiveSection,
      quizMessage,
      setQuizMessage,
      registerSection,
    }),
    [activeSection, quizMessage, registerSection],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}