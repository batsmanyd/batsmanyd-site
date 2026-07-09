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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batsmanyd-site-964b.vercel.app";
const title = "batsmanyd — Сайты, реклама и AI-автоматизация";
const description =
  "Digital-специалист: современные сайты, контекстная реклама, заявки в Telegram/CRM и AI-автоматизация. Бесплатный экспресс-аудит сайта.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "сайты",
    "реклама",
    "AI-автоматизация",
    "лендинг",
    "контекстная реклама",
    "заявки в Telegram",
    "CRM автоматизация",
    "batsmanyd",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "batsmanyd",
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