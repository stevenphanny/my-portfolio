"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
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

// ── IntroSection ───────────────────────────────────────────────────────────────
export function IntroSection() {
  const { scrollY } = useScroll();

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
          className="font-instrument-serif text-cream leading-none tracking-tight mr-10"
          style={{ fontSize: "clamp(4rem, 13vw, 14rem)" }}
        >
          Steven Phan
        </motion.h1>
      </motion.div>

      {/* ── Rows 2 & 3: move together ────────────────────────────────────── */}
      <motion.div
        style={{ x: row2X }}
      className="flex flex-col items-center gap-1 mr-10"
      >
        <motion.p
          variants={row2Variants}
          initial="hidden"
          animate="show"
          className="font-instrument-serif tracking-tight"
          style={{ fontSize: "clamp(0.8rem, 2.6vw, 2.8rem)" }}
        >
          <span className="text-tan">@</span>
          <span className="text-tan">stevenphanny</span>
        </motion.p>
      </motion.div>

    </div>
  );
}
