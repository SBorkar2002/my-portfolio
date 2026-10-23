import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, workJsonLd } from "@/lib/seo";
import { CardRow, CaseHero, CaseSummary, CaseLayout, CaseSection, Facts, Figure, NextCard, NumberCard, Shot, Stage } from "@/components/case/blocks";
import { Img } from "@/components/Img";
import { nextLiveProject, projectByNumber } from "@/lib/projects";

export const metadata: Metadata = pageMetadata("/work/marketing-site");

// Built in code from Sejal's notes, the home tile copy and PLAN.md (no Figma page). Every image is a capture of the live public site.
const rail = ["Overview", "The problem", "Decisions", "What shipped"];

export default function MarketingSite() {
  const project = projectByNumber(1)!;
  const next = nextLiveProject(1);
  return (
    <CaseLayout rail={rail}>
      <JsonLd data={workJsonLd("/work/marketing-site")} />
      <CaseHero
        kicker="CASE STUDY 01 / 06"
        tag="shipped"
        company="EPIFI · TETRIZ"
        title={project.title}
        lead="I turned flat, generic feature pages into an interactive, consistent, product-accurate story."
        links={project.links}
        meta={[
          ["COMPANY", "Epifi Technologies"],
          ["PRODUCT", "Tetriz marketing site"],
          ["PAGES", "5 feature pages"],
          ["LIBRARY", "20 components"],
          ["YEAR", "2026"],
        ]}
      >
        <Shot name="mkt_hero" w={920} h={406} priority alt="Live Tetriz feature page: Adoption isn't logins. It's shipped work." />
      </CaseHero>

      <CaseSummary
        problem="Tetriz’s feature pages read as flat and generic. The story did not build, the graphs were static and unclear, and the pages did not look like the real product."
        did={[
          "I rebuilt five feature pages in production Next.js with Claude Code, from one shared kit of 20 components.",
          "I redesigned the charts so they explain themselves, with steppers, hover context and labels that never collide.",
          "I restructured the nav so every surface sits under Features.",
        ]}
        result="All five pages are live on tetriz.ai, including AI ROI, a page I built from scratch."
      />

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="What it is"
        lead="Tetriz is Epifi’s B2B engineering-intelligence platform. I rebuilt five of its feature pages from one shared kit, and simplified the feature nav."
      >
        <Facts
          items={[
            ["5", "FEATURE PAGES"],
            ["20", "COMPONENTS IN THE KIT"],
          ]}
        />
      </CaseSection>

      <CaseSection
        n={2}
        kicker="02 · THE PROBLEM"
        title="Flat pages that did not look like the product"
        lead="The old feature pages read as flat, generic and AI-made. The story did not build, the graphs were unclear and static, and the pages did not look like the real product. My goal: a guided, product-grade story, consistent across every page."
      />

      <CaseSection n={3} kicker="03 · DECISIONS" title="Four calls that shaped it">
        <div className="grid w-full gap-5 md:grid-cols-2">
          <NumberCard
            n="01"
            shadow="var(--pastel-lilac)"
            title="One story, told the same way everywhere"
            body="I built one shared “At org scale” scroller, one contributor rolling up to the org, and reused it on AI Adoption, AI Impact, Session Security and AI ROI. I turned “Why us” and the deep dives into scrollytelling with click-to-jump."
          />
          <NumberCard
            n="02"
            shadow="var(--pastel-lilac)"
            title="Graphs that explain themselves"
            body="I redrew the maturity chart to show two trajectories and the gap between them, with levels on the axes and an interactive level stepper. On AI Impact I replaced a box quadrant with a radar progress meter with hover context. Labels never overlap the curve or leave the plot."
          />
          <NumberCard
            n="03"
            shadow="var(--pastel-lilac)"
            title="Match the real product"
            body="I rebuilt AI Impact to the reference: hero, before and after, a research stat band with count-up, a cycle-time dashboard. I built AI ROI from scratch and rebuilt the Session Security hero around the real flags view."
          />
          <NumberCard
            n="04"
            shadow="var(--pastel-lilac)"
            title="A nav with a clear hierarchy"
            body="The old nav made it hard to tell what sits under what. I took Product, Pricing and Company out, added FAQ, and put every surface under Features."
          />
        </div>
        <p className="type-body-s text-muted">My polish rules across every page: short subtexts, nothing under the hero CTAs, distinct real avatars.</p>
      </CaseSection>

      <CaseSection
        n={4}
        kicker="04 · WHAT SHIPPED"
        title="Live on tetriz.ai"
        lead="I built AI ROI new, from a hero through a 4-step “how the number is built”, three lenses, org scale and an FAQ. All of these pages are live."
      >
        <Stage className="grid gap-8 p-6 md:p-8">
          <Figure below label="AI IMPACT" name="mkt_ai_impact" w={920} h={409} alt="Live AI Impact page hero: Faster is half the answer. Quality is the other half." />
          <Figure below label="AI ROI" name="mkt_ai_roi" w={920} h={409} alt="Live AI ROI page hero: Every ROI number gets litigated. This one is built to survive it." />
          <Figure below label="SESSION SECURITY" name="mkt_session_security" w={920} h={409} alt="Live Session Security page hero with the security flags view" />
          <Figure below label="AI ADOPTION" name="mkt_shift" w={920} h={329} alt="AI Adoption page section: From guesswork to ground truth, without and with Tetriz" />
        </Stage>
        <CardRow>
          <p className="type-body-l text-primary">I turned flat, generic feature pages into an interactive, consistent, product-accurate story.</p>
        </CardRow>
      </CaseSection>

      <NextCard project={next} media={<Img name="w03_sourced" width={584} alt="Three Sourced app screens" />} />
    </CaseLayout>
  );
}
