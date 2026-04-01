"use client";

import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE, BRANCH_AFTER, ROW_HEIGHT, type TimelineEvent } from "./timelineData";

gsap.registerPlugin(ScrollTrigger);

// ── Layout constants ──────────────────────────────────────────────────────────
const FORK_DROP = 70;       // px: how far below the last trunk node the fork curves end
const TOP_PAD = 40;         // px: space above the first node
const BOTTOM_PAD = 60;      // px: space below the last node

// X positions as fractions of the SVG width (0–1)
const X_TRUNK = 0.38;
const X_LEFT  = 0.18;
const X_RIGHT = 0.62;

// ── Helpers ───────────────────────────────────────────────────────────────────
function nodeY(index: number): number {
  return TOP_PAD + index * ROW_HEIGHT;
}

// ── GitGraph ──────────────────────────────────────────────────────────────────
export function GitGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);

  const trunkLineRef   = useRef<SVGLineElement>(null);
  const forkLeftRef    = useRef<SVGPathElement>(null);
  const forkRightRef   = useRef<SVGPathElement>(null);
  const branchLeftRef  = useRef<SVGLineElement>(null);
  const branchRightRef = useRef<SVGLineElement>(null);

  const dotRefs  = useRef<(SVGCircleElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelLeftRef  = useRef<HTMLDivElement>(null);
  const labelRightRef = useRef<HTMLDivElement>(null);

  // ── Separate events by phase ──
  const trunkEvents  = useMemo(() => TIMELINE.filter(e => e.branch === "main"), []);
  // Pair left+right events by index within branch groups
  const leftEvents  = useMemo(() => TIMELINE.filter(e => e.branch === "left"),  []);
  const rightEvents = useMemo(() => TIMELINE.filter(e => e.branch === "right"), []);

  const maxBranchRows = Math.max(leftEvents.length, rightEvents.length);

  // ── Y coordinates ──
  const lastTrunkIndex = BRANCH_AFTER - 1;             // 0-based index of last trunk node
  const lastTrunkY     = nodeY(lastTrunkIndex);
  const forkEndY       = lastTrunkY + FORK_DROP;        // where branches start their straight segments

  const totalRows    = BRANCH_AFTER + maxBranchRows;
  const svgHeight    = nodeY(totalRows - 1) + BOTTOM_PAD;

  // ── Branch node Y: offset from forkEndY ──
  function branchNodeY(branchIndex: number): number {
    return forkEndY + branchIndex * ROW_HEIGHT;
  }

  // ── GSAP animations ──────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const ctx = gsap.context(() => {
      const svgEl = svgRef.current!;

      // Helper: set up strokeDasharray on a line/path and return its length
      function prep(el: SVGGeometryElement | null): number {
        if (!el) return 0;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        return len;
      }

      const trunkLen       = prep(trunkLineRef.current);
      const forkLeftLen    = prep(forkLeftRef.current);
      const forkRightLen   = prep(forkRightRef.current);
      const branchLeftLen  = prep(branchLeftRef.current);
      const branchRightLen = prep(branchRightRef.current);

      // ── 1. Trunk draws in ──
      gsap.to(trunkLineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: svgEl,
          start: "top 75%",
          end: `top ${75 - (BRANCH_AFTER / totalRows) * 55}%`,
          scrub: 0.4,
        },
      });

      // ── 2. Fork curves draw in (after trunk) ──
      const forkStart = `top ${75 - (BRANCH_AFTER / totalRows) * 55}%`;
      const forkEnd   = `top ${75 - ((BRANCH_AFTER + 0.6) / totalRows) * 55}%`;

      gsap.to(forkLeftRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: svgEl, start: forkStart, end: forkEnd, scrub: 0.4 },
      });
      gsap.to(forkRightRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: svgEl, start: forkStart, end: forkEnd, scrub: 0.4 },
      });

      // ── 3. Branch lines draw in ──
      const branchStart = forkEnd;
      const branchEnd   = "bottom 30%";

      gsap.to(branchLeftRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: svgEl, start: branchStart, end: branchEnd, scrub: 0.4 },
      });
      gsap.to(branchRightRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: svgEl, start: branchStart, end: branchEnd, scrub: 0.4 },
      });

      // suppress unused var warnings
      void trunkLen; void forkLeftLen; void forkRightLen; void branchLeftLen; void branchRightLen;

      // ── 4. Dots: scale in then fill ──
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(dot, { scale: 0 }, {
          scale: 1,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: dot, start: "top 85%", end: "top 70%", scrub: 0.3 },
        });
        gsap.to(dot, {
          attr: { fill: "#fcedd3", stroke: "#fcedd3" },
          filter: "drop-shadow(0 0 6px rgba(252,237,211,0.5))",
          scrollTrigger: { trigger: dot, start: "top 70%", end: "top 55%", scrub: 0.3 },
        });
      });

      // ── 5. Cards: slide in from correct side ──
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          const branch = card.dataset.branch as "main" | "left" | "right";
          const xFrom = branch === "left" ? -50 : branch === "right" ? 50 : -30;
          gsap.fromTo(card,
            { opacity: 0, x: xFrom },
            {
              opacity: 1, x: 0,
              scrollTrigger: { trigger: card, start: "top 88%", end: "top 65%", scrub: 0.5 },
            },
          );
        });

        // Branch labels fade in
        [labelLeftRef.current, labelRightRef.current].forEach((el) => {
          if (!el) return;
          gsap.fromTo(el, { opacity: 0, y: 10 }, {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 70%", scrub: 0.4 },
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, x: 30 },
            {
              opacity: 1, x: 0,
              scrollTrigger: { trigger: card, start: "top 90%", end: "top 72%", scrub: 0.5 },
            },
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── SVG path strings ──────────────────────────────────────────────────────────
  // These are computed at render time using % of SVG width.
  // We pass width as a viewBox of 100 to make fractions easy.
  const W = 100; // viewBox width units
  const xT = X_TRUNK * W;
  const xL = X_LEFT  * W;
  const xR = X_RIGHT * W;

  // Trunk: from top to last trunk node
  const trunkD_y1 = 0;
  const trunkD_y2 = lastTrunkY;

  // Fork bezier mid points
  const midY = lastTrunkY + FORK_DROP / 2;

  const forkLeftD  = `M ${xT} ${lastTrunkY} C ${xT} ${midY}, ${xL} ${midY}, ${xL} ${forkEndY}`;
  const forkRightD = `M ${xT} ${lastTrunkY} C ${xT} ${midY}, ${xR} ${midY}, ${xR} ${forkEndY}`;

  // Branch lines: from forkEndY to last branch node
  const lastBranchY = branchNodeY(maxBranchRows - 1);

  // ── Build all nodes (dots + cards) ──────────────────────────────────────────
  // Trunk nodes
  const trunkNodes = trunkEvents.map((ev, i) => ({
    ev, cx: xT, cy: nodeY(i), index: i,
  }));

  // Branch nodes: interleave left/right by row index
  const branchNodes = Array.from({ length: maxBranchRows }, (_, rowI) => {
    const nodes = [];
    const lEv = leftEvents[rowI];
    const rEv = rightEvents[rowI];
    if (lEv) nodes.push({ ev: lEv, cx: xL, cy: branchNodeY(rowI), index: BRANCH_AFTER + rowI * 2 });
    if (rEv) nodes.push({ ev: rEv, cx: xR, cy: branchNodeY(rowI), index: BRANCH_AFTER + rowI * 2 + 1 });
    return nodes;
  }).flat();

  const allNodes = [...trunkNodes, ...branchNodes];

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: svgHeight }}>
      {/* ── SVG layer ── */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${svgHeight}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        {/* Guide lines (dim) */}
        <line x1={xT} y1={0} x2={xT} y2={lastTrunkY} stroke="rgba(252,237,211,0.08)" strokeWidth="0.5" />
        <path d={forkLeftD}  fill="none" stroke="rgba(252,237,211,0.08)" strokeWidth="0.5" />
        <path d={forkRightD} fill="none" stroke="rgba(252,237,211,0.08)" strokeWidth="0.5" />
        <line x1={xL} y1={forkEndY} x2={xL} y2={lastBranchY} stroke="rgba(252,237,211,0.08)" strokeWidth="0.5" />
        <line x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY} stroke="rgba(252,237,211,0.08)" strokeWidth="0.5" />

        {/* Animated lines */}
        <line
          ref={trunkLineRef}
          x1={xT} y1={trunkD_y1} x2={xT} y2={trunkD_y2}
          stroke="rgba(252,237,211,0.6)" strokeWidth="0.8"
        />
        <path
          ref={forkLeftRef}
          d={forkLeftD}
          fill="none" stroke="rgba(252,237,211,0.5)" strokeWidth="0.8"
        />
        <path
          ref={forkRightRef}
          d={forkRightD}
          fill="none" stroke="rgba(252,237,211,0.35)" strokeWidth="0.8"
        />
        <line
          ref={branchLeftRef}
          x1={xL} y1={forkEndY} x2={xL} y2={lastBranchY}
          stroke="rgba(252,237,211,0.5)" strokeWidth="0.8"
        />
        <line
          ref={branchRightRef}
          x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY}
          stroke="rgba(252,237,211,0.35)" strokeWidth="0.8"
        />

        {/* Dots */}
        {allNodes.map(({ cx, cy, index }) => (
          <circle
            key={index}
            ref={(el) => { dotRefs.current[index] = el; }}
            cx={cx}
            cy={cy}
            r={3.5}
            fill="#002147"
            stroke="rgba(252,237,211,0.5)"
            strokeWidth="0.8"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>

      {/* ── Branch labels (desktop only) ── */}
      <div
        ref={labelLeftRef}
        className="hidden md:block absolute font-poppins text-[10px] tracking-[0.25em] uppercase text-cream/30"
        style={{ left: `${X_LEFT * 100}%`, top: forkEndY - 28, transform: "translateX(-50%)" }}
      >
        Technical
      </div>
      <div
        ref={labelRightRef}
        className="hidden md:block absolute font-poppins text-[10px] tracking-[0.25em] uppercase text-cream/30"
        style={{ left: `${X_RIGHT * 100}%`, top: forkEndY - 28, transform: "translateX(-50%)" }}
      >
        Life
      </div>

      {/* ── Event cards ── */}
      {allNodes.map(({ ev, cx, cy, index }) => (
        <EventCard
          key={index}
          ev={ev}
          cx={cx}
          cy={cy}
          index={index}
          cardRef={(el) => { cardRefs.current[index] = el; }}
          svgWidth={W}
        />
      ))}
    </div>
  );
}

// ── EventCard ─────────────────────────────────────────────────────────────────
function EventCard({
  ev,
  cx,
  cy,
  index,
  cardRef,
  svgWidth,
}: {
  ev: TimelineEvent;
  cx: number;
  cy: number;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  svgWidth: number;
}) {
  const isTrunk = ev.branch === "main";
  const isLeft  = ev.branch === "left";

  // On desktop: left-branch cards go to the left of their dot, right-branch to the right
  // On mobile: all cards go to the right of the trunk
  const desktopStyle: React.CSSProperties = {
    position: "absolute",
    top: cy - 14,
  };

  if (isTrunk || isLeft) {
    // Anchor from the right edge of the left zone
    desktopStyle.right = `${(1 - cx / svgWidth) * 100 + 4}%`;
    desktopStyle.textAlign = "right";
  } else {
    // Anchor from the left edge of the right zone
    desktopStyle.left = `${(cx / svgWidth) * 100 + 4}%`;
    desktopStyle.textAlign = "left";
  }

  return (
    <div
      ref={cardRef}
      data-branch={ev.branch}
      data-index={index}
      className="absolute md:w-[36%] w-[calc(100%-48px)]"
      style={desktopStyle}
    >
      <span className="font-poppins text-[11px] tracking-[0.2em] text-cream/35 block">
        {ev.year}
      </span>
      <p className={`font-instrument-serif mt-0.5 text-cream leading-snug ${isTrunk ? "text-xl" : "text-lg"}`}>
        {ev.event}
      </p>
      {ev.detail && (
        <p className="font-lora text-xs text-cream/40 mt-0.5 leading-relaxed">
          {ev.detail}
        </p>
      )}
    </div>
  );
}
