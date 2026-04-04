"use client";

import { motion } from "framer-motion";

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONCEPT F — Magazine Spread
// Each project is a full-width cinematic image (21:9) with the title overlaid
// directly on the image over a gradient — like a luxury campaign spread.
// Hover: gradient thins, image breathes (scale 1.03).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MagazineCard({ project, index }: { project: Project; index: number }) {
  const linkUrl = project.live && project.live !== "#" ? project.live : undefined;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: EASE }}
      className="group relative overflow-hidden rounded-xl cursor-pointer"
      style={{ aspectRatio: "21 / 9" }}
    >
      {/* Screenshot */}
      {project.image && (
        <motion.img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: 1.04 }}
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      )}

      {/* Gradient overlay — thins on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,33,71,0.82) 0%, rgba(0,33,71,0.3) 45%, rgba(0,33,71,0.05) 100%)",
        }}
        whileHover={{
          background: "linear-gradient(to top, rgba(0,33,71,0.65) 0%, rgba(0,33,71,0.15) 45%, rgba(0,33,71,0.0) 100%)",
        }}
        transition={{ duration: 0.5, ease: EASE }}
      />

      {/* Overlaid text — bottom left */}
      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10 pointer-events-none">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/40 mb-2">
              {project.id} · {project.year}
            </p>
            <h3 className="font-instrument-serif text-3xl md:text-5xl text-cream leading-tight">
              {project.title}
            </h3>
          </div>
          {/* Arrow — appears on parent group hover via CSS */}
          <span className="font-instrument-serif text-3xl text-cream/0 group-hover:text-cream/70 shrink-0 mb-1 transition-colors duration-300">
            ↗
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <article>
      {linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
          {card}
        </a>
      ) : card}

      {/* Below-image meta row */}
      <div className="flex items-start justify-between gap-6 mt-5 px-1">
        <p className="font-lora text-sm text-navy/60 leading-relaxed max-w-lg">
          {project.desc}
        </p>
        <div className="flex flex-wrap gap-2 justify-end shrink-0">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-navy/30 px-3 py-1 font-poppins text-xs text-navy/45">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function MagazineSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 md:px-12 py-4">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE }}
        style={{ originX: 0 }}
        className="h-px w-full bg-navy/15 mb-16"
      />

      <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/30 mb-4">
        Concept F — Magazine Spread
      </p>

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

      <div className="flex flex-col gap-16 md:gap-24">
        {PROJECTS.map((p, i) => (
          <MagazineCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
