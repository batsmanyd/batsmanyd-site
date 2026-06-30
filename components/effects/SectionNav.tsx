"use client";

import { sectionNavItems } from "@/lib/wow-content";
import { useSite } from "@/lib/site-context";
import { cn } from "@/lib/utils";

export function SectionNav() {
  const { activeSection } = useSite();

  return (
    <nav
      className="fixed right-3 top-1/2 z-[55] hidden -translate-y-1/2 flex-col gap-2 lg:flex"
      aria-label="Навигация по секциям"
    >
      {sectionNavItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          title={item.label}
          className={cn(
            "group relative flex h-2.5 w-2.5 items-center justify-center rounded-full border transition-all duration-300",
            activeSection === item.id
              ? "h-3 w-3 border-brick bg-brick shadow-lg shadow-brick/40"
              : "border-white/20 bg-white/10 hover:border-brick/50 hover:bg-brick/30",
          )}
        >
          <span className="pointer-events-none absolute right-5 whitespace-nowrap rounded-lg border border-white/10 bg-surface-elevated px-2 py-1 text-[10px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}