# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

Single-page portfolio built with **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**.

### Section system

`components/sections/registry.ts` is the single source of truth for the page layout. `SECTION_REGISTRY` is an ordered array — each entry defines the section's `id` (scroll target), `label` (navbar text), `bgClass` (Tailwind background), and `Component`. Editing this array is all that's needed to add, remove, or reorder sections. `app/page.tsx` maps over it to render the `<Navbar>` and each `<section>`.

### Smooth scrolling

`LenisProvider` (wraps the app in `layout.tsx`) holds a single Lenis instance and exposes `useLenis()` → `{ scrollTo }`. The Navbar uses this to scroll to sections by id. Scroll feel (duration, easing, `smoothWheel`) is tuned in `LENIS_OPTIONS` inside that file.

### Loading screen

`LoadingScreen` renders before any content. It uses `opentype.js` (loaded lazily to avoid bundle bloat) to convert "Steven Phan" from `public/fonts/Ballet-Regular.ttf` into SVG paths, then animates each glyph being drawn stroke-by-stroke via Framer Motion's `pathLength`. Constants at the top of the file (`WRITE_DELAY`, `WRITE_DURATION`, `EASE_POWER`) control the feel. The screen disappears after ~5.5 s.

### Fonts

Four Google Fonts are loaded in `layout.tsx` and exposed as CSS variables:
- `--font-lora` → `.font-lora` (body default)
- `--font-poppins` → `.font-poppins` (UI / navbar)
- `--font-ballet` → `.font-ballet` (loading screen fallback)
- `--font-instrument-serif` → `.font-instrument-serif` (logo / decorative)

### Colour palette (Tailwind custom colours in `globals.css`)

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#002147` | Primary background, text on light surfaces |
| `cream` | `#fcedd3` | Primary text, light backgrounds |
| `tan` | `#d2b48c` | Skills section background |
| `black` | `#333333` | Soft black (matches MAC brand) |

Use these as `bg-navy`, `text-cream`, etc. in Tailwind classes.

## Design Philosophy

> Sophisticated yet special. Editorial typography, purposeful motion, dark navy / warm cream palette. Every animation earns its place.

### Typography hierarchy

| Role | Font | Tailwind class |
|------|------|----------------|
| Display / hero names | Instrument Serif | `font-instrument-serif` |
| Pull-quotes, body text | Lora | `font-lora` |
| UI labels, nav, tags, eyebrows | Poppins | `font-poppins` |

- Eyebrow labels: Poppins, `text-xs tracking-[0.3em] uppercase opacity-50`
- Section headings: Instrument Serif, `text-5xl md:text-7xl`
- Body: Lora, `text-base leading-relaxed`

### Animation principles

- **Headings**: clip-reveal upward — `clipPath: "inset(0 0 100% 0)"` → `"inset(0 0 0% 0)"` (wrap text in overflow-hidden container)
- **Body / cards**: fade + slide up — `opacity: 0, y: 40` → `opacity: 1, y: 0`
- **Lists / tags**: stagger via Framer Motion `staggerChildren`
- **Dividers**: wipe from left — `scaleX: 0 → 1` with `style={{ originX: 0 }}`
- **Scroll triggers**: `whileInView` with `viewport={{ once: true, margin: "-60px" }}`
- Standard easing: `[0.25, 0, 0, 1]` (smooth ease-out)
- Spring/overshoot easing: `[0.16, 1, 0.3, 1]` (for navbar / entrance moments)
- Intro section animations: delay to `NAV_DELAY = 5.7` so they start after the loading screen exits

### Interaction feel

- Hover on interactive elements: subtle scale (`scale(1.02–1.05)`) + colour swap
- Image blocks: `overflow-hidden` with inner `scale(1.03)` on hover for parallax feel
- Transitions: `duration-300` for hover states, `duration-[600ms]` for entrance animations
