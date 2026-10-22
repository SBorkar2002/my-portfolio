"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../ui";

const gutter = "mx-auto max-w-[1440px] px-[clamp(20px,8.333vw,120px)]";

type Room = "comics" | "motion";

// The four art rooms. Illustration and graphic live on her other portfolios, so those open in a new tab.
const ROOMS = [
  { id: "illustration", label: "ILLUSTRATION", href: "https://www.artstation.com/jen_chan", chip: "bg-peach" },
  { id: "comics", label: "COMICS", href: "/art/comics", chip: "bg-butter" },
  { id: "graphic", label: "GRAPHIC", href: "https://sejalborkarart.my.canva.site/", chip: "bg-sky" },
  { id: "motion", label: "MOTION", href: "/art/motion", chip: "bg-pink" },
] as const;

/** Jump between the art rooms without going back home. */
function ArtNav({ current }: { current: Room }) {
  return (
    <nav aria-label="Art rooms">
      <ul className="flex flex-wrap gap-2.5">
        {ROOMS.map((r) => {
          const here = r.id === current;
          const external = r.href.startsWith("http");
          const cls = `type-label-s inline-flex h-9 items-center gap-2 border-2 border-line px-3 shadow-[0_2px_0_0_var(--line)] transition-colors duration-100 ${
            here ? `${r.chip} text-on-pastel` : "bg-raised text-muted hover:text-primary"
          }`;
          return (
            <li key={r.id}>
              {external ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {r.label}
                  <span aria-hidden="true" className="inline-flex -rotate-45">
                    <Icon name="arrow-right" />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Link href={r.href} aria-current={here ? "page" : undefined} className={cls}>
                  {r.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Shared frame for the art room's sub-pages: a way back, the other rooms, the title and a short lead. */
export function ArtPage({ room, kicker, title, lead, children }: { room: Room; kicker: string; title: string; lead: string; children: ReactNode }) {
  return (
    <div className={`${gutter} flex flex-col gap-16 pt-10 xl:pt-16`}>
      <header className="flex max-w-[760px] flex-col items-start gap-6">
        <Link href="/#art" className="type-label-s inline-flex items-center gap-2.5 text-muted hover:text-primary">
          <Icon name="arrow-left" />
          ART ROOM
        </Link>
        <ArtNav current={room} />
        <p className="type-label-s text-ink">{kicker}</p>
        <h1 className="type-display-l text-primary">{title}</h1>
        <p className="type-body-l text-muted">{lead}</p>
      </header>
      {children}
    </div>
  );
}

export function ArtSection({ kicker, title, lead, ai, children }: { kicker: string; title: string; lead?: ReactNode; ai?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-7 border-t-2 border-line pt-12">
      <div className="flex max-w-[760px] flex-col gap-3">
        <p className="type-label-s text-ink">{kicker}</p>
        <h2 className="type-display-m text-primary">{title}</h2>
        {lead && <p className="type-body-m text-muted">{lead}</p>}
        {ai && (
          <p className="type-body-s mt-1 border-l-4 border-line bg-sunken px-4 py-3 text-primary">
            <span className="type-label-s mr-2 text-ink">AI USE</span>
            {ai}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/** A small preview of a case study: thumbnail, title and an arrow. */
export function CaseLink({ href, kicker, title, thumb, alt }: { href: string; kicker: string; title: string; thumb: string; alt: string }) {
  return (
    <Link
      href={href}
      className="group flex w-full max-w-[420px] items-stretch border-2 border-line bg-raised shadow-[4px_4px_0_0_var(--line)] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--pastel-lilac)]"
    >
      <span className="w-[120px] shrink-0 overflow-hidden border-r-2 border-line bg-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/${thumb}-240.webp`} srcSet={`/images/${thumb}-240.webp 1x, /images/${thumb}-480.webp 2x`} alt={alt} width={120} height={74} loading="lazy" decoding="async" className="block size-full object-cover" />
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3">
        <span className="flex min-w-0 flex-col gap-1">
          <span className="type-label-s text-ink">{kicker}</span>
          <span className="type-body-s font-semibold text-primary">{title}</span>
        </span>
        <span className="text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary">
          <Icon name="arrow-right" />
        </span>
      </span>
    </Link>
  );
}

/** A comic panel that opens large on tap or click (Esc or tap again to close). */
export function Panel({ src, full, w, h, alt, label }: { src: string; full?: string; w: number; h: number; alt: string; label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <figure className="flex min-w-0 flex-col gap-2.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open larger: ${alt}`}
        className="group block w-full overflow-hidden border-2 border-line bg-sunken shadow-[4px_4px_0_0_var(--line)] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--pastel-lilac)]"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" className="block size-full object-cover object-top" />
      </button>
      {label && <figcaption className="type-label-s text-muted">{label}</figcaption>}
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={() => setOpen(false)}
        aria-label={alt}
        className="m-auto max-h-[94dvh] max-w-[min(1100px,96vw)] overflow-auto border-2 border-line bg-page p-0 backdrop:bg-[color-mix(in_srgb,var(--bg-sunken)_85%,transparent)]"
      >
        {open && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={full ?? src} alt={alt} className="block h-auto w-full" />
        )}
      </dialog>
    </figure>
  );
}

/** A video with sound and controls. Only one plays at a time on the page. */
export function Clip({ src, poster, w, h, title, note }: { src: string; poster: string; w: number; h: number; title: string; note?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onPlay = () => document.querySelectorAll("video").forEach((o) => o !== v && o.pause());
    v.addEventListener("play", onPlay);
    return () => v.removeEventListener("play", onPlay);
  }, []);
  return (
    <figure className="flex min-w-0 flex-col gap-2.5">
      <div className="overflow-hidden border-2 border-line bg-[#0b0b0d] shadow-[4px_4px_0_0_var(--line)]" style={{ aspectRatio: `${w} / ${h}` }}>
        <video ref={ref} src={src} poster={poster} controls playsInline preload="none" className="block size-full object-contain" />
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className="type-label-s text-primary">{title}</span>
        {note && <span className="type-body-s text-muted">{note}</span>}
      </figcaption>
    </figure>
  );
}
