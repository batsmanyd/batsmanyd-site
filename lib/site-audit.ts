export type PageSpeedStrategy = "mobile" | "desktop";

type PageSpeedCategoryParam = "PERFORMANCE" | "ACCESSIBILITY" | "BEST_PRACTICES" | "SEO";

export type PageSpeedScore = {
  strategy: PageSpeedStrategy;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  reportUrl: string;
  error?: string;
};

export type BasicSeoCheck = {
  status: number | null;
  finalUrl: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  canonical: string | null;
  robots: string | null;
  viewport: string | null;
  ogTitle: string | null;
  issues: string[];
  error?: string;
};

export type WebsiteAuditResult = {
  url: string;
  checkedAt: string;
  pageSpeed: PageSpeedScore[];
  seo: BasicSeoCheck;
  summary: string[];
};

type LighthouseCategory = {
  score?: number | null;
};

type PageSpeedResponse = {
  error?: {
    message?: string;
  };
  lighthouseResult?: {
    categories?: Record<string, LighthouseCategory | undefined>;
  };
};

function withTimeout(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function toScore(value: number | null | undefined): number | null {
  if (typeof value !== "number") return null;
  return Math.round(value * 100);
}

function scoreLabel(score: number | null): string {
  if (score === null) return "нет данных";
  if (score >= 90) return `${score}/100 — хорошо`;
  if (score >= 50) return `${score}/100 — средне`;
  return `${score}/100 — плохо`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeText(value: string | null, maxLength = 180): string {
  if (!value) return "не найден";
  const clean = value.replace(/\s+/g, " ").trim();
  const shortened = clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}…` : clean;
  return escapeHtml(shortened);
}

function extractTag(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match?.[1]?.replace(/\s+/g, " ").trim() || null;
}

function extractMeta(html: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return extractTag(
    html,
    new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
  ) || extractTag(
    html,
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escaped}["'][^>]*>`, "i"),
  );
}

async function runPageSpeed(url: string, strategy: PageSpeedStrategy): Promise<PageSpeedScore> {
  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  const categories: PageSpeedCategoryParam[] = [
    "PERFORMANCE",
    "ACCESSIBILITY",
    "BEST_PRACTICES",
    "SEO",
  ];

  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", strategy.toUpperCase());
  for (const category of categories) {
    apiUrl.searchParams.append("category", category);
  }

  const reportUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&form_factor=${strategy === "mobile" ? "mobile" : "desktop"}`;

  try {
    const response = await fetch(apiUrl.toString(), {
      signal: withTimeout(25000),
      headers: { Accept: "application/json" },
    });

    const data = (await response.json().catch(() => null)) as PageSpeedResponse | null;

    if (!response.ok) {
      return {
        strategy,
        performance: null,
        accessibility: null,
        bestPractices: null,
        seo: null,
        reportUrl,
        error: data?.error?.message || `PageSpeed вернул статус ${response.status}`,
      };
    }

    const categoriesData = data?.lighthouseResult?.categories ?? {};

    const result = {
      strategy,
      performance: toScore(categoriesData.performance?.score),
      accessibility: toScore(categoriesData.accessibility?.score),
      bestPractices: toScore(categoriesData["best-practices"]?.score),
      seo: toScore(categoriesData.seo?.score),
      reportUrl,
    };

    if (
      result.performance === null &&
      result.accessibility === null &&
      result.bestPractices === null &&
      result.seo === null
    ) {
      return {
        ...result,
        error: "PageSpeed ответил без Lighthouse-оценок",
      };
    }

    return result;
  } catch (error) {
    return {
      strategy,
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
      reportUrl,
      error: error instanceof Error ? error.message : "PageSpeed недоступен",
    };
  }
}

async function runBasicSeo(url: string): Promise<BasicSeoCheck> {
  try {
    const response = await fetch(url, {
      signal: withTimeout(10000),
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; batsmanyd-audit/1.0)",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return {
        status: response.status,
        finalUrl: response.url,
        title: null,
        description: null,
        h1: null,
        canonical: null,
        robots: null,
        viewport: null,
        ogTitle: null,
        issues: ["Страница не вернула HTML — полноценный SEO-разбор невозможен"],
      };
    }

    const html = await response.text();
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extractMeta(html, "description");
    const h1 = extractTag(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)?.replace(/<[^>]+>/g, "").trim() || null;
    const canonical = extractTag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
    const robots = extractMeta(html, "robots");
    const viewport = extractMeta(html, "viewport");
    const ogTitle = extractMeta(html, "og:title");

    const issues: string[] = [];
    if (response.status >= 400) issues.push(`HTTP-статус ${response.status} — страница может быть недоступна`);
    if (!title) issues.push("Не найден title");
    if (title && title.length > 65) issues.push("Title длиннее 65 символов — может обрезаться в поиске");
    if (!description) issues.push("Не найден meta description");
    if (description && description.length > 160) issues.push("Meta description длиннее 160 символов — может обрезаться");
    if (!h1) issues.push("Не найден H1");
    if (!canonical) issues.push("Не найден canonical URL");
    if (!viewport) issues.push("Не найден viewport — возможны проблемы на мобильных");
    if (!ogTitle) issues.push("Не найден OpenGraph title — ссылка может плохо выглядеть в соцсетях/мессенджерах");

    return {
      status: response.status,
      finalUrl: response.url,
      title,
      description,
      h1,
      canonical,
      robots,
      viewport,
      ogTitle,
      issues,
    };
  } catch (error) {
    return {
      status: null,
      finalUrl: url,
      title: null,
      description: null,
      h1: null,
      canonical: null,
      robots: null,
      viewport: null,
      ogTitle: null,
      issues: ["Не удалось загрузить сайт для базовой SEO-проверки"],
      error: error instanceof Error ? error.message : "Сайт недоступен",
    };
  }
}

function buildSummary(pageSpeed: PageSpeedScore[], seo: BasicSeoCheck): string[] {
  const summary: string[] = [];
  const mobile = pageSpeed.find((item) => item.strategy === "mobile");
  const desktop = pageSpeed.find((item) => item.strategy === "desktop");

  if (mobile?.performance !== null && mobile?.performance !== undefined && mobile.performance < 50) {
    summary.push("Мобильная скорость в красной зоне — это может снижать конверсию с рекламы");
  }
  if (desktop?.performance !== null && desktop?.performance !== undefined && desktop.performance < 70) {
    summary.push("Desktop-скорость требует внимания");
  }
  if (seo.issues.length > 0) {
    summary.push(...seo.issues.slice(0, 5));
  }
  if (summary.length === 0) {
    summary.push("Критичных технических проблем на первом проходе не найдено — нужен ручной UX/оффер-разбор");
  }

  return summary.slice(0, 6);
}

export async function auditWebsite(url: string): Promise<WebsiteAuditResult> {
  const [mobile, desktop, seo] = await Promise.all([
    runPageSpeed(url, "mobile"),
    runPageSpeed(url, "desktop"),
    runBasicSeo(url),
  ]);

  return {
    url,
    checkedAt: new Date().toISOString(),
    pageSpeed: [mobile, desktop],
    seo,
    summary: buildSummary([mobile, desktop], seo),
  };
}

export function formatAuditResultForTelegram(audit: WebsiteAuditResult): string {
  const mobile = audit.pageSpeed.find((item) => item.strategy === "mobile");
  const desktop = audit.pageSpeed.find((item) => item.strategy === "desktop");
  const pageSpeedErrors = audit.pageSpeed
    .filter((item) => item.error)
    .map((item) => `• ${item.strategy}: ${safeText(item.error ?? "ошибка", 220)}`);

  return [
    "",
    "🤖 <b>Авто-аудит сайта</b>",
    "",
    `📱 <b>Mobile performance:</b> ${scoreLabel(mobile?.performance ?? null)}`,
    `🖥 <b>Desktop performance:</b> ${scoreLabel(desktop?.performance ?? null)}`,
    `♿ <b>Accessibility:</b> ${scoreLabel(mobile?.accessibility ?? desktop?.accessibility ?? null)}`,
    `🧭 <b>SEO:</b> ${scoreLabel(mobile?.seo ?? desktop?.seo ?? null)}`,
    pageSpeedErrors.length > 0 ? "" : "",
    pageSpeedErrors.length > 0 ? "⚙️ <b>PageSpeed диагностика:</b>" : "",
    ...pageSpeedErrors,
    "",
    `🌐 <b>Финальный URL:</b> ${safeText(audit.seo.finalUrl, 220)}`,
    `📄 <b>Title:</b> ${safeText(audit.seo.title, 180)}`,
    `📝 <b>Description:</b> ${safeText(audit.seo.description, 220)}`,
    `🏷 <b>H1:</b> ${safeText(audit.seo.h1, 180)}`,
    "",
    "⚠️ <b>Что проверить первым:</b>",
    ...audit.summary.map((item) => `• ${safeText(item, 220)}`),
    "",
    mobile ? `🔗 <b>PageSpeed mobile:</b> ${escapeHtml(mobile.reportUrl)}` : "",
    desktop ? `🔗 <b>PageSpeed desktop:</b> ${escapeHtml(desktop.reportUrl)}` : "",
  ].filter(Boolean).join("\n");
}
