"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { links, liveProjects, projectByNumber, projects } from "@/lib/projects";
import { setTheme } from "@/lib/theme";
import { Keycap } from "./ui";

type Chrome = {
  openSheet: () => void;
  announce: (message: string) => void;
};

const ChromeContext = createContext<Chrome | null>(null);

export function useChrome() {
  const value = useContext(ChromeContext);
  if (!value) throw new Error("useChrome must be used inside <SiteChrome>");
  return value;
}

/** Home sections reachable with W A E C (Figma prototype, Home notes 30:811). */
export const homeSections = [
  { key: "W", id: "work", label: "Work" },
  { key: "A", id: "art", label: "Art room" },
  { key: "E", id: "experience", label: "Experience" },
  { key: "C", id: "contact", label: "Contact" },
] as const;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scrolls to an element and moves focus there so keyboard users land in the right place. */
export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
  return true;
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function comingSoon(n: number) {
  return `Case study 0${n} is coming soon`;
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const announce = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(""), 2600);
  }, []);

  const openSheet = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const closeSheet = useCallback(() => dialogRef.current?.close(), []);

  const openProject = useCallback(
    (n: number) => {
      const project = projectByNumber(n);
      if (!project) return;
      if (project.href) router.push(project.href);
      else announce(comingSoon(n));
    },
    [router, announce],
  );

  const goToSection = useCallback(
    (id: string) => {
      if (isHome) jumpTo(id);
      else router.push(`/#${id}`);
    },
    [isHome, router],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || isTyping(e.target)) return;
      const key = e.key;

      if ((e.metaKey || e.ctrlKey) && key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) closeSheet();
        else openSheet();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (dialogRef.current?.open) return; // the dialog handles its own keys (Esc closes it)

      if (key === "?") {
        e.preventDefault();
        openSheet();
        return;
      }

      const lower = key.toLowerCase();
      if (lower === "t") return setTheme("light");
      if (lower === "d") return setTheme("dark");

      const section = homeSections.find((s) => s.key.toLowerCase() === lower);
      if (section) {
        e.preventDefault();
        goToSection(section.id);
        return;
      }

      if (/^[1-6]$/.test(key)) {
        e.preventDefault();
        const n = Number(key);
        if (isHome) openProject(n);
        else jumpTo(`section-${n}`);
        return;
      }

      if (!isHome && key === "Escape") {
        router.push("/");
        return;
      }

      if (!isHome && (key === "ArrowRight" || key === "ArrowLeft")) {
        const index = liveProjects.findIndex((p) => p.href === pathname);
        if (index === -1) return;
        const step = key === "ArrowRight" ? 1 : -1;
        const target = liveProjects[(index + step + liveProjects.length) % liveProjects.length];
        if (target.href) router.push(target.href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isHome, pathname, router, openSheet, closeSheet, openProject, goToSection]);

  const value = useMemo(() => ({ openSheet, announce }), [openSheet, announce]);

  return (
    <ChromeContext.Provider value={value}>
      {children}
      <ShortcutSheet ref={dialogRef} onClose={closeSheet} onProject={openProject} onSection={goToSection} />
      <div
        role="status"
        aria-live="polite"
        className={`type-label-s pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 border-2 border-line bg-raised px-4 py-3 text-primary shadow-pixel-4 [--pixel-shadow:var(--pastel-lilac)] transition-opacity duration-150 ${message ? "opacity-100" : "opacity-0"}`}
      >
        {message}
      </div>
    </ChromeContext.Provider>
  );
}

type SheetProps = {
  ref: Ref<HTMLDialogElement>;
  onClose: () => void;
  onProject: (n: number) => void;
  onSection: (id: string) => void;
};

/** Stand-in for the ⌘K palette and ? sheet, which are not designed yet. It reuses the
    jump-in panel styling and only lists what already exists on the home page. */
function ShortcutSheet({ ref, onClose, onProject, onSection }: SheetProps) {
  const rowClass =
    "flex w-full items-center gap-3.5 border-t-2 border-line py-3 text-left transition-colors duration-100 hover:text-ink focus-visible:text-ink";
  return (
    <dialog
      ref={ref}
      aria-label="Jump to and shortcuts"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-48px)] w-[min(440px,calc(100vw-40px))] overflow-y-auto border-2 border-line bg-raised p-0 text-primary shadow-pixel-8 backdrop:bg-[color-mix(in_srgb,var(--bg-sunken)_70%,transparent)]"
    >
      <div className="px-6 py-5">
        <div className="flex items-start gap-3 pb-3">
          <p className="type-label-s text-ink">JUMP STRAIGHT IN</p>
          <span className="flex-1" />
          <button type="button" onClick={onClose} className="type-label-s flex items-center gap-2 text-muted hover:text-primary">
            CLOSE <Keycap>ESC</Keycap>
          </button>
        </div>
        {projects.map((p) => (
          <button
            key={p.number}
            type="button"
            className={`${rowClass} ${p.href ? "" : "text-muted"}`}
            onClick={() => {
              onClose();
              onProject(p.number);
            }}
          >
            <Keycap>{p.number}</Keycap>
            <span className="type-body-m flex-1">{p.name}</span>
            <span className="type-label-s text-muted">{p.href ? p.tag.toUpperCase() : "COMING SOON"}</span>
          </button>
        ))}
        <p className="type-label-s border-t-2 border-line pt-5 pb-3 text-ink">SECTIONS</p>
        {homeSections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={rowClass}
            onClick={() => {
              onClose();
              onSection(s.id);
            }}
          >
            <Keycap>{s.key}</Keycap>
            <span className="type-body-m flex-1">{s.label}</span>
          </button>
        ))}
        <a href={links.resume} download="" className={rowClass}>
          <Keycap>↓</Keycap>
          <span className="type-body-m flex-1">Resume (PDF)</span>
        </a>
        <p className="type-label-s border-t-2 border-line pt-5 pb-3 text-ink">KEYS</p>
        <ul className="type-body-s text-muted">
          <li className="flex items-center gap-3 border-t-2 border-line py-3">
            <span className="flex gap-1.5">
              <Keycap>T</Keycap>
              <Keycap>D</Keycap>
            </span>
            Light and dark
          </li>
          <li className="flex items-center gap-3 border-t-2 border-line py-3">
            <span className="type-label-s flex items-center gap-1.5">
              <Keycap>1</Keycap>TO<Keycap>6</Keycap>
            </span>
            On a case study: jump to a section
          </li>
          <li className="flex items-center gap-3 border-t-2 border-line py-3">
            <Keycap>ESC</Keycap>
            On a case study: back to all work
          </li>
        </ul>
      </div>
    </dialog>
  );
}
