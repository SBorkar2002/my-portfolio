// Link000 from Skiper UI (https://skiper-ui.com, skiper40, free with credit). An underline that grows on hover, CSS only.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function UnderlineLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center",
        className,
        "before:pointer-events-none before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100 motion-reduce:before:transition-none",
      )}
    >
      {children}
    </a>
  );
}
