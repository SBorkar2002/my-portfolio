import Link from "next/link";
import type { ReactNode } from "react";
import { projectByNumber, type Project } from "@/lib/projects";
import { Img } from "../Img";
import { Icon, Keycap, SectionTitle, Tag } from "../ui";

const tileBase = "flex border-2 border-line bg-raised shadow-pixel-8";
const tileLive =
  "transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_var(--pastel-lilac)]";

/** Selected work (Figma 27:447): tile 01 wide, two rows of two, tile 06 wide. */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="border-t-2 border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-[clamp(20px,8.333vw,120px)] pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="flex items-end gap-6" data-cat-perch="work-gutter">
          <SectionTitle kicker="01 · SELECTED WORK" title="Selected work" id="work-title" />
          <span className="min-w-px flex-1" />
          <p className="type-label-s hidden text-right text-muted md:block">6 PROJECTS · PRESS 1 TO 6</p>
        </div>

        <TileShell project={projectByNumber(1)!} className="flex-col lg:flex-row">
          <div className="grid shrink-0 grid-cols-2 items-center gap-3 bg-sunken px-4 py-6 sm:gap-6 sm:px-8 sm:py-10 lg:w-[60.9%]">
            <Screen name="w01_intro" alt="Shipped intro screen: How AI-native is your engineering org?" />
            <Screen name="w01_result" alt="Shipped result screen with the stage, the score and the answers people gave" />
          </div>
          <TileBody project={projectByNumber(1)!} padding="p-6 sm:p-9" stats />
        </TileShell>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
          <StackedTile n={2} image="w02_features" alt="Tetriz feature page: Adoption isn't logins, it's shipped work" />
          <StackedTile n={3} image="w03_sourced" alt="Three Sourced app screens: onboarding, the feed and the Flow tracker" perch="tile-03" />
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-6">
          <StackedTile n={4} image="w04_futureofhr" alt="The #futureofhr landing page hero: The Future of Remote Hiring" />
          <StackedTile n={5} image="w05_afb" alt="AppsForBharat blog home page with the latest post and category filters" />
        </div>

        <TileShell project={projectByNumber(6)!} className="flex-col-reverse lg:flex-row">
          <TileBody project={projectByNumber(6)!} padding="p-6 sm:p-9" />
          <div className="aspect-[720/276] shrink-0 lg:aspect-auto lg:w-[60.2%] lg:self-stretch">
            <Img name="w06_media" width={720} alt="Recommendations screen listing installable skills, rules and hooks" />
          </div>
        </TileShell>
      </div>
    </section>
  );
}

function TileShell({ project, className, children }: { project: Project; className: string; children: ReactNode }) {
  if (project.href) {
    return (
      <Link href={project.href} aria-label={`${project.title}. Read the case study`} className={`group ${tileBase} ${tileLive} ${className}`}>
        {children}
      </Link>
    );
  }
  return <article className={`${tileBase} ${className}`}>{children}</article>;
}

function StackedTile({ n, image, alt, perch }: { n: number; image: string; alt: string; perch?: string }) {
  const project = projectByNumber(n)!;
  return (
    <TileShell project={project} className="flex-col overflow-hidden">
      <div className="aspect-[584/368] w-full" data-cat-perch={perch}>
        <Img name={image} width={584} alt={alt} />
      </div>
      <TileBody project={project} padding="p-6 sm:p-7" />
    </TileShell>
  );
}

function Screen({ name, alt }: { name: string; alt: string }) {
  return (
    <div className="aspect-[320/275] border-2 border-line bg-white shadow-[4px_4px_0_0_var(--line)]">
      <Img name={name} width={320} alt={alt} />
    </div>
  );
}

function TileBody({
  project,
  padding,
  stats,
  className = "",
}: {
  project: Project;
  padding: string;
  stats?: boolean;
  className?: string;
}) {
  const live = project.href !== null;
  return (
    <div className={`flex min-w-0 flex-1 flex-col items-start gap-3.5 ${padding} ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Tag kind={project.tag} />
        <p className="type-label-s text-muted">{project.meta}</p>
      </div>
      <h3 className="type-heading-s text-primary">{project.title}</h3>
      <p className="type-body-m text-muted">{project.summary}</p>
      {stats && (
        <dl className="flex gap-8 py-1.5">
          {[
            ["19", "QUESTIONS"],
            ["6", "SCREENS"],
            ["5", "RESULT STATES"],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse gap-0.5">
              <dt className="type-label-s text-muted">{label}</dt>
              <dd className="type-numeral text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="flex w-full items-center gap-2.5 pt-1.5">
        {live ? (
          <>
            <span className="type-label-s text-ink">READ THE CASE STUDY</span>
            <Icon name="arrow-right" className="text-ink transition-transform duration-150 group-hover:translate-x-1" />
          </>
        ) : (
          <span className="type-label-s text-muted">CASE STUDY COMING SOON</span>
        )}
        <span className="min-w-px flex-1" />
        <span className="hidden md:contents">
          <Keycap>{project.number}</Keycap>
        </span>
      </div>
    </div>
  );
}
