"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Timeline data ──────────────────────────────────────────────────────────────
const TIMELINE = [
  { year: "2022", event: "Started Software Engineering at university" },
  { year: "2023", event: "First internship — building production features" },
  { year: "2024", event: "Deepened focus on full-stack & UI engineering" },
  { year: "2025", event: "Launched this portfolio" },
];

// ── Framer variants (heading + bio) ────────────────────────────────────────────
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

// ── AboutSection ───────────────────────────────────────────────────────────────
export function AboutSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── GSAP ScrollTrigger animations ──
  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Progress line: fills top → bottom, scrubbed to scroll position
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 0.3,
          },
        },
      );

      // Cards: responsive slide direction via matchMedia
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
            {
              opacity: 1,
              x: 0,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 55%",
                scrub: 0.5,
              },
            },
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, x: 40 },
            {
              opacity: 1,
              x: 0,
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 70%",
                scrub: 0.5,
              },
            },
          );
        });
      });

      // Dots — phase 1: scale in
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: dot,
              start: "top 85%",
              end: "top 70%",
              scrub: 0.3,
            },
          },
        );
      });

      // Dots — phase 2: fill color + glow
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.to(dot, {
          backgroundColor: "#fcedd3",
          borderColor: "#fcedd3",
          boxShadow: "0 0 10px 3px rgba(252,237,211,0.2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 70%",
            end: "top 55%",
            scrub: 0.3,
          },
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

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

      {/* Bio */}
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-xl flex flex-col gap-6"
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

      {/* ── GSAP Scroll-driven timeline ─────────────────────────────────────── */}
      <div className="mt-28">
        <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/40 text-center mb-20">
          Journey
        </p>

        <div ref={timelineRef} className="relative">
          {/* Background line (dim guide) */}
          <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-cream/10" />

          {/* Progress line (fills from top, scrubbed) */}
          <div
            ref={progressRef}
            className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-cream/50 origin-top"
          />

          {/* Timeline items */}
          <div className="flex flex-col gap-28 md:gap-40">
            {TIMELINE.map(({ year, event }, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={year} className="relative">
                  {/* Dot on the line */}
                  <div
                    ref={(el) => { dotRefs.current[i] = el; }}
                    className="absolute left-5 -translate-x-1/2 md:left-1/2 top-2 w-3 h-3 rounded-full border-2 border-cream/50 bg-navy z-10"
                  />

                  {/* Content card */}
                  <div
                    ref={(el) => { cardRefs.current[i] = el; }}
                    className={`
                      pl-12
                      md:pl-0 md:w-[calc(50%-24px)]
                      ${isEven
                        ? "md:mr-auto md:text-right md:pr-12"
                        : "md:ml-auto md:pl-12"
                      }
                    `}
                  >
                    <span className="font-instrument-serif text-3xl md:text-4xl text-cream block">
                      {year}
                    </span>
                    <p className="font-lora text-sm text-cream/50 mt-2 leading-relaxed">
                      {event}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
