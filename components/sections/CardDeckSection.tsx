"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

// Stacked (at-rest) positions for each card
const STACK_POSITIONS = [
  { x: 0, y: 0, rotate: 0, zIndex: 3 },
  { x: 6, y: 14, rotate: 3, zIndex: 2 },
  { x: -4, y: 22, rotate: -4, zIndex: 1 },
];

// Fanned-out positions
const FAN_POSITIONS = [
  { x: 0, y: 0, rotate: 0, zIndex: 3 },
  { x: -260, y: 20, rotate: -10, zIndex: 2 },
  { x: 260, y: 20, rotate: 10, zIndex: 1 },
];

const headingVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 10 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: { duration: 0.75, ease: SPRING_EASE },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mobile card list — simple stacked layout for touch devices
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MobileCardList() {
  return (
    <div className="flex flex-col gap-5">
      {PROJECTS.map((p, i) => {
        const linkUrl = p.live && p.live !== "#" ? p.live : undefined;
        const cardRatio = 16 / 9.5;

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            className="relative rounded-xl overflow-hidden"
            style={{ aspectRatio: cardRatio }}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,33,71,0.8) 0%, rgba(0,33,71,0.2) 55%, rgba(0,33,71,0.0) 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none">
              <span className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/30">
                {p.id}
              </span>
              <div>
                <h3 className="font-instrument-serif text-cream text-xl leading-tight">
                  {p.title}
                </h3>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-poppins text-[10px] tracking-widest uppercase text-cream/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label={`View ${p.title}`}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Desktop card deck — stacked cards that fan on hover
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function DesktopCardDeck() {
  const [fanned, setFanned] = useState(false);
  const cardW = 440;
  const cardH = Math.round(cardW / (16 / 9.5));

  return (
    <>
      <p className="font-poppins text-xs tracking-[0.25em] uppercase text-navy/30 text-center mb-6">
        {fanned ? "Hover a card" : "Hover to fan"}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto"
        style={{ width: cardW, height: cardH + 30 }}
        onMouseEnter={() => setFanned(true)}
        onMouseLeave={() => setFanned(false)}
      >
        {PROJECTS.map((p, i) => {
          const stackPos = STACK_POSITIONS[i];
          const fanPos = FAN_POSITIONS[i];
          const pos = fanned ? fanPos : stackPos;
          const linkUrl = p.live && p.live !== "#" ? p.live : undefined;

          return (
            <motion.div
              key={p.id}
              animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, zIndex: pos.zIndex }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 24,
                delay: fanned ? i * 0.06 : (PROJECTS.length - 1 - i) * 0.04,
              }}
              whileHover={fanned ? { y: pos.y - 14, scale: 1.04, zIndex: 10 } : {}}
              className="absolute cursor-pointer"
              style={{ width: cardW, height: cardH, top: 0, left: 0, borderRadius: 12, overflow: "hidden" }}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
                />
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,33,71,0.75) 0%, rgba(0,33,71,0.2) 50%, rgba(0,33,71,0.0) 100%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                <span className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/30">
                  {p.id}
                </span>
                <div>
                  <h3 className="font-instrument-serif text-cream text-2xl md:text-3xl leading-tight">
                    {p.title}
                  </h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="font-poppins text-[10px] tracking-widest uppercase text-cream/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {linkUrl && fanned && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label={`View ${p.title}`}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div style={{ height: cardH + 60 }} />
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CardDeckSection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function CardDeckSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

      <div className="overflow-hidden mb-12">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="font-instrument-serif text-4xl md:text-5xl text-navy"
        >
          Other Projects
        </motion.h2>
      </div>

      {isMobile ? <MobileCardList /> : <DesktopCardDeck />}
    </div>
  );
}
