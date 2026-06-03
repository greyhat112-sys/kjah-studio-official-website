<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# KJAH Studio — Codebase Notes for Agents

## ⚠️ Site is currently in Coming Soon mode (v1.9.0)
`middleware.js` redirects every public route to `/coming-soon`. The full marketing site (`app/page.js` + all section components) is untouched and will be served the moment the middleware file is deleted or renamed. The contact API (`/api/contact`) and static assets are excluded from the redirect.
- **To launch:** `rm middleware.js` (or rename to `middleware.js.disabled`), commit, push.
- **Holding page:** `app/coming-soon/page.js` + `page.module.css`. `metadata.robots: { index: false, follow: false }`.

## ⚠️ Critical — iOS Safari / mobile testing
The Turbopack dev server (`npm run dev`) outputs modern JS syntax that iOS Safari's WebKit engine cannot parse. On real iOS devices, all JavaScript silently fails — `useEffect` never runs, state never updates, interactive features appear completely broken. Chrome DevTools mobile simulation is unaffected (V8 engine). **Always use `npm run build && npm start` when testing on a real device.**

## Stack
- **Next.js 16 App Router** · **React 19** · **Framer Motion 12** · **CSS Modules** (no Tailwind)
- Single-page site — all sections composed in `app/page.js`

## Architecture
```
app/
  layout.js       — root layout: fonts, DotGrid, Cursor, BookingProvider, BookingModal, page-content wrapper, Grain overlay
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
  BookingModal/   — contact form (name/email/message) in a full-screen overlay; submits to /api/contact
  api/
    contact/route.js — POST handler; sends email to support@kjahstudio.com via Resend (RESEND_API_KEY env var)
  ui/
    Cursor.jsx          — custom cyan cursor with lagging ring (z-index 9999/9998)
    DotGrid.jsx         — canvas dot grid with Stitch-exact physics (z-index 0, fixed)
    Grain.jsx           — canvas-generated film-grain overlay (z-index 50, fixed, mix-blend screen)
    Scramble.jsx        — text scramble effect; resolves random chars to real text left-to-right
    LightRays.jsx       — conic-gradient ray fan; accepts origin="left" (Hero) or "bottom" (About)
    AnimatedSection.jsx — scroll-triggered fade+slide reveal wrapper
    Counter.jsx         — animated number counter
    MagneticButton.jsx  — cursor-following magnetic pull on hover; renders <a> with href or <button> with onClick
    TerminalWindow.jsx  — animated terminal (unused in hero; kept for reuse)
    TerminalTile.jsx    — typewriter terminal tile for the hero 2×3 grid (Blackbox-style)
    SmoothScroll.jsx    — Lenis smooth scroll init (desktop wheel only, smoothTouch: false)
app/
  coming-soon/page.js — holding page served while middleware.js is in place
app/
  opengraph-image.jsx — edge-runtime ImageResponse, 1200×630 branded OG image
  sitemap.js          — generates /sitemap.xml (kjahstudio.com, weekly)
  robots.js           — generates /robots.txt (allow all, sitemap ref)
public/
  manifest.json              — PWA web app manifest
  favicon.ico / apple-touch-icon.png / android-chrome-192×192 / 512×512
```

## Image optimization
`next.config.mjs` has `formats: ['image/avif', 'image/webp']` — Vercel serves compressed images automatically. **Always add a `sizes` prop to every `<Image>` component.** Without it, Next.js serves the full `width` value regardless of display size, negating the optimization. Example for a 3-column grid: `sizes="(max-width: 540px) 100vw, (max-width: 900px) 50vw, 33vw"`.

## Dark mode lock
The site is always dark. `color-scheme: dark` on `:root` in `globals.css` + `<meta name="color-scheme" content="dark">` in `layout.js` prevent any browser/OS from applying light mode. Do not add `@media (prefers-color-scheme: light)` overrides.

## Smooth scroll
CSS-only: `scroll-behavior: smooth` on `html` in `globals.css`. `SmoothScroll.jsx` (Lenis) has been removed from `layout.js` — it was causing anchor links to stop working when `<Link>` was used. Hash anchor links use plain `<a>` tags (not Next.js `<Link>`) to respect CSS scroll-behavior.

## SEO
- `app/layout.js` — full `metadata` export with `metadataBase`, OG, Twitter card, robots, canonical, keywords, icons, manifest, appleWebApp.
- `app/opengraph-image.jsx` — edge-runtime branded OG image (1200×630).
- `app/sitemap.js` / `app/robots.js` — auto-generate `/sitemap.xml` and `/robots.txt`.
- `app/page.js` — `ProfessionalService` JSON-LD schema with offer catalog.
- Submit sitemap to Google Search Console: `https://kjahstudio.com/sitemap.xml`.

## Booking modal / contact form
`contexts/BookingContext.jsx` provides `openBooking` / `closeBooking` to any client component. `BookingModal` lives in `app/layout.js` (outside `page-content`) so it overlays everything. Both the Nav CTA and CTA section button call `openBooking()`. The modal now renders a contact form (name / email / message) that POSTs to `/api/contact`. On success it shows a confirmation screen; on error it shows an inline message. Calendly has been removed entirely.

## Contact API route
`app/api/contact/route.js` — Next.js App Router POST handler. Uses the `resend` npm package to send submissions to `support@kjahstudio.com`. `replyTo` is set to the sender's email. Requires `RESEND_API_KEY` environment variable (set in Vercel project settings). Domain `kjahstudio.com` must be verified in Resend for `from: hello@kjahstudio.com` to work.

## DotGrid — how it works
`components/ui/DotGrid.jsx` is a `position: fixed` canvas covering the full viewport. Physics are ported 1:1 from Google Stitch's production source:
- Each dot stores a lerped **displacement** (`dx`, `dy`) from its grid origin — not an absolute position.
- Every frame: compute target displacement (zero when no cursor, repel vector when cursor nearby), then `dot.dx += (target - dot.dx) * 0.035`. The `0.035` lerp factor is the entire physics system — it creates the float/lag.
- Repel uses cubic easing: `proximity³ × 28px` max push.
- Perlin noise is added to displaced dots for organic jitter.
- Dots shift colour toward `--kjah-cyan` / `--kjah-amber` near cursor.
- Scroll is handled by a `scrollY % SPACING` phase offset on the viewport-space origin — do not store absolute page positions in dot state or lerp will break on scroll.

## FAQ section
`components/FAQ/` — 9-item accordion, one open at a time. Placed between Testimonials and CTA in `page.js`. Both Nav and Footer link to `#faq`. `.list` and `.item` require explicit `width: 100%` — flex children do not stretch by default. Do not add `max-width` back to `.list`.

## iOS Safari — filter: blur() inside overflow: hidden
iOS Safari does not apply `filter: blur()` correctly when a parent has `overflow: hidden`, unless the element is on its own GPU compositing layer. Fix: add `-webkit-filter: blur(Xpx)` AND `transform: translateZ(0)` to the blurred element. Applied to both Hero and About orbs.

## SEO — .sr-only hidden content
A `.sr-only` utility class exists in `globals.css` (clip-based, 1×1px absolute). Use it to add Google-readable keyword text that is invisible to users. A hidden `<p className="sr-only">` with the full keyword phrase sits after the H1 in Hero.jsx. Do not remove it.

## Hero subline
`.hl` is `font-size: 16px` with `max-width: 360px` — aligned under the display headline. Do not increase max-width past 360px or it will bleed into the terminal on desktop.

## Encoding — never use PowerShell Set-Content on JSX files with special chars
PowerShell 5.1 `Get-Content -Raw` + `Set-Content -Encoding utf8` can double-encode multi-byte UTF-8 characters (em dashes `—`, middle dots `·`, curly quotes). Use the `Edit` or `Write` tool instead. If corruption occurs, fix with byte-level char code replacement: `$c.Replace([string][char]226 + [string][char]8364 + [string][char]8221, [string][char]8212)`.

## Nav anchor links — use plain `<a>` not `<Link>`
Hash-only anchor links (`#section`) in Nav and Footer use plain `<a>` tags, not Next.js `<Link>`. `<Link>` routes through the router and bypasses CSS `scroll-behavior: smooth`. The logo (`/`) stays as `<Link>`.

## Hero mobile layout
On mobile (≤900px): terminal grid is `display: none`. The gradient orb is visible at top-right (`right: -5%; top: -10%; opacity: 0.1`). The interactive DotGrid canvas is the primary background. Do not re-enable the terminal silhouette on mobile.

## About section — position context
The `.section` global class does NOT have `position: relative`. The About section uses its own `.about` class (in `About.module.css`) which sets `position: relative; overflow: hidden`. This is required for the absolute-positioned gradient orb to be anchored inside the section. **Any section that needs absolutely-positioned children must either use `.section-bg` or add its own `position: relative` class — do not rely on `.section` for this.**

## BookingModal loading state
`BookingModal.jsx` now tracks `loaded` state. The Calendly iframe starts hidden (`.frameHidden`) and fades in (`.frameVisible`) once `onLoad` fires. A `.loader` div with a spinning cyan `.spinner` is shown while loading. Close button auto-focuses on open via `closeRef`.

## DotGrid visibility — which sections show it
The canvas sits behind all content. Sections block it by declaring `background: var(--black)`. Current state:
- **Dot grid visible:** Hero, About, Works
- **Solid black background:** Platforms, Services, Pricing, Testimonials, CTA, Footer
- Controlled via `background: var(--black)` on the global `.section` class + local root classes. Works uses `className="section section-transparent"` to opt out.
- **Rule:** if you add a new section and don't want the dots showing, ensure its root element has `background: var(--black)`.

## Hero terminal grid
`components/ui/TerminalTile.jsx` — 6 compact tiles in a 2×3 grid covering the right half of the hero viewport (`termGridWrapper`: `position: absolute; left: 50%; right: 0; top/bottom: 0`). Agents: WEBSITE, FUNNEL, AUTOMATION, DEPLOY, CRM, EMAIL. Each tile pins to its `seqIndex`, animates lines in, status dot cyan → amber on done, auto-restarts. Stagger delays prevent all tiles animating in sync. Hidden at ≤900px.

## Stacking context
- `DotGrid` canvas: `z-index: 0` (fixed, behind everything)
- `<main id="main-content" className="page-content">`: `z-index: 1` (all sections live here — changed from `<div>` to `<main>` for a11y landmark)
- `Grain` overlay: `z-index: 50` (fixed, above content, below nav; `pointer-events: none`, `mix-blend-mode: screen`)
- `Nav`: `z-index: 200`
- `BookingModal` backdrop: `z-index: 1000`
- `Cursor` dot/ring: `z-index: 9999/9998`

## Grain overlay
`components/ui/Grain.jsx` generates a 128×128 noise tile via canvas on mount (encoded to data URL), then renders a `position: fixed` element with that as a repeating background. Noise values are clamped to **90–189** (not full 0–255) so the brightest dots stay grey rather than pure white. Opacity: **0.022 desktop / 0.014 mobile / 0.012 reduced-motion**. Sits at `z-index: 50` so it textures the content but not the nav, modal, or cursor. Do not raise opacity above 0.03 — the noise visually competes with the DotGrid canvas at higher values.

## Scramble component
`components/ui/Scramble.jsx` — accepts `text`, `delay` (ms), `duration` (ms, default 1100). SSR-safe: `useState(text)` renders the real text on the server. On mount, a rAF loop replaces alphanumerics with random `A–Z 0–9` chars, resolving left-to-right. Non-alphanumeric characters (spaces, punctuation like `.`) are preserved unchanged. Respects `prefers-reduced-motion`. Used in `Hero.jsx` to scramble "SMART" (delay 0) and "BUILDS." (delay 220ms).

## Spotlight cards
`components/Works/Works.jsx` — each `WorkCard` tracks the cursor via `onMouseMove`, setting `--spot-x` / `--spot-y` CSS custom properties on its root. A `.spotlight` element renders a cyan radial gradient at those coordinates with `mix-blend-mode: screen`. Disabled on touch via `@media (hover: hover)`. To reuse on Services or About cards: add `position: relative; isolation: isolate;` to the card, attach the mouseMove handler, and copy the `.spotlight` CSS.

## Design tokens (globals.css)
```css
--kjah-cyan:  #4DDFF0
--kjah-amber: #FDD03C
--kjah-pink:  #E05070
--black / --surface / --surface-raised / --border / --border-vis
--text-off / --text-sec / --text-pri / --text-disp
```
The site is **always dark** — `color-scheme: dark` on `:root` and `<meta name="color-scheme" content="dark">` in layout.js prevent iOS Safari and other browsers from applying system light mode. There is no light mode override.

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
`.orb` in `Hero.module.css` is `position: absolute; left: -5%; top: -10%` — bleeds off the top-left corner. Size: `38vw / 480px`. `opacity: 0.07` (intentionally subtle). Hidden on mobile (`display: none` at ≤900px). Do not increase opacity past 0.1 or recentre it — it's a background accent, not a feature.

## Hero terminal tile timing
`TerminalTile.jsx` uses a **typewriter effect**: characters appear one at a time, then styling (colours) snaps on when the line is complete. Two delay functions:

`charDelay(line)` — per-character interval:
- `cmd` (user typing): 48–120ms/char
- output lines: 16–40ms/char

`lineDelay(line)` — pause after line finishes typing (simulates work running):
- `cmd`: 180–440ms
- `BUILD` / `DEPLOY`: 700–2100ms
- `INTG` / `SCAN`: 500–1400ms
- `INIT` / `CHECK` / other: 280–760ms
- `done`: 280–560ms
- Restart hold: 10,000–18,000ms after sequence completes.

Phase state machine: `init → typing → pause → typing → … → complete → typing (restart)`

Tile start offsets in `Hero.jsx`: `[0, 3200, 6800, 1600, 5100, 9400]`ms — wide enough that tiles are never in sync. Do not collapse these.

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Doto (ROND=0, wght=700) | Hero headline, stat numbers, pricing |
| Body/UI | Space Grotesk 300–700 | Section headings, body, cards |
| Labels | Space Mono 400/700 | ALL CAPS labels, nav, tags, buttons |

## backdrop-filter — never use on fixed or scrolled elements
**Do not add `backdrop-filter` or `-webkit-backdrop-filter` to any element that is `position: fixed` or that sits over a frequently-repainting layer (like the DotGrid canvas).** Chrome forces a full GPU re-blur on every scroll frame. This was the root cause of 24–30fps scroll lag in all three sections. Nav and About team cards have had their `backdrop-filter` removed. Replace with a higher-opacity solid background instead.

## TerminalTile — ref-based typing
`TerminalTile.jsx` updates character-by-character typing via `useRef` + direct `textContent` DOM mutation, NOT `setState`. React state only changes at line transitions (~7 per cycle). If you modify TerminalTile, preserve this pattern — switching back to `setTyping()` per character causes ~100+ React re-renders/sec across 6 tiles which competes with the DotGrid rAF loop and causes Hero section lag.

## Performance config
- `next.config.mjs` has `experimental.optimizeCss: true` (requires `critters` devDependency — already installed). Inlines critical CSS to eliminate render-blocking chunks.
- `vercel.json` in project root sets security headers (X-Frame-Options, HSTS, COOP, nosniff, Referrer-Policy, Permissions-Policy). Do not remove it.
- `.browserslistrc` targets last 2 versions of Chrome/Firefox/Safari/Edge. Do not widen targets — it reintroduces legacy polyfills.
