import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Checkup } from "@/components/analytics/Checkup";
import { PAGES, SITE_URL } from "@/lib/seo";
import { ANALYTICS_COOKIE, COOKIE_MAX_AGE, cookieIsValid, cookieValue, credentialsMatch, getSpeed, getTraffic, signInReady, type Row, type Speed } from "@/lib/stats";

// Private analytics: visits, speed and the last site checkup. Linked from the footer, but only Sejal can sign in
// (ANALYTICS_EMAIL and ANALYTICS_PASSWORD in Vercel). Never indexed.
export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};
export const maxDuration = 60;

const gutter = "mx-auto max-w-[1440px] px-[clamp(20px,8.333vw,120px)]";
const HOME = "/analytics";

async function signIn(form: FormData) {
  "use server";
  if (!credentialsMatch(String(form.get("email") ?? ""), String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800));
    redirect(`${HOME}?wrong=1`);
  }
  (await cookies()).set(ANALYTICS_COOKIE, cookieValue(), { httpOnly: true, secure: true, sameSite: "strict", path: HOME, maxAge: COOKIE_MAX_AGE });
  redirect(HOME);
}

async function signOut() {
  "use server";
  (await cookies()).delete({ name: ANALYTICS_COOKIE, path: HOME });
  redirect(HOME);
}

export default async function Analytics({ searchParams }: { searchParams: Promise<{ wrong?: string }> }) {
  if (!signInReady()) return <NotSetUp />;
  const signedIn = cookieIsValid((await cookies()).get(ANALYTICS_COOKIE)?.value);
  if (!signedIn) return <SignIn wrong={(await searchParams).wrong === "1"} />;
  const [traffic, speed] = await Promise.all([getTraffic(), getSpeed(SITE_URL)]);

  return (
    <div className={`${gutter} flex flex-col gap-12 pt-10 pb-28 xl:pt-16`}>
      <header className="flex flex-col items-start gap-4">
        <p className="type-label-s text-ink">PRIVATE · ONLY YOU CAN SIGN IN</p>
        <h1 className="type-display-l text-primary">Analytics</h1>
        {traffic.state === "ok" && (
          <p className="type-body-l text-muted">
            The last 30 days, {nice(traffic.since)} to {nice(traffic.until)}. Visits refresh every 15 minutes, speed once a day.
          </p>
        )}
        {(traffic.state === "ok" && traffic.sample) || speed.sample ? (
          <p className="type-body-s border-2 border-line bg-butter px-4 py-3 text-on-pastel">
            Sample numbers. This is a local preview with no Vercel token, so nothing here is real. The live page shows your data.
          </p>
        ) : null}
      </header>

      {traffic.state === "setup" && <Setup />}
      {traffic.state === "error" && <TrafficError status={traffic.status} />}
      {traffic.state === "ok" && <TrafficView t={traffic} />}

      <section className="flex flex-col gap-6 border-t-2 border-line pt-10">
        <div className="flex flex-col gap-2">
          <p className="type-label-s text-ink">SPEED · GOOGLE PAGESPEED · PHONE TEST</p>
          <h2 className="type-display-m text-primary">How fast the pages are</h2>
          <p className="type-body-m max-w-[720px] text-muted">
            A lab test on a mid-range phone over slow 4G, run once a day. 90 or more is good. When enough real Chrome users visit a page, Google also shows how it felt for them.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {speed.pages.map((p) => (
            <SpeedCard key={p.path} s={p} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t-2 border-line pt-10">
        <div className="flex flex-col gap-2">
          <p className="type-label-s text-ink">SITE CHECKUP · CODE DOCTOR</p>
          <h2 className="type-display-m text-primary">The last full checkup</h2>
          <p className="type-body-m max-w-[720px] text-muted">
            Every page at desktop and phone width, in light and dark: errors, broken images and links, overlaps, contrast, speed and accessibility.
          </p>
        </div>
        <Checkup />
      </section>

      <footer className="flex flex-col items-start gap-4 border-t-2 border-line pt-8">
        <p className="type-body-s max-w-[760px] text-muted">
          Visits come from Vercel Web Analytics, which counts page views without cookies. Vercel&apos;s own Speed Insights score from real visitors stays in the{" "}
          <a className="text-ink underline" href="https://vercel.com/sborkar2002s-projects/sejalborkar/speed-insights" target="_blank" rel="noopener noreferrer">
            Vercel dashboard
          </a>
          , because Vercel offers no way to read it from here.
        </p>
        <form action={signOut}>
          <button type="submit" className="type-label-s border-2 border-line bg-raised px-4 py-2.5 text-muted shadow-[0_2px_0_0_var(--line)] hover:text-primary">
            SIGN OUT
          </button>
        </form>
      </footer>
    </div>
  );
}

function SignIn({ wrong }: { wrong: boolean }) {
  return (
    <div className={`${gutter} flex min-h-[70vh] items-center justify-center py-16`}>
      <form action={signIn} className="flex w-full max-w-[420px] flex-col gap-5 border-2 border-line bg-raised p-8 shadow-pixel-8">
        <p className="type-label-s text-ink">PRIVATE</p>
        <h1 className="type-display-m text-primary">Analytics</h1>
        <p className="type-body-s text-muted">Visits, speed and site checkups for this portfolio. Only Sejal can sign in.</p>
        <label htmlFor="analytics-email" className="type-label-s text-muted">
          EMAIL
        </label>
        <input
          id="analytics-email"
          name="email"
          type="text"
          autoComplete="username"
          spellCheck={false}
          autoCapitalize="none"
          required
          className="type-body-m border-2 border-line bg-page px-3 py-2.5 text-primary"
        />
        <label htmlFor="analytics-password" className="type-label-s text-muted">
          PASSWORD
        </label>
        <input
          id="analytics-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="type-body-m border-2 border-line bg-page px-3 py-2.5 text-primary"
        />
        {wrong && (
          <p role="alert" className="type-body-s text-primary">
            That email and password did not match. Try again.
          </p>
        )}
        <button type="submit" className="type-label-s self-start border-2 border-ink bg-lime px-5 py-3 text-on-pastel shadow-[0_3px_0_0_var(--accent-ink)]">
          SIGN IN
        </button>
      </form>
    </div>
  );
}

function NotSetUp() {
  return (
    <div className={`${gutter} flex min-h-[70vh] items-center justify-center py-16`}>
      <section className="flex w-full max-w-[520px] flex-col gap-4 border-2 border-line bg-raised p-8 shadow-pixel-8">
        <p className="type-label-s text-ink">PRIVATE</p>
        <h1 className="type-display-m text-primary">Analytics</h1>
        <p className="type-body-m text-muted">Sign-in is not switched on yet. It turns on once the owner adds a sign-in in the site&apos;s settings.</p>
      </section>
    </div>
  );
}

function Setup() {
  return (
    <section className="flex flex-col gap-3 border-2 border-line bg-raised p-6 shadow-pixel-8">
      <p className="type-label-s text-ink">ONE STEP LEFT</p>
      <h2 className="type-heading-s text-primary">Connect Vercel Web Analytics</h2>
      <p className="type-body-m max-w-[720px] text-muted">
        Add VERCEL_ANALYTICS_TOKEN and VERCEL_ANALYTICS_PROJECT_ID to the project&apos;s environment variables in Vercel, then redeploy. The steps are in outreach-kit.md, section 5.
      </p>
    </section>
  );
}

function TrafficError({ status }: { status: number }) {
  const blocked = status === 401 || status === 402 || status === 403;
  return (
    <section className="flex flex-col gap-3 border-2 border-line bg-raised p-6 shadow-pixel-8">
      <p className="type-label-s text-ink">VISITS · VERCEL ANSWERED {status || "NOTHING"}</p>
      <h2 className="type-heading-s text-primary">{blocked ? "Vercel did not let this token read the visits" : "Vercel could not be reached"}</h2>
      <p className="type-body-m max-w-[720px] text-muted">
        {blocked
          ? "Check that the token belongs to your account and has not expired. If it is right, the analytics API may not be open on the free plan. Every number is still in the Vercel dashboard."
          : "Try again in a few minutes. Every number is also in the Vercel dashboard."}{" "}
        <a className="text-ink underline" href="https://vercel.com/sborkar2002s-projects/sejalborkar/analytics" target="_blank" rel="noopener noreferrer">
          Open Vercel Analytics
        </a>
      </p>
    </section>
  );
}

// ---------- traffic ----------

function TrafficView({ t }: { t: Extract<Awaited<ReturnType<typeof getTraffic>>, { state: "ok" }> }) {
  const views = sum(t.days, "pageviews");
  const visitors = sum(t.days, "visitors");
  const busiest = [...t.days].sort((a, b) => b.pageviews - a.pageviews)[0];
  const countryTotal = sum(t.countries, "pageviews");
  const top = t.countries[0];
  return (
    <>
      <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile color="bg-mint" label="PAGE VIEWS" value={fmt(views)} note="every page opened in 30 days" />
        <Tile color="bg-sky" label="VISITORS" value={fmt(visitors)} note="people per day, added up" />
        <Tile color="bg-lilac" label="BUSIEST DAY" value={busiest ? fmt(busiest.pageviews) : "0"} note={busiest?.timestamp ? `views on ${nice(busiest.timestamp)}` : "no visits yet"} />
        <Tile color="bg-butter" label="TOP COUNTRY" value={top ? `${Math.round((top.pageviews / Math.max(1, countryTotal)) * 100)}%` : "-"} note={top ? `of views came from ${country(top.country)}` : "no visits yet"} />
      </section>

      <section className="flex flex-col gap-5 border-2 border-line bg-raised p-6 shadow-pixel-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="type-label-s text-ink">DAY BY DAY</p>
            <h2 className="type-heading-s text-primary">Page views and visitors</h2>
          </div>
          <p className="type-label-s flex gap-4 text-muted">
            <span className="inline-flex items-center gap-2">
              <i className="inline-block size-3 border-2 border-line bg-lilac" /> PAGE VIEWS
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="inline-block size-3 border-2 border-line bg-mint" /> VISITORS
            </span>
          </p>
        </div>
        <DailyChart days={t.days} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <ListPanel kicker="TOP PAGES" title="What people read" rows={t.pages.map((r) => [pageName(r.requestPath ?? ""), r.pageviews])} />
        <ListPanel kicker="COUNTRIES" title="Where they are" rows={t.countries.map((r) => [country(r.country), r.pageviews])} />
        <ListPanel kicker="REFERRERS" title="How they found the site" rows={t.referrers.map((r) => [r.referrerHostname || "Typed it in, or no referrer", r.pageviews])} />
        <Devices rows={t.devices} />
      </div>
    </>
  );
}

function Tile({ color, label, value, note }: { color: string; label: string; value: string; note: string }) {
  return (
    <div className={`${color} flex flex-col gap-1.5 border-2 border-line p-4 text-on-pastel shadow-[4px_4px_0_0_var(--line)]`}>
      <span className="type-label-s">{label}</span>
      <span className="type-display-m tabular-nums">{value}</span>
      <span className="type-body-s">{note}</span>
    </div>
  );
}

function DailyChart({ days }: { days: Row[] }) {
  const W = 960, H = 240, L = 36, B = 28, T = 10, R = 8;
  const max = Math.max(1, ...days.map((d) => d.pageviews));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const y = (v: number) => T + (H - B - T) * (1 - v / top);
  const slot = (W - L - R) / Math.max(1, days.length);
  const bw = Math.max(2, slot * 0.36);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Page views and visitors per day" className="block h-auto w-full min-w-[560px]">
        {Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray={v === 0 ? undefined : "2 4"} />
            <text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="var(--text-muted)" fontFamily="var(--font-label)">
              {v}
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const x = L + slot * i + slot / 2;
          return (
            <g key={d.timestamp ?? i}>
              <rect x={x - bw - 1} y={y(d.pageviews)} width={bw} height={y(0) - y(d.pageviews)} fill="var(--pastel-lilac)" stroke="var(--line)" />
              <rect x={x + 1} y={y(d.visitors)} width={bw} height={y(0) - y(d.visitors)} fill="var(--pastel-mint)" stroke="var(--line)" />
              {i % 5 === 0 && d.timestamp && (
                <text x={x} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontFamily="var(--font-label)">
                  {short(d.timestamp)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ListPanel({ kicker, title, rows }: { kicker: string; title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return (
    <section className="flex min-w-0 flex-col gap-4 border-2 border-line bg-raised p-6 shadow-pixel-8">
      <div className="flex flex-col gap-1">
        <p className="type-label-s text-ink">{kicker}</p>
        <h2 className="type-heading-s text-primary">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="type-body-s text-muted">Nothing yet.</p>
      ) : (
        <ol className="flex flex-col gap-2.5">
          {rows.map(([name, v]) => (
            <li key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
              <span className="type-body-s truncate text-primary">{name}</span>
              <span className="type-body-s tabular-nums text-muted">{fmt(v)}</span>
              <span className="col-span-2 h-2.5 border-2 border-line bg-sunken">
                <span className="block h-full bg-lilac" style={{ width: `${(v / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Devices({ rows }: { rows: Row[] }) {
  const total = Math.max(1, sum(rows, "pageviews"));
  const colors = ["bg-sky", "bg-peach", "bg-mint", "bg-butter", "bg-pink"];
  return (
    <section className="flex min-w-0 flex-col gap-4 border-2 border-line bg-raised p-6 shadow-pixel-8">
      <div className="flex flex-col gap-1">
        <p className="type-label-s text-ink">DEVICES</p>
        <h2 className="type-heading-s text-primary">Phone or computer</h2>
      </div>
      <div className="flex h-8 border-2 border-line">
        {rows.map((r, i) => (
          <span key={r.deviceType} className={`${colors[i % colors.length]} h-full`} style={{ width: `${(r.pageviews / total) * 100}%` }} />
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <li key={r.deviceType} className="type-body-s flex items-center gap-2.5 text-primary">
            <i className={`inline-block size-3 border-2 border-line ${colors[i % colors.length]}`} />
            {device(r.deviceType)} · {Math.round((r.pageviews / total) * 100)}%
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- speed ----------

function SpeedCard({ s }: { s: Speed }) {
  const chip = (v: number) => (v >= 90 ? "bg-mint" : v >= 50 ? "bg-butter" : "bg-pink");
  return (
    <article className="flex min-w-0 flex-col gap-4 border-2 border-line bg-raised p-5 shadow-pixel-8">
      <p className="type-label-s text-ink">{pageName(s.path).toUpperCase()}</p>
      {s.error || !s.scores ? (
        <p className="type-body-s text-muted">{s.error ?? "No result yet"}. It tries again on the next visit.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["Speed", s.scores.performance],
                ["Accessibility", s.scores.accessibility],
                ["Best practice", s.scores.bestPractices],
                ["Search basics", s.scores.seo],
              ] as const
            ).map(([label, v]) => (
              <div key={label} className={`${chip(v)} flex flex-col items-start gap-1 border-2 border-line px-3 py-2 text-on-pastel`}>
                <span className="type-label-s">{label}</span>
                <span className="type-heading-s tabular-nums">{v}</span>
              </div>
            ))}
          </div>
          {s.lab && (
            <ul className="type-body-s flex flex-col gap-1 text-muted">
              <li>Biggest content appears at {s.lab.lcp}</li>
              <li>Layout shift {s.lab.cls}</li>
              <li>Blocking time {s.lab.tbt}</li>
            </ul>
          )}
          <p className="type-body-s text-muted">
            {s.field
              ? `Real Chrome users: biggest content at ${((s.field.lcpMs ?? 0) / 1000).toFixed(1)} s, response to taps in ${s.field.inpMs ?? "-"} ms.`
              : "Not enough real Chrome visitors yet for Google to report how it felt to them."}
          </p>
        </>
      )}
    </article>
  );
}

// ---------- helpers ----------

function sum(rows: Row[], key: "pageviews" | "visitors") {
  return rows.reduce((a, r) => a + (r[key] ?? 0), 0);
}
function fmt(n: number) {
  return new Intl.NumberFormat("en").format(n);
}
function nice(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(d));
}
function short(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(d)).toUpperCase();
}
function niceStep(max: number) {
  const raw = max / 4;
  const p = 10 ** Math.floor(Math.log10(Math.max(1, raw)));
  return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? p * 10;
}
function country(code?: string) {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
function device(t?: string) {
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "Unknown";
}
function pageName(path: string) {
  if (path === "/") return "Home";
  return PAGES[path]?.title ?? path;
}
