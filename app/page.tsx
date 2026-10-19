import { Hero } from "@/components/home/Hero";
import { ArtRoom, Contact, Experience } from "@/components/home/Sections";
import { SectionRail } from "@/components/home/SectionRail";
import { Work } from "@/components/home/Work";

export default function Home() {
  return (
    <>
      <SectionRail />
      <Hero />
      <Work />
      <Experience />
      <ArtRoom />
      <Contact />
    </>
  );
}
