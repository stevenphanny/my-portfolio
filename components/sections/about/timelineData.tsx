import type { ReactNode } from "react";

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
  /** Optional caption shown below images — supports JSX for inline styling */
  caption?: ReactNode;
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
    year: "2024",
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

  // ===============================Left branch
  {
    branch: "left",
    year: "2024",
    event: "Monash Assistive Tech Team (MATT)",
    detail: "Building assistive tech for people with disabilities",
  },
  {
    branch: "left",
    year: "2025",
    event: "Monash Connected Autonomous Vehicles (MCAV)",
    detail: "Electrical Self Driving Software engineer",
    weight: "featured",
    panel: {
      images: ["/about/mcav-1.jpg", "/about/mcav-2.jpg"],
      caption: (
        <>
          May 27, 2025 · Detroit, Michigan, USA
          <br />
          <span className="font-medium">Intelligent Ground Vehicle Competition (IGVC)</span>
        </>
      ),
      layout: "hero",
    },
  },
  {
    branch: "left",
    year: "2026",
    event: "UNIHACK",
    detail: "6th place across Australia",
    weight: "featured",
    panel: {
      images: ["/about/unihack-1.jpg", "/about/unihack-2.jpg"],
      caption: (
        <>
          <span className="font-medium">March 14–16, 2026</span>
          <br /><br />
          My first ever 48hr hackathon with such a GOATED team. We lived off of GYGs.
        </>
      ),
      layout: "grid",
    },
  },
   {
    branch: "left",
    year: "2026",
    event: "Started this Portfolio",
    detail: "I enjoy making cool and enjoyable websites",
  },
  {
    branch: "left",
    year: "2026 - Present",
    event: "What's next...",
    detail: "",
    weight: "featured",
    panel: {
      caption: (
        <>
          - Grinding Leetcode to hopefully land a big tech internship 
          - Try build more projects that people actually use
        </>
      ),
      layout: "hero",
    },
  },

  // ============================Right branch
  {
    branch: "right",
    year: "2024",
    event: "Found my 3 beautiful Cats",
    detail: "So many strays around my area",
    weight: "featured",
    panel: {
      images: ["/about/mac-1.jpg"],
      caption: "Helping run workshops, socials, and hackathons for the coding community.",
      layout: "grid",
    },
  },
  {
    branch: "right",
    year: "2025",
    event: "My first half marathon",
    detail: "Thought I was cooked",
    weight: "featured",
    panel: {
      images: ["/about/hackathon-1.jpg", "/about/hackathon-2.jpg", "/about/hackathon-3.jpg", "/about/hackathon-4.jpg"],
      caption: (
        <>
          <span className="font-medium">October 12, 2025 · Nike Melbourne Marathon Festival</span>
          <br /><br />
          Trained for a couple of months to go from not being able to run a half marathon to finishing in{" "}
          <span className="font-instrument-serif text-base">1:50:18</span>{" "}
          with my friends Tony and Anthony.
        </>
      ),
      layout: "grid",
    },
  },
  {
    branch: "right",
    year: "2026",
    event: "Joined MAC",
    detail: "Best. Decision. Ever.",
    weight: "featured",
    panel: {
      images: ["/about/climbing-1.jpg", "/about/climbing-2.jpg"],
      caption: (
        <>
          <span className="font-instrument-serif font-extrabold italic text-xl leading-snug mb-4 block">&ldquo;There&apos;s no such thing as a perfect moment&rdquo;</span>

          After watching Eddie&apos;s video on the{" "}
          <span className="font-bold text-navy ">butterfly effect</span>, and how a single{" "}
          <span className="font-instrument-serif font-bold italic text-base">YES</span>{" "}
          can change your life, I finally decided to apply for MAC.
          <br /><br />
          <span className="italic">October 25, 2025</span> - I receive the email to join as a <span className="font-bold">Project Officer</span>.
          <br /><br />
          As of <span className="italic">April 2026</span>, in just a few months, MAC has brought some of the most <span className="font-bold ">fun, </span><span className="font-bold"> genuine </span>and<span className="font-bold">  inspiring</span> people into my life.

        </>
      ),
      layout: "strip",
    },
  },
  {
    branch: "right",
    year: "2026 - Present",
    event: "What's next...",
    detail: "",
    weight: "featured",
    panel: {
      caption: (
        <>
          - Stop losing money because of my car (crash and tow away)
          - Make more money so I can cook more and try more restaurants and bakeries
          - Run my first Marathon at the Nike Melbourne Marathon Festival Oct. 2026
          
        </>
      ),
      layout: "hero",
    },
  },
  
  
];
