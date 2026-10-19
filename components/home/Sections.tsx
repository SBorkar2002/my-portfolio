"use client";

import { type CSSProperties, type ReactNode } from "react";
import { links, socials } from "@/lib/projects";
import { Img } from "../Img";
export { Experience } from "./Experience";
import { ArtCollage, RevealArt } from "./ArtCollage";
import { ARROW_UP, Doodle, PixelGlyph, ToolButton } from "./Doodle";
import { UnderlineLink } from "../vendor/underline-link";
import { Button, Icon, SectionTitle } from "../ui";

const gutter = "mx-auto max-w-[1440px] px-[clamp(20px,8.333vw,120px)]";

const categories = [
  {
    label: "ILLUSTRATION",
    color: "var(--pastel-peach)",
    chip: "bg-peach",
    line: "Jeneko, 2020 to now",
    note: "38 PIECES ON ARTSTATION",
    href: "https://www.artstation.com/jen_chan",
    pieces: [
      ["a_ill_1", "Painted illustration of a girl asleep in a dreamlike landscape"],
      ["a_ill_2", "Painted portrait of a silver-haired woman with a dragon"],
      ["a_ill_3", "Portrait study of a woman in a dark coat"],
      ["a_ill_4", "Character illustration in red and black"],
    ],
  },
  {
    label: "COMICS",
    color: "var(--pastel-butter)",
    chip: "bg-butter",
    line: "Webtoon, Pocket FM, The Last Over",
    note: "SOLO AND CLIENT WORK",
    href: "https://www.webtoons.com/en/canvas/one-last-chance/list?title_no=772592",
    pieces: [
      ["a_com_1", "Comic panel of a bearded man thinking"],
      ["a_com_2", "Comic page with action panels and sound effects"],
      ["a_com_3", "Comic panel of two children talking at a table"],
      ["a_com_4", "Line art comic panel of a couple at a cafe"],
    ],
  },
  {
    label: "GRAPHIC",
    color: "var(--pastel-sky)",
    chip: "bg-sky",
    line: "Brand, print, merch, social",
    note: "CAFE, STARTUP, TAKE-HOMES",
    href: "https://sejalborkarart.my.canva.site/",
    pieces: [
      ["a_gra_1", "Cafe student offer poster"],
      ["a_gra_2", "Illustrated appreciation card"],
      ["a_gra_3", "2025 UX Challenges carousel cover"],
      ["a_gra_4", "The Future of Remote Hiring poster"],
    ],
  },
  {
    label: "MOTION",
    color: "var(--pastel-pink)",
    chip: "bg-pink",
    line: "Comic series, launch films",
    note: "BEST EPISODE 30,000+ VIEWS",
    href: null,
    pieces: [
      ["a_mot_1", "Frame from a comic series episode"],
      ["a_mot_2", "Frame from a comic series episode with a single character"],
      ["a_mot_3", "Frame from the #futureofhr launch video"],
      ["a_mot_4", "Frame from a launch film"],
    ],
  },
] as const;

/** Art room preview (Figma 28:466). The full art room page is not designed yet. */
export function ArtRoom() {
  return (
    <section id="art" aria-labelledby="art-title" className="relative isolate border-t-2 border-line">
      <ArtCollage />
      <div className={`${gutter} flex flex-col gap-10 pt-16 pb-20 lg:pt-24 lg:pb-32`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6" data-cat-perch="art-room" data-reveal>
          <div className="flex max-w-[560px] flex-col gap-3">
            <SectionTitle kicker="03 · ART ROOM" title="Art, comics, graphics, motion" id="art-title" />
            <p className="type-body-m text-muted">Drawing since 2020. It is still part of how I design.</p>
          </div>
          <span className="min-w-px flex-1" />
          <RevealArt />
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((c, i) => (
            <li
              key={c.label}
              data-reveal
              className="self-start border-2 border-line bg-raised shadow-pixel-8"
              style={{ "--pixel-shadow": c.color, "--reveal-delay": `${i * 80}ms` } as CSSProperties}
            >
              <CardLink href={c.href}>
                <div className="grid grid-cols-2 gap-0.5 bg-sunken">
                  {c.pieces.map(([name, alt]) => (
                    <div key={name} className="aspect-square">
                      <Img name={name} width={140} alt={alt} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start gap-2 px-5 pt-[18px] pb-5">
                  <span className={`type-label-s px-2 py-1.5 text-on-pastel ${c.chip}`}>{c.label}</span>
                  <p className="type-body-m text-primary">{c.line}</p>
                  <p className="type-label-s text-muted">{c.note}</p>
                </div>
              </CardLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CardLink({ href, children }: { href: string | null; children: ReactNode }) {
  if (!href) return <div className="flex flex-col overflow-hidden">{children}</div>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex flex-col overflow-hidden">
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Contact and footer (Figma 28:524). The cat sits in the empty space beside the heading, and the whole section is a
    doodle canvas. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="contact-paper relative isolate border-t-2 border-line bg-sunken">
      <div className={`${gutter} flex flex-col items-start gap-9 pt-20 pb-14 lg:pt-28`}>
        <div className="flex w-full flex-col gap-9 lg:flex-row lg:items-stretch">
          <div className="flex min-w-0 flex-col items-start gap-9 lg:w-[min(720px,60%)]">
            <p className="type-label-s text-ink">04 · CONTACT</p>
            <h2 id="contact-title" data-reveal className="type-display-l text-primary">
              Hiring a product designer?
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={`mailto:${links.email}`} label="EMAIL ME" />
              <Button href={links.resume} label="RESUME" icon="download" kind="secondary" download />
              <p data-no-doodle className="type-body-l break-all text-primary">{links.email}</p>
            </div>
            <ul className="flex flex-wrap gap-x-7 gap-y-4 pt-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <UnderlineLink href={s.href} className="type-label-s gap-2 text-primary hover:text-ink">
                    {s.label}
                    <Icon name="arrow-right" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </UnderlineLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Empty on purpose: the cat sits here. */}
          <div data-cat-perch="contact" aria-hidden="true" className="h-[240px] w-full lg:h-auto lg:min-h-[400px] lg:flex-1" />
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 pt-10" data-cat-perch="footer">
          <p className="type-label-s text-muted">SEJAL BORKAR · BENGALURU</p>
          <span className="min-w-px flex-1" />
          <Doodle />
          <ToolButton
            label="Back to top"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
            }
          >
            <PixelGlyph rows={ARROW_UP} />
          </ToolButton>
        </div>
      </div>
    </section>
  );
}
