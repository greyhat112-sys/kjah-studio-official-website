<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# KJAH Studio — Codebase Notes for Agents

## ⚠️ Critical — iOS Safari / mobile testing
The Turbopack dev server (`npm run dev`) outputs modern JS syntax that iOS Safari's WebKit engine cannot parse. On real iOS devices, all JavaScript silently fails — `useEffect` never runs, state never updates, interactive features appear completely broken. Chrome DevTools mobile simulation is unaffected (V8 engine). **Always use `npm run build && npm start` when testing on a real device.**

## Stack
- **Next.js 16 App Router** · **React 19** · **Framer Motion 12** · **CSS Modules** (no Tailwind)
- Single-page site — all sections composed in `app/page.js`

## Architecture
```
app/
  layout.js       — root layout: fonts, DotGrid, Cursor, BookingProvider, BookingModal, page-content wrapper
  page.js         — composes all 10 section components
  globals.css     — design tokens, reset, shared utilities
contexts/
  BookingContext.jsx — React context: isOpen, openBooking(), closeBooking(). Wrap app in BookingProvider.
components/
  Nav/            — fixed nav; desktop: link list + CTA; mobile: section label (no hamburger)
  Hero/           — two-column hero, Doto character reveal, TerminalTile grid
  Platforms/      — platform logo bar
  Services/       — 3-card service grid
  About/          — two-column about + glassmorphism team cards
  Pricing/        — two-tier pricing with segmented progress bars
  Works/          — 18-card works grid with hover overlay
  Testimonials/   — 5-card testimonial grid
  CTA/            — call-to-action; "Book a Free Call" opens BookingModal, email → support@kjahstudio.com
  Footer/         — logo + nav links
  BookingModal/   — Calendly iframe (kjahstudio-support/30min) in a full-screen overlay
  ui/
    Cursor.jsx          — custom cyan cursor with lagging ring (z-index 9999/9998)
    DotGrid.jsx         — canvas dot grid with Stitch-exact physics (z-index 0, fixed)
    AnimatedSection.jsx — scroll-triggered fade+slide reveal wrapper
    Counter.jsx         — animated number counter
    MagneticButton.jsx  — cursor-following magnetic pull on hover; renders <a> with href or <button> with onClick
    TerminalWindow.jsx  — animated terminal (unused in hero; kept for reuse)
    TerminalTile.jsx    — compact terminal tile for the hero 2×3 grid (Blackbox-style)
```

## Booking modal
`contexts/BookingContext.jsx` provides `openBooking` / `closeBooking` to any client component. `BookingModal` lives in `app/layout.js` (outside `page-content`) so it overlays everything. Both the Nav CTA and CTA section button call `openBooking()`. The Calendly embed URL is themed with `background_color=000000&text_color=ffffff&primary_color=4ddff0`.

## DotGrid — how it works
`components/ui/DotGrid.jsx` is a `position: fixed` canvas covering the full viewport. Physics are ported 1:1 from Google Stitch's production source:
- Each dot stores a lerped **displacement** (`dx`, `dy`) from its grid origin — not an absolute position.
- Every frame: compute target displacement (zero when no cursor, repel vector when cursor nearby), then `dot.dx += (target - dot.dx) * 0.035`. The `0.035` lerp factor is the entire physics system — it creates the float/lag.
- Repel uses cubic easing: `proximity³ × 28px` max push.
- Perlin noise is added to displaced dots for organic jitter.
- Dots shift colour toward `--kjah-cyan` / `--kjah-amber` near cursor.
- Scroll is handled by a `scrollY % SPACING` phase offset on the viewport-space origin — do not store absolute page positions in dot state or lerp will break on scroll.

## DotGrid visibility — which sections show it
The canvas sits behind all content. Sections block it by declaring `background: var(--black)`. Current state:
- **Dot grid visible:** Hero, Works
- **Solid black background:** Platforms, Services, About, Pricing, Testimonials, CTA, Footer
- Controlled via `background: var(--black)` on the global `.section` class + local root classes. Works uses `className="section section-transparent"` to opt out.
- **Rule:** if you add a new section and don't want the dots showing, ensure its root element has `background: var(--black)`.

## Hero terminal grid
`components/ui/TerminalTile.jsx` — 6 compact tiles in a 2×3 grid covering the right half of the hero viewport (`termGridWrapper`: `position: absolute; left: 50%; right: 0; top/bottom: 0`). Agents: WEBSITE, FUNNEL, AUTOMATION, DEPLOY, CRM, EMAIL. Each tile pins to its `seqIndex`, animates lines in, status dot cyan → amber on done, auto-restarts. Stagger delays prevent all tiles animating in sync. Hidden at ≤900px.

## Stacking context
- `DotGrid` canvas: `z-index: 0` (fixed, behind everything)
- `.page-content` wrapper: `z-index: 1` (all sections live here)
- `Cursor` dot/ring: `z-index: 9999/9998`

## Design tokens (globals.css)
```css
--kjah-cyan:  #4DDFF0
--kjah-amber: #FDD03C
--kjah-pink:  #E05070
--black / --surface / --surface-raised / --border / --border-vis
--text-off / --text-sec / --text-pri / --text-disp
```
Light mode inverts the full token set via `@media (prefers-color-scheme: light)`.

## Framer Motion — SSR rules
**Never use `initial={{ opacity: 0 }}` (or any `initial` with invisible values) on elements that are server-rendered and visible above the fold.** Framer Motion writes `initial` values as inline styles in the SSR HTML. On slow connections or before React hydrates, the element stays permanently invisible. Fix: use CSS `@keyframes` with `animation-fill-mode: both` instead. Framer Motion is acceptable for decorative desktop-only elements (e.g. the hero terminal grid) that won't cause blank sections if delayed.

## Nav — mobile behaviour
On mobile (≤900px) the desktop link list is hidden and **no hamburger menu exists**. Instead, a section label (`— Services`, `— About`, etc.) appears on the right side of the nav using the same IntersectionObserver that tracks the active section on desktop. The label is hidden while the user is in the hero section (`scrollY < 50vh`) and clears `active` back to `''` so no label shows. This eliminates all mobile tap/event issues. Do not add a hamburger back without good reason.

## Counter
`components/ui/Counter.jsx` uses `setInterval` (not `requestAnimationFrame`). iOS Safari throttles rAF for elements inside a `opacity: 0` ancestor — the `.stats` container has a CSS entrance animation with `fill-mode: both`, so it starts at `opacity: 0`. rAF inside it never fires until the animation completes. `setInterval` is immune to this throttle.

## Hero terminal grid
On desktop the grid fades in via a CSS `@keyframes termFadeIn` animation (1.2s, 0.5s delay). On mobile (≤900px) the animation is disabled and the grid is shown at `opacity: 0.15` as a background silhouette — wide enough to span full width (`left: 0`). Adjust the opacity value in `.termGridWrapper` inside the `@media (max-width: 900px)` block in `Hero.module.css`.

## DotGrid opacity
The canvas dot grid is `opacity: 0.6` on desktop and `opacity: 0.25` on mobile (≤900px) via a media query in `DotGrid.module.css`.

## Hero gradient orb
`.orb` in `Hero.module.css` is `position: absolute; right: -5%; top: -10%` — bleeds off the top-right corner. `opacity: 0.07` (intentionally subtle). Hidden on mobile (`display: none` at ≤900px). Do not increase opacity past 0.1 or recentre it — it's a background accent, not a feature.

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Doto (ROND=0, wght=700) | Hero headline, stat numbers, pricing |
| Body/UI | Space Grotesk 300–700 | Section headings, body, cards |
| Labels | Space Mono 400/700 | ALL CAPS labels, nav, tags, buttons |
