import Link from "next/link";
import { brand } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brick to-red text-xs font-bold text-white">
            b
          </span>
          <span className="font-display text-sm font-semibold text-foreground">
            {brand.name}
          </span>
        </div>
        <p className="text-sm text-muted">{brand.tagline}</p>
        <div className="flex flex-col items-center gap-2 text-xs text-muted/60 sm:items-end">
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Политика обработки персональных данных
          </Link>
          <p>© {new Date().getFullYear()} {brand.name}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
