"use client";

import { m, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// ── Tunables ──────────────────────────────────────────────────────────────────

// Circle diameter in px — bigger = more visible, smaller = more subtle
// Range: 5–60   |  8–12 = subtle dot, 16–24 = standard, 30–60 = bold blob
const CURSOR_SIZE = 20;

// bg name → cursor fill colour — add entries here for new section backgrounds
const CURSOR_COLORS: Record<string, string> = {
  navy: "#fcedd3", // cream on navy
  tan: "#002147", // navy on tan
  cream: "#002147", // navy on cream
  black: "#fcedd3", // cream on black
};
// const CURSOR_COLORS: Record<string, string> = {
//   navy: "#fcedd3", // cream on navy
//   tan: "#fcedd3", // navy on tan
//   cream: "#fcedd3", // navy on cream
//   black: "#fcedd3", // cream on black
// };

// Fallback when no data-bg ancestor is found (e.g. between sections, navbar)
const DEFAULT_COLOR = "#fcedd3";

// How long the colour crossfade takes when moving between sections (in ms)
// Range: 0–1000  |  0 = instant snap, 150–300 = smooth, 500+ = slow dreamy fade
const COLOR_TRANSITION_MS = 300;

// Spring physics for cursor follow:
//
//   stiffness — how aggressively it snaps to the pointer (higher = tighter)
//   Range: 50–3000
//     50–150  = floaty, trails behind like a ghost
//     300–600 = smooth, slightly behind the pointer
//     800+    = snappy, nearly 1:1 with the pointer
//
//   damping — how quickly it settles (higher = less wobble)
//   Range: 5–150
//     5–15    = jelly, bounces and oscillates around the target
//     20–50   = gentle ease-in with a tiny overshoot
//     60–150  = firm stop, no visible bounce
//
//   mass — inertia of the cursor (higher = heavier, more lag)
//   Range: 0.1–5
//     0.1–0.3 = featherlight, reacts instantly
//     0.5–1   = natural weight, slight momentum
//     2–5     = heavy, drifts and takes time to catch up
//
const SPRING_CONFIG = { stiffness: 3000, damping: 150, mass: 1 };

// ── Component ─────────────────────────────────────────────────────────────────
export function CustomCursor() {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - CURSOR_SIZE / 2);
      rawY.set(e.clientY - CURSOR_SIZE / 2);

      // Walk up from the element under the pointer to find the nearest data-bg
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const bgEl = target?.closest("[data-bg]") as HTMLElement | null;
      const bg = bgEl?.dataset.bg;
      setColor(bg && CURSOR_COLORS[bg] ? CURSOR_COLORS[bg] : DEFAULT_COLOR);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY]);

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{
        x,
        y,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        backgroundColor: color,
        opacity: visible ? 1 : 0,
        transition: `background-color ${COLOR_TRANSITION_MS}ms ease`,
      }}
    />
  );
}
