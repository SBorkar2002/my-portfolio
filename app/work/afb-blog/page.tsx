import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, workJsonLd } from "@/lib/seo";
import { CaseHero, CaseSummary, CaseLayout, CaseSection, Facts, Figure, NextCard, NumberCard, Shot, Stage } from "@/components/case/blocks";
import { Img } from "@/components/Img";
import { nextLiveProject, projectByNumber } from "@/lib/projects";

export const metadata: Metadata = pageMetadata("/work/afb-blog");

// Built in code from the Figma file (72tXrfMYH64v0hkxDF1m2n, node 114-1729), the local exports and inventory/external.md.
const rail = ["Overview", "Decisions", "What shipped", "Print and merch"];

export default function AfbBlog() {
  const project = projectByNumber(4)!;
  const next = nextLiveProject(4);
  return (
    <CaseLayout rail={rail}>
      <JsonLd data={workJsonLd("/work/afb-blog")} />
      <CaseHero
        kicker="CASE STUDY 04 / 06"
        tag="shipped"
        company="APPSFORBHARAT"
        title={project.title}
        lead="I designed the home, article and category pages for the company blog, with one visual identity per category."
        links={project.links}
        meta={[
          ["ROLE", "Design Intern"],
          ["COMPANY", "AppsForBharat"],
          ["PLATFORM", "Desktop and mobile web"],
          ["PAGES", "Home, article, category"],
          ["YEAR", "2026"],
        ]}
      >
        <Shot name="afb_home" w={920} h={791} priority alt="Blog home: Inside AFB, a featured post, category tabs and a card grid" />
      </CaseHero>

      <CaseSummary
        problem="AppsForBharat needed a company blog where readers can tell topics apart at a glance, on desktop and on mobile."
        did={[
          "I designed the home, article and category templates.",
          "I gave each of the 7 categories its own painterly thumbnail.",
          "I designed a custom hero for each article, and wrote one of the posts.",
        ]}
        result="Live at blog.appsforbharat.com."
      />

      <CaseSection
        n={1}
        kicker="01 · OVERVIEW"
        title="What it is"
        lead="I designed Inside AFB, the AppsForBharat company blog: a featured post, category tabs, a card grid and a subscribe band, for desktop and mobile."
      >
        <Facts
          items={[
            ["3", "PAGE TEMPLATES"],
            ["7", "CATEGORIES"],
          ]}
        />
      </CaseSection>

      <CaseSection n={2} kicker="02 · DECISIONS" title="Two calls that shaped it">
        <div className="grid w-full gap-5 md:grid-cols-2">
          <NumberCard
            n="01"
            shadow="var(--pastel-peach)"
            title="One thumbnail per category"
            body="I gave every card in a category one shared painterly thumbnail, so the grid reads by topic at a glance: a teal hand for Tech, a lotus for Design, a conch for Product, a banyan for People & Culture."
          />
          <NumberCard
            n="02"
            shadow="var(--pastel-peach)"
            title="A custom hero inside each article"
            body="I designed a custom hero for each article, in a maroon and saffron AFB style. The listing says which category, the article tells its own story."
          />
        </div>
      </CaseSection>

      <CaseSection
        n={3}
        kicker="03 · WHAT SHIPPED"
        title="Live at blog.appsforbharat.com"
        lead="The blog is live, and I wrote for it too: “What Working on Employer Branding Taught Me About Design”."
      >
        <Stage className="flex flex-col items-center justify-center gap-8 p-6 sm:flex-row sm:items-end md:p-8">
          <Figure below label="MOBILE HOME" name="afb_phone" w={240} h={507} alt="Blog home on mobile: header, featured post and the first cards" />
        </Stage>
      </CaseSection>

      <CaseSection
        n={4}
        kicker="04 · PRINT AND MERCH"
        title="Also at AFB"
        lead="Alongside the blog, I designed a buddy tee, appreciation cards and a Women’s Day card for the team."
      >
        <Stage className="flex flex-wrap items-end justify-center gap-6 p-6 md:p-8">
          <Figure below label="BUDDY TEE" name="afb_tee" w={290} h={290} alt="Buddy tee design: two colleagues on a music player screen" />
          <Figure below label="APPRECIATION CARD" name="afb_card" w={290} h={375} alt="Employee appreciation card in a character style" />
          <Figure below label="WOMEN’S DAY CARD" name="afb_womensday" w={290} h={375} alt="Women's Day card illustration" />
        </Stage>
      </CaseSection>

      <NextCard project={next} media={<Img name="cs01_hero_intro" width={400} alt="Shipped lead-gen assessment intro screen" />} />
    </CaseLayout>
  );
}
