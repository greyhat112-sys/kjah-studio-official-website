# Changelog — KJAH Studio Website

All notable changes to this project are documented here.

---

## [1.2.4] — 2026-05-20

### Fixed
- **Cursor blink sync** — each `TerminalTile` now generates a random `animationDelay` on mount (`-(0–1.4s)`) applied to its cursor element. Cursors across all 6 tiles blink out of phase naturally.
- **Terminal opacity** — `termFadeIn` keyframe `to` value reduced from `opacity: 1` → `opacity: 0.45` so the grid reads as background context, not foreground UI.
- **About section dot grid** — removed `section-bg` + gradient orb; replaced with `section-transparent` so the interactive DotGrid canvas shows through the Who We Are section.
- **iOS Safari light mode** — removed `@media (prefers-color-scheme: light)` token override that was inverting the entire colour scheme on devices with system light mode. Added `color-scheme: dark` to `:root` in `globals.css` and `<meta name="color-scheme" content="dark">` in `layout.js`. Site now stays dark regardless of device system setting.

---

## [1.2.3] — 2026-05-20

### Changed — Terminal Typewriter Effect
- **TerminalTile** — rewrote animation as a character-by-character typewriter. Each line types out one char at a time before colour/styling applies. `cmd` lines feel like human typing (48–120ms/char); output lines stream faster (16–40ms/char). Cursor tracks at the end of the line being typed. When a line finishes typing, the process pause (lineDelay) happens before the next line starts — so BUILD/DEPLOY steps visibly wait 0.7–2.1s between output, making it feel like real work.
- Completed lines snap from plain mono text → full styled colour on completion (tag cyan, rest grey, ok cyan).
- Removed `lineIn` CSS animation from completed lines — typewriter replaces it.
- Added `.typingLine` CSS class for the in-progress line.

---

## [1.2.2] — 2026-05-20

### Changed — Terminal & Orb Polish
- **Terminal timing** — rewrote per-line delay logic in `TerminalTile.jsx`. Lines now wait a random amount based on type: BUILD/DEPLOY steps 1.1–2.9s, INTG/SCAN 0.8–2.0s, INIT/CHECK 0.6–1.4s, cmd 0.4–0.9s. Sequences feel like real work instead of a scripted slideshow.
- **Terminal restart delay** — done state now holds for 10–18 seconds (was 3.2s) before restarting, so tiles spend meaningful time in their completed state.
- **Tile start offsets** — `TILE_DELAYS` widened from `[0,700,1400,350,1050,1750]` to `[0,3200,6800,1600,5100,9400]`ms so tiles are never in sync and drift further apart over time.
- **Line reveal animation** — slowed from `0.1s` to `0.3s` ease-out for a softer appearance.
- **Hero gradient orb** — reduced size from `60vw / 780px` to `38vw / 480px`.

---

## [1.2.1] — 2026-05-20

### Changed
- **Hero gradient orb** — moved from top-right (`right: -5%`) to top-left (`left: -5%`); top offset and opacity unchanged.

---

## [1.2.0] — 2026-05-20

### Added — Calendly Booking Modal

- **`contexts/BookingContext.jsx`** — React context exposing `isOpen`, `openBooking`, `closeBooking`. Wraps the full app via `BookingProvider` in `app/layout.js` so any component can open the modal.
- **`components/BookingModal/BookingModal.jsx`** — centered overlay with a Calendly inline iframe (`kjahstudio-support/30min`). Themed black/cyan to match the site. Closes on backdrop click, ✕ button, or `Escape`. Locks body scroll while open.
- **`components/BookingModal/BookingModal.module.css`** — `fadeIn` + `slideUp` entrance animations, `backdrop-filter: blur(6px)`, `border: 1px solid var(--border-vis)`.

### Changed
- **Nav "Book a Call"** — now calls `openBooking()` instead of linking to `#contact`.
- **CTA "Book a Free Call"** — converted from `<Link href="#">` to `<button onClick={openBooking}>`.
- **CTA email** — updated from `hello@kjahstudio.com` → `support@kjahstudio.com`.
- **Hero gradient orb** — repositioned from `right: 16%; top: 50%` (centered-right) to `right: -5%; top: -10%` (top-right bleed); opacity reduced `0.12 → 0.07` for a more subtle accent.

---

## [1.1.0] — 2026-05-20

### Changed — Full Mobile & Tablet Responsiveness

- **Mobile hamburger nav** — `Nav.jsx` + `Nav.module.css` rewritten. At ≤900px the desktop link list and CTA button hide; a hamburger button (3-bars → X on open) appears. Tapping opens a full-screen overlay (`position: fixed; top: 60px`) with large Space Grotesk section links and a cyan "BOOK A CALL" CTA. `AnimatePresence` fade+slide entrance/exit. Body scroll is locked while the menu is open.
- **Section padding** — global `.section` mobile padding reduced from `--sp-3xl` (64px) to `--sp-2xl` (48px) at ≤540px. Cuts ~576px of dead vertical space across all 9 sections.
- **Hero stats grid** — fixed column gap: changed `gap: var(--sp-lg) 0` → `gap: var(--sp-lg) var(--sp-md)` at ≤540px so the 2×2 stat grid has breathing room between columns.
- **Works grid** — kept 2-column layout at ≤540px (`1fr 1fr` with `gap: var(--sp-sm)`) instead of collapsing to 1-column. Reduces the 18-card Works section height by ~2700px on mobile.
- **About team grid** — kept 2-column at ≤540px (was collapsing to 1-col). Portrait cards are compact enough to read at 2-col on 390px screens.
- **Pricing grid** — added `margin-inline: auto` to center the max-width: 860px grid within its wrapper at all breakpoints.
- **Page height** — total mobile page height reduced from 14,277px → 9,604px (32% reduction).

---

## [1.0.9] — 2026-05-19

### Changed
- **Section backgrounds** — All sections except Hero and Works now carry an explicit `background: var(--black)` so the interactive DotGrid canvas only shows through the Hero and Works (client portfolio) sections. Sections affected: Platforms, Services, About, Pricing, Testimonials, CTA, Footer.
- `app/globals.css` — added `background: var(--black)` to `.section` (covers Services, About, Pricing, Testimonials) and a `.section-transparent` utility override.
- `components/Works/Works.jsx` — section uses `className="section section-transparent"` to stay see-through against the canvas.
- `components/Platforms/Platforms.module.css`, `components/CTA/CTA.module.css`, `components/Footer/Footer.module.css` — `background: var(--black)` added to each root class.

---

## [1.0.8] — 2026-05-19

### Changed
- **Hero terminal scene → Blackbox-style 2-column grid** — replaced the single layered `TerminalWindow` depth effect with a 2×3 grid of compact `TerminalTile` components covering the right half of the hero viewport, inspired by Blackbox AI's hero section.

### Added
- `components/ui/TerminalTile.jsx` — compact terminal tile component. Six agents run in parallel (WEBSITE, FUNNEL, AUTOMATION, DEPLOY, CRM, EMAIL) with staggered `startDelay` offsets so they're always at different points in their sequence. Status dot: cyan while running, shifts to amber on sequence complete, then auto-restarts after 3.2s pause.
- `components/ui/TerminalTile.module.css` — flat grid-cell style: no border-radius, 10px Space Mono, compact header with right-aligned status dot.

### Hero layout changes
- `components/Hero/Hero.jsx` — removed `terminalScene` / `TerminalWindow` imports. Terminal grid is now a `motion.div` (`termGridWrapper`) positioned `position: absolute; left: 50%; right: 0; top: 0; bottom: 0` inside the hero, rendering 6 `TerminalTile` instances with `TILE_DELAYS = [0, 700, 1400, 350, 1050, 1750]ms`.
- `components/Hero/Hero.module.css` — removed `.terminalScene`, `.termMain`, `.termBg1`, `.termBg2`, `.vignette`. Added `.termGridWrapper`, `.termGrid` (2-col × 3-row CSS grid filling full height), `.termGridVignette` (left + top/bottom gradient fades). `.inner` simplified to single-column with `max-width: 560px` on `.left`.

---

## [1.0.7] — 2026-05-19

### Added
- **Interactive DotGrid component** (`components/ui/DotGrid.jsx`) — replaces the static CSS `radial-gradient` dot pattern with a canvas-based implementation using physics ported 1:1 from Google Stitch's production source. Algorithm: lerp factor `E=0.035` (each frame dots move 3.5% toward target — produces the signature float/lag), repel radius `W=725px`, cubic displacement easing (`proximity³ × T`), Perlin noise layered on displaced dots for organic jitter, colour shift from `--border-vis` grey toward `--kjah-cyan` / `--kjah-amber` as proximity increases, opacity fade near bottom of viewport and near cursor. Canvas is `position: fixed` full-viewport; dots are page-anchored via `scrollY % S` phase offset. Per-dot state stores displacement `dx/dy` rather than absolute positions so scroll doesn't corrupt lerp continuity.
- `components/ui/DotGrid.module.css` — `position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.6`.

### Changed
- `app/layout.js` — `<DotGrid />` inserted before `<Cursor />`; `{children}` wrapped in `<div className="page-content">` (z-index: 1) so page content sits above the canvas layer.
- `app/globals.css` — removed `.section-bg::before` static dot grid. Added `.page-content { position: relative; z-index: 1; }`.
- `components/Hero/Hero.jsx` — removed `<div className={styles.dots} />` element.
- `components/Hero/Hero.module.css` — removed `.dots` rule.

### Dependencies
- `puppeteer` added as devDependency (used during development to screenshot pages; not used at runtime).

---

## [1.0.6] — 2026-05-19

### Fixed
- **TerminalWindow CSS module** — rewrote `TerminalWindow.module.css` to match the JSX class names introduced in 1.0.5. Old names (`.titleBar`, `.trafficLights`, `.titleText`, `.cursorLine`, `.cmdText`, `.lineText`) replaced with the new names used in JSX (`.header`, `.dot`, `.label`, `.cursorRow`, `.lineCmd`, `.rest`, `.tag`, `.ok`, `.tagDone`, `.restDone`, `.lineDone`).
- **TerminalWindow prop API** — reconciled prop mismatch left mid-refactor. Hero was passing `initialSeq` / `initialLine` (v1.0.5 multi-window design) but the component had been partially updated to `agentId` / `startDelay`. Restored `initialSeq` / `initialLine` as the canonical props. Background terminals with `initialSeq` pinned loop their own sequence; the foreground terminal (no props) auto-cycles through all four agents.

---

## [1.0.5] — 2026-05-19

### Changed
- **Hero terminal — multi-window depth effect** — replaced single terminal with a layered scene of 3 terminals. Background terminals (`initialSeq`, `initialLine` props) start mid-execution to simulate active parallel builds. Foreground terminal sits at z-index 3; background ones are at 0.18/0.13 opacity with `filter: blur(1.5–2px)`, offset off-screen edges. A four-sided linear-gradient vignette (z-index 4) fades all edges to `--black`, unifying the scene.
- `TerminalWindow` gains `initialSeq` and `initialLine` props so instances can start at any point in any sequence.

---

## [1.0.4] — 2026-05-19

### Added
- **TerminalWindow component** (`components/ui/TerminalWindow.jsx`) — replaces the static hero image with an animated terminal window. Cycles through three client build sequences (fitness coaching, e-commerce, coaching academy), revealing lines one-by-one with realistic timing delays. Features: macOS-style traffic-light title bar, cyan status tags (`[SCAN]`, `[BUILD]`, `[FUNNL]`, `[AUTO]`, `[INTG]`, `[DEPLOY]`), amber metric values, cyan LIVE status, blinking cursor, AnimatePresence fade between sequences every ~5s.
- Removed static hero image (`next/image`) from Hero — replaced with `TerminalWindow`.
- Cleaned up `Hero.module.css`: removed `.phone` class and image-specific offsets on `.right`.

---

## [1.0.3] — 2026-05-19

### Added
- **Hero stat counter animation on load** — Numbers in the hero stats row (4, 6, 100%, 10+) now count up from 0 when the page loads. Counter.jsx gains an optional `delay` prop; Hero passes `delay={1.4}` to sync the count-start with the stats fadeUp animation (1.3s delay) so numbers begin counting right as they become visible.

---

## [1.0.2] — 2026-05-19

### Fixed
- **Hero headline word-break** — "BUILDS." was splitting as "BUI / LDS." on narrow viewports. Replaced single `chars` array with `lines = ['SMART', 'BUILDS.']`; each word now renders as its own `display: block` container with `white-space: nowrap`, so the full word always stays on one line. Character stagger animation preserved.

### Meta
- CHANGELOG and memory files now auto-updated and pushed after every change (standing workflow rule).

---

## [1.0.0] — 2026-05-19

### Initial Release — Next.js Migration & Full Build

#### Project Migration
- Migrated from a single `index.html` static file to a **Next.js 14 (App Router)** project
- Replaced Tailwind CSS (auto-installed by scaffold) with **CSS Modules** to preserve the Nothing design system's CSS custom property architecture
- Configured **Framer Motion** for all animations
- Set up **Google Fonts** via `next/font`: Space Grotesk + Space Mono; Doto loaded via `<link>` (variable font not yet supported in next/font)
- Deployed source to GitHub: `greyhat112-sys/kjah-studio-official-website`

#### Architecture
```
app/
  layout.js       — root layout, fonts, metadata, Cursor
  page.js         — composes all 10 section components
  globals.css     — design tokens, reset, shared utilities (.wrap, .btn-p, .btn-s, .section, .section-bg, .s-orb)
components/
  Nav/            — fixed nav, active section tracking, scroll state
  Hero/           — two-column hero, character-by-character Doto reveal
  Platforms/      — platform logo bar
  Services/       — 3-card service grid
  About/          — two-column about + glassmorphism team cards
  Pricing/        — two-tier pricing with segmented progress bars
  Works/          — 18-card works grid with hover overlay
  Testimonials/   — 5-card testimonial grid
  CTA/            — final call-to-action
  Footer/         — logo + nav links
  ui/
    Cursor.jsx          — custom cyan cursor with lagging ring
    AnimatedSection.jsx — scroll-triggered fade+slide reveal wrapper
    Counter.jsx         — animated number counter (counts up on scroll-into-view)
    MagneticButton.jsx  — cursor-following magnetic pull on hover
public/assets/
  brand/    — logo.png, logo-with-text.png, hero-image.png, gradient-orb.png, bg-pattern.png
  team/     — designer-1..4.png (illustrated portraits)
  works/    — 18 × 960×540 JPEG thumbnails from portfolio PDF
```

---

### Design System — Nothing-Inspired

#### Brand Tokens
```css
--kjah-cyan:  #4DDFF0
--kjah-amber: #FDD03C
--kjah-pink:  #E05070
```

#### Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Doto (ROND=0, wght=700) | Hero headline, stat numbers, service numbers, pricing |
| Body/UI | Space Grotesk 300/400/500/700 | Section headings, body text, card titles |
| Labels | Space Mono 400/700 | ALL CAPS labels, nav links, tags, button text |

#### Components Built
- **Segmented progress bars** — Nothing signature data viz in Pricing section (cyan / amber fills)
- **Glassmorphism team cards** — `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(16px)`, inner highlight
- **Dot-grid background** — CSS `radial-gradient` dots (20px grid, `--border-vis`, opacity 0.6)
- **Gradient orb** — `gradient-orb.png` with `filter: blur(80px)`, opacity 0.12, positioned right of hero

---

### Animations (Framer Motion)

| Animation | Component | Detail |
|-----------|-----------|--------|
| Nav slide-down | Nav | Entrance on page load, y: -60 → 0 |
| Active nav dot | Nav | Cyan dot animates between links via `layoutId` |
| Nav scroll state | Nav | Transparent → frosted glass after 20px scroll |
| Hero character reveal | Hero | "SMART BUILDS." — each char staggered 40ms, Doto font |
| Hero stagger | Hero | Eyebrow → display → hl → actions → stats, each 200ms apart |
| Stat counters | Hero | Count up from 0 on mount, cubic ease-out over 1400ms |
| Magnetic buttons | Nav + Hero | Subtle pull toward cursor (0.3× offset), snaps back on leave |
| Section scroll reveal | Services, About | Fade + translateY(32px) → 0 on IntersectionObserver |
| Card stagger | Services, About, Works | Children reveal sequentially, 100–120ms between each |
| Works hover overlay | Works | Image darkens (brightness 0.45), overlay fades in with niche + type |
| Custom cursor | Global | Cyan dot (exact) + white ring (lerp 0.12 follow), expands on hover |

---

### Sections & Content

#### Hero
- Two-column grid (1fr 1fr), stacks to single column at ≤900px
- Left: eyebrow → Doto headline → Space Grotesk subline → CTA buttons → 4-stat grid
- Right: `hero-image.png` (3-phone mockup), oversized (130% width, max 740px), positioned top-aligned
- Background: CSS dot grid + blurred gradient orb (right side)

#### Platforms
- ClickFunnels · WordPress · Wix · HighLevel · Shopify · Systeme.io

#### Services (3 cards)
- 01 Websites — up to 10 pages, domain config, mobile-first, back-end setup
- 02 Funnels — up to 7 pages, email automation, CRM integration, checkout flow
- 03 Automation — email sequences, workflow logic, 3rd-party integrations, CRM setup

#### About
- `section-bg` applied (dot grid + orb background)
- Glassmorphism team cards with portrait images
- Team: Project Manager (designer-2), Funnel Specialist (designer-1), Web Specialist (designer-3), Automation Expert (designer-4)

#### Pricing
- Cyan Tier: $1,000 — website max 5 pages, funnel max 3 pages
- Amber Tier: $2,000 (Most Popular) — e-commerce max 50 products, website max 10 pages, funnel max 7 pages
- Segmented bars filled in respective brand colors

#### Works (18 projects)
Fairhope Bay Dental, 10X Ladies, AdOutreach TheQuality, Josh Pineda, Champion E-Commerce, Unity Drives Growth, EntrepreneurialEdge, Jim Kwik Limitless Expanded, Ryptic Room Escape, Tarek El Moussa Flip Your Life, Empire Coaching, Influential, HYROZ CBD, Pick Your Chill, Virology Marketing, Lox's Swatch Ring, GSD Community, Lox Stylist Business

#### Testimonials (5)
Dylan C., Sarah J., David C., Elena R., Jameson J. — all 5-star, verbatim from portfolio PDF

---

### Previous History (Static HTML Phase)

The site began as `index.html` in `C:\Users\user\Documents\Design and tech team\website sample\` — a single-file Nothing design system implementation. Key milestones before migration:

- Extracted brand content from `KJAH Studio - Portfolio.pdf` (image-based, 30 pages) using PyMuPDF
- Cropped 18 work thumbnails (960×540, 16:9) from PDF pages using Pillow
- Imported Figma assets manually after Figma REST API render timed out on complex frames
- Iteratively refined: hero layout, gradient orb opacity/blur/position, background pattern, team glassmorphism cards, Doto typography across display elements
- Brand colors updated from original PDF estimates to Figma-exact values (`#4DDFF0`, `#FDD03C`, `#E05070`)
