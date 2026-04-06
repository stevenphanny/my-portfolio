"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE, BRANCH_AFTER, ROW_HEIGHT, type TimelineEvent } from "./timelineData";

gsap.registerPlugin(ScrollTrigger);

// ── Layout constants ──────────────────────────────────────────────────────────
const FORK_DROP   = ROW_HEIGHT;  // match row spacing for consistent dot gaps
const TOP_PAD     = 10;   // px: space above first node
const BOTTOM_PAD  = 400;   // px: space below last node
const DOT_R          = 5;   // px: normal dot radius
const DOT_R_FEATURED = 10;   // px: featured dot radius
const DOT_HIT_R      = 50;  // px: invisible hit-area radius — increase for easier targeting

// ── Label tuning ──────────────────────────────────────────────────────────────
// TECH_LABEL_OFFSET: px above the first Technical node — increase to push label up
const TECH_LABEL_OFFSET = 63;
// LIFE_LABEL_T: position along the fork bezier (0 = top of curve, 1 = first Life node)
// decrease to move label higher/further up the curve; increase to move it closer to the node
const LIFE_LABEL_T = 0.81;

// ── Scroll animation config ───────────────────────────────────────────────────
const SCROLL = {
  // ── Lines ──────────────────────────────────────────────────────────────────
  // When the trunk line starts drawing (viewport %, e.g. "top 90%" = starts when
  // top of section is 90% down the viewport — decrease to start later / further in)
  TRUNK_START:        "top 50%",
  // Base viewport % used to place the fork animation window — decrease to push fork earlier
  FORK_BASE:          38,
  // How far the fork window shifts based on how many trunk events there are
  FORK_SPREAD:        52,
  // Fraction of scroll range devoted to the fork drawing (larger = fork draws over more scroll)
  FORK_WINDOW:        0.5,
  // When branch lines finish drawing — decrease % to finish scrolling earlier than the lines reach the nodes (e.g. "bottom 35%")
  BRANCHES_END:       "bottom 90%",
  // Scrub smoothness for lines: 0 = instant snap, higher = more lag/smoothness
  LINE_SCRUB:         0.4,

  // ── Dots ───────────────────────────────────────────────────────────────────
  // Eg top 1% means the animation starts when the top of the dot reaches the top edge of the screen
  // Eg top
  DOT_FADE_START:     "top 85%",  // dot starts fading in
  DOT_FADE_END:       "top 50%",  // dot fully visible
  DOT_FILL_START:     "top 40%",  // dot fill (cream) starts
  DOT_FILL_END:       "top 52%",  // dot fill completes
  DOT_SCRUB:          0.3,

  // ── Cards — desktop ────────────────────────────────────────────────────────
  CARD_START:         "top 88%",
  CARD_END:           "top 65%",
  CARD_SCRUB:         0.5,
  CARD_X_RIGHT:       30,   // px: right-branch cards slide in from this x offset
  CARD_X_LEFT:        -25,  // px: left-branch cards slide in from this x offset

  // ── Branch labels — desktop ────────────────────────────────────────────────
  LABEL_START:        "top 85%",
  LABEL_END:          "top 70%",
  LABEL_SCRUB:        0.4,
  LABEL_Y_OFFSET:     8,    // px: labels rise this many px on entry

  // ── Cards — mobile ─────────────────────────────────────────────────────────
  CARD_MOBILE_START:  "top 90%",
  CARD_MOBILE_END:    "top 72%",
  CARD_MOBILE_X:      28,   // px: cards slide in from this x offset
  CARD_MOBILE_SCRUB:  0.5,
};

// ── Branch line positions (fractions of container width) ─────────────────────
const X_LEFT  = 0.32;  // trunk / technical line
const X_RIGHT = 0.68;  // life branch

// ── Card layout ───────────────────────────────────────────────────────────────
// All values are fractions of container width (0–1).
const CARD = {
  // Clearance between a branch line and the nearest card edge.
  // Increase if large (featured) dots overlap card text.
  GAP_LEFT:   0.04,  // X_LEFT  → right edge of left-branch cards
  GAP_RIGHT:  0.04,  // X_RIGHT → left edge of right-branch cards
  // Width of left-branch cards (they extend leftward from their right edge).
  LEFT_WIDTH: 0.40,
  // Inset from each line toward the centre for "main" branch cards.
  MAIN_INSET: 0.04,
};

// Derived card edges — edit CARD above, not these.
const CARD_LEFT_END    = X_LEFT  - CARD.GAP_LEFT;   // right edge of left cards
const CARD_LEFT_WIDTH  = CARD.LEFT_WIDTH;
const CARD_RIGHT_START = X_RIGHT + CARD.GAP_RIGHT;  // left edge of right cards
const CARD_MAIN_LEFT   = X_LEFT  + CARD.MAIN_INSET;
const CARD_MAIN_RIGHT  = X_RIGHT - CARD.MAIN_INSET;

// ── Helpers ───────────────────────────────────────────────────────────────────
function nodeY(idx: number) { return TOP_PAD + idx * ROW_HEIGHT; }

function evalBezier(t: number, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*x0 + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*x3,
    y: mt*mt*mt*y0 + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*y3,
  };
}

// ── GitGraph ──────────────────────────────────────────────────────────────────
export function GitGraph({ onNodeHover }: { onNodeHover?: (ev: TimelineEvent | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced leave: prevents the panel flashing closed when the pointer moves
  // between a dot and its card (they're separate elements with a small gap).
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function nodeEnter(ev: TimelineEvent) {
    if (!ev.panel) return;
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    onNodeHover?.(ev);
  }
  function nodeLeave() {
    leaveTimer.current = setTimeout(() => onNodeHover?.(null), 60);
  }

  // Measure actual pixel width so SVG coordinates are 1:1 → perfect circles
  const [svgW, setSvgW] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setSvgW(el.offsetWidth);
    const ro = new ResizeObserver(() => setSvgW(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Event arrays ──────────────────────────────────────────────────────────
  const trunkEvents = useMemo(() => TIMELINE.filter(e => e.branch === "main"), []);
  const leftEvents  = useMemo(() => TIMELINE.filter(e => e.branch === "left"),  []);
  const rightEvents = useMemo(() => TIMELINE.filter(e => e.branch === "right"), []);
  const maxRows     = Math.max(leftEvents.length, rightEvents.length);

  // ── Y geometry ────────────────────────────────────────────────────────────
  const lastTrunkY      = nodeY(BRANCH_AFTER - 1);
  const forkEndY        = lastTrunkY + FORK_DROP;
  const totalBranchSpan = (maxRows - 1) * ROW_HEIGHT;   // fixed height both branches fill
  const lastBranchY     = forkEndY + totalBranchSpan;
  const svgHeight       = lastBranchY + BOTTOM_PAD;

  // Each branch distributes its own nodes evenly over totalBranchSpan,
  // so a branch with fewer nodes gets wider spacing automatically.
  const leftY  = (i: number) =>
    leftEvents.length  <= 1 ? forkEndY : forkEndY + (i / (leftEvents.length  - 1)) * totalBranchSpan;
  const rightY = (i: number) =>
    rightEvents.length <= 1 ? forkEndY : forkEndY + (i / (rightEvents.length - 1)) * totalBranchSpan;

  // ── X geometry (real pixels, derived from measured width) ─────────────────
  const xL = svgW * X_LEFT;
  const xR = svgW * X_RIGHT;

  // Fork bezier: trunk continues straight (xL→xL), fork curves right (xL→xR)
  const midForkY = lastTrunkY + FORK_DROP / 2;
  const forkPath = `M ${xL} ${lastTrunkY} C ${xL} ${midForkY}, ${xR} ${midForkY}, ${xR} ${forkEndY}`;

  // "Life" label position on the bezier curve (tuned via LIFE_LABEL_T above)
  const lifeLabelPos = svgW > 0
    ? evalBezier(LIFE_LABEL_T, xL, lastTrunkY, xL, midForkY, xR, midForkY, xR, forkEndY)
    : { x: svgW * X_RIGHT, y: forkEndY - 34 };

  // ── Refs for animation ────────────────────────────────────────────────────
  const trunkLineRef      = useRef<SVGLineElement>(null);  // trunk: TOP_PAD → lastTrunkY
  const leftDropRef       = useRef<SVGLineElement>(null);  // left continuation: lastTrunkY → forkEndY
  const forkRef           = useRef<SVGPathElement>(null);  // bezier fork to right
  const leftBranchLineRef = useRef<SVGLineElement>(null);  // left branch: forkEndY → lastBranchY
  const rightBranchLineRef= useRef<SVGLineElement>(null);  // right branch: forkEndY → lastBranchY

  const dotRefs  = useRef<(SVGCircleElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement   | null)[]>([]);
  const labelRightRef = useRef<HTMLDivElement>(null);
  const labelLeftRef  = useRef<HTMLDivElement>(null);

  // ── Node list (stable key ordering) ──────────────────────────────────────
  type Node = { ev: TimelineEvent; x: number; y: number; key: string };

  const nodes = useMemo<Node[]>(() => {
    const list: Node[] = [];
    trunkEvents.forEach( (ev, i) => list.push({ ev, x: 0, y: nodeY(i),  key: `trunk-${i}` }));
    leftEvents.forEach(  (ev, i) => list.push({ ev, x: 0, y: leftY(i),  key: `left-${i}`  }));
    rightEvents.forEach( (ev, i) => list.push({ ev, x: 0, y: rightY(i), key: `right-${i}` }));
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GSAP animations (re-run after width measured) ─────────────────────────
  useEffect(() => {
    if (!svgW || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const trigger = containerRef.current!;
      const trunkFrac = BRANCH_AFTER / (BRANCH_AFTER + maxRows);

      function prep(el: SVGGeometryElement | null) {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      }
      prep(trunkLineRef.current);
      prep(leftDropRef.current);
      prep(forkRef.current);
      prep(leftBranchLineRef.current);
      prep(rightBranchLineRef.current);

      // Scroll positions where trunk ends and fork completes
      const forkS = `top ${SCROLL.FORK_BASE - trunkFrac * SCROLL.FORK_SPREAD}%`;
      const forkE = `top ${SCROLL.FORK_BASE - (trunkFrac + SCROLL.FORK_WINDOW) * SCROLL.FORK_SPREAD}%`;

      // Dots start cream (already set in JSX); no initial opacity override needed

      const DOT_FADE   = 0.05;  // fraction of parent timeline over which each dot fills in
      const trunkSpan  = lastTrunkY - TOP_PAD;
      const branchSpan = lastBranchY - forkEndY;

      // 1. Trunk timeline: line draws + each dot fills navy as the line reaches its node
      const trunkTL = gsap.timeline({
        scrollTrigger: { trigger, start: SCROLL.TRUNK_START, end: forkS, scrub: SCROLL.LINE_SCRUB },
      });
      trunkTL.to(trunkLineRef.current, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      trunkEvents.forEach((_ev, i) => {
        const dotEl = dotRefs.current[i];
        if (!dotEl) return;
        const fraction = trunkSpan > 0 ? (nodeY(i) - TOP_PAD) / trunkSpan : 0;
        trunkTL.fromTo(dotEl, { attr: { fill: "#fcedd3" } }, { attr: { fill: "#002147" }, ease: "none", duration: DOT_FADE },
          Math.min(1 - DOT_FADE, fraction));
      });

      // 2. Left drop + fork bezier draw together (no nodes in this segment)
      gsap.to(leftDropRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: forkS, end: forkE, scrub: SCROLL.LINE_SCRUB },
      });
      gsap.to(forkRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: forkS, end: forkE, scrub: SCROLL.LINE_SCRUB },
      });

      // 3. Branch timeline: both lines draw + each dot appears as its line reaches the node.
      //    Left and right nodes are at different Y positions so fractions differ → naturally
      //    staggered without any hard-coded offsets.
      const branchTL = gsap.timeline({
        scrollTrigger: { trigger, start: forkE, end: SCROLL.BRANCHES_END, scrub: SCROLL.LINE_SCRUB },
      });
      branchTL.to(leftBranchLineRef.current,  { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      branchTL.to(rightBranchLineRef.current, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

      leftEvents.forEach((_ev, i) => {
        const dotEl = dotRefs.current[trunkEvents.length + i];
        if (!dotEl) return;
        const fraction = branchSpan > 0 ? (leftY(i) - forkEndY) / branchSpan : 0;
        branchTL.fromTo(dotEl, { attr: { fill: "#fcedd3" } }, { attr: { fill: "#002147" }, ease: "none", duration: DOT_FADE },
          Math.min(1 - DOT_FADE, fraction));
      });

      rightEvents.forEach((_ev, i) => {
        const dotEl = dotRefs.current[trunkEvents.length + leftEvents.length + i];
        if (!dotEl) return;
        const fraction = branchSpan > 0 ? (rightY(i) - forkEndY) / branchSpan : 0;
        branchTL.fromTo(dotEl, { attr: { fill: "#fcedd3" } }, { attr: { fill: "#002147" }, ease: "none", duration: DOT_FADE },
          Math.min(1 - DOT_FADE, fraction));
      });

      // 5. Cards + labels
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          const xOff = card.dataset.branch === "right" ? SCROLL.CARD_X_RIGHT : SCROLL.CARD_X_LEFT;
          gsap.fromTo(card,
            { opacity: 0, x: xOff },
            { opacity: 1, x: 0, scrollTrigger: { trigger: card, start: SCROLL.CARD_START, end: SCROLL.CARD_END, scrub: SCROLL.CARD_SCRUB } },
          );
        });
        [labelLeftRef.current, labelRightRef.current].forEach((el) => {
          if (!el) return;
          gsap.fromTo(el, { opacity: 0, y: SCROLL.LABEL_Y_OFFSET }, {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: el, start: SCROLL.LABEL_START, end: SCROLL.LABEL_END, scrub: SCROLL.LABEL_SCRUB },
          });
        });
      });
      mm.add("(max-width: 767px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, x: SCROLL.CARD_MOBILE_X },
            { opacity: 1, x: 0, scrollTrigger: { trigger: card, start: SCROLL.CARD_MOBILE_START, end: SCROLL.CARD_MOBILE_END, scrub: SCROLL.CARD_MOBILE_SCRUB } },
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [svgW, maxRows]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: svgHeight }}>

      {/* ── SVG: lines + dots (only renders once width is known) ── */}
      {svgW > 0 && (
        <svg
          width={svgW}
          height={svgHeight}
          className="absolute inset-0"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Glow filter for featured nodes — stdDeviation controls spread */}
            <filter id="dot-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Guide lines (dim track) */}
          <line x1={xL} y1={TOP_PAD} x2={xL} y2={lastTrunkY} stroke="rgba(0,33,71,0.08)" strokeWidth="1" />
          <line x1={xL} y1={lastTrunkY} x2={xL} y2={forkEndY} stroke="rgba(0,33,71,0.08)" strokeWidth="1" />
          <path d={forkPath} fill="none" stroke="rgba(0,33,71,0.08)" strokeWidth="1" />
          <line x1={xL} y1={forkEndY} x2={xL} y2={lastBranchY} stroke="rgba(0,33,71,0.08)" strokeWidth="1" />
          <line x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY} stroke="rgba(0,33,71,0.08)" strokeWidth="1" />

          {/* Animated: trunk (before fork) */}
          <line ref={trunkLineRef}
            x1={xL} y1={TOP_PAD} x2={xL} y2={lastTrunkY}
            stroke="rgba(0,33,71,0.55)" strokeWidth="1.5"
          />

          {/* Animated: left drop — straight connector on xL from trunk to branch */}
          <line ref={leftDropRef}
            x1={xL} y1={lastTrunkY} x2={xL} y2={forkEndY}
            stroke="rgba(0,33,71,0.55)" strokeWidth="1.5"
          />

          {/* Animated: fork bezier to right branch */}
          <path ref={forkRef}
            d={forkPath} fill="none"
            stroke="rgba(0,33,71,0.45)" strokeWidth="1.5"
          />

          {/* Animated: left branch (after fork) — synced with right */}
          <line ref={leftBranchLineRef}
            x1={xL} y1={forkEndY} x2={xL} y2={lastBranchY}
            stroke="rgba(0,33,71,0.55)" strokeWidth="1.5"
          />

          {/* Animated: right branch (after fork) — synced with left */}
          <line ref={rightBranchLineRef}
            x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY}
            stroke="rgba(0,33,71,0.35)" strokeWidth="1.5"
          />

          {/* Dots — real pixel coords, no viewBox → perfect circles */}
          {nodes.map(({ ev, y, key }, i) => {
            const cx       = ev.branch === "right" ? xR : xL;
            const r        = ev.weight === "featured" ? DOT_R_FEATURED : DOT_R;
            const stroke   = ev.weight === "featured"
              ? "rgba(0,33,71,0.85)"
              : "rgba(0,33,71,0.55)";
            return (
              <circle
                key={key}
                ref={(el) => { dotRefs.current[i] = el; }}
                cx={cx}
                cy={y}
                r={r}
                fill="#fcedd3"
                stroke={stroke}
                strokeWidth="1.5"
                filter={ev.weight === "featured" ? "url(#dot-glow)" : undefined}
                style={{
                  transformOrigin: `${cx}px ${y}px`,
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {/* Hit-area circles — invisible, larger radius for easier targeting */}
          {nodes.map(({ ev, y, key }) => {
            if (!ev.panel) return null;
            const cx = ev.branch === "right" ? xR : xL;
            return (
              <circle
                key={`hit-${key}`}
                cx={cx}
                cy={y}
                r={DOT_HIT_R}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => nodeEnter(ev)}
                onMouseLeave={nodeLeave}
              />
            );
          })}
        </svg>
      )}

      {/* ── Branch label nodes — pill badges centered on their branch lines ── */}
      <div
        ref={labelLeftRef}
        className="hidden md:block absolute font-poppins font-medium text-[10px] tracking-[0.15em] uppercase text-navy/90 bg-cream border border-navy/50 rounded px-2.5 py-1 whitespace-nowrap"
        style={{ left: `${X_LEFT * 100}%`, top: forkEndY - TECH_LABEL_OFFSET, transform: "translateX(-50%)" }}
      >
        Technical
      </div>
      <div
        ref={labelRightRef}
        className="hidden md:block absolute font-poppins font-medium text-[10px] tracking-[0.15em] uppercase text-navy/90 bg-cream border border-navy/50 rounded px-2.5 py-1 whitespace-nowrap"
        style={{ left: lifeLabelPos.x, top: lifeLabelPos.y - 12, transform: "translateX(-50%)" }}
      >
        Life
      </div>

      {/* ── Event cards ── */}
      {nodes.map(({ ev, y, key }, i) => (
        <EventCard
          key={key}
          ev={ev}
          y={y}
          cardRef={(el) => { cardRefs.current[i] = el; }}
          onEnter={nodeEnter}
          onLeave={nodeLeave}
        />
      ))}
    </div>
  );
}

// ── EventCard ─────────────────────────────────────────────────────────────────
function EventCard({
  ev,
  y,
  cardRef,
  onEnter,
  onLeave,
}: {
  ev: TimelineEvent;
  y: number;
  cardRef: (el: HTMLDivElement | null) => void;
  onEnter: (ev: TimelineEvent) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isRight    = ev.branch === "right";
  const hasPanel   = Boolean(ev.panel);
  const isFeatured = ev.weight === "featured";

  // "left"  → sits to the LEFT of the technical line, right-aligned text
  // "right" → sits to the RIGHT of the life branch, left-aligned text
  // "main"  → sits between the two lines, left-aligned text
  let posStyle: React.CSSProperties;
  const textAlign: React.CSSProperties["textAlign"] = isRight ? "left" : "right";

  if (isRight) {
    posStyle = {
      top: y - 12,
      left: `${CARD_RIGHT_START * 100}%`,
      width: `${(1 - CARD_RIGHT_START) * 100}%`,
    };
  } else {
    // "left" and "main" both sit to the LEFT of the technical line, right-aligned
    posStyle = {
      top: y - 12,
      right: `${(1 - CARD_LEFT_END) * 100}%`,
      width: `${CARD_LEFT_WIDTH * 100}%`,
    };
  }

  const titleColor = "text-navy";
  // Featured nodes get a slightly larger title.
  const titleSize  = ev.branch === "main"
    ? (isFeatured ? "text-2xl"    : "text-xl")
    : (isFeatured ? "text-[20px]" : "text-[17px]");

  return (
    <div
      ref={cardRef}
      data-branch={ev.branch}
      className={`absolute ${hasPanel ? "cursor-pointer" : ""}`}
      style={{ ...posStyle, textAlign }}
      onMouseEnter={() => { setHovered(true);  onEnter(ev); }}
      onMouseLeave={() => { setHovered(false); onLeave();   }}
    >
      <span className="font-poppins font-medium text-[10px] tracking-[0.15em] text-navy/65 block">
        {ev.year}
      </span>
      <p className={`font-instrument-serif mt-0.5 leading-snug ${titleColor} ${titleSize}`}>
        {ev.event}
      </p>
      {/* Underline wipe — only on hoverable nodes, matches site divider animation */}
      {hasPanel && (
        <motion.div
          className="h-px bg-navy/65 mt-1"
          style={{ originX: isRight ? 0 : 1 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
        />
      )}
      {ev.detail && (
        <p className="font-lora text-xs text-navy/75 mt-1 leading-relaxed">
          {ev.detail}
        </p>
      )}
    </div>
  );
}
