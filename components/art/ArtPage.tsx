"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../ui";

const gutter = "mx-auto max-w-[1440px] px-[clamp(20px,8.333vw,120px)]";

/** Shared frame for the art room's sub-pages: a way back, the title and a short lead. */
export function ArtPage({ kicker, title, lead, children }: { kicker: string; title: string; lead: string; children: ReactNode }) {
  return (
    <div className={`${gutter} flex flex-col gap-16 pt-10 pb-28 xl:pt-16`}>
      <header className="flex max-w-[760px] flex-col items-start gap-6">
        <Link href="/#art" className="type-label-s inline-flex items-center gap-2.5 text-muted hover:text-primary">
          <Icon name="arrow-left" />
          ART ROOM
        </Link>
        <p className="type-label-s text-ink">{kicker}</p>
        <h1 className="type-display-l text-primary">{title}</h1>
        <p className="type-body-l text-muted">{lead}</p>
      </header>
      {children}
    </div>
  );
}

export function ArtSection({ kicker, title, lead, children }: { kicker: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-7 border-t-2 border-line pt-12">
      <div className="flex max-w-[760px] flex-col gap-3">
        <p className="type-label-s text-ink">{kicker}</p>
        <h2 className="type-display-m text-primary">{title}</h2>
        {lead && <p className="type-body-m text-muted">{lead}</p>}
      </div>
      {children}
    </section>
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
