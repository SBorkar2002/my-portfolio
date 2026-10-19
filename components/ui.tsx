import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export type IconName = "arrow-right" | "arrow-left" | "download" | "moon" | "sun" | "cat";

export function Icon({ name, size = 16, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${className}`}
      style={{ "--icon": `url(/icons/${name}.svg)`, width: size, height: size } as CSSProperties}
    />
  );
}

/** Keyboard hint (Figma Keycap 10:17): 2px border with a 2px hard shadow under it. */
export function Keycap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={`type-key inline-flex min-w-[26px] shrink-0 items-center justify-center border-2 border-line bg-raised px-[7px] py-[6px] text-primary shadow-[0_2px_0_0_var(--line)] ${className}`}
    >
      {children}
    </kbd>
  );
}

export type TagKind = "shipped" | "personal" | "take-home" | "client";

const tagStyles: Record<TagKind, string> = {
  shipped: "bg-mint",
  personal: "bg-pink",
  "take-home": "bg-butter",
  client: "bg-sky",
};

/** Provenance tag (Figma Tag 10:27). Text is always on-pastel. */
export function Tag({ kind }: { kind: TagKind }) {
  return (
    <span className={`type-label-s inline-flex shrink-0 px-2 py-1.5 text-on-pastel ${tagStyles[kind]}`}>
      {kind.toUpperCase()}
    </span>
  );
}

type ButtonProps = {
  href: string;
  label: string;
  kind?: "primary" | "secondary";
  icon?: IconName;
  download?: boolean;
  external?: boolean;
  className?: string;
};

/** Square button (Figma Button 10:36). Primary: lilac with a 4px hard shadow. Secondary: 2px outline. */
export function Button({ href, label, kind = "primary", icon = "arrow-right", download, external, className = "" }: ButtonProps) {
  const look =
    kind === "primary"
      ? "bg-lime text-on-pastel shadow-pixel-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--text-primary)]"
      : "border-2 border-primary text-primary hover:bg-primary hover:text-page";
  const classes = `type-label-m inline-flex shrink-0 items-center gap-2.5 px-[18px] py-[14px] transition-[transform,box-shadow,background-color,color] duration-100 ${look} ${className}`;
  const content = (
    <>
      {label}
      <Icon name={icon} />
    </>
  );
  if (download || external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(download ? { download: "" } : {})}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Section kicker + Display M title (Figma "Section head"). */
export function SectionTitle({ kicker, title, id }: { kicker: string; title: string; id?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="type-label-s text-ink">{kicker}</p>
      <h2 id={id} className="type-display-m text-primary">
        {title}
      </h2>
    </div>
  );
}
