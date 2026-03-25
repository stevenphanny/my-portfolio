"use client";

import { motion } from "framer-motion";

// ── Timeline data ──────────────────────────────────────────────────────────────
// Update years and events to match your real story.
const TIMELINE = [
  { year: "2022", event: "Started Software Engineering at university" },
  { year: "2023", event: "First internship — building production features" },
  { year: "2024", event: "Deepened focus on full-stack & UI engineering" },
  { year: "2025", event: "Launched this portfolio" },
];

// ── Variants ───────────────────────────────────────────────────────────────────
const headingVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 10 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

const timelineContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

// ── AboutSection ───────────────────────────────────────────────────────────────
export function AboutSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 md:px-12 py-4">

      {/* Section heading */}
      <div className="overflow-hidden mb-16">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-5xl md:text-7xl text-cream"
        >
          About
        </motion.h2>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        style={{ originX: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0, 0, 1] }}
        className="h-px w-full bg-cream/10 mb-14"
      />

      {/* Two-column content */}
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">

        {/* Left: pull-quote + bio */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-6"
        >
          <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/40">
            About me
          </p>

          <blockquote className="font-instrument-serif text-3xl md:text-4xl text-cream leading-snug">
            &ldquo;Building things that feel as good as they look.&rdquo;
          </blockquote>

          <p className="font-lora text-base text-cream/60 leading-relaxed">
            I&apos;m a Software Engineering student with a deep interest in
            full-stack development and thoughtful UI design. I care about the
            craft — the details in motion, the weight of typography, and the
            feeling of using something well-made.
          </p>

          <p className="font-lora text-base text-cream/60 leading-relaxed">
            When I&apos;m not building, I&apos;m studying how good products work
            and thinking about how to make the next thing a little bit better.
          </p>
        </motion.div>

        {/* Right: timeline */}
        <div className="flex flex-col gap-3">
          <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/40 mb-4">
            Timeline
          </p>

          <motion.ul
            variants={timelineContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-0"
          >
            {TIMELINE.map(({ year, event }) => (
              <motion.li
                key={year}
                variants={timelineItemVariants}
                className="flex gap-5 py-4 border-b border-cream/8 last:border-0 group"
              >
                {/* Year */}
                <span className="font-poppins text-xs text-cream/30 pt-0.5 w-10 shrink-0 tabular-nums">
                  {year}
                </span>

                {/* Thin vertical rule */}
                <div className="w-px bg-cream/15 shrink-0 self-stretch" />

                {/* Event */}
                <span className="font-lora text-sm text-cream/65 leading-snug">
                  {event}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
