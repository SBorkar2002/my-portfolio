import type { Metadata } from "next";
import { ArtPage, ArtSection, Panel } from "@/components/art/ArtPage";
import { NextPageCard } from "@/components/case/blocks";
import { Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Comics",
  description: "Action scenes from Sejal's webtoon, client comics for Pocket Toons and a one-shot cricket comic.",
};

const C = "/images/comics";

const STRIPS: [string, string, string][] = [
  ["pt-smack", "SMACK", "A father slaps his daughter, with a big SMACK across the panel"],
  ["pt-ah", "AH!", "Line-art panel of a woman crying out in pain"],
  ["pt-airport", "LEAVE HER ALONE", "A little girl shouts at a man in an airport to protect her mother"],
  ["pt-grit", "GRIT", "A clenched fist and a smiling grey-haired woman, with GRIT lettered beside them"],
  ["pt-reddoor", "THE RED DOOR", "A bloodied woman escapes through a red doorway holding her baby"],
  ["pt-anthony", "FACE-OFF", "A sweating man remembers, and a woman snaps that she is done playing games"],
];

export default function Comics() {
  return (
    <ArtPage
      room="comics"
      kicker="ART ROOM · COMICS"
      title="Comics"
      lead="Action scenes from my webtoon, client comics for Pocket Toons and a one-shot. Each one says how AI was used. Tap any panel to see it large."
    >
      <ArtSection
        kicker="WEBTOON · 2022"
        title="One Last Chance"
        lead={
          <>
            My first webtoon, art and story, on WEBTOON Canvas.{" "}
            <a
              href="https://www.webtoons.com/en/canvas/one-last-chance/list?title_no=772592"
              target="_blank"
              rel="noopener noreferrer"
              className="type-label-s inline-flex items-center gap-2 text-ink hover:text-primary"
            >
              READ IT ON WEBTOON <Icon name="arrow-right" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        }
        ai="None. Story, art and lettering by me."
      >
        <div className="grid grid-cols-2 items-start gap-5 md:grid-cols-3">
          <Panel src={`${C}/olc-kaboom-800.webp`} w={800} h={2080} label="KA BOOM" alt="A fighter is hit in a blast of red and white light, lettered KA BOOM" />
          <Panel src={`${C}/olc-whoosh-800.webp`} w={800} h={2190} label="THE WIND-UP" alt="Narrowed eyes, then a purple strike sweeping past with a WHOOSH" />
          <Panel src={`${C}/olc-finale-800.webp`} w={800} h={2750} label="FINALE AND TITLE" alt="A man reaches out shouting NOOO, then the One Last Chance title card" />
        </div>
      </ArtSection>

      <ArtSection
        kicker="POCKET FM · POCKET TOONS · 2025"
        title="Comic post-production"
        lead="I turned scripts into finished comic pages, then laid out pages and series openings."
        ai="Panels were generated with AI. I retouched them by hand to match each series' style, then did the lettering and the layout."
      >
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {STRIPS.map(([name, label, alt]) => (
            <Panel key={name} src={`${C}/${name}-800.webp`} w={800} h={1420} label={label} alt={alt} />
          ))}
        </div>
        <div className="flex flex-col gap-4 pt-6">
          <p className="type-label-s text-ink">SERIES OPENINGS FOR 9:16 VIDEO · A DRAWING FLIPS TO A FLASHBACK</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Panel key={i} src={`${C}/pt-flip-${i}-540.webp`} full={`${C}/pt-flip-${i}-1080.webp`} w={540} h={960} alt={`Opening frame ${i}: a child's drawing of a family flips to reveal a scribbled-over figure and a flashback`} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-6">
          <p className="type-label-s text-ink">SERIES OPENINGS FOR 9:16 VIDEO · HER FACE IN HIS EYE</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Panel key={i} src={`${C}/pt-eye-${i}-540.webp`} full={`${C}/pt-eye-${i}-1080.webp`} w={540} h={960} alt={`Opening frame ${i}: a surgeon's reveal leaves her ex shocked, her face reflected in his eye`} />
            ))}
          </div>
        </div>
      </ArtSection>

      <ArtSection
        kicker="ONE-SHOT · 2026"
        title="The Last Over"
        lead="A two-page cricket comic: story, character and pages."
        ai="Images generated with Gemini (Nano Banana), and Claude helped plan the story, draft the script and write the prompts. By hand in Photoshop: page layout, compositing, lighting, ball trails and bat swings, sound effects and lettering."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Panel src={`${C}/lastover-p1-1240.webp`} full={`${C}/lastover-p1-2480.webp`} w={1240} h={1754} label="PAGE 1" alt="Page 1: a young batter walks out under stadium lights; the ball hits his helmet grille" />
          <Panel src={`${C}/lastover-p2-1240.webp`} full={`${C}/lastover-p2-2480.webp`} w={1240} h={1754} label="PAGE 2" alt="Page 2: two sixes, a diving fielder and the crowd shouting his name" />
        </div>
      </ArtSection>

      <NextPageCard
        label="Next art room"
        kicker="NEXT · ART ROOM"
        title="Motion: comic videos, a launch video and a film, with sound"
        href="/art/motion"
        catLine="next: the videos!"
        media={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/art_next_motion-560.webp" srcSet="/images/art_next_motion-560.webp 560w, /images/art_next_motion-1120.webp 1120w" sizes="(max-width: 767px) 100vw, 560px" width={560} height={350} alt="Three frames from the comic video series" loading="lazy" decoding="async" className="block size-full object-cover" />
        }
      />
    </ArtPage>
  );
}
