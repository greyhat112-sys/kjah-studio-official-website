# Changelog — KJAH Studio Website

All notable changes to this project are documented here.

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
