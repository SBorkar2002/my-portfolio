import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, workJsonLd } from "@/lib/seo";
import { CaseHero, CaseSummary, CaseLayout, CaseSection, Figure, NextCard, NumberCard, Shot, Stage } from "@/components/case/blocks";
import { Img } from "@/components/Img";
import { LoopVideo } from "@/components/LoopVideo";
import { nextLiveProject } from "@/lib/projects";

export const metadata: Metadata = pageMetadata("/work/video-system");

// The film is unannounced: the product is never named on this page, and every image was checked for its name and logo.
const rail = ["Overview", "Script and storyboard", "The build", "Voice and captions", "Iterations"];

export default function VideoSystem() {
  const next = nextLiveProject(5);
  return (
    <CaseLayout rail={rail}>
      <JsonLd data={workJsonLd("/work/video-system")} />
      <CaseHero
        kicker="CASE STUDY 05 / 06"
        tag="shipped"
        company="EPIFI · 2026"
        title="Making a B2B SaaS launch film"
        lead="I took it from script to final render, with reusable skill files in the repo and review gates."
        meta={[
          ["FILM", "2:23, 14 scenes"],
          ["FORMAT", "1920 x 1080, 30 fps"],
          ["BUILT IN", "Remotion"],
          ["VOICE", "ElevenLabs, Whisper timings"],
          ["AUDIENCE", "CTOs and engineering leaders"],
        ]}
      >
        <div className="aspect-video w-full overflow-hidden border-2 border-line bg-[#f1f2f6] shadow-[4px_4px_0_0_var(--line)]">
          <LoopVideo
            src="/video/recommendations"
            poster="/video/recommendations-poster.webp"
            label="Excerpt from the film: a recommendations table fills in row by row"
          />
        </div>
      </CaseHero>

      <CaseSummary
        problem="A launch film had to explain four product levers to CTOs, and the early scripts read as surface level."
        did={[
          "I rewrote the script as a spine, one line per beat, each tied to the real screen that proves it.",
          "I storyboarded 18 Figma frames and built every scene as its own Remotion file with Claude Code.",
          "I set the voice and caption rules and wrote them back into reusable skill files.",
        ]}
        result="A 2:23 film in 14 scenes, taken through a leadership pass and three rounds of product feedback."
      />

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="A film built like a product"
        lead="I made a launch film for a B2B SaaS product, aimed at CTOs. Every scene is code, I logged every change, and the rules I learned went back into skill files so the next video starts further ahead."
      />

      <CaseSection
        n={2}
        kicker="02 · SCRIPT AND STORYBOARD"
        title="Spine first, then frames"
        lead="Early scripts read as surface level, so I changed the method: a bones-only spine first, one line per beat, each with the real screen that proves it. Visuals carry the depth; the voice states the outcome."
      >
        <div className="grid w-full gap-5 md:grid-cols-3">
          <NumberCard n="01" shadow="var(--accent-lime)" title="Hard script rules" body="Numbers are shown in the UI, never spoken. Screen-only terms are never voiced. Each claim is grounded in a spec." />
          <NumberCard n="02" shadow="var(--accent-lime)" title="A persistent map" body="Four levers stay on screen with the current one emphasised, so viewers always know where they are." />
          <NumberCard n="03" shadow="var(--accent-lime)" title="18 Figma frames" body="Ten beats from the spine, split into sub-frames for one engineer, the team and the org." />
        </div>
        <Stage className="grid gap-8 p-6 md:p-8">
          <Figure below label="STORYBOARD · EVERY PROMPT, SCORED" name="vid_sb1" w={920} h={426} alt="Storyboard frame: a lever map on top and a prompt quality score card for one engineer" />
          <Figure below label="STORYBOARD · RECOMMENDATIONS" name="vid_sb2" w={920} h={426} alt="Storyboard frame: recommendations for the harness lever" />
        </Stage>
      </CaseSection>

      <CaseSection
        n={3}
        kicker="03 · THE BUILD"
        title="One file per scene, measured not eyeballed"
        lead="I built each scene as its own Remotion file with Claude Code, stitched into one film with shared pieces for the camera, word reveals and the lever map. My loop: edit, render a still, read it, adjust. I checked cuts by transcribing the render and pixel-diffing continuation frames."
      >
        <Stage className="flex flex-wrap items-start justify-center gap-6 p-6 md:p-8">
          <Figure below label="PRUNE BEAT" name="vid_st1" w={440} h={248} alt="Film still: the prune beat" />
          <Figure below label="POP REVEAL, MID WAVE" name="vid_st2" w={440} h={248} alt="Film still: a memory grid revealing left to right" />
          <Figure below label="FOUR LEVERS" name="vid_st3" w={440} h={248} alt="Film still: four levers stacked" />
        </Stage>
        <p className="type-body-s text-muted">On-screen numbers in the film are storyboard mocks, not live data.</p>
      </CaseSection>

      <CaseSection
        n={4}
        kicker="04 · VOICE AND CAPTIONS"
        title="Never cut a word"
        lead="I never edit the master voice file. Pacing comes from playback windows I cut only inside measured silence, with a short tail after every word. On a new read, I re-time beats from word timings instead of shifting them by a constant."
      >
        <div className="grid w-full gap-5 md:grid-cols-3">
          <NumberCard n="01" shadow="var(--pastel-lilac)" title="Two caption tiers" body="Small captions carry the full line, always. Large emphasis captions appear only for lines with real value, above them, and never at the same time." />
          <NumberCard n="02" shadow="var(--pastel-lilac)" title="Motion lands on its words" body="A reveal starts on the word it illustrates. Nothing else moves with it, and a label never comes before the thing it names." />
          <NumberCard n="03" shadow="var(--pastel-lilac)" title="Calm by rule" body="No tilting, no overlaps, a zoom needs a target, and continuation frames hard-cut with matched positions." />
        </div>
      </CaseSection>

      <CaseSection
        n={5}
        kicker="05 · ITERATIONS"
        title="Review gates, then rules in the repo"
        lead="My first full cut ran 1:41 and came back with four fixes, which I made the same day. Later rounds added a leadership pass and three rounds of product feedback. I logged every change in a decision log, and wrote the rules that kept coming up back into the skill files through pull requests."
      />

      <NextCard project={next} media={<Img name="cs01_hero_intro" width={400} alt="Shipped lead-gen assessment intro screen" />} />
    </CaseLayout>
  );
}
