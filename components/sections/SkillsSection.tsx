"use client";

import { motion } from "framer-motion";

// ── Skill groups ───────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    label: "Technologies",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "PostgreSQL",
      "Tailwind CSS",
      "REST APIs",
      "GraphQL",
    ],
  },
  {
    label: "Tools & Design",
    tags: [
      "Git",
      "Figma",
      "Docker",
      "CI / CD",
      "Framer Motion",
      "Vercel",
      "Linux",
    ],
  },
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

const groupVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

const tagsContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const tagVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

// ── SkillsSection ──────────────────────────────────────────────────────────────
export function SkillsSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 md:px-12 py-4">

      {/* Section heading */}
      <div className="overflow-hidden mb-16">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-5xl md:text-7xl text-navy"
        >
          Skills
        </motion.h2>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        style={{ originX: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0, 0, 1] }}
        className="h-px w-full bg-navy/10 mb-14"
      />

      {/* Skill groups */}
      <div className="flex flex-col gap-12">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.label}
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            style={{ transitionDelay: `${gi * 0.1}s` }}
            className="flex flex-col gap-4"
          >
            <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/40">
              {group.label}
            </p>

            <motion.ul
              variants={tagsContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2"
            >
              {group.tags.map((tag) => (
                <motion.li key={tag} variants={tagVariants}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="inline-block rounded-full border border-navy/20 px-4 py-1.5 font-poppins text-sm text-navy/70 cursor-default transition-colors duration-200 hover:border-navy hover:text-navy"
                  >
                    {tag}
                  </motion.span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
