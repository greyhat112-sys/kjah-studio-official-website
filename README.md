# KJAH Studio — Official Website

Marketing website for KJAH Studio, a digital agency specialising in websites, sales funnels, and automation systems.

## Stack

- **Next.js 16** (App Router) · **React 19** · **Framer Motion 12** · **CSS Modules**
- No Tailwind — all styling via CSS Modules + design tokens in `globals.css`

## Dev

```bash
npm install
npm run dev       # http://localhost:3000
```

> ⚠️ **iOS Safari testing:** the Turbopack dev server outputs modern JS that WebKit can't parse — all `useEffect` / interactivity silently fails on real devices. Always test on the production build:

```bash
npm run build && npm start
```

## Project structure

```
app/
  layout.js       — root layout: fonts, DotGrid background, Cursor
  page.js         — composes all section components
  globals.css     — design tokens, reset, shared utilities
components/
  Nav/            — fixed nav; active section label on mobile (no hamburger)
  Hero/           — headline, stats counters, terminal tile grid (desktop)
  Platforms/      — platform logo bar
  Services/       — 3-card service grid
  About/          — two-column about + team cards
  Pricing/        — two-tier pricing
  Works/          — 18-card portfolio grid
  Testimonials/   — review cards
  CTA/            — call-to-action
  Footer/
  ui/
    Cursor.jsx        — custom cursor (hidden on touch devices)
    DotGrid.jsx       — canvas dot grid background (fixed, z-index 0)
    Counter.jsx       — animated number counter (setInterval-based)
    MagneticButton.jsx
    TerminalTile.jsx
```

## Key decisions

- **No Framer Motion on SSR-rendered elements** — `initial={{ opacity: 0 }}` gets written into the SSR HTML; on slow/mobile devices the page stays invisible until React hydrates. Entrance animations use CSS `@keyframes` instead.
- **Mobile nav is a section label**, not a hamburger menu. The current section name (e.g. `— About`) appears on the right of the nav as the user scrolls. Hidden while in the hero section (`scrollY < 50vh`).
- **Counter uses `setInterval`** not `requestAnimationFrame` — iOS Safari throttles rAF for elements inside an `opacity: 0` ancestor (CSS animation fill-mode), causing counters to freeze at 0.
- **Hero terminal grid**: full opacity on desktop (CSS fade-in), 15% opacity silhouette on mobile spanning full width.
- **DotGrid**: 60% opacity on desktop, 25% on mobile.
