import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { ArtRoom, Contact, Experience } from "@/components/home/Sections";
import { ScrollMemory } from "@/components/home/ScrollMemory";
import { SectionRail } from "@/components/home/SectionRail";
import { Work } from "@/components/home/Work";
import { personJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <ScrollMemory />
      <SectionRail />
      <Hero />
      <Work />
      <Experience />
      <ArtRoom />
      <Contact />
    </>
  );
}
