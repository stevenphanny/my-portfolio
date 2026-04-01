// ── Config ────────────────────────────────────────────────────────────────────
/** Number of 'main' trunk events before the branch fork appears. */
export const BRANCH_AFTER = 2;

/** Vertical px between event rows. Must match GitGraph's ROW_HEIGHT. */
export const ROW_HEIGHT = 160;

// ── Types ─────────────────────────────────────────────────────────────────────
export type Branch = "main" | "left" | "right";

export type TimelineEvent = {
  year: string;
  event: string;
  branch: Branch;
  detail?: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
// branch: "main"  → trunk (before fork)
// branch: "left"  → academics / internships / technical
// branch: "right" → extracurricular / life
export const TIMELINE: TimelineEvent[] = [
  {
    branch: "main",
    year: "2022",
    event: "Started Software Engineering",
    detail: "Monash University",
  },
  {
    branch: "main",
    year: "2023",
    event: "First internship",
    detail: "Building production features",
  },
  // ── Fork happens here (after BRANCH_AFTER main events) ──
  {
    branch: "left",
    year: "2023",
    event: "Deepened full-stack focus",
    detail: "React, Next.js, TypeScript",
  },
  {
    branch: "right",
    year: "2023",
    event: "Joined MAC committee",
    detail: "Monash Association of Coding",
  },
  {
    branch: "left",
    year: "2024",
    event: "Second internship",
    detail: "UI-focused engineering role",
  },
  {
    branch: "right",
    year: "2024",
    event: "Project officer",
    detail: "Led internal events & workshops",
  },
  {
    branch: "left",
    year: "2025",
    event: "Launched this portfolio",
    detail: "Next.js 16 · Framer Motion · GSAP",
  },
  {
    branch: "right",
    year: "2025",
    event: "Hackathon finalist",
    detail: "24 h build · top 5 team",
  },
  {
    branch: "left",
    year: "2025",
    event: "Open source contributions",
    detail: "TypeScript tooling & component libs",
  },
  {
    branch: "right",
    year: "2025",
    event: "Rock climbing",
    detail: "Found a new weekend pursuit",
  },
  {
    branch: "left",
    year: "2026",
    event: "Graduating",
    detail: "Bachelor of Software Engineering",
  },
  {
    branch: "right",
    year: "2026",
    event: "Exploring Southeast Asia",
    detail: "Post-degree travel chapter",
  },
  {
    branch: "left",
    year: "2026",
    event: "Building in public",
    detail: "Shipping side projects & tools",
  },
  {
    branch: "right",
    year: "2026",
    event: "What's next",
    detail: "The adventure continues…",
  },
];
