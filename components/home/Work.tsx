import Link from "next/link";
import type { ReactNode } from "react";
import { projectByNumber, type Project } from "@/lib/projects";
import { Img } from "../Img";
import { LoopVideo } from "../LoopVideo";
import { Icon, Keycap, SectionTitle, Tag } from "../ui";
import { GutterSky } from "./GutterSky";

const tileBase = "work-enter flex border-2 border-line bg-raised shadow-pixel-8";
const tileLive =
  "transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_var(--pastel-lilac)]";

/** Selected work: two rows of two, then the video system wide. The lead-gen case study sits under "More work". */
export function Work() {
  const more = projectByNumber(6)!;
  return (
    <section id="work" aria-labelledby="work-title" className="work-fx border-t-2 border-line">
      <GutterSky />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-[clamp(20px,8.333vw,120px)] pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="flex items-end gap-6" data-cat-perch="work-gutter" data-reveal>
          <SectionTitle kicker="01 · SELECTED WORK" title="Selected work" id="work-title" />
          <span className="min-w-px flex-1" />
          <p className="type-label-s hidden text-right text-muted md:block">6 PROJECTS · PRESS 1 TO 6</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
          <StackedTile n={1} image="w02_features" alt="Tetriz feature page: Adoption isn't logins, it's shipped work" />
          <StackedTile n={2} image="w03_sourced" alt="Three Sourced app screens: onboarding, the feed and the Flow tracker" perch="tile-03" />
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-6">
          <StackedTile n={3} image="w04_futureofhr" alt="The #futureofhr landing page hero: The Future of Remote Hiring" />
          <StackedTile n={4} image="w05_afb" alt="AppsForBharat blog home page with the latest post and category filters" />
        </div>

        <div>
        <TileShell project={projectByNumber(5)!} className="flex-col-reverse lg:flex-row">
          <TileBody project={projectByNumber(5)!} padding="p-6 sm:p-9" />
          <div className="aspect-video shrink-0 bg-[#f1f2f6] lg:w-[60.2%] lg:self-center">
            <LoopVideo
              src="/video/recommendations"
              poster="/video/recommendations-poster.webp"
              label="A Recommendations table fills in row by row with suggested skills, rules, hooks and sub-agents for a Next.js app, each with a fit grade and an Install button."
            />
          </div>
        </TileShell>
        </div>

        <div data-reveal>
        <Link
          href={more.href!}
          id={`project-${more.number}`}
          className="group flex flex-wrap items-center gap-x-4 gap-y-2 border-y-2 border-line py-5"
        >
          <span className="type-label-s text-ink">MORE WORK</span>
          <Tag kind={more.tag} />
          <span className="type-body-m min-w-0 flex-1 text-primary group-hover:text-ink">{more.title}</span>
          <span className="type-label-s flex items-center gap-2.5 text-ink">
            READ THE CASE STUDY
            <Icon name="arrow-right" className="transition-transform duration-150 group-hover:translate-x-1" />
          </span>
          <span className="hidden md:contents">
            <Keycap>{more.number}</Keycap>
          </span>
        </Link>
        </div>
      </div>
    </section>
  );
}

function TileShell({ project, className, children }: { project: Project; className: string; children: ReactNode }) {
  const id = `project-${project.number}`;
  if (project.href) {
    return (
      <Link href={project.href} id={id} aria-label={`${project.title}. Read the case study`} className={`group ${tileBase} ${tileLive} ${className}`}>
        {children}
      </Link>
    );
  }
  if (project.links?.length === 1) {
    return (
      <a href={project.links[0].href} id={id} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}. Open on ${project.links[0].label.toLowerCase()} in a new tab`} className={`group ${tileBase} ${tileLive} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <article id={id} className={`group ${tileBase} ${className}`}>
      {children}
    </article>
  );
}

function StackedTile({ n, image, alt, perch }: { n: number; image: string; alt: string; perch?: string }) {
  const project = projectByNumber(n)!;
  return (
    <TileShell project={project} className="flex-col overflow-hidden">
      {!project.href && project.links && project.links.length > 1 ? (
        <a href={project.links[0].href} target="_blank" rel="noopener noreferrer" className="scroll-scale block aspect-[584/368] w-full overflow-hidden" data-cat-perch={perch}>
          <div className="size-full">
            <Img name={image} width={584} alt={`${alt} (opens ${project.links[0].label.toLowerCase()} in a new tab)`} />
          </div>
        </a>
      ) : (
        <div className="scroll-scale aspect-[584/368] w-full overflow-hidden" data-cat-perch={perch}>
          <div className="size-full">
            <Img name={image} width={584} alt={alt} />
          </div>
        </div>
      )}
      <TileBody project={project} padding="p-6 sm:p-7" />
    </TileShell>
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
        ) : project.links && project.links.length > 1 ? (
          <span className="flex flex-wrap gap-x-5 gap-y-2">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="type-label-s group/link flex items-center gap-2.5 text-ink hover:text-primary">
                {l.label}
                <Icon name="arrow-right" className="transition-transform duration-150 group-hover/link:translate-x-1" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </span>
        ) : project.links ? (
          <>
            <span className="type-label-s text-ink">VIEW ON {project.links[0].label}</span>
            <Icon name="arrow-right" className="text-ink transition-transform duration-150 group-hover:translate-x-1" />
          </>
        ) : null}
        <span className="min-w-px flex-1" />
        <span className="hidden md:contents">
          <Keycap>{project.number}</Keycap>
        </span>
      </div>
    </div>
  );
}
