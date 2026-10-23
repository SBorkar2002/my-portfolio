import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, workJsonLd } from "@/lib/seo";
import { CaseHero, CaseSummary, CaseLayout, CaseSection, Figure, NextCard, NumberCard, Shot, Stage } from "@/components/case/blocks";
import { Img } from "@/components/Img";
import { LoopVideo } from "@/components/LoopVideo";
import { nextLiveProject, projectByNumber } from "@/lib/projects";

export const metadata: Metadata = pageMetadata("/work/futureofhr");

// Built in code from the Figma file (page "06 · New direction · The Call"), its direction board and the Remotion launch video.
const rail = ["Overview", "The direction", "Landing page", "Video and poster"];

export default function FutureOfHr() {
  const project = projectByNumber(3)!;
  const next = nextLiveProject(3);
  return (
    <CaseLayout rail={rail}>
      <JsonLd data={workJsonLd("/work/futureofhr")} />
      <CaseHero
        kicker="CASE STUDY 03 / 06"
        tag="take-home"
        company="INSTAHYRE TAKE-HOME"
        title={project.title}
        lead="2020 moved hiring onto a video call. So I made the page the call."
        meta={[
          ["BRIEF", "Webinar launch kit"],
          ["EVENT", "The Future of Remote Hiring"],
          ["DELIVERED", "Landing page, video, poster"],
          ["VIDEO", "20 s, built in Remotion"],
          ["YEAR", "2026"],
        ]}
      >
        <Shot name="hr_hero" w={920} h={820} priority alt="Landing page hero in cobalt: The Future of Remote Hiring, with panelists as video call tiles and an empty tile for you, on mute" />
      </CaseHero>

      <CaseSummary
        problem="Hiring moved onto video calls in 2020. The brief asked for a launch kit that gets people to sign up for a free webinar about it."
        did={[
          "I designed the landing page as the call itself, with panelists as tiles and the visitor as the empty tile, on mute.",
          "I built a 20 second launch video in Remotion from my Figma styleframes.",
          "I made a 4:5 LinkedIn poster in the same four-colour system.",
        ]}
        result="A complete take-home kit: the landing page design, the launch video and the poster."
      />

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="What it is"
        lead="A live webinar, The Future of Remote Hiring: free, online, 60 minutes and a live Q&A with three panelists. My brief was the launch kit: a landing page, a launch video and a LinkedIn poster."
      />

      <CaseSection
        n={2}
        kicker="02 · THE DIRECTION"
        title="The Call"
        lead="I made the page the call. The panelists are tiles, the agenda is a chapter bar, and the visitor is the empty tile, on mute. The scroll is a story: you can sit back and learn, the best question wins a prize, and the pass at the end reads “Seat for You”."
      >
        <Shot name="hr_board" w={920} h={703} alt="Direction board: The Call, with the four colours cobalt, lime, ink and paper" />
        <div className="grid w-full gap-5 md:grid-cols-3">
          <NumberCard
            n="01"
            shadow="var(--accent-lime)"
            title="Colour carries meaning"
            body="I used four colours. Lime only ever means live or act: live dots, buttons, the contest. Never decoration."
          />
          <NumberCard
            n="02"
            shadow="var(--accent-lime)"
            title="Every graphic is from a call"
            body="I borrowed every graphic from a video call: the tile, the empty tile, the live pass, the redline, the chapter bar and the prize pass."
          />
          <NumberCard
            n="03"
            shadow="var(--accent-lime)"
            title="Motion with a job"
            body="I gave every section a reveal as it scrolls in. No bounce, and no fade on its own."
          />
        </div>
        <Shot name="hr_motifs" w={920} h={537} alt="Motifs from the board: a speaker tile, the empty You tile, the live pass and the redline" />
      </CaseSection>

      <CaseSection
        n={3}
        kicker="03 · LANDING PAGE"
        title="One scroll, one call"
        lead="Hero, the shift, the panel, the run of show, a contest where the best question wins, and registration. I built each section as a prototype component with its own reveal states."
      >
        <Stage className="grid gap-8 p-6 md:p-8">
          <Figure below label="THE SHIFT" name="hr_shift" w={920} h={837} alt="The shift: redlined before and after pairs, interview rooms to video calls, local hiring to hiring from anywhere" />
          <Figure below label="THE CONTEST" name="hr_contest" w={920} h={728} alt="Contest section in lime: The best question wins, with a prize pass and a question queue" />
        </Stage>
      </CaseSection>

      <CaseSection
        n={4}
        kicker="04 · VIDEO AND POSTER"
        title="The launch video and the poster"
        lead="I built a 20 second launch video in six beats in Remotion, from my Figma styleframes, with synthesised audio. Then I made a 4:5 LinkedIn poster in the same system."
      >
        <Stage className="flex flex-col items-center justify-center gap-8 p-6 sm:flex-row sm:items-start md:p-8">
          <figure className="flex w-full max-w-[360px] flex-col gap-2.5">
            <div className="aspect-[4/5] overflow-hidden border-2 border-line shadow-[4px_4px_0_0_var(--line)]">
              <LoopVideo
                src="/video/futureofhr"
                poster="/video/futureofhr-poster.webp"
                label="Launch video excerpt: speaker tiles join the call one by one, then the prize pass wipes in"
              />
            </div>
            <figcaption className="type-label-s text-muted">LAUNCH VIDEO · PANEL AND PRIZE BEATS</figcaption>
          </figure>
          <Figure below label="LINKEDIN POSTER" name="hr_poster" w={400} h={500} alt="LinkedIn poster: The Future of Remote Hiring, a call grid and a seat for you" />
        </Stage>
      </CaseSection>

      <NextCard project={next} media={<Img name="afb_home" width={920} alt="AppsForBharat blog home page" position="top" />} />
    </CaseLayout>
  );
}
