import type { Metadata } from "next";
import Link from "next/link";
import { ArtPage, ArtSection, Clip } from "@/components/art/ArtPage";
import { Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Motion",
  description: "Sejal's comic video series, a webinar launch video and excerpts from a launch film, with sound.",
};

const V = "/video/motion";

const EPISODES: [string, string][] = [
  ["comic-ep1", "EP 01 · LOOP"],
  ["comic-ep2", "EP 02 · GRAPH ENGINEERING"],
  ["comic-ep3", "EP 03 · REMOTE CONTROL"],
  ["comic-ep4", "EP 04 · INSIGHTS"],
  ["comic-ep5", "EP 05 · SYSTEM ONE MODEL"],
  ["comic-pe", "PROMPT ENGINEERING"],
];

function More({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="type-label-s inline-flex items-center gap-2 text-ink hover:text-primary">
      {label} <Icon name="arrow-right" />
    </Link>
  );
}

export default function Motion() {
  return (
    <ArtPage kicker="ART ROOM · MOTION" title="Motion" lead="Comic videos, a webinar launch video and parts of a launch film. Turn the sound on.">
      <ArtSection
        kicker="COMIC VIDEO SERIES · EPIFI · 2026"
        title="AI ideas as comic videos"
        lead="Short comic videos that explain AI engineering ideas: format, script, art direction and edit. The best episode passed 30,000 organic views on Instagram."
      >
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
          {EPISODES.map(([name, title]) => (
            <Clip key={name} src={`${V}/${name}.mp4`} poster={`${V}/${name}-poster.webp`} w={9} h={16} title={title} />
          ))}
        </div>
      </ArtSection>

      <ArtSection kicker="#FUTUREOFHR · 2026" title="Webinar launch video" lead="Twenty seconds in six beats, built in Remotion from Figma styleframes, with synthesised audio.">
        <div className="grid items-end gap-6 md:grid-cols-[minmax(0,360px)_1fr]">
          <Clip src={`${V}/futureofhr-full.mp4`} poster={`${V}/futureofhr-full-poster.webp`} w={4} h={5} title="THE FULL VIDEO" />
          <More href="/work/futureofhr" label="READ THE CASE STUDY" />
        </div>
      </ArtSection>

      <ArtSection kicker="LAUNCH FILM · 2026" title="A B2B SaaS launch film, in parts" lead="Three excerpts from a 2:23 film for engineering leaders. The product is not named here.">
        <div className="grid gap-6 md:grid-cols-3">
          <Clip src={`${V}/film-question.mp4`} poster={`${V}/film-question-poster.webp`} w={16} h={9} title="THE QUESTION" />
          <Clip src={`${V}/film-harness.mp4`} poster={`${V}/film-harness-poster.webp`} w={16} h={9} title="THE HARNESS" />
          <Clip src={`${V}/film-coaching.mp4`} poster={`${V}/film-coaching-poster.webp`} w={16} h={9} title="COACHING, STACKED" />
        </div>
        <More href="/work/video-system" label="HOW THE FILM WAS MADE" />
      </ArtSection>
    </ArtPage>
  );
}
