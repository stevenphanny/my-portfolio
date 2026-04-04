"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Switch variants — change this one value to preview each design
//   "cover-reveal" → navy cover with title wipes away on hover to show screenshot
//   "tinted"       → screenshot under navy overlay; hover lifts the tint
//   "editorial"    → clean text list; hover reveals sticky preview panel on right
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const VARIANT: "cover-reveal" | "tinted" | "editorial" = "cover-reveal";

const CARD_RATIO = 16 / 9.5;
const IMAGE_SCALE = 1.06;

// ── Project data ──────────────────────────────────────────────────────────────
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
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    image: "/projects/mac.png",
    live: "https://www.monashcoding.com/",
    github: "#",
  },
  {
    id: "02",
    title: "BeeSafe",
    year: "2024",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    image: "/projects/beeSafe.png",
    live: "https://devpost.com/software/beesafe-njd4hi",
    github: "#",
  },
  {
    id: "03",
    title: "Blackjack",
    year: "2023",
    tags: ["Python", "FastAPI", "Figma"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    image: "/projects/blackjack.png",
    live: "https://stevenphanny-blackjack.vercel.app/",
    github: "#",
  },
];

// ── Shared animation variants ─────────────────────────────────────────────────
const headingVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 10 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0, 0, 1] as [number, number, number, number],
    },
  }),
};

const tagsContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const tagVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  },
};

// ── Shared links ──────────────────────────────────────────────────────────────
function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-5 pt-1">
      {project.live && project.live !== "#" && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-poppins text-xs text-navy/60 transition-colors duration-200 hover:text-navy"
        >
          Live
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      )}
      {project.github && project.github !== "#" && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-poppins text-xs text-navy/60 transition-colors duration-200 hover:text-navy"
        >
          GitHub
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      )}
    </div>
  );
}

// ── Shared text column ────────────────────────────────────────────────────────
function ProjectText({ project }: { project: Project }) {
  return (
    <div className="flex flex-col justify-center gap-4">
      <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/30">{project.id}</p>
      <h3 className="font-instrument-serif text-3xl md:text-4xl text-navy leading-tight">
        {project.title}
      </h3>
      <motion.ul
        variants={tagsContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap gap-2"
      >
        {project.tags.map((tag) => (
          <motion.li key={tag} variants={tagVariants}>
            <span className="rounded-full border border-navy/40 px-3 py-1 font-poppins text-xs text-navy/50">
              {tag}
            </span>
          </motion.li>
        ))}
      </motion.ul>
      <p className="font-lora text-sm text-navy/65 leading-relaxed">{project.desc}</p>
      <ProjectLinks project={project} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VARIANT A — Cover Reveal
// Navy cover with cream title sits over the screenshot.
// Hover wipes the cover away left-to-right, revealing the screenshot beneath.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CoverRevealCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const imageRight = index % 2 !== 0;
  const linkUrl = project.live && project.live !== "#" ? project.live : undefined;

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
          animate={{ scale: hovered ? IMAGE_SCALE * 1.03 : IMAGE_SCALE }}
          transition={{ duration: 0.55, ease: [0.25, 0, 0, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Cover — wipes away on hover */}
      <motion.div
        className="absolute inset-0 bg-navy flex flex-col justify-between p-7 md:p-9 pointer-events-none"
        animate={{
          clipPath: hovered ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)",
        }}
        transition={{ duration: 0.55, ease: [0.25, 0, 0, 1] }}
      >
        <span className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/30">
          {project.id}
        </span>
        <div>
          {/* Ghost number — decorative */}
          <span className="absolute bottom-3 right-5 font-instrument-serif text-[7rem] leading-none text-cream/[0.06] select-none">
            {project.id}
          </span>
          <h3 className="font-instrument-serif text-cream text-2xl md:text-3xl leading-snug mb-3">
            {project.title}
          </h3>
          <p className="font-poppins text-cream/30 text-[10px] tracking-[0.3em] uppercase">
            Hover to preview
          </p>
        </div>
      </motion.div>
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
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
            {imageBlock}
          </a>
        ) : (
          imageBlock
        )}
      </div>
      <ProjectText project={project} />
    </motion.article>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VARIANT B — Tinted
// Screenshot always visible but buried under a navy overlay so it blends with
// the palette. Hover lifts the overlay, revealing the true colours.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TintedCard({ project, index }: { project: Project; index: number }) {
  const imageRight = index % 2 !== 0;
  const linkUrl = project.live && project.live !== "#" ? project.live : undefined;

  const imageBlock = (
    <motion.div
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{ aspectRatio: CARD_RATIO }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
    >
      {project.image && (
        <motion.img
          src={project.image}
          alt={project.title}
          style={{ scale: IMAGE_SCALE }}
          whileHover={{ scale: IMAGE_SCALE * 1.02 }}
          transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
          className="w-full h-full object-cover"
        />
      )}

      {/* Navy tint overlay */}
      <motion.div
        className="absolute inset-0 bg-navy"
        initial={{ opacity: 0.68 }}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
      />

      {/* Cover text — fades as tint lifts */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-7 pointer-events-none"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/40">
          {project.id}
        </span>
        <span className="font-instrument-serif text-[6.5rem] leading-none text-cream/[0.07] self-end select-none">
          {project.id}
        </span>
      </motion.div>
    </motion.div>
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
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
            {imageBlock}
          </a>
        ) : (
          imageBlock
        )}
      </div>
      <ProjectText project={project} />
    </motion.article>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VARIANT C — Editorial
// No images in the main layout. Each project is a full-width numbered row.
// Hovering a row shows its screenshot in a sticky panel on the right.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function EditorialRow({
  project,
  index,
  onHover,
  onLeave,
}: {
  project: Project;
  index: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  const linkUrl = project.live && project.live !== "#" ? project.live : undefined;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group border-b border-navy/15 py-7 cursor-default"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: index + title + description */}
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <span className="font-poppins text-xs tracking-[0.3em] text-navy/30 pt-2 shrink-0">
            {project.id}
          </span>
          <div className="min-w-0">
            <h3 className="font-instrument-serif text-3xl md:text-4xl text-navy leading-tight group-hover:opacity-60 transition-opacity duration-300">
              {linkUrl ? (
                <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p className="font-lora text-sm text-navy/50 leading-relaxed mt-2 max-w-sm">
              {project.desc}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <ProjectLinks project={project} />
            </div>
          </div>
        </div>

        {/* Right: tags + year */}
        <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-[200px] shrink-0 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-navy/30 px-3 py-1 font-poppins text-xs text-navy/45"
            >
              {tag}
            </span>
          ))}
          <span className="w-full text-right font-poppins text-xs text-navy/25 tracking-wider mt-1">
            {project.year}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function EditorialList({ projects }: { projects: Project[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredProject = projects.find((p) => p.id === hoveredId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-16 items-start">
      {/* Project list */}
      <div className="lg:col-span-3">
        {projects.map((p, i) => (
          <EditorialRow
            key={p.id}
            project={p}
            index={i}
            onHover={() => setHoveredId(p.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      {/* Sticky preview panel */}
      <div className="hidden lg:block lg:col-span-2 sticky top-32">
        <AnimatePresence mode="wait">
          {hoveredProject ? (
            <motion.div
              key={hoveredProject.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
              className="rounded-xl overflow-hidden"
              style={{ aspectRatio: CARD_RATIO }}
            >
              {hoveredProject.image ? (
                <img
                  src={hoveredProject.image}
                  alt={hoveredProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-navy/8 flex items-center justify-center">
                  <span className="font-instrument-serif text-navy/20 text-6xl">
                    {hoveredProject.id}
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-navy/10 flex items-center justify-center"
              style={{ aspectRatio: CARD_RATIO }}
            >
              <span className="font-poppins text-[10px] tracking-[0.3em] uppercase text-navy/20">
                Hover a project
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WorkSection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function WorkSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 md:px-12 py-4">

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.25, 0, 0, 1] }}
        style={{ originX: 0 }}
        className="h-px w-full bg-navy/15 mb-16"
      />

      {/* Section heading */}
      <div className="overflow-hidden mb-16">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-5xl md:text-7xl text-navy"
        >
          Work
        </motion.h2>
      </div>

      {/* Content — driven by VARIANT constant above */}
      {VARIANT === "editorial" ? (
        <EditorialList projects={PROJECTS} />
      ) : (
        <div className="flex flex-col gap-20 md:gap-28">
          {PROJECTS.map((p, i) =>
            VARIANT === "cover-reveal" ? (
              <CoverRevealCard key={p.id} project={p} index={i} />
            ) : (
              <TintedCard key={p.id} project={p} index={i} />
            )
          )}
        </div>
      )}
    </div>
  );
}
