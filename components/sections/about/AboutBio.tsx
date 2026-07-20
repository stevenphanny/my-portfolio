"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = [0.25, 0, 0, 1] as [number, number, number, number];
const SPRING_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const headingVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 10 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.75, ease: SPRING_EASE },
  },
};

const bioVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.34,
    },
  },
};

const quoteVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.085,
    },
  },
};

const quotePhraseVariants = {
  hidden: { y: "115%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.72, ease: SPRING_EASE },
  },
};

const bodyVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.065,
    },
  },
};

const bodyPhraseVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: EASE_OUT },
  },
};

const QUOTE_PHRASES = [
  { text: "\u201cSay" },
  { text: "Yes", className: "font-extrabold" },
  { text: "to opportunities" },
  { text: "that" },
  { text: "scare you\u201d", className: "italic" },
];

const BODY_PHRASES = [
  "When I\u2019m not coding,",
  "I love cooking,",
  "rating restaurants",
  "and bakeries,",
  "running,",
  "and hanging out",
  "with friends.",
];

export function AboutBio() {
  const shouldReduceMotion = useReducedMotion();
  const initialState = shouldReduceMotion ? "show" : "hidden";

  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-hidden mb-16">
        <motion.h2
          variants={headingVariants}
          initial={initialState}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-5xl md:text-7xl text-navy"
        >
          About Me
        </motion.h2>
      </div>

      <motion.div
        initial={
          shouldReduceMotion
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        style={{ originX: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
        className="h-px w-full bg-navy/10 mb-14"
      />

      <motion.div
        variants={bioVariants}
        initial={initialState}
        whileInView="show"
        viewport={{ once: true, margin: "-80px", amount: 0.35 }}
        className="flex flex-col gap-7"
      >
        <motion.blockquote
          variants={quoteVariants}
          className="font-instrument-serif text-3xl md:text-4xl text-navy leading-snug"
        >
          <span className="flex flex-wrap gap-x-[0.22em] gap-y-1">
            {QUOTE_PHRASES.map(({ text, className }) => (
              <span
                key={text}
                className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]"
              >
                <motion.span
                  variants={quotePhraseVariants}
                  className={`inline-block ${className ?? ""}`}
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.blockquote>

        <motion.p
          variants={bodyVariants}
          className="font-lora text-base text-navy/75 leading-relaxed"
        >
          {BODY_PHRASES.map((phrase) => (
            <motion.span
              key={phrase}
              variants={bodyPhraseVariants}
              className="inline-block mr-[0.28em]"
            >
              {phrase}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </div>
  );
}
