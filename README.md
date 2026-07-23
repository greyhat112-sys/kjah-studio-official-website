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
  Pricing/        — tabbed pricing toggle (Web & Funnels / Graphic Design)
  Works/          — 18-card portfolio grid
  Testimonials/   — review cards
  Audit/          — "Free Website Audit" lead-magnet section (id="audit") →
                    inline form (name/email/website) → POST /api/contact (type:'audit')
  CTA/            — call-to-action: "Book a Free Call" + "Get a Free Audit" buttons
  Footer/
  BookingModal/   — Calendly booking iframe modal, opened via openBooking()
  api/
    contact/route.js — sends notification + auto-reply emails (Resend) and
                       auto-creates an inbound prospect in the Prospect Pipeline
                       (handles both contact and audit-request submissions)
  ui/
    Cursor.jsx        — custom cursor (hidden on touch devices)
    DotGrid.jsx       — canvas dot grid background (fixed, z-index 0)
    Counter.jsx       — animated number counter (setInterval-based)
    MagneticButton.jsx
    TerminalTile.jsx  — typewriter terminal animation (6 agents)
    SmoothScroll.jsx  — Lenis smooth scroll (desktop wheel only)
contexts/
  BookingContext.jsx — shared isOpen state for the booking modal
app/
  opengraph-image.jsx — edge-runtime 1200×630 OG image
  sitemap.js          — /sitemap.xml
  robots.js           — /robots.txt
public/
  manifest.json             — PWA web app manifest
  favicon.ico               — browser tab icon
  apple-touch-icon.png      — iOS home screen icon (180×180)
  android-chrome-192x192.png
  android-chrome-512x512.png
```

## Key decisions

- **Always dark** — `color-scheme: dark` on `:root` + `<meta name="color-scheme" content="dark">` prevents iOS Safari and all browsers from applying system light mode. No light mode exists.
- **No Framer Motion on SSR-rendered elements** — `initial={{ opacity: 0 }}` gets written into SSR HTML; on slow/mobile devices elements stay invisible until hydration. Entrance animations use CSS `@keyframes` instead.
- **Mobile nav is a section label**, not a hamburger. The current section name (`— About`) appears on the right as the user scrolls. Hidden while in the hero section (`scrollY < 50vh`).
- **Counter uses `setInterval`** not `requestAnimationFrame` — iOS Safari throttles rAF inside an `opacity: 0` ancestor (CSS fill-mode), counters freeze at 0.
- **Hero terminal grid**: full opacity on desktop (CSS fade-in at 45%), 15% silhouette on mobile.
- **DotGrid**: 60% opacity on desktop, 25% on mobile.
- **Lenis**: smooth wheel scroll on desktop only (`smoothTouch: false`). Intercepts anchor clicks with `-72px` nav offset.
- **Image optimization**: `next.config.mjs` serves AVIF/WebP. Always set `sizes` prop on `<Image>` components — without it Next.js defaults to the full `width` value regardless of display size.
- **Pricing toggle**: `Pricing/` is a client component with a segmented toggle between **Web & Funnels** (one-time $1000/$2000) and **Graphic Design** (monthly $199/$249). Sliding pill is a CSS-only absolutely-positioned `.slider` — no `gap` on the toggle (breaks pill alignment), explicit `340px` desktop width (not `fit-content`). Graphic-design card copy is placeholder pending finalized content.
