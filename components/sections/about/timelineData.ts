// ── Config ────────────────────────────────────────────────────────────────────
/** Number of 'main' trunk events before the branch fork appears. */
export const BRANCH_AFTER = 2;

/** Vertical px between event rows. Must match GitGraph's ROW_HEIGHT. */
export const ROW_HEIGHT = 220;

// ── Types ─────────────────────────────────────────────────────────────────────
export type Branch = "main" | "left" | "right";

export type NodePanel = {
  /** Image paths relative to /public, e.g. "/about/hackathon-1.jpg" */
  images?: string[];
  /** Optional caption shown below images */
  caption?: string;
  /**
   * Layout mode:
   * - "hero"  : one large image filling the panel (default when 1 image)
   * - "grid"  : 2-column mosaic (default when 2+ images)
   * - "strip" : images side by side in a scrollable row
   */
  layout?: "hero" | "grid" | "strip";
};

export type TimelineEvent = {
  year: string;
  event: string;
  branch: Branch;
  detail?: string;
  /**
   * Visual weight of the node:
   * - "featured" : larger dot + larger title — use for milestones that matter most
   * - "normal"   : default size (omit for normal)
   */
  weight?: "normal" | "featured";
  /** If present, hovering this node opens the right-column panel. */
  panel?: NodePanel;
};

// ── Data ──────────────────────────────────────────────────────────────────────
// branch: "main"  → trunk (before fork)
// branch: "left"  → academics / internships / technical
// branch: "right" → extracurricular / life
export const TIMELINE: TimelineEvent[] = [
  {
    branch: "main",
    year: "2023",
    event: "Started Software Engineering ",
    detail: "Monash University",
  },
  {
    branch: "main",
    year: "",
    event: "",
    detail: "",
  },
  // ── Fork happens here (after BRANCH_AFTER main events) ──
  {
    branch: "left",
    year: "2024",
    event: "Monash Assistive Tech Team (MATT)",
    detail: "My first ",
    panel: {
      images: ["/about/matt-1.jpg", "/about/matt-2.jpg"],
      caption: "Building accessible tech with an incredible team.",
      layout: "grid",
    },
  },
  {
    branch: "right",
    year: "2023",
    event: "Joined MAC committee",
    detail: "Monash Association of Coding",
    weight: "featured",
    panel: {
      images: ["/about/mac-1.jpg"],
      caption: "Helping run workshops, socials, and hackathons for the coding community.",
      layout: "hero",
    },
  },
  {
    branch: "left",
    year: "2024",
    event: "Second internship",
    detail: "UI-focused engineering role",
  },
  // {
  //   branch: "right",
  //   year: "2024",
  //   event: "Project officer",
  //   detail: "Led internal events & workshops",
  // },
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
    weight: "featured",
    panel: {
      images: ["/about/hackathon-1.jpg", "/about/hackathon-2.jpg", "/about/hackathon-3.jpg", "/about/hackathon-4.jpg"],
      caption: "24 hours. One idea. Top 5 out of 40 teams.",
      layout: "grid",
    },
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
    panel: {
      images: ["/about/climbing-1.jpg", "/about/climbing-2.jpg"],
      caption: "Started bouldering. Got hooked immediately.",
      layout: "strip",
    },
  },
  {
    branch: "left",
    year: "2026",
    event: "Graduating",
    detail: "Bachelor of Software Engineering",
    weight: "featured",
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
