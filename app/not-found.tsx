import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-start gap-7 px-[clamp(20px,8.333vw,120px)] pt-24 pb-32">
      <p className="type-label-s text-ink">404 · PAGE NOT FOUND</p>
      <h1 className="type-display-l text-primary">Nothing here.</h1>
      <Button href="/" label="BACK TO HOME" icon="arrow-right" />
    </section>
  );
}
