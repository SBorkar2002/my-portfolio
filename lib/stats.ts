import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { unstable_cache } from "next/cache";

// Data for the private stats page. Traffic comes from the Vercel Web Analytics API
// (GET https://api.vercel.com/v1/query/web-analytics/visits/aggregate, documented at
// vercel.com/docs/analytics/web-analytics-api). Speed comes from Google's free PageSpeed Insights API, because
// Speed Insights has no read API. Every secret lives in an environment variable; none is in this public repo.

export const STATS_COOKIE = "stats_auth";

/** The page is switched off unless both the secret path and the password are set. */
export function statsEnabled() {
  return Boolean(process.env.STATS_PATH && process.env.STATS_PASSWORD);
}

function authToken() {
  return createHmac("sha256", process.env.STATS_PASSWORD ?? "").update("stats-v1").digest("hex");
}

export function passwordMatches(input: string) {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(process.env.STATS_PASSWORD ?? "").digest();
  return timingSafeEqual(a, b);
}

export function cookieValue() {
  return authToken();
}

export function cookieIsValid(value: string | undefined) {
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(authToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

export type Row = { pageviews: number; visitors: number; timestamp?: string; requestPath?: string; country?: string; referrerHostname?: string; deviceType?: string };

export type Traffic =
  | { state: "ok"; sample: boolean; since: string; until: string; days: Row[]; pages: Row[]; countries: Row[]; referrers: Row[]; devices: Row[] }
  | { state: "setup" }
  | { state: "error"; status: number; message: string };

const API = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** The last 30 days (Hobby keeps one month of Web Analytics). */
export async function getTraffic(): Promise<Traffic> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID;
  const until = new Date();
  const since = new Date(until.getTime() - 29 * 86400000);
  if (!token || !projectId) {
    if (process.env.NODE_ENV === "development") return sampleTraffic(since, until);
    return { state: "setup" };
  }
  const query = async (by: string, limit?: number) => {
    const params = new URLSearchParams({ projectId, by, since: iso(since), until: iso(until) });
    if (limit) params.set("limit", String(limit));
    if (process.env.VERCEL_TEAM_ID) params.set("teamId", process.env.VERCEL_TEAM_ID);
    const res = await fetch(`${API}?${params}`, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 900 } });
    if (!res.ok) throw Object.assign(new Error((await res.text()).slice(0, 300)), { status: res.status });
    return ((await res.json()) as { data: Row[] }).data;
  };
  try {
    const [days, pages, countries, referrers, devices] = await Promise.all([
      query("day"),
      query("requestPath", 10),
      query("country", 10),
      query("referrerHostname", 10),
      query("deviceType", 5),
    ]);
    return { state: "ok", sample: false, since: iso(since), until: iso(until), days, pages, countries, referrers, devices };
  } catch (e) {
    const err = e as Error & { status?: number };
    return { state: "error", status: err.status ?? 0, message: err.message };
  }
}

export type Speed = {
  path: string;
  scores?: { performance: number; accessibility: number; bestPractices: number; seo: number };
  lab?: { lcp: string; cls: string; tbt: string };
  /** Real Chrome users, when Google has enough of them for this page (often not, for a small site). */
  field?: { lcpMs?: number; inpMs?: number; cls?: number; overall?: string };
  error?: string;
};

const PSI = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
export const SPEED_PAGES = ["/", "/work/sourced", "/art/comics"];

type PsiResult = Omit<Speed, "path" | "error">;

// One PageSpeed run, kept for a day. A failed run throws, so it is never cached and the next visit tries again.
const runPageSpeed = unstable_cache(
  async (url: string): Promise<PsiResult> => {
    const params = new URLSearchParams({ url, strategy: "mobile" });
    for (const c of ["performance", "accessibility", "best-practices", "seo"]) params.append("category", c);
    if (process.env.PAGESPEED_API_KEY) params.set("key", process.env.PAGESPEED_API_KEY);
    const res = await fetch(`${PSI}?${params}`, { cache: "no-store", signal: AbortSignal.timeout(50000) });
    if (!res.ok) throw Object.assign(new Error("PageSpeed"), { status: res.status });
    const d = await res.json();
    const c = d.lighthouseResult?.categories ?? {};
    const a = d.lighthouseResult?.audits ?? {};
    const m = d.loadingExperience?.metrics ?? {};
    const pct = (v: { score?: number } | undefined) => Math.round((v?.score ?? 0) * 100);
    return {
      scores: { performance: pct(c.performance), accessibility: pct(c.accessibility), bestPractices: pct(c["best-practices"]), seo: pct(c.seo) },
      lab: { lcp: a["largest-contentful-paint"]?.displayValue ?? "-", cls: a["cumulative-layout-shift"]?.displayValue ?? "-", tbt: a["total-blocking-time"]?.displayValue ?? "-" },
      field: m.LARGEST_CONTENTFUL_PAINT_MS
        ? {
            lcpMs: m.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
            inpMs: m.INTERACTION_TO_NEXT_PAINT?.percentile,
            cls: m.CUMULATIVE_LAYOUT_SHIFT_SCORE ? m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : undefined,
            overall: d.loadingExperience?.overall_category,
          }
        : undefined,
    };
  },
  ["pagespeed-v1"],
  { revalidate: 86400 },
);

/** Phone scores for a few key pages, refreshed once a day. */
export async function getSpeed(siteUrl: string): Promise<{ sample: boolean; pages: Speed[] }> {
  if (process.env.NODE_ENV === "development" && !process.env.VERCEL_ANALYTICS_TOKEN) return { sample: true, pages: sampleSpeed() };
  const pages = await Promise.all(
    SPEED_PAGES.map(async (path): Promise<Speed> => {
      try {
        return { path, ...(await runPageSpeed(siteUrl + path)) };
      } catch (e) {
        const status = (e as { status?: number }).status;
        if (status === 429 && !process.env.PAGESPEED_API_KEY) return { path, error: "Google only runs these tests with a free API key. Add PAGESPEED_API_KEY (outreach kit, section 5)" };
        if (status === 429) return { path, error: "Google's daily limit for speed tests was reached" };
        return { path, error: "Google's speed test did not answer" };
      }
    }),
  );
  return { sample: false, pages };
}

// ---------- local preview only: clearly marked sample numbers so the page can be designed without a token ----------

function sampleTraffic(since: Date, until: Date): Traffic {
  const days: Row[] = Array.from({ length: 30 }, (_, i) => {
    const pv = Math.round(18 + 14 * Math.sin(i / 3) + (i % 7 === 2 ? 30 : 0) + i * 0.8);
    return { timestamp: new Date(since.getTime() + i * 86400000).toISOString(), pageviews: pv, visitors: Math.round(pv * 0.62) };
  });
  const rows = (key: keyof Row, list: [string, number][]): Row[] => list.map(([k, v]) => ({ [key]: k, pageviews: v, visitors: Math.round(v * 0.7) }) as Row);
  return {
    state: "ok",
    sample: true,
    since: iso(since),
    until: iso(until),
    days,
    pages: rows("requestPath", [["/", 410], ["/work/sourced", 120], ["/work/marketing-site", 96], ["/art/comics", 64], ["/work/futureofhr", 51], ["/art/motion", 40]]),
    countries: rows("country", [["IN", 380], ["US", 140], ["GB", 52], ["DE", 31], ["JP", 18], ["NL", 12]]),
    referrers: rows("referrerHostname", [["linkedin.com", 210], ["", 180], ["google.com", 66], ["behance.net", 40], ["artstation.com", 22]]),
    devices: rows("deviceType", [["mobile", 420], ["desktop", 290], ["tablet", 14]]),
  };
}

function sampleSpeed(): Speed[] {
  return [
    { path: "/", scores: { performance: 92, accessibility: 100, bestPractices: 100, seo: 100 }, lab: { lcp: "3.3 s", cls: "0", tbt: "10 ms" } },
    { path: "/work/sourced", scores: { performance: 97, accessibility: 100, bestPractices: 100, seo: 100 }, lab: { lcp: "2.6 s", cls: "0", tbt: "10 ms" } },
    { path: "/art/comics", scores: { performance: 99, accessibility: 100, bestPractices: 100, seo: 100 }, lab: { lcp: "2.3 s", cls: "0", tbt: "8 ms" } },
  ];
}
