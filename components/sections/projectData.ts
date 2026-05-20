export type Project = {
  id: string;
  title: string;
  year: string;
  tags: string[];
  desc: string;
  image?: string;
  live?: string;
  github?: string;
};

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "01",
    title: "Monash Association of Coding Website",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    desc: "The public-facing MAC website for events, membership, recruitment, and community updates.",
    image: "/projects/mac.png",
    live: "https://www.monashcoding.com/",
    github: "#",
  },
  {
    id: "02",
    title: "MAC Job Board",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Product"],
    desc: "A careers board helping Monash students discover internships, graduate roles, and tech opportunities.",
    image: "/projects/mac.png",
    live: "https://jobs.monashcoding.com/jobs",
    github: "#",
  },
  {
    id: "03",
    title: "BeeSafe",
    year: "2025",
    tags: ["Next.js", "TypeScript", "UX"],
    desc: "A safety-focused project designed to make reporting and responding to risk feel clearer and faster.",
    image: "/projects/beeSafe.png",
    live: "https://devpost.com/software/beesafe-njd4hi",
    github: "#",
  },
];

export const OTHER_PROJECTS: Project[] = [
  {
    id: "01",
    title: "Black Jack",
    year: "2023",
    tags: ["JavaScript", "Game Logic", "UI"],
    desc: "A playable browser blackjack game focused on quick rounds, clean interactions, and readable game state.",
    image: "/projects/blackjack.png",
    live: "https://stevenphanny-blackjack.vercel.app/",
    github: "#",
  },
  {
    id: "02",
    title: "MonMap",
    year: "2026",
    tags: ["Next.js", "Course Planning", "MAC"],
    desc: "A course mapping tool for Monash students, built with the MAC projects team.",
    image: "/projects/mac.png",
    live: "https://monmap.monashcoding.com/",
    github: "#",
  },
];
