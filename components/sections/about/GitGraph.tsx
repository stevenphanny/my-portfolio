"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE, BRANCH_AFTER, ROW_HEIGHT, type TimelineEvent } from "./timelineData";

gsap.registerPlugin(ScrollTrigger);

// ── Layout constants ──────────────────────────────────────────────────────────
const FORK_DROP   = ROW_HEIGHT;  // match row spacing for consistent dot gaps
const TOP_PAD     = 20;   // px: space above first node
const BOTTOM_PAD  = 60;   // px: space below last node
const DOT_R       = 5;    // px: dot radius (real pixels — no viewBox distortion)

// X as fractions of container width
// Trunk continues down as the left (technical) line.
// Life branch forks off to the right.
const X_LEFT  = 0.32;  // trunk / technical line
const X_RIGHT = 0.68;  // extracurricular branch

// Card zones (CSS % of container)
// "main"  → between the two lines
const CARD_MAIN_LEFT   = X_LEFT  + 0.04;   // 36%
const CARD_MAIN_RIGHT  = X_RIGHT - 0.04;   // 64%
// "left"  → to the LEFT of X_LEFT (right edge of card aligned near line)
const CARD_LEFT_END    = X_LEFT  - 0.02;   // 30%
const CARD_LEFT_WIDTH  = 0.28;             // 28% wide → left edge at ~2%
// "right" → to the RIGHT of X_RIGHT
const CARD_RIGHT_START = X_RIGHT + 0.02;   // 70%

// ── Helpers ───────────────────────────────────────────────────────────────────
function nodeY(idx: number) { return TOP_PAD + idx * ROW_HEIGHT; }

// ── GitGraph ──────────────────────────────────────────────────────────────────
export function GitGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      const forkS = `top ${78 - trunkFrac * 52}%`;
      const forkE = `top ${78 - (trunkFrac + 0.12) * 52}%`;

      // 1. Trunk line draws until fork begins
      gsap.to(trunkLineRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: "top 78%", end: forkS, scrub: 0.4 },
      });

      // 2. Left drop (straight connector on xL) + fork bezier draw together
      gsap.to(leftDropRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: forkS, end: forkE, scrub: 0.4 },
      });
      gsap.to(forkRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: forkS, end: forkE, scrub: 0.4 },
      });

      // 3. Both branch lines share identical triggers → draw in perfect sync
      //    (they are the same length so matching start/end guarantees same speed)
      const branchTrigger = { trigger, start: forkE, end: "bottom 25%", scrub: 0.4 };
      gsap.to(leftBranchLineRef.current,  { strokeDashoffset: 0, ease: "none", scrollTrigger: branchTrigger });
      gsap.to(rightBranchLineRef.current, { strokeDashoffset: 0, ease: "none", scrollTrigger: branchTrigger });

      // 4. Dots: fade in → fill
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(dot, { opacity: 0 }, {
          opacity: 1,
          scrollTrigger: { trigger: dot, start: "top 85%", end: "top 68%", scrub: 0.3 },
        });
        gsap.to(dot, {
          attr: { fill: "#fcedd3" },
          scrollTrigger: { trigger: dot, start: "top 68%", end: "top 52%", scrub: 0.3 },
        });
      });

      // 5. Cards + labels
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          const xOff = card.dataset.branch === "right" ? 30 : -25;
          gsap.fromTo(card,
            { opacity: 0, x: xOff },
            { opacity: 1, x: 0, scrollTrigger: { trigger: card, start: "top 88%", end: "top 65%", scrub: 0.5 } },
          );
        });
        [labelLeftRef.current, labelRightRef.current].forEach((el) => {
          if (!el) return;
          gsap.fromTo(el, { opacity: 0, y: 8 }, {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 70%", scrub: 0.4 },
          });
        });
      });
      mm.add("(max-width: 767px)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, scrollTrigger: { trigger: card, start: "top 90%", end: "top 72%", scrub: 0.5 } },
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
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          {/* Guide lines (dim track) */}
          <line x1={xL} y1={TOP_PAD} x2={xL} y2={lastTrunkY} stroke="rgba(252,237,211,0.08)" strokeWidth="1" />
          <line x1={xL} y1={lastTrunkY} x2={xL} y2={forkEndY} stroke="rgba(252,237,211,0.08)" strokeWidth="1" />
          <path d={forkPath} fill="none" stroke="rgba(252,237,211,0.08)" strokeWidth="1" />
          <line x1={xL} y1={forkEndY} x2={xL} y2={lastBranchY} stroke="rgba(252,237,211,0.08)" strokeWidth="1" />
          <line x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY} stroke="rgba(252,237,211,0.08)" strokeWidth="1" />

          {/* Animated: trunk (before fork) */}
          <line ref={trunkLineRef}
            x1={xL} y1={TOP_PAD} x2={xL} y2={lastTrunkY}
            stroke="rgba(252,237,211,0.55)" strokeWidth="1.5"
          />

          {/* Animated: left drop — straight connector on xL from trunk to branch */}
          <line ref={leftDropRef}
            x1={xL} y1={lastTrunkY} x2={xL} y2={forkEndY}
            stroke="rgba(252,237,211,0.55)" strokeWidth="1.5"
          />

          {/* Animated: fork bezier to right branch */}
          <path ref={forkRef}
            d={forkPath} fill="none"
            stroke="rgba(252,237,211,0.45)" strokeWidth="1.5"
          />

          {/* Animated: left branch (after fork) — synced with right */}
          <line ref={leftBranchLineRef}
            x1={xL} y1={forkEndY} x2={xL} y2={lastBranchY}
            stroke="rgba(252,237,211,0.55)" strokeWidth="1.5"
          />

          {/* Animated: right branch (after fork) — synced with left */}
          <line ref={rightBranchLineRef}
            x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY}
            stroke="rgba(252,237,211,0.35)" strokeWidth="1.5"
          />

          {/* Dots — real pixel coords, no viewBox → perfect circles */}
          {nodes.map(({ ev, y, key }, i) => {
            const cx = ev.branch === "right" ? xR : xL;
            return (
              <circle
                key={key}
                ref={(el) => { dotRefs.current[i] = el; }}
                cx={cx}
                cy={y}
                r={DOT_R}
                fill="#002147"
                stroke="rgba(252,237,211,0.55)"
                strokeWidth="1.5"
                style={{ transformOrigin: `${cx}px ${y}px` }}
              />
            );
          })}
        </svg>
      )}

      {/* ── Branch labels ── */}
      <div
        ref={labelLeftRef}
        className="hidden md:block absolute font-poppins text-[9px] tracking-[0.28em] uppercase text-cream/25"
        style={{ left: `${X_LEFT * 100}%`, top: forkEndY - 22, transform: "translateX(-50%)" }}
      >
        Technical
      </div>
      <div
        ref={labelRightRef}
        className="hidden md:block absolute font-poppins text-[9px] tracking-[0.28em] uppercase text-cream/25"
        style={{ left: `${X_RIGHT * 100}%`, top: forkEndY - 22, transform: "translateX(-50%)" }}
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
}: {
  ev: TimelineEvent;
  y: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const isRight = ev.branch === "right";
  const isLeft  = ev.branch === "left";

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

  return (
    <div
      ref={cardRef}
      data-branch={ev.branch}
      className="absolute"
      style={{ ...posStyle, textAlign }}
    >
      <span className="font-poppins text-[10px] tracking-[0.2em] text-cream/30 block">
        {ev.year}
      </span>
      <p className={`font-instrument-serif mt-0.5 text-cream leading-snug ${ev.branch === "main" ? "text-xl" : "text-[17px]"}`}>
        {ev.event}
      </p>
      {ev.detail && (
        <p className="font-lora text-xs text-cream/40 mt-1 leading-relaxed">
          {ev.detail}
        </p>
      )}
    </div>
  );
}
