import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/lib/projects";
import { Img } from "../Img";
import { Button, Icon, Keycap, Tag, type TagKind } from "../ui";
import { CaseRail } from "./CaseRail";

const gutter = "mx-auto max-w-[1440px] px-[clamp(20px,8.333vw,120px)]";

/** Page frame for a case study: fixed rail on the left (desktop), 920px content column. */
export function CaseLayout({ rail, children }: { rail: string[]; children: ReactNode }) {
  return (
    <div className={`${gutter} flex gap-[60px]`}>
      <CaseRail items={rail} />
      <article className="min-w-0 flex-1 pt-8 xl:max-w-[920px] xl:pt-16">
        <Link
          href="/#work"
          className="type-label-s mb-8 inline-flex items-center gap-2.5 text-muted hover:text-primary xl:hidden"
        >
          <Icon name="arrow-left" />
          ALL WORK
        </Link>
        {children}
      </article>
    </div>
  );
}

export function CaseHero({
  kicker,
  tag,
  company,
  title,
  lead,
  meta,
  links,
  children,
}: {
  kicker: string;
  tag: TagKind;
  company: string;
  title: string;
  lead: string;
  meta: [string, string][];
  links?: { label: string; href: string }[];
  children: ReactNode;
}) {
  return (
    <header className="flex flex-col items-start gap-7 pb-16 xl:pb-[88px]">
      <div className="flex flex-wrap items-center gap-3">
        <p className="type-label-s text-ink">{kicker}</p>
        <Tag kind={tag} />
        <p className="type-label-s text-muted">{company}</p>
      </div>
      <h1 className="type-display-l text-primary">{title}</h1>
      <p className="type-body-l max-w-[700px] text-muted">{lead}</p>
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {links.map((l) => (
            <Button key={l.href} href={l.href} label={`VIEW ON ${l.label}`} kind="secondary" external />
          ))}
        </div>
      )}
      <dl className="grid w-full grid-cols-2 pt-2 sm:grid-cols-3 lg:grid-cols-5">
        {meta.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-2 border-t-2 border-line pt-4 pr-4 pb-4 lg:pb-0">
            <dt className="type-label-s text-muted">{label}</dt>
            <dd className="type-body-s text-primary">{value}</dd>
          </div>
        ))}
      </dl>
      {children}
    </header>
  );
}

/** One numbered section of the case study. The id matches the rail key. */
export function CaseSection({
  n,
  kicker,
  title,
  lead,
  children,
}: {
  n: number;
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section
      id={`section-${n}`}
      aria-labelledby={`section-${n}-title`}
      data-reveal
      className="flex flex-col items-start gap-7 border-t-2 border-line pt-14 pb-16 outline-none xl:pt-[72px] xl:pb-[88px]"
    >
      <p className="type-label-s text-ink">{kicker}</p>
      <h2 id={`section-${n}-title`} className="type-display-m text-primary">
        {title}
      </h2>
      {lead && <p className="type-body-l max-w-[760px] text-muted">{lead}</p>}
      {children}
    </section>
  );
}

type ShotProps = {
  name: string;
  /** Display size in the Figma frame. */
  w: number;
  h: number;
  alt: string;
  top?: boolean;
  contain?: boolean;
  priority?: boolean;
};

/** A screen capture with the 2px line border and 4px hard shadow. Scales down, never up. */
export function Shot({ name, w, h, alt, top, contain, priority }: ShotProps) {
  return (
    <div
      className={`w-full overflow-hidden border-2 border-line shadow-[4px_4px_0_0_var(--line)] ${contain ? "bg-white" : ""}`}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <Img name={name} width={w} alt={alt} position={top ? "top" : "center"} fit={contain ? "contain" : "cover"} priority={priority} />
    </div>
  );
}

/** Shot with a Silkscreen caption, sized like the Figma frame and allowed to shrink. */
export function Figure({ label, below, ...shot }: ShotProps & { label: string; below?: boolean }) {
  return (
    <figure className="flex min-w-0 flex-col items-start gap-2.5" style={{ flex: `0 1 ${shot.w}px` }}>
      {!below && <figcaption className="type-label-s text-muted">{label}</figcaption>}
      <Shot {...shot} />
      {below && <figcaption className="type-label-s text-muted">{label}</figcaption>}
    </figure>
  );
}

/** Dark stage that holds visuals inside a section. On phones (under 768 px) the standard padding shrinks so
    screenshots stay readable; stages with their own proportional spacing are left alone. */
export function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const phonePad = /(^|\s)p-6(\s|$)/.test(className) ? "max-md:p-3!" : "";
  const phoneGap = /(^|\s)gap-(6|8)(\s|$)/.test(className) ? "max-md:gap-5!" : "";
  return <div className={`w-full overflow-hidden border-2 border-line bg-sunken ${className} ${phonePad} ${phoneGap}`}>{children}</div>;
}

export function StageArrow() {
  return (
    <span className="hidden shrink-0 text-muted md:flex">
      <Icon name="arrow-right" size={24} />
    </span>
  );
}

/** Before → After pair inside a stage (decisions 1, 2 and 4). */
export function BeforeAfter({ before, after }: { before: ShotProps; after: ShotProps }) {
  return (
    <Stage className="flex flex-col items-center justify-center gap-6 p-6 md:flex-row md:p-8">
      <Figure label="BEFORE" {...before} />
      <StageArrow />
      <Figure label="AFTER" {...after} />
    </Stage>
  );
}

/** Big numbered card (problems, reflections). */
export function NumberCard({
  n,
  title,
  body,
  shadow,
  labelTitle,
}: {
  n: string;
  title: string;
  body: string;
  shadow: string;
  /** Problems use a Silkscreen title, reflections a semibold sentence. */
  labelTitle?: boolean;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-start gap-3 border-2 border-line bg-raised px-5 pt-5 pb-[22px] shadow-[6px_6px_0_0_var(--card-shadow)]"
      style={{ "--card-shadow": shadow } as CSSProperties}
    >
      <p className="type-numeral text-primary">{n}</p>
      {labelTitle ? (
        <h3 className="type-label-s text-primary">{title}</h3>
      ) : (
        <h3 className="type-body-m font-semibold text-primary">{title}</h3>
      )}
      <p className="type-body-s text-muted">{body}</p>
    </div>
  );
}

export function CardRow({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col items-stretch gap-5 md:flex-row md:items-start">{children}</div>;
}

/** Numerals with Silkscreen labels under a 2px rule. */
export function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid w-full grid-cols-2 gap-y-6 md:grid-cols-4">
      {items.map(([value, label]) => (
        <div key={label} className="flex flex-col-reverse gap-1 border-t-2 border-line pt-4">
          <dt className="type-label-s text-muted">{label}</dt>
          <dd className="type-numeral text-primary">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A decision: lilac number, heading, then chose / cut / why columns and a visual. */
export function Decision({
  n,
  title,
  chose,
  cut,
  why,
  children,
}: {
  n: string;
  title: string;
  chose: string;
  cut: string;
  why: string;
  children: ReactNode;
}) {
  const columns: [string, string, string][] = [
    ["CHOSE", chose, "var(--pastel-mint)"],
    ["CUT", cut, "var(--pastel-peach)"],
    ["WHY", why, "var(--pastel-butter)"],
  ];
  return (
    <div className="flex w-full flex-col items-start gap-[22px] border-t-2 border-line pt-9 pb-2">
      <h3 className="flex items-center gap-4">
        <span className="type-heading-s shrink-0 bg-lilac px-2.5 py-1 text-on-pastel">{n}</span>
        <span className="type-heading-s text-primary">{title}</span>
      </h3>
      <div className="flex w-full flex-col gap-6 md:flex-row">
        {columns.map(([label, text, color]) => (
          <div key={label} className="flex min-w-0 flex-1 flex-col gap-2.5 border-l-[3px] pl-3.5" style={{ borderColor: color }}>
            <p className="type-label-s text-primary">{label}</p>
            <p className="type-body-s text-muted">{text}</p>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

/** Next case study card (Figma 41:763 / 56:947), pointed at the next live case study. */
// What the cat says on top of the "Next" card, by the next project's number. Short, true, no em dashes.
const NEXT_LINES: Record<number, string> = {
  1: "next: the marketing site",
  2: "next: my art app",
  3: "next: a webinar page",
  4: "next: a company blog",
  5: "next: a launch film",
  6: "next: a quiz that shipped",
};

export function NextCard({ project, media }: { project: Project; media: ReactNode }) {
  return (
    <NextPageCard
      label="Next case study"
      kicker={`NEXT CASE STUDY · 0${project.number} / 06`}
      title={project.title}
      href={project.href ?? "/"}
      catLine={NEXT_LINES[project.number] ?? "one more?"}
      media={media}
      keys
    />
  );
}

/** The "next page" card at the bottom of a page. The cat sits on its top edge (CatLayer). */
export function NextPageCard({
  label,
  kicker,
  title,
  href,
  catLine,
  media,
  keys = false,
}: {
  label: string;
  kicker: string;
  title: string;
  href: string;
  catLine: string;
  media: ReactNode;
  /** Show the keyboard hints (case studies handle the keys). */
  keys?: boolean;
}) {
  return (
    <section aria-label={label} className="border-t-2 border-line pt-14 pb-[120px]">
      <Link
        data-cat-perch="case-next"
        data-cat-line={catLine}
        href={href}
        className="group flex flex-col border-2 border-line bg-raised shadow-pixel-8 transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_var(--pastel-lilac)] md:flex-row"
      >
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3 p-6 sm:p-8">
          <p className="type-label-s text-ink">{kicker}</p>
          <p className="type-heading-s max-w-[400px] text-primary">{title}</p>
          {keys ? (
            <div className="hidden items-center gap-2.5 pt-2 md:flex">
              <Keycap>→</Keycap>
              <span className="type-label-s text-muted">NEXT</span>
              <Keycap>ESC</Keycap>
              <span className="type-label-s text-muted">ALL WORK</span>
            </div>
          ) : (
            <span className="type-label-s inline-flex items-center gap-2 pt-2 text-muted group-hover:text-primary">
              OPEN <Icon name="arrow-right" />
            </span>
          )}
        </div>
        <div className="aspect-[400/250] w-full shrink-0 overflow-hidden md:w-[43.5%]">{media}</div>
      </Link>
    </section>
  );
}

/** Merged pull request rows. */
export function PullRequests({ items }: { items: [string, string, string][] }) {
  return (
    <ul className="w-full">
      {items.map(([number, title, body]) => (
        <li
          key={number}
          className="grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 border-t-2 border-line py-5 [grid-template-areas:'chip_merged'_'text_text'] sm:grid-cols-[auto_1fr_auto] sm:[grid-template-areas:'chip_text_merged']"
        >
          <span className="type-label-s bg-mint px-2.5 py-1.5 text-on-pastel [grid-area:chip]">{number}</span>
          <div className="flex min-w-0 flex-col gap-1.5 [grid-area:text]">
            <p className="type-body-m font-semibold text-primary">{title}</p>
            <p className="type-body-s text-muted">{body}</p>
          </div>
          <span className="type-label-s justify-self-end text-muted [grid-area:merged]">MERGED</span>
        </li>
      ))}
    </ul>
  );
}
