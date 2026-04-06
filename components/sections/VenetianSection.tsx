"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Project = {
  id: string;
  title: string;
  year: string;
  tags: string[];
  desc: string;
  image?: string;
  live?: string;
  github?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Monash Association of Coding",
    year: "2024",
    tags: ["React", "Node.js", "REST API"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it.",
    image: "/projects/mac.png",
    live: "https://www.monashcoding.com/",
    github: "#",
  },
  {
    id: "02",
    title: "BeeSafe",
    year: "2024",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it.",
    image: "/projects/beeSafe.png",
    live: "https://devpost.com/software/beesafe-njd4hi",
    github: "#",
  },
  {
    id: "03",
    title: "Blackjack",
    year: "2023",
    tags: ["Python", "FastAPI", "Figma"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it.",
    image: "/projects/blackjack.png",
    live: "https://stevenphanny-blackjack.vercel.app/",
    github: "#",
  },
];

const CARD_RATIO = 16 / 9.5;
const STRIP_COUNT = 7;
const EASE = [0.25, 0, 0, 1] as [number, number, number, number];
const SPRING_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const headingVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 10 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.75, ease: SPRING_EASE },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: EASE },
  }),
};

function ProjectText({ project }: { project: Project }) {
  return (
    <div className="flex flex-col justify-center gap-4">
      <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/30">{project.id}</p>
      <h3 className="font-instrument-serif text-3xl md:text-4xl text-cream leading-tight">
        {project.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-cream/40 px-3 py-1 font-poppins text-xs text-cream/50">
            {tag}
          </span>
        ))}
      </div>
      <p className="font-lora text-sm text-cream/65 leading-relaxed">{project.desc}</p>
      <div className="flex gap-5">
        {project.live && project.live !== "#" && (
          <a href={project.live} target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-poppins text-xs text-cream/60 transition-colors duration-200 hover:text-cream">
            Live
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONCEPT G — Venetian Blind
// The navy cover is sliced into STRIP_COUNT horizontal strips.
// On hover, each strip slides off to the right with a top-to-bottom stagger —
// like venetian blinds retracting. Alternating strips exit in opposite directions
// for extra drama.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function VenetianCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const imageRight = index % 2 !== 0;
  const linkUrl = project.live && project.live !== "#" ? project.live : undefined;

  const strips = Array.from({ length: STRIP_COUNT }, (_, i) => i);
  const stripHeightPct = 100 / STRIP_COUNT;

  const imageBlock = (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{ aspectRatio: CARD_RATIO }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Screenshot — base layer */}
      {project.image && (
        <motion.img
          src={project.image}
          alt={project.title}
          animate={{ scale: hovered ? 1.03 : 1.06 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Venetian strips */}
      {strips.map((i) => {
        // Alternate: even strips exit right, odd strips exit left
        const exitX = i % 2 === 0 ? "110%" : "-110%";
        // Stagger from top to bottom
        const staggerDelay = i * 0.04;

        return (
          <motion.div
            key={i}
            className="absolute left-0 right-0 bg-cream pointer-events-none"
            style={{
              top: `${i * stripHeightPct}%`,
              height: `${stripHeightPct + 0.5}%`, // +0.5% to prevent hairline gaps
            }}
            animate={{ x: hovered ? exitX : "0%" }}
            transition={{
              duration: 0.45,
              delay: hovered ? staggerDelay : (STRIP_COUNT - 1 - i) * 0.03,
              ease: EASE,
            }}
          >
            {/* Show title text only on the middle strip */}
            {i === Math.floor(STRIP_COUNT / 2) - 1 && (
              <div className="absolute inset-0 flex items-center px-7 md:px-9">
                <h3 className="font-instrument-serif text-navy text-xl md:text-2xl leading-snug truncate">
                  {project.title}
                </h3>
              </div>
            )}
            {/* Ghost number on last strip */}
            {i === STRIP_COUNT - 1 && (
              <span className="absolute bottom-1 right-5 font-instrument-serif text-[3.5rem] leading-none text-navy/[0.07] select-none">
                {project.id}
              </span>
            )}
          </motion.div>
        );
      })}

      {/* Index label — always visible above strips */}
      <div className="absolute top-5 left-7 z-10 pointer-events-none">
        <span className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/30">
          {project.id}
        </span>
      </div>
    </div>
  );

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 ${imageRight ? "md:[&>*:first-child]:order-last" : ""}`}
    >
      <div>
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">{imageBlock}</a>
        ) : imageBlock}
      </div>
      <ProjectText project={project} />
    </motion.article>
  );
}

export function VenetianSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 md:px-12 py-4">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE }}
        style={{ originX: 0 }}
        className="h-px w-full bg-cream/15 mb-16"
      />

      <div className="overflow-hidden mb-16">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-5xl md:text-7xl text-cream"
        >
          Work
        </motion.h2>
      </div>

      <div className="flex flex-col gap-20 md:gap-28">
        {PROJECTS.map((p, i) => (
          <VenetianCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
