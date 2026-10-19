# Sejal Borkar · portfolio

The portfolio of Sejal Borkar, product designer. Live at [sejalborkar.vercel.app](https://sejalborkar.vercel.app).

Pixel chrome, HD work: pixel type, keycaps and icons frame the site, while every piece of work is shown at full resolution in a readable body font. It is built for a recruiter in a hurry, so everything is one click or one key away.

## What is in this version

- Home: hero with a jump-in panel, selected work, experience, art room preview, contact.
- Sourced (`/work/sourced`), with 11 tappable phones running the exported app screens and the same 83 hotspots as the Figma prototype, plus its Behance case study.
- Lead-gen assessment (`/work/lead-gen-assessment`), linked under "More work".
- Projects without an inner page link straight to their source in a new tab (AFB Figma and live blog). Art room cards link to ArtStation, Webtoon and the Canva graphics site.
- Light and dark themes. The site follows the system setting until a visitor picks one; the choice is saved in `localStorage`.

## Keyboard shortcuts

| Where | Keys | Does |
|---|---|---|
| Everywhere | `W` `A` `E` `C` | Work, Art room, Experience, Contact |
| Everywhere | `T` / `D` | Light / dark theme |
| Everywhere | `?` or `⌘K` / `Ctrl+K` | Jump list and shortcut sheet |
| Home | `1` to `6` | Open a project: its case study, its source in a new tab, or its tile |
| Case study | `1` to `6` | Jump to a section from the contents rail |
| Case study | `Esc` | Back to home |
| Case study | `←` / `→` | Previous / next live case study |

Shortcuts are ignored while typing in a form field. Motion respects `prefers-reduced-motion`.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, every route prerendered as static HTML)
- [Tailwind CSS](https://tailwindcss.com) v4, with the colour tokens from the Figma variables in `app/globals.css`
- Google Fonts through `next/font` (self-hosted at build time): Jersey 15 for headings, Silkscreen for labels and keys, Rethink Sans for body text
- No animation libraries: effects are CSS, small canvas and SVG pieces, and three vendored free components. Native scroll.

## Run locally

Needs Node 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes a production build and `npm run typecheck` runs TypeScript.

## Folder structure

```
app/
  layout.tsx                    fonts, theme script, nav, shortcut layer, cat slot
  globals.css                   colour tokens (light and dark), type styles, pixel shadows
  page.tsx                      home
  work/lead-gen-assessment/     case study 01
  work/sourced/                 case study 03
components/
  ui.tsx                        Keycap, Tag, Button, Icon, SectionTitle
  Nav.tsx, ThemeToggle.tsx      top bar
  SiteChrome.tsx                keyboard shortcuts, jump sheet, notices
  home/                         home page sections
  case/                         case study layout, rail, blocks, tappable phone
  cat/                          the pixel cat and its nav toggle
lib/
  projects.ts                   project list, links, socials
  sourcedApp.ts                 Sourced prototype screens and hotspots
  theme.ts                      theme helpers
  cat/                          cat frames (generated), sprite renderer, on/off preference
public/
  images/                       optimised WebP files (1x and 2x)
  icons/                        pixel icons from the Figma UI kit, used as CSS masks
  Sejal_Borkar_Resume.pdf
scripts/
  optimise-images.mjs           turns source images into the WebP files in public/images
  export-cat-frames.mjs         copies the cat frames from the cat studio export
```

## Design source

The Figma file "Pixel portfolio · v1" is the source of truth for layout, copy and tokens. Images are exported from it, optimised with `scripts/optimise-images.mjs` and served from `public/images`. Nothing is hot-linked.

### The cat

The pixel cat lives on the home page. Its art (cat v2, 48 x 48 frames and timings) is owned by the cat studio; `scripts/export-cat-frames.mjs` copies it from the studio's `frames.json` into `lib/cat/frames.ts`:

```bash
node scripts/export-cat-frames.mjs ~/Documents/career/portfolio-pixel/cat-v2/preview/frames.json
```

`components/cat/CatLayer.tsx` draws it on one canvas at a whole-pixel scale in device pixels, with the colours from the `--cat-*` tokens, so it swaps with the theme. It moves between five perches marked with `data-cat-perch` (from the Home notes in Figma): it lands on the jump-in panel, walks along tile 01 and sits beside "Selected work", peeks over the Sourced tile, sits by the art room title and sleeps by the footer. Click or tap it to pet it.

Rules it follows: it never covers text, links or images (each spot is checked against the content around it, and the cat skips a spot that does not fit), it only animates while its spot is on screen and the tab is visible, phones get only the panel and footer spots, `prefers-reduced-motion` gets a still cat at the panel and the footer, and the cat button in the nav hides it (the choice is remembered).

## Deploy

Vercel deploys from GitHub: every push builds a preview, and `main` is production. `vercel.json` pins the framework to Next.js, because this project used to be a Vite site.

## The old site

The previous React and Vite portfolio is kept on the [`old-portfolio`](https://github.com/SBorkar2002/my-portfolio/tree/old-portfolio) branch and the `old-portfolio-final` tag (commit `e0dbd46`). Its history is also still part of `main`.

## Credits

- Light Lines from [Vengeance UI](https://www.vengenceui.com) (MIT, Ashutoshx7/VengeanceUI), adapted in `components/vendor/` (reduced-motion guard).
- The experience zoom story follows the pin and progress pattern of [scroll-craft](https://github.com/nateherkai/scroll-craft) (MIT), rebuilt in React without dependencies.
- Underline link hover (skiper40 Link000) from [Skiper UI](https://skiper-ui.com), free with credit.
- Everything else is written for this site. Fonts: Jersey 15, Silkscreen and Rethink Sans, all under the SIL Open Font License via Google Fonts.
