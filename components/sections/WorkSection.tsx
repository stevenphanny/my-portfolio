"use client";

import { motion } from "framer-motion";

// ── Project data ───────────────────────────────────────────────────────────────
// Replace title, desc, live, github, and imgClass with real content later.
type Project = {
  id: string;
  title: string;
  tags: string[];
  desc: string;
  imgClass: string; // Tailwind bg class for the placeholder colour block
  live?: string;
  github?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Project Title",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    imgClass: "bg-cream/10",
    live: "#",
    github: "#",
  },
  {
    id: "02",
    title: "Project Title",
    tags: ["React", "Node.js", "REST API"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    imgClass: "bg-tan/25",
    live: "#",
    github: "#",
  },
  {
    id: "03",
    title: "Project Title",
    tags: ["Python", "FastAPI", "Figma"],
    desc: "A short description of what this project does, the problem it solves, and what was interesting about building it. Replace with your real content.",
    imgClass: "bg-cream/5",
    live: "#",
    github: "#",
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

// ── WorkSection ────────────────────────────────────────────────────────────────
export function WorkSection() {
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
          Work
        </motion.h2>
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-20 md:gap-28">
        {PROJECTS.map((project, i) => {
          // Alternate: even index = image left, odd = image right
          const imageRight = i % 2 !== 0;

          return (
            <motion.article
              key={project.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 ${imageRight ? "md:[&>*:first-child]:order-last" : ""}`}
            >
              {/* Image block */}
              <div className="overflow-hidden rounded-xl">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
                  className={`aspect-video w-full ${project.imgClass} rounded-xl flex items-end p-5`}
                >
                  <span className="font-poppins text-xs tracking-[0.2em] text-cream/20 uppercase">
                    {project.id}
                  </span>
                </motion.div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center gap-4">
                <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/30">
                  {project.id}
                </p>

                <h3 className="font-instrument-serif text-3xl md:text-4xl text-cream leading-tight">
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
                      <span className="rounded-full border border-cream/15 px-3 py-1 font-poppins text-xs text-cream/50">
                        {tag}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <p className="font-lora text-sm text-cream/55 leading-relaxed">
                  {project.desc}
                </p>

                {/* Links */}
                <div className="flex items-center gap-5 pt-1">
                  {project.live && project.live !== "#" && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-poppins text-xs text-cream/60 transition-colors duration-200 hover:text-cream"
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
                      className="group inline-flex items-center gap-1.5 font-poppins text-xs text-cream/60 transition-colors duration-200 hover:text-cream"
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
        })}
      </div>
    </div>
  );
}
