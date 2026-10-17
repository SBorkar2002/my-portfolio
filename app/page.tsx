import { Hero } from "@/components/home/Hero";
import { ArtRoom, Contact, Experience } from "@/components/home/Sections";
import { Work } from "@/components/home/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <ArtRoom />
      <Contact />
    </>
  );
}
