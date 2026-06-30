import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "batsmanyd — Сайты, реклама и AI-автоматизация",
  description:
    "Премиальный digital-специалист: современные сайты, контекстная реклама и AI-автоматизация. Бесплатный экспресс-аудит сайта за 24 часа.",
  keywords: [
    "сайты",
    "реклама",
    "AI-автоматизация",
    "лендинг",
    "контекстная реклама",
    "batsmanyd",
  ],
  openGraph: {
    title: "batsmanyd — Сайты, реклама и AI-автоматизация",
    description:
      "Превращаю сайт в систему продаж с AI и рекламой. Бесплатный экспресс-аудит за 24 часа.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}