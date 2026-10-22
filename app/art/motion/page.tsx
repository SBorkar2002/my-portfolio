import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, workJsonLd } from "@/lib/seo";
import { ArtPage, ArtSection, CaseLink, Clip } from "@/components/art/ArtPage";
import { NextPageCard } from "@/components/case/blocks";

export const metadata: Metadata = pageMetadata("/art/motion");

const V = "/video/motion";

const EPISODES: [string, string][] = [
  ["comic-ep1", "EP 01 · LOOP"],
  ["comic-ep2", "EP 02 · GRAPH ENGINEERING"],
  ["comic-ep3", "EP 03 · REMOTE CONTROL"],
  ["comic-ep4", "EP 04 · INSIGHTS"],
  ["comic-ep5", "EP 05 · SYSTEM ONE MODEL"],
  ["comic-pe", "PROMPT ENGINEERING"],
];

// From the series' production notes. Tools and steps only.
const PIPELINE: [string, string][] = [
  ["Script", "Each episode starts as a script. A rough voice pass comes straight after it, before any art, to hear whether the joke lands."],
  ["Panels", "I lay the panels out in Figma and generate the characters in ChatGPT from a fixed cast, one pose or expression at a time."],
  ["Keying", "Generated art comes back on a solid background. A Python script keys it to transparency and lines each new expression up with the face before it."],
  ["Voice", "Each character has an ElevenLabs voice. Takes are spliced and their pace matched, measured in syllables per second."],
  ["Animation", "Remotion puts it together: panel timing, push-ins, mouths that move between drawn open and shut frames, and the small AI character."],
  ["Captions and sound", "Captions are drawn live, one word at a time, from word timings found with Whisper. An ambience bed dips under every line, and sound effects come from a shared library."],
];

export default function Motion() {
  return (
    <ArtPage room="motion" kicker="ART ROOM · MOTION" title="Motion" lead="Comic videos, a webinar launch video and parts of a launch film. Turn the sound on.">
      <JsonLd data={workJsonLd("/art/motion")} />
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
        <div className="flex flex-col gap-5 pt-6">
          <div className="flex flex-col gap-2">
            <h3 className="type-heading-s text-primary">How the videos were made</h3>
            <p className="type-label-s text-muted">CHATGPT · FIGMA · PYTHON · ELEVENLABS · REMOTION · WHISPER</p>
          </div>
          <ol className="grid gap-x-10 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
            {PIPELINE.map(([step, text], i) => (
              <li key={step} className="flex flex-col gap-2 border-t-2 border-line pt-4">
                <span className="type-label-s text-ink">0{i + 1} · {step.toUpperCase()}</span>
                <p className="type-body-s text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </ArtSection>

      <ArtSection kicker="#FUTUREOFHR · 2026" title="Webinar launch video" lead="Twenty seconds in six beats, built in Remotion from Figma styleframes, with synthesised audio.">
        <div className="flex w-full max-w-[420px] flex-col gap-6">
          <Clip src={`${V}/futureofhr-full.mp4`} poster={`${V}/futureofhr-full-poster.webp`} w={4} h={5} title="THE FULL VIDEO" />
          <CaseLink href="/work/futureofhr" kicker="CASE STUDY" title="#futureofhr: the page, the video and the poster" thumb="art_card_hr" alt="" />
        </div>
      </ArtSection>

      <ArtSection kicker="LAUNCH FILM · 2026" title="A B2B SaaS launch film, in parts" lead="Three excerpts from a 2:23 film for engineering leaders. The product is not named here.">
        <div className="grid gap-6 md:grid-cols-3">
          <Clip src={`${V}/film-question.mp4`} poster={`${V}/film-question-poster.webp`} w={16} h={9} title="THE QUESTION" />
          <Clip src={`${V}/film-harness.mp4`} poster={`${V}/film-harness-poster.webp`} w={16} h={9} title="THE HARNESS" />
          <Clip src={`${V}/film-smarter.mp4`} poster={`${V}/film-smarter-poster.webp`} w={16} h={9} title="EVERY WEEK STARTS SMARTER" />
        </div>
        <CaseLink href="/work/video-system" kicker="CASE STUDY" title="How the film was made" thumb="art_card_vid" alt="" />
      </ArtSection>

      <NextPageCard
        label="Next art room"
        kicker="NEXT · ART ROOM"
        title="Comics: webtoon action, client pages and a cricket one-shot"
        href="/art/comics"
        catLine="next: comics!"
        media={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/art_next_comics-560.webp" srcSet="/images/art_next_comics-560.webp 560w, /images/art_next_comics-1120.webp 1120w" sizes="(max-width: 767px) 100vw, 560px" width={560} height={350} alt="Page from The Last Over: a batter hits a six, lettered KATHUNK" loading="lazy" decoding="async" className="block size-full object-cover" />
        }
      />
    </ArtPage>
  );
}
