import type { ReactNode } from "react";
import { CHECKUP_DATE, CONTRAST, CRAWL, FINDINGS, LIGHTHOUSE, LINKS, LOADER, MEDIA, SWEEP, type Finding } from "@/lib/checkup";

// The 22 Oct checkup as charts on /analytics: server-rendered SVG drawn to scale, coloured from the site's tokens so
// both themes work.

const LABEL = { fontFamily: "var(--font-label)", fontSize: 10, fill: "var(--text-muted)" } as const;
const VALUE = { fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, fill: "var(--text-primary)" } as const;
const SITE_FILL = { old: "var(--pastel-sky)", new: "var(--pastel-lilac)" } as const;

export function Panel({ kicker, title, lead, children, legend }: { kicker: string; title: string; lead?: ReactNode; children: ReactNode; legend?: [string, string][] }) {
  return (
    <section className="flex min-w-0 flex-col gap-5 border-2 border-line bg-raised p-6 shadow-pixel-8">
      <div className="flex flex-col gap-1.5">
        <p className="type-label-s text-ink">{kicker}</p>
        <h3 className="type-heading-s text-primary">{title}</h3>
        {lead && <p className="type-body-s max-w-[720px] text-muted">{lead}</p>}
      </div>
      {legend && (
        <p className="type-label-s flex flex-wrap gap-4 text-muted">
          {legend.map(([name, fill]) => (
            <span key={name} className="inline-flex items-center gap-2">
              <i className="inline-block size-3 border-2 border-line" style={{ background: fill }} /> {name}
            </span>
          ))}
        </p>
      )}
      {children}
    </section>
  );
}

function Scroll({ children, min = 520 }: { children: ReactNode; min?: number }) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: min }}>{children}</div>
    </div>
  );
}

/** Horizontal bars on one scale, with an optional target line. */
function HBars({ rows, max, ticks, unit, target, labelWidth = 170, label }: { rows: { name: string; value: number; fill: string; text?: string; tick?: number }[]; max: number; ticks: number[]; unit: (v: number) => string; target?: { at: number; name: string }; labelWidth?: number; label: string }) {
  const W = 720, rh = 26, T = 22, R = 64, H = T + rows.length * rh + 24;
  const x = (v: number) => labelWidth + (v / max) * (W - labelWidth - R);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={T - 6} y2={H - 22} stroke="var(--line)" strokeDasharray="2 4" />
          <text x={x(t)} y={H - 6} textAnchor="middle" {...LABEL}>
            {unit(t)}
          </text>
        </g>
      ))}
      {target && (
        <g>
          <line x1={x(target.at)} x2={x(target.at)} y1={T - 10} y2={H - 22} stroke="var(--accent-ink)" strokeWidth={2} />
          <text x={x(target.at) + 5} y={T - 10} {...LABEL} fill="var(--accent-ink)">
            {target.name}
          </text>
        </g>
      )}
      {rows.map((r, i) => {
        const y = T + i * rh;
        return (
          <g key={r.name + i}>
            <text x={labelWidth - 10} y={y + 14} textAnchor="end" {...LABEL}>
              {r.name}
            </text>
            <rect x={x(0)} y={y + 3} width={Math.max(1, x(r.value) - x(0))} height={15} fill={r.fill} stroke="var(--line)" strokeWidth={2} />
            {r.tick !== undefined && <rect x={x(r.tick) - 1.5} y={y} width={3} height={21} fill="var(--text-primary)" />}
            <text x={x(r.value) + 6} y={y + 14} {...VALUE}>
              {r.text ?? unit(r.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LighthouseChart() {
  const pages = ["/", "/work/sourced", "/work/video-system", "/art/comics", "/art/motion"];
  const W = 720, H = 250, L = 36, B = 34, T = 16, R = 8, gw = (W - L - R) / pages.length, bw = 32;
  const y = (v: number) => T + (H - B - T) * (1 - (v - 50) / 50);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lighthouse performance score by page, old and new site" className="block h-auto w-full">
      <rect x={L} y={y(100)} width={W - L - R} height={y(90) - y(100)} fill="var(--accent-lime)" opacity={0.3} />
      {[50, 60, 70, 80, 90, 100].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t === 50 ? undefined : "2 4"} />
          <text x={L - 6} y={y(t) + 3} textAnchor="end" {...LABEL}>
            {t}
          </text>
        </g>
      ))}
      {pages.map((p, i) => {
        const cx = L + gw * i + gw / 2;
        return (
          <g key={p}>
            {(["old", "new"] as const).map((site, j) => {
              const r = LIGHTHOUSE.find((d) => d.page === p && d.site === site);
              const x = cx - bw - 3 + j * (bw + 6);
              if (!r)
                return (
                  <text key={site} x={x + bw / 2} y={y(53)} textAnchor="middle" {...LABEL}>
                    N/A
                  </text>
                );
              return (
                <g key={site}>
                  <rect x={x} y={y(r.perf)} width={bw} height={y(50) - y(r.perf)} fill={SITE_FILL[site]} stroke="var(--line)" strokeWidth={2} />
                  <text x={x + bw / 2} y={y(r.perf) - 5} textAnchor="middle" {...VALUE}>
                    {r.perf}
                  </text>
                </g>
              );
            })}
            <text x={cx} y={H - 12} textAnchor="middle" {...LABEL}>
              {p === "/" ? "HOME" : p.split("/").pop()!.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LoaderChart() {
  const W = 720, rh = 26, T = 22, L = 170, R = 20, H = T + LOADER.length * rh + 24, max = 2000;
  const x = (v: number) => L + (v / max) * (W - L - R);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Loading screen timing per run" className="block h-auto w-full">
      {[0, 500, 1000, 1500, 2000].map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={T - 6} y2={H - 22} stroke={t === 1500 ? "var(--accent-ink)" : "var(--line)"} strokeWidth={t === 1500 ? 2 : 1} strokeDasharray={t === 1500 ? undefined : "2 4"} />
          <text x={x(t)} y={H - 6} textAnchor="middle" {...LABEL}>
            {t / 1000} S
          </text>
        </g>
      ))}
      <text x={x(1500) + 5} y={T - 10} {...LABEL} fill="var(--accent-ink)">
        1.5 S MINIMUM
      </text>
      {LOADER.map(([name, shown, exit, gone], i) => {
        const y = T + i * rh;
        return (
          <g key={name}>
            <text x={L - 10} y={y + 14} textAnchor="end" {...LABEL}>
              {name.toUpperCase()}
            </text>
            <rect x={x(shown)} y={y + 3} width={x(exit) - x(shown)} height={15} fill="var(--pastel-lilac)" stroke="var(--line)" strokeWidth={2} />
            <rect x={x(exit)} y={y + 3} width={x(gone) - x(exit)} height={15} fill="var(--pastel-peach)" stroke="var(--line)" strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
}

function SweepGrid({ runs, findings }: { runs: number; findings: number }) {
  return (
    <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
      {Array.from({ length: runs }, (_, k) => (
        <span key={k} className={`aspect-square border-2 border-line ${k < findings ? "bg-pink" : "bg-mint"}`} />
      ))}
    </div>
  );
}

const LEVEL: Record<Finding["level"], [string, string]> = {
  p0: ["P0 · YOU", "bg-pink"],
  p1: ["P1", "bg-peach"],
  p2: ["P2", "bg-butter"],
  note: ["NOTE", "bg-sky"],
  done: ["DONE", "bg-mint"],
};

export function Checkup() {
  const mb = (b: number) => b / 1048576;
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(
          [
            ["bg-mint", "JS ERRORS", String(CRAWL.jsErrors), `on ${CRAWL.loads} page loads`],
            ["bg-sky", "BROKEN IMAGES", String(CRAWL.brokenImages), "every image loaded"],
            ["bg-lilac", "ACCESSIBILITY", "100", `new site, Lighthouse; axe found ${CRAWL.axeViolations} problems`],
            ["bg-butter", "LINKS", `${LINKS.ok}/${LINKS.ok + LINKS.botBlocked + LINKS.notOpened}`, "loaded; 2 block bots but open in a browser"],
          ] as const
        ).map(([bg, label, value, note]) => (
          <div key={label} className={`${bg} flex flex-col gap-1.5 border-2 border-line p-4 text-on-pastel shadow-[4px_4px_0_0_var(--line)]`}>
            <span className="type-label-s">{label}</span>
            <span className="type-display-m tabular-nums">{value}</span>
            <span className="type-body-s">{note}</span>
          </div>
        ))}
      </div>

      <Panel
        kicker="LIGHTHOUSE 12.2 · PHONE · SLOW 4G"
        title="Speed score by page"
        lead="90 or more is good (the lime band). The art pages only exist on the new site."
        legend={[
          ["OLD SITE", SITE_FILL.old],
          ["NEW SITE", SITE_FILL.new],
        ]}
      >
        <Scroll>
          <LighthouseChart />
        </Scroll>
      </Panel>

      <div className="flex flex-col gap-6">
        <Panel kicker="CORE WEB VITALS" title="When the biggest thing appears" lead="Bar: largest content. Black tick: first paint. Layout shift was 0 everywhere.">
          <Scroll>
            <HBars
              label="Largest contentful paint per page"
              rows={LIGHTHOUSE.map((r) => ({ name: `${r.site.toUpperCase()} · ${r.page === "/" ? "HOME" : r.page.split("/").pop()!.toUpperCase()}`, value: r.lcp, tick: r.fcp, fill: SITE_FILL[r.site], text: `${r.lcp.toFixed(1)} s` }))}
              max={4.5}
              ticks={[0, 1, 2, 3, 4]}
              unit={(v) => `${v} S`}
              target={{ at: 2.5, name: "GOOD UNDER 2.5 S" }}
            />
          </Scroll>
        </Panel>
        <Panel kicker="PLAYWRIGHT · 8 RUNS" title="Loading screen" legend={[["HOLD", "var(--pastel-lilac)"], ["FADE", "var(--pastel-peach)"]]} lead="The exit starts at 1.5 s once the bar has finished. Reduced motion (RM) skips the wait.">
          <Scroll>
            <LoaderChart />
          </Scroll>
        </Panel>
        <Panel kicker="WCAG 2.1 · TEXT CONTRAST" title="Every colour pair passes" lead="Each text colour on each surface. The line is the 4.5:1 minimum.">
          <Scroll>
            <HBars
              label="Contrast ratio per colour pair"
              rows={CONTRAST.map(([name, v]) => ({ name: name.toUpperCase(), value: v, fill: v < 7 ? "var(--pastel-butter)" : "var(--pastel-mint)", text: `${v.toFixed(1)}:1` }))}
              max={18}
              ticks={[0, 7, 12, 18]}
              unit={(v) => `${v}:1`}
              target={{ at: 4.5, name: "AA 4.5:1" }}
            />
          </Scroll>
        </Panel>
        <Panel kicker="ART PAGES · SELF-HOSTED" title="What the videos weigh" lead="Each video loads only when played, so visitors download one at a time.">
          <Scroll>
            <HBars
              label="Video file sizes"
              rows={MEDIA.map(([name, b]) => ({ name: name.toUpperCase(), value: mb(b), fill: name.startsWith("Film") ? "var(--pastel-sky)" : name.startsWith("#") ? "var(--pastel-peach)" : "var(--pastel-pink)", text: `${mb(b).toFixed(1)} MB` }))}
              max={5}
              ticks={[0, 1, 2, 3, 4, 5]}
              unit={(v) => `${v} MB`}
              labelWidth={130}
            />
          </Scroll>
        </Panel>
      </div>

      <Panel kicker="PHONE SWEEP · 9 PAGES × 4 PHONES × 2 THEMES" title="Overlaps on phones" lead="Each square is one page scrolled on one phone in one theme. Pink means something covered text or an image.">
        <div className="grid gap-6 md:grid-cols-2">
          {(["new", "old"] as const).map((site) => (
            <div key={site} className="flex flex-col gap-3">
              <p className="type-label-s text-muted">
                {site === "new" ? "NEW SITE" : "OLD SITE"} · {SWEEP[site].runs} RUNS · {SWEEP[site].findings} FOUND
              </p>
              <SweepGrid {...SWEEP[site]} />
            </div>
          ))}
        </div>
        <p className="type-body-s text-muted">
          New site: the cat passing over one art card once. Old site: the same cat pass three times, plus the two art pages that did not exist there yet.
        </p>
      </Panel>

      <Panel kicker="WHAT TO DO" title="Findings">
        <ul className="flex flex-col">
          {FINDINGS.map((f) => (
            <li key={f.title} className="grid gap-x-4 gap-y-2 border-t-2 border-line py-3 sm:grid-cols-[96px_minmax(0,1fr)]">
              <span className={`type-label-s self-start justify-self-start border-2 border-line px-2 py-1 text-on-pastel ${LEVEL[f.level][1]}`}>{LEVEL[f.level][0]}</span>
              <p className="type-body-s text-muted">
                <span className="font-semibold text-primary">{f.title}</span> {f.body}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
      <p className="type-body-s text-muted">Checkup run on {CHECKUP_DATE}. It is a snapshot; the visits and speed sections above update on their own.</p>
    </div>
  );
}
