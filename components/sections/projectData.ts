export type Project = {
  id: string;
  title: string;
  year: string;
  tags: string[];
  desc: string;
  image?: string;
  imageOrientation?: "landscape" | "vertical";
  imageFit?: "cover" | "contain";
  imageScale?: number;
  imageHoverScale?: number;
  live?: string;
  github?: string;
};

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "01",
    title: "Monash Association of Coding Website",
    year: "2026",
    tags: [],
    desc: "The largest student coding club in Australia.",
    image: "/projects/mac.png",
    live: "https://www.monashcoding.com/",
    github: "#",
  },
  {
    id: "02",
    title: "MAC Job Board",
    year: "2026",
    tags: [],
    desc: "A job board helping Monash students discover internships, graduate roles, and tech opportunities.",
    image: "/projects/mac_job_board.png",
    imageOrientation: "vertical",
    imageFit: "contain",
    imageScale: 0.96,
    imageHoverScale: 1,
    live: "https://jobs.monashcoding.com/jobs",
    github: "#",
  },
  {
    id: "03",
    title: "BeeSafe",
    year: "2025",
    tags: ["6th place out of 183 teams"],
    desc: "A mobile dashcam with AI integration to detect drowsiness and crashes.",
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
    image: "/projects/monmap.png",
    live: "https://monmap.monashcoding.com/",
    github: "#",
  },
];
