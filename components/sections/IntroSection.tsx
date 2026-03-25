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
const row3Variants = makeFadeUp(0.52);

// ── IntroSection ───────────────────────────────────────────────────────────────
export function IntroSection() {
  const { scrollY } = useScroll();

  // No useSpring — Lenis already smooths scroll, double-smoothing felt wrong
  const row1X = useTransform(scrollY, [0, 600], [-10, 40]);
  const row2X = useTransform(scrollY, [0, 600], [10, -30]);

  // Scroll indicator: show after hero delay, hide once user scrolls
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

      {/* Cream wipe: sweeps in left→right, then exits left→right */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[55] bg-cream pointer-events-none"
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
          className="font-instrument-serif text-cream leading-none tracking-tight"
          style={{ fontSize: "clamp(4rem, 13vw, 14rem)" }}
        >
          Steven Phan
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
          className="font-instrument-serif tracking-tight"
          style={{ fontSize: "clamp(0.8rem, 2.6vw, 2.8rem)" }}
        >
          <span className="text-cream/30">@</span>
          <span className="text-tan">stevenphanny</span>
        </motion.p>

        <motion.p
          variants={row3Variants}
          initial="hidden"
          animate="show"
          className="font-poppins text-sm text-cream/50 tracking-wide"
        >
          Software Engineer
        </motion.p>
      </motion.div>

      {/* Scroll indicator — fixed to viewport bottom, fades after loading + hides on scroll */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30"
        animate={{
          opacity: indicatorVisible && !hasScrolled ? 1 : 0,
          y: indicatorVisible && !hasScrolled ? 0 : 8,
        }}
        transition={{ duration: 0.7, ease: [0.25, 0, 0, 1] }}
      >
        <span className="font-poppins text-[10px] tracking-[0.3em] uppercase text-cream/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cream/25">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
