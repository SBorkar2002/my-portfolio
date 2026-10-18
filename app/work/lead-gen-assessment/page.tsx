import type { Metadata } from "next";
import {
  BeforeAfter,
  CardRow,
  CaseHero,
  CaseLayout,
  CaseSection,
  Decision,
  Facts,
  Figure,
  NextCard,
  NumberCard,
  PullRequests,
  Shot,
  Stage,
  StageArrow,
} from "@/components/case/blocks";
import { Img } from "@/components/Img";
import { nextLiveProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Lead-gen assessment",
  description: "Case study 01: a lead-gen assessment for Tetriz, redesigned around the answers people gave and shipped to production.",
};

// Copy from Figma "Case study · 01 Lead-gen assessment (Dark)" 39:704.
const rail = ["Overview", "The problem", "Before", "Decisions", "What shipped", "What I would change"];

export default function LeadGenAssessment() {
  const next = nextLiveProject(6);
  return (
    <CaseLayout rail={rail}>
      <CaseHero
        kicker="CASE STUDY 06 / 06"
        tag="shipped"
        company="EPIFI · TETRIZ"
        title="Lead-gen assessment, redesigned and shipped"
        lead="From an internal model on a screen to a result people recognise as their own."
        meta={[
          ["TIMELINE", "July 2026"],
          ["TEAM", "Me, a design lead, an engineer, a content lead"],
          ["FOCUS", "UX, UI, front-end"],
          ["PLATFORM", "Desktop and mobile web"],
          ["SHIPPED", "3 pull requests to production"],
        ]}
      >
        {/* Hero visual (39:730): a fixed 920 x 520 composition that scales down as one piece. */}
        <Stage className="flex aspect-[920/520] items-start justify-center gap-[3.48%] px-[4.35%] pt-[5.2%]">
          <div className="w-[43.5%] shrink-0">
            <Shot name="cs01_hero_intro" w={400} h={343} priority alt="Shipped intro: How AI-native is your engineering org? with a hidden preview of the result" />
          </div>
          <div className="w-[43.5%] shrink-0">
            <Shot name="cs01_hero_result" w={400} h={557} priority alt="Shipped result: Deploying, 39 out of 100, a five-stage stepper, what you told us and one next move" />
          </div>
        </Stage>
      </CaseHero>

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="What it is"
        lead="Tetriz is Epifi’s B2B engineering-intelligence platform. Before launch, the team ran a LinkedIn quiz for engineering leaders: answer a few questions, find out how AI-native your org is. It was the top of the sales funnel."
      >
        <ol className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {[
            ["cs01_flow_intro", "1 · INTRO", "Intro screen", true],
            ["cs01_flow_questions", "2 · QUESTIONS", "A question with four answer tiles", true],
            ["cs01_flow_result", "3 · RESULT", "Result screen with stage, score and answers", false],
            ["cs01_flow_email", "4 · EMAIL", "Email step: Want the full breakdown?", true],
            ["cs01_flow_share", "5 · SHARE CARD", "Share card: You are a Deploying org", false],
          ].map(([name, label, alt, contain]) => (
            <li key={name as string} className="flex min-w-0 flex-col gap-2.5">
              <div className="h-[200px]">
                <div className="h-full overflow-hidden border-2 border-line bg-white shadow-[4px_4px_0_0_var(--line)]">
                  <FlowImage name={name as string} alt={alt as string} contain={contain as boolean} />
                </div>
              </div>
              <p className="type-label-s text-muted">{label as string}</p>
            </li>
          ))}
        </ol>
        <Facts
          items={[
            ["19", "QUESTIONS"],
            ["6", "SCREENS"],
            ["5", "RESULT STATES"],
            ["3", "PULL REQUESTS MERGED"],
          ]}
        />
      </CaseSection>

      <CaseSection
        n={2}
        kicker="02 · THE PROBLEM"
        title="It explained our model, not their org"
        lead="The first build shipped fast and it worked, but it read like an internal document. The result opened on three pillar scores the reader had never heard of, then a feedback-loop meter and a capped score. And the intro promised no email, on a page whose job was to start sales conversations."
      >
        <CardRow>
          <NumberCard
            n="01"
            labelTitle
            shadow="var(--pastel-peach)"
            title="INTERNAL WORDS ON SCREEN"
            body="Observe, Transform, Govern: the team’s mental model, shown without explanation."
          />
          <NumberCard
            n="02"
            labelTitle
            shadow="var(--pastel-peach)"
            title="A RESULT YOU COULD NOT TRACE"
            body="Scores with no visible link back to the answers that made them."
          />
          <NumberCard
            n="03"
            labelTitle
            shadow="var(--pastel-peach)"
            title="A FUNNEL THAT PROMISED NO FUNNEL"
            body="“No email required” on a page built to capture leads."
          />
        </CardRow>
      </CaseSection>

      <CaseSection n={3} kicker="03 · BEFORE" title="Where it started">
        <div className="flex w-full flex-col items-start gap-10 md:flex-row md:gap-6">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <p className="type-label-s text-muted">INTRO</p>
            <Shot name="cs01_before_intro" w={448} h={199} alt="Original intro: AI is increasing engineering activity everywhere. Activity is not advantage." />
            <div className="w-full border-2 border-dashed border-line px-4 py-3.5">
              <p className="type-label-s text-muted">INTERNAL CHART HIDDEN HERE. IT WAS NOT FOR DISTRIBUTION.</p>
            </div>
            <Shot name="cs01_before_footer" w={448} h={81} alt="Original intro footer: No email required, 16 questions, about 5 minutes, no data sent anywhere" />
            <p className="type-body-s text-muted">The footer promised “no email required” on a lead-gen page.</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <p className="type-label-s text-muted">RESULT</p>
            <Shot name="cs01_before_result" w={448} h={640} top alt="Original result: Piloting, pillar scores for Observe, Transform and Govern, a feedback loop meter and a diagnosis" />
            <p className="type-body-s text-muted">Pillar scores, a feedback-loop meter and a paragraph of diagnosis before any next step.</p>
          </div>
        </div>
      </CaseSection>

      <CaseSection n={4} kicker="04 · DECISIONS" title="Five calls that shaped it">
        <div className="flex w-full flex-col gap-7">
          <Decision
            n="01"
            title="Open on a curiosity gap"
            chose="A hidden preview of their own result, three things they will get, one tension line and a single “Reveal my stage” button."
            cut="A five-stage spectrum with a “you?” marker. It oriented people but gave them no reason to start."
            why="People start a quiz for the payoff. Showing its shape, still hidden, makes the payoff real."
          >
            <BeforeAfter
              before={{ name: "cs01_d1_before", w: 330, h: 147, alt: "Original intro headline and paragraph" }}
              after={{ name: "cs01_d1_after", w: 380, h: 326, top: true, alt: "New intro with a hidden result preview and a Reveal my stage button" }}
            />
          </Decision>

          <Decision
            n="02"
            title="Show people their own answers"
            chose="Stage and score, a stepper of all five stages, one line on what holds them back, the four things they told us and one next move."
            cut="Pillar scores, the gate box, the feedback-loop meter and the “capped score” wording."
            why="A result you can trace to your own answers is one you believe, and one you are willing to share."
          >
            <BeforeAfter
              before={{ name: "cs01_d2_before", w: 340, h: 480, top: true, alt: "Original result with pillar scores" }}
              after={{ name: "cs01_d2_after", w: 340, h: 480, top: true, alt: "New result with stage, score, stepper and the answers people gave" }}
            />
          </Decision>

          <Decision
            n="03"
            title="Keep two scoring tracks apart"
            chose="Context answers come back as “What you told us”. Scored answers drive the stage and score. Two blocks, nothing linking them."
            cut="A layout I explored that nested the context answers under the pillar scores, as if they were evidence for them."
            why="The quiz scores 11 questions and only displays 4 more. Mixing them would claim something the scoring never measured."
          >
            <Stage className="flex flex-col p-6 md:p-8">
              <Track
                from={["TRACK A · 4 CONTEXT QUESTIONS", "Lifecycle breadth, sentiment, adoption, review burden."]}
                to={["WHAT YOU TOLD US", "Shown back with a colour for each answer. Never scored."]}
                shadow="var(--pastel-butter)"
              />
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="h-0.5 max-w-[260px] flex-1 border-t-2 border-dashed border-muted" />
                <span className="type-label-s shrink-0 text-muted">KEPT APART</span>
                <span className="h-0.5 max-w-[260px] flex-1 border-t-2 border-dashed border-muted" />
              </div>
              <Track
                from={["TRACK B · 11 SCORED QUESTIONS", "The answers the index actually measures."]}
                to={["STAGE AND SCORE", "The only thing the scored answers produce."]}
                shadow="var(--pastel-lilac)"
              />
            </Stage>
          </Decision>

          <Decision
            n="04"
            title="Ask for the email, honestly"
            chose="A clear step after the result: “Want the full breakdown?” with one work-email field. It later shipped as a required name and email gate."
            cut="The “no email required, no data sent anywhere” promise on the intro."
            why="The page existed to start conversations. A promise the funnel would break on day one costs more than a short form."
          >
            <BeforeAfter
              before={{ name: "cs01_d4_before", w: 360, h: 65, alt: "Original footer: No email required, no data sent anywhere" }}
              after={{ name: "cs01_d4_after", w: 380, h: 269, alt: "New email step: Want the full breakdown? with one work email field" }}
            />
          </Decision>

          <Decision
            n="05"
            title="Design every outcome, not just the demo"
            chose="All five stage results, each with real per-stage data from the scoring doc: score, the gate holding them, their answers, their next move."
            cut="One polished result with placeholder copy for the other four."
            why="Every visitor sees exactly one of these. Each one has to stand on its own."
          >
            <Stage className="flex flex-wrap items-center justify-center gap-3 p-6 md:p-8">
              {["PILOTING", "DEPLOYING", "INTEGRATING", "REINVENTING", "COMPOUNDING"].map((stage) => (
                <div key={stage} className="flex min-w-[112px] flex-col gap-2.5" style={{ flex: "0 1 158px" }}>
                  <p className="type-label-s text-muted">{stage}</p>
                  <Shot name={`cs01_st_${stage.toLowerCase()}`} w={158} h={220} top alt={`Result screen for the ${stage.toLowerCase()} stage`} />
                </div>
              ))}
            </Stage>
          </Decision>
        </div>
      </CaseSection>

      <CaseSection
        n={5}
        kicker="05 · WHAT SHIPPED"
        title="Merged to production"
        lead="I built the redesign in the production codebase with Claude Code and merged it behind the full CI review gate. The quiz is offline now that the company is winding down, so these are captures of the shipped build and its designs."
      >
        <Stage className="flex flex-wrap items-end justify-center gap-7 px-6 py-8 md:flex-nowrap md:px-10 md:py-9">
          <Figure below label="MOBILE INTRO" name="cs01_ship_mobile_intro" w={180} h={390} alt="Mobile intro screen" />
          <Figure below label="MOBILE STEPPER" name="cs01_ship_mobile_stepper" w={180} h={390} alt="Mobile result with a vertical stepper of the five stages" />
          <Figure below label="SHARE CARD" name="cs01_ship_share" w={320} h={390} top alt="Share card: You are a Deploying org, with a position chart" />
        </Stage>
        <PullRequests
          items={[
            [
              "#6611",
              "Colour, tiles and a fairer score",
              "Matched the build to the Figma colours, coloured each answer tile by its strength, and added a tiered gate so a perfect score needs all five lifecycle stages.",
            ],
            [
              "#6649",
              "Sharing and resuming",
              "LinkedIn share captions that copy in one tap, resume on refresh, and a quieter retake link.",
            ],
            [
              "#6686",
              "Email gate, position chart, mobile",
              "Ported everything to the 19-question version: a required name and email gate, a two-axis position chart, and a full mobile pass with a vertical stepper.",
            ],
          ]}
        />
      </CaseSection>

      <CaseSection n={6} kicker="06 · WHAT I WOULD CHANGE" title="Three things I would do differently">
        <CardRow>
          <NumberCard
            n="01"
            shadow="var(--pastel-butter)"
            title="Ship the tracking with the first PR"
            body="I never got completion or lead numbers before the company wound down, so I cannot say how much the new intro helped."
          />
          <NumberCard
            n="02"
            shadow="var(--pastel-butter)"
            title="Test the questions with real leads"
            body="A few questions, like “instrument PR rework rate”, were still the team’s own jargon."
          />
          <NumberCard
            n="03"
            shadow="var(--pastel-butter)"
            title="Design mobile first"
            body="The mobile pass came last. The stepper and answer tiles should have started at 390px."
          />
        </CardRow>
      </CaseSection>

      <NextCard project={next} media={<Img name="w02_features" width={584} alt="Tetriz AI Adoption feature page" />} />
    </CaseLayout>
  );
}

function FlowImage({ name, alt, contain }: { name: string; alt: string; contain: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${name}-168.webp`}
      srcSet={`/images/${name}-168.webp 1x, /images/${name}-336.webp 2x`}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`block size-full object-top ${contain ? "object-contain" : "object-cover"}`}
    />
  );
}

function Track({ from, to, shadow }: { from: [string, string]; to: [string, string]; shadow: string }) {
  const box = (title: string, body: string) => (
    <div
      className="flex w-full flex-col gap-1.5 border-2 border-line bg-raised px-4 py-3.5 md:w-[330px]"
      style={{ boxShadow: `4px 4px 0 0 ${shadow}` }}
    >
      <p className="type-label-s text-primary">{title}</p>
      <p className="type-body-s text-muted">{body}</p>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-5 md:flex-row md:gap-6">
      {box(...from)}
      <StageArrow />
      {box(...to)}
    </div>
  );
}
