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
