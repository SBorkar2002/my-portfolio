import type { Metadata } from "next";
import { CaseHero, CaseLayout, CaseSection, Facts, NextCard, Shot } from "@/components/case/blocks";
import { Img } from "@/components/Img";
import { nextLiveProject, projectByNumber } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Marketing site",
  description: "Case study 01: five feature pages and a 20-component library for the Tetriz marketing site, shipped in production Next.js.",
};

// Built in code from the home tile copy and PLAN.md (no Figma page). Captures are of the live public site.
const rail = ["Overview", "What shipped"];

export default function MarketingSite() {
  const project = projectByNumber(1)!;
  const next = nextLiveProject(1);
  return (
    <CaseLayout rail={rail}>
      <CaseHero
        kicker="CASE STUDY 01 / 06"
        tag="shipped"
        company="EPIFI · TETRIZ"
        title={project.title}
        lead="Five feature pages in production Next.js, composed from one shared kit."
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

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="What it is"
        lead="Tetriz is Epifi’s B2B engineering-intelligence platform. Its marketing site got five feature pages, all composed from one shared kit, and a simpler feature nav."
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
        kicker="02 · WHAT SHIPPED"
        title="Live on tetriz.ai"
        lead="The feature nav went from a pillar taxonomy to a flat five. AI Adoption is one of the pages, live today."
      >
        <Shot name="mkt_shift" w={920} h={329} alt="AI Adoption page section: From guesswork to ground truth, without and with Tetriz" />
      </CaseSection>

      <NextCard project={next} media={<Img name="w03_sourced" width={584} alt="Three Sourced app screens" />} />
    </CaseLayout>
  );
}
