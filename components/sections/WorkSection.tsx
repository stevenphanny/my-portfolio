"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ── Tuning (adjust these) ─────────────────────────────────────────────────────
const CARD_RATIO    = 16 / 10;  // image aspect ratio — try 16/9, 16/10, 3/2
const PARALLAX_PX   = 30;       // how far the image shifts on scroll (px each direction)
const IMAGE_SCALE   = 1.15;     // image is 15% larger than card so edges never show

// ── Project data ──────────────────────────────────────────────────────────────
type Project = {
  id: string;
  title: string;
  tags: string[];
  desc: string;
  image?: string;
  imgClass?: string;
  live?: string;
  github?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Project Title",
    tags: ["React", "Node.js", "REST API"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    image: "/projects/mac.png",
    imgClass: "bg-tan/25",
    live: "https://www.monashcoding.com/",
    github: "#",
  },
  {
    id: "02",
    title: "BeeSafe",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    image: "/projects/beeSafe.jpg",
    imgClass: "bg-cream/10",
    live: "https://devpost.com/software/beesafe-njd4hi",
    github: "#",
  },
  {
    id: "03",
    title: "Project Title",
    tags: ["Python", "FastAPI", "Figma"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    image: "/projects/blackjack.png",
    imgClass: "bg-cream/5",
    live: "https://stevenphanny-blackjack.vercel.app/",
    github: "#",
  },
];

// ── Variants ──────────────────────────────────────────────────────────────────
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

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRight = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-PARALLAX_PX, PARALLAX_PX]);

  const linkUrl =
    project.live && project.live !== "#"
      ? project.live
      : project.github && project.github !== "#"
        ? project.github
        : undefined;

  const imageBlock = (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,33,71,0.18)" }}
      transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
      className="rounded-xl overflow-hidden cursor-pointer shadow-sm border-2 border-transparent hover:border-cream/20 transition-colors duration-300"
      style={{ aspectRatio: CARD_RATIO }}
    >
      {project.image ? (
        <motion.img
          src={project.image}
          alt={project.title}
          style={{ y: imageY, scale: IMAGE_SCALE }}
          whileHover={{ scale: IMAGE_SCALE * 1.03 }}
          transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
          className="w-full h-full object-cover"
        />
      ) : (
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
          className={`w-full h-full ${project.imgClass ?? "bg-cream/10"} flex items-end p-5`}
        >
          <span className="font-poppins text-xs tracking-[0.2em] text-navy/20 uppercase">
            {project.id}
          </span>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <motion.article
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 ${imageRight ? "md:[&>*:first-child]:order-last" : ""}`}
    >
      {/* Image block */}
      <div>
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
            {imageBlock}
          </a>
        ) : (
          imageBlock
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-4">
        <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/30">
          {project.id}
        </p>

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

        <p className="font-lora text-sm text-navy/65 leading-relaxed">
          {project.desc}
        </p>

        {/* Links */}
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
      </div>
    </motion.article>
  );
}

// ── WorkSection ───────────────────────────────────────────────────────────────
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
        className="h-px max-w-full w-full bg-navy/15 mb-16"
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

      {/* Project cards */}
      <div className="flex flex-col gap-20 md:gap-28">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
