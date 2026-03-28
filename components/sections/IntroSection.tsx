"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
const HERO_DELAY = 5.7;

// ── Entry variants ─────────────────────────────────────────────────────────────

// Row 1 — clip-reveal upward, slow and weighty
const row1Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 24 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: {
      delay: HERO_DELAY,
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// Rows 2 & 3 and CTA — slow fade + gentle rise
const makeFadeUp = (extraDelay: number) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: HERO_DELAY + extraDelay,
      duration: 1.0,
      ease: [0.25, 0, 0, 1] as [number, number, number, number],
    },
  },
});

const row2Variants = makeFadeUp(0.3);

// ── Proximity hover: letters near the cursor rise proportionally ──────────────
const HERO_NAME = "Steven Phan";
const HERO_HANDLE = "@stevenphanny";
// Radius in px — letters within this distance from the cursor are affected
const NAME_RADIUS = 100;
const HANDLE_RADIUS = 18;
// Max raise in em — scales with font size so it stays proportional
const MAX_RAISE_EM = 0.08;

function HeroLetter({
  char,
  index,
  cursorX,
  radius,
}: {
  char: string;
  index: number;
  cursorX: MotionValue<number>;
  radius: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const rawY = useMotionValue(0);
  // stiffness: how aggressively the spring snaps to target (higher = faster)
  // damping: how quickly oscillation settles (lower = bouncier)
  const y = useSpring(rawY, { stiffness: 250, damping: 20 });

  useEffect(() => {
    if (char === " ") return;
    return cursorX.on("change", (cx) => {
      const el = ref.current;
      if (!el || cx === -1) { rawY.set(0); return; }
      // Get letter center x relative to viewport
      const rect = el.getBoundingClientRect();
      const letterCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cx - letterCenter);
      if (dist > radius) { rawY.set(0); return; }
      // Cosine falloff: smooth bell curve from 1 (at cursor) to 0 (at radius edge)
      const strength = Math.cos((dist / radius) * (Math.PI / 2));
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      rawY.set(-strength * MAX_RAISE_EM * fontSize);
    });
  }, [char, cursorX, rawY, radius]);

  if (char === " ") {
    return <span className="inline-block w-[0.25em]">&nbsp;</span>;
  }

  return (
    <motion.span ref={ref} className="inline-block cursor-default" style={{ y }}>
      {char}
    </motion.span>
  );
}

// ── IntroSection ───────────────────────────────────────────────────────────────
export function IntroSection() {
  const { scrollY } = useScroll();
  // Track cursor x — separate motion values so each row is independent
  const cursorX = useMotionValue(-1);
  const cursorX2 = useMotionValue(-1);

  // No useSpring — Lenis already smooths scroll, double-smoothing felt wrong
  const row1X = useTransform(scrollY, [0, 600], [-10, 60]);
  const row2X = useTransform(scrollY, [0, 600], [10, -40]);

  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIndicatorVisible(true), (HERO_DELAY + 1) * 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) {
        setHasScrolled(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-0 text-center relative">

      {/* Cream wipe: sweeps in left→right over the loading screen, then exits left→right */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[10000] bg-cream pointer-events-none"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 100%)"] }}
        transition={{ delay: HERO_DELAY - 0.4, duration: 1.2, times: [0, 0.45, 1], ease: "easeInOut" }}
      />

      {/* ── Row 1: Steven Phan ───────────────────────────────────────────── */}
      <motion.div className="overflow-hidden" style={{ x: row1X }}>
        <motion.h1
          variants={row1Variants}
          initial="hidden"
          animate="show"
          className="font-instrument-serif text-cream leading-none tracking-tight flex"
          style={{ fontSize: "clamp(4rem, 13vw, 14rem)" }}
          onMouseMove={(e) => cursorX.set(e.clientX)}
          onMouseLeave={() => cursorX.set(-1)}
        >
          {HERO_NAME.split("").map((char, i) => (
            <HeroLetter key={i} char={char} index={i} cursorX={cursorX} radius={NAME_RADIUS} />
          ))}
        </motion.h1>
      </motion.div>

      {/* ── Rows 2 & 3: move together ────────────────────────────────────── */}
      <motion.div
        style={{ x: row2X }}
      className="flex flex-col items-center gap-1"
      >
        <motion.p
          variants={row2Variants}
          initial="hidden"
          animate="show"
          className="font-instrument-serif tracking-tight text-tan flex"
          style={{ fontSize: "clamp(0.8rem, 2.6vw, 2.8rem)" }}
          onMouseMove={(e) => cursorX2.set(e.clientX)}
          onMouseLeave={() => cursorX2.set(-1)}
        >
          {HERO_HANDLE.split("").map((char, i) => (
            <HeroLetter key={i} char={char} index={i} cursorX={cursorX2} radius={HANDLE_RADIUS} />
          ))}
        </motion.p>
      </motion.div>

    </div>
  );
}
