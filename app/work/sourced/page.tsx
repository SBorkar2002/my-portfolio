import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CardRow, CaseHero, CaseLayout, CaseSection, Decision, Facts, NextCard, NumberCard, Stage } from "@/components/case/blocks";
import { TappablePhone } from "@/components/case/TappablePhone";
import { Img } from "@/components/Img";
import { nextLiveProject } from "@/lib/projects";
import { screenSrc } from "@/lib/sourcedApp";

export const metadata: Metadata = {
  title: "Sourced",
  description: "Case study 03: Sourced, an app that verifies human artists and pairs them as Art Buddies. Shaped by a survey of 25+ artists.",
};

// Copy from Figma "Case study · 03 Sourced (Dark)" 55:730.
const rail = ["Overview", "The problem", "Before", "Decisions", "The design", "What I would change"];

const tips: [string, string][] = [
  ["GET STARTED", "Onboarding with three paths"],
  ["HUMAN-MADE / AI ART", "Switch feeds at the top of Home"],
  ["EVIDENCE · 4", "See the process behind a post"],
  ["FLOW TAB", "The streak you keep with buddies"],
  ["INBOX", "WIPs from your buddies"],
];

const keyScreens: [number, string][] = [
  [1, "WELCOME"],
  [4, "HOME"],
  [6, "EVIDENCE"],
  [12, "FLOW"],
  [14, "INBOX"],
];

export default function Sourced() {
  const next = nextLiveProject(3);
  return (
    <CaseLayout rail={rail}>
      <CaseHero
        kicker="CASE STUDY 03 / 06"
        tag="personal"
        company="SOLO PROJECT · MOBILE APP"
        title="Sourced: human-made and AI art, side by side"
        lead="Art you can trace back to a human, and buddies who keep you making it."
        meta={[
          ["FOCUS", "Authenticity and motivation"],
          ["PLATFORM", "Mobile app"],
          ["RESEARCH", "Survey, 25+ respondents"],
          ["TOOLS", "Google Forms, Figma, Photoshop"],
          ["TIMELINE", "2025, redesigned in 2026"],
        ]}
      >
        {/* Try it (55:756): the live phone and how to use it. */}
        <Stage className="flex flex-col items-center gap-10 px-6 py-8 md:flex-row md:gap-14 md:px-14 md:py-12">
          <div className="flex w-full max-w-[340px] shrink-0 justify-center">
            <TappablePhone start={1} size="hero" label="Try the app" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[18px]">
            <p className="type-label-s text-ink">TRY THE APP</p>
            <p className="type-heading-s max-w-[400px] text-primary">Tap around. This is the real prototype, all 20 screens.</p>
            <dl className="w-full">
              {tips.map(([key, text]) => (
                <div key={key} className="flex items-start gap-3 border-t-2 border-line pt-2.5 pb-[18px] last:pb-0">
                  <dt className="type-label-s w-[150px] shrink-0 text-primary">{key}</dt>
                  <dd className="type-body-s min-w-0 flex-1 text-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Stage>
      </CaseHero>

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="What it is"
        lead="Every artist has felt it. You post your work and it disappears into a feed flooded with AI-generated images. Nobody can tell what is human-made anymore, and nobody is waiting for your next piece. Sourced was built to fix both at once."
      >
        <Facts
          items={[
            ["25+", "PEOPLE SURVEYED"],
            ["92.9%", "WANT AI ART VERIFIED"],
            ["50%", "ASKED FOR TWO SEPARATE SECTIONS"],
            ["82.1%", "SAY A BUDDY WOULD PUSH THEM"],
          ]}
        />
        <ol className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {keyScreens.map(([n, label]) => (
            <li key={label} className="flex min-w-0 flex-col gap-2.5">
              <div className="aspect-[168/374] overflow-hidden rounded-[18px] border-2 border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={screenSrc(n)} alt={`Sourced ${label.toLowerCase()} screen`} loading="lazy" decoding="async" className="block size-full object-cover" />
              </div>
              <p className="type-label-s text-muted">{label}</p>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection
        n={2}
        kicker="02 · THE PROBLEM"
        title="Human-made work was not disappearing. It was getting lost."
        lead="As an artist myself, I watched platforms I loved fill up with AI-generated content. Visibility was only half of it. There were two problems, feeding each other."
      >
        <CardRow>
          {[
            [
              "PROBLEM 01 · AUTHENTICITY",
              "No way to prove it is human",
              "Small artists, freelancers and hobbyists posted into a mixed feed with no way to show their work was genuine.",
              "var(--pastel-peach)",
            ],
            [
              "PROBLEM 02 · MOTIVATION",
              "No one waiting for the next piece",
              "Artists were not finishing work because nobody was waiting for it. No community holding them to it.",
              "var(--pastel-peach)",
            ],
            ["THE QUESTION", "Could one platform solve both?", "One system for proof and for showing up, without it feeling like homework.", "var(--pastel-butter)"],
          ].map(([label, title, body, shadow]) => (
            <div
              key={label}
              className="flex min-w-0 flex-1 flex-col gap-3 border-2 border-line bg-raised px-5 pt-5 pb-[22px] shadow-[6px_6px_0_0_var(--card-shadow)]"
              style={{ "--card-shadow": shadow } as CSSProperties}
            >
              <p className="type-label-s text-muted">{label}</p>
              <h3 className="type-body-m font-semibold text-primary">{title}</h3>
              <p className="type-body-s text-muted">{body}</p>
            </div>
          ))}
        </CardRow>
        <p className="type-label-s text-ink">THE RESEARCH · A SURVEY OF 25+ PEOPLE, BOTH SIDES OF THE AI DEBATE</p>
        <div className="flex w-full flex-col items-start gap-6 md:flex-row">
          <div className="aspect-[560/583] w-full shrink-0 overflow-hidden border-2 border-line md:w-[60.9%]">
            <Img
              name="cs03_survey"
              width={560}
              alt="Survey charts: 50% oppose AI art, 82.1% agree a buddy would push them, 50% want two separate sections, 92.9% want platforms to verify AI art"
            />
          </div>
          <figure className="flex min-w-0 flex-1 flex-col items-start gap-[18px] border-2 border-line bg-raised p-6 shadow-[6px_6px_0_0_var(--pastel-lilac)]">
            <p className="type-label-s text-ink">IN THEIR WORDS</p>
            <blockquote className="type-body-l text-primary">
              “If I have someone to hold me accountable I would want to draw, and I would be eager to show them my improvements too.”
            </blockquote>
            <figcaption className="type-label-s text-muted">SURVEY RESPONDENT</figcaption>
            <p className="type-body-s text-muted">
              Most artists practised only when inspired. Nearly all wanted AI and human art told apart. Half asked for two separate sections, not a ban.
            </p>
          </figure>
        </div>
      </CaseSection>

      <CaseSection
        n={3}
        kicker="03 · BEFORE"
        title="Where it started"
        lead="The 2025 version. The product thinking held up, the visual layer did not."
      >
        <div className="aspect-[920/1100] w-full overflow-hidden border-2 border-line">
          <Img
            name="cs03_before2025"
            width={916}
            position="top"
            alt="Twelve screens from the 2025 version of Sourced: welcome, buddy list, feeds, profiles, upload, inbox and send WIP"
          />
        </div>
      </CaseSection>

      <CaseSection n={4} kicker="04 · DECISIONS" title="Five calls that shaped it" lead="Every phone below is live. Tap it.">
        <div className="flex w-full flex-col gap-7">
          <Decision
            n="01"
            title="Separate, do not exclude"
            chose="Two feeds, verified human-made and AI, one tap apart. AI posts are clearly labelled and never mix into the human feed."
            cut="The original idea: a platform for human-made art only."
            why="Several respondents said AI artists deserve a space too, and half of all answers asked for two clearly separate sections."
          >
            <Phones pair={[[4, "TAP “AI ART” AT THE TOP"], [5, "THE AI FEED"]]} />
          </Decision>
          <Decision
            n="02"
            title="Make the process the proof"
            chose="Every human-made post carries its process: WIP steps, dates and tools, shown as an evidence timeline."
            cut="A badge on its own, with nothing behind it."
            why="92.9% wanted platforms to verify AI art. A badge asks for trust. Process earns it."
          >
            <Phones pair={[[9, "SHOW YOUR PROCESS"], [6, "EVIDENCE ON A POST"]]} />
          </Decision>
          <Decision
            n="03"
            title="Pair artists as Art Buddies"
            chose="Human artists pick buddies who see their daily WIP and confirm it. Each confirmation keeps both their Flows going."
            cut="One-sided adding. Each pick is now a request the other artist accepts."
            why="82.1% said a buddy would push them to do better. Accountability only works if both sides opted in."
          >
            <Phones pair={[[3, "PICK ART BUDDIES"], [13, "SEND A WIP"]]} />
          </Decision>
          <Decision
            n="04"
            title="Turn consistency into Flow"
            chose="Flow counts the days in a row you send a WIP. Buddies see it, and a nudge pings a buddy who has not sent today’s."
            cut="Day numbers stamped on every post. Posts now just say when."
            why="Most artists practised only when inspired. A streak you share makes showing up the default."
          >
            <Phones pair={[[12, "YOUR FLOW"], [15, "CONFIRM A BUDDY’S DAY"]]} />
          </Decision>
          <Decision
            n="05"
            title="Three ways in"
            chose="Onboarding asks how you will use Sourced: browse, post human-made work, or post AI art. AI posts skip the evidence step."
            cut="One onboarding that sent everyone into buddy setup."
            why="Not everyone is here to post, and Art Buddies are only for human artists."
          >
            <Phones pair={[[2, "HOW WILL YOU USE SOURCED"], [8, "POSTING AI ART"]]} />
          </Decision>
        </div>
      </CaseSection>

      <CaseSection
        n={5}
        kicker="05 · THE DESIGN"
        title="Mapped first, then built from one system"
        lead="I mapped eight areas and every path before drawing a screen, sketched the flows in low fidelity, then built a component library so every screen is assembled from it."
      >
        <Facts
          items={[
            ["20", "SCREENS"],
            ["42", "COMPONENTS AND VARIANTS"],
            ["5", "COLOUR TOKENS"],
            ["83", "PROTOTYPE HOTSPOTS"],
          ]}
        />
        <div className="flex w-full flex-col items-start gap-10 md:flex-row md:gap-6">
          <figure className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="aspect-[448/759] w-full overflow-hidden border-2 border-line">
              <Img name="cs03_ia" width={448} alt="Information architecture of eight areas and the full user flow" />
            </div>
            <figcaption className="type-label-s text-muted">INFORMATION ARCHITECTURE AND USER FLOW</figcaption>
          </figure>
          <figure className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="aspect-[448/730] w-full overflow-hidden border-2 border-line">
              <Img name="cs03_system" width={448} alt="Low fidelity sketches, colour tokens, type and the component library" />
            </div>
            <figcaption className="type-label-s text-muted">LOW FIDELITY, TOKENS AND COMPONENTS</figcaption>
          </figure>
        </div>
      </CaseSection>

      <CaseSection
        n={6}
        kicker="06 · WHAT I WOULD CHANGE"
        title="What it taught me"
        lead="The designer’s job is not to be right from the start. It is to change direction when the evidence points elsewhere."
      >
        <CardRow>
          <NumberCard
            n="01"
            shadow="var(--pastel-butter)"
            title="What I underestimated"
            body="Turning findings into design. One system for proof and for motivation, without it feeling like homework, took far more iteration than I expected."
          />
          <NumberCard
            n="02"
            shadow="var(--pastel-butter)"
            title="Revisiting the UI"
            body="The product thinking held up, the visual layer did not. I rebuilt it on a component library and closed the gaps: three ways in and an AI posting path."
          />
          <NumberCard
            n="03"
            shadow="var(--pastel-butter)"
            title="What comes next"
            body="Hiring and commissions. A public Flow and buddy-confirmed work already make a trust profile."
          />
        </CardRow>
      </CaseSection>

      <NextCard
        project={next}
        media={
          <div className="grid size-full grid-cols-2 items-center gap-[6%] bg-sunken px-[8%]">
            {[
              ["w01_intro", "Shipped intro screen"],
              ["w01_result", "Shipped result screen"],
            ].map(([name, alt]) => (
              <div key={name} className="aspect-[320/275] border-2 border-line bg-white shadow-[4px_4px_0_0_var(--line)]">
                <Img name={name} width={320} alt={alt} />
              </div>
            ))}
          </div>
        }
      />
    </CaseLayout>
  );
}

/** Two live phones side by side inside a stage (decision visuals 56:752 and siblings). */
function Phones({ pair }: { pair: [number, string][] }) {
  return (
    <Stage className="flex flex-col items-center justify-center gap-10 px-6 py-8 sm:flex-row sm:items-start sm:gap-12 sm:px-8 sm:py-9">
      {pair.map(([start, label]) => (
        <figure key={label} className="flex w-full max-w-[256px] flex-col items-center gap-3">
          <TappablePhone start={start} label={label} />
          <figcaption className="type-label-s text-center text-muted">{label}</figcaption>
        </figure>
      ))}
    </Stage>
  );
}
