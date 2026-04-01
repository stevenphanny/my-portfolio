"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE, BRANCH_AFTER, ROW_HEIGHT, type TimelineEvent } from "./timelineData";

gsap.registerPlugin(ScrollTrigger);

// ── Layout constants ──────────────────────────────────────────────────────────
const FORK_DROP   = 80;   // px: vertical drop of the fork bezier
const TOP_PAD     = 20;   // px: space above first node
const BOTTOM_PAD  = 60;   // px: space below last node
const DOT_R       = 5;    // px: dot radius (real pixels — no viewBox distortion)

// X as fractions of container width
// Trunk continues down as the left (technical) line.
// Life branch forks off to the right.
const X_LEFT  = 0.08;  // trunk / technical line
const X_RIGHT = 0.55;  // extracurricular branch

// Card zones (CSS % of container, same reference frame as X_LEFT/X_RIGHT)
const CARD_LEFT_START  = X_LEFT  + 0.06;              // 14%
const CARD_LEFT_END    = X_RIGHT - 0.04;               // 51%
const CARD_RIGHT_START = X_RIGHT + 0.04;               // 59%
const CARD_RIGHT_END   = 1.00;                          // 100%

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
  const lastTrunkY     = nodeY(BRANCH_AFTER - 1);
  const forkEndY       = lastTrunkY + FORK_DROP;
  const branchY        = (i: number) => forkEndY + i * ROW_HEIGHT;
  const lastBranchY    = branchY(maxRows - 1);
  const svgHeight      = lastBranchY + BOTTOM_PAD;

  // ── X geometry (real pixels, derived from measured width) ─────────────────
  const xL = svgW * X_LEFT;
  const xR = svgW * X_RIGHT;

  // Fork bezier: trunk continues straight (xL→xL), fork curves right (xL→xR)
  const midForkY = lastTrunkY + FORK_DROP / 2;
  const forkPath = `M ${xL} ${lastTrunkY} C ${xL} ${midForkY}, ${xR} ${midForkY}, ${xR} ${forkEndY}`;

  // ── Refs for animation ────────────────────────────────────────────────────
  const mainLineRef  = useRef<SVGLineElement>(null);  // continuous left line
  const forkRef      = useRef<SVGPathElement>(null);  // bezier fork
  const rightLineRef = useRef<SVGLineElement>(null);  // right branch line

  const dotRefs  = useRef<(SVGCircleElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement   | null)[]>([]);
  const labelRightRef = useRef<HTMLDivElement>(null);
  const labelLeftRef  = useRef<HTMLDivElement>(null);

  // ── Node list (stable key ordering) ──────────────────────────────────────
  type Node = { ev: TimelineEvent; x: number; y: number; key: string };

  const nodes = useMemo<Node[]>(() => {
    const list: Node[] = [];
    trunkEvents.forEach((ev, i) => list.push({ ev, x: 0, y: nodeY(i),    key: `trunk-${i}` }));
    for (let r = 0; r < maxRows; r++) {
      if (leftEvents[r])  list.push({ ev: leftEvents[r],  x: 0, y: branchY(r), key: `left-${r}` });
      if (rightEvents[r]) list.push({ ev: rightEvents[r], x: 0, y: branchY(r), key: `right-${r}` });
    }
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
      prep(mainLineRef.current);
      prep(forkRef.current);
      prep(rightLineRef.current);

      // 1. Main left line draws all the way through
      gsap.to(mainLineRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: "top 78%", end: "bottom 25%", scrub: 0.4 },
      });

      // 2. Fork curve: starts drawing once trunk portion has scrolled past
      const forkS = `top ${78 - trunkFrac * 52}%`;
      const forkE = `top ${78 - (trunkFrac + 0.12) * 52}%`;
      gsap.to(forkRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: forkS, end: forkE, scrub: 0.4 },
      });

      // 3. Right branch line
      gsap.to(rightLineRef.current, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger, start: forkE, end: "bottom 25%", scrub: 0.4 },
      });

      // 4. Dots: scale in → fill
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(dot, { scale: 0 }, {
          scale: 1,
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
          <line x1={xL} y1={TOP_PAD} x2={xL} y2={lastBranchY} stroke="rgba(252,237,211,0.08)" strokeWidth="1" />
          <path d={forkPath} fill="none" stroke="rgba(252,237,211,0.08)" strokeWidth="1" />
          <line x1={xR} y1={forkEndY} x2={xR} y2={lastBranchY} stroke="rgba(252,237,211,0.08)" strokeWidth="1" />

          {/* Animated: main left line (trunk + left branch continuation) */}
          <line ref={mainLineRef}
            x1={xL} y1={TOP_PAD} x2={xL} y2={lastBranchY}
            stroke="rgba(252,237,211,0.55)" strokeWidth="1.5"
          />

          {/* Animated: fork bezier */}
          <path ref={forkRef}
            d={forkPath} fill="none"
            stroke="rgba(252,237,211,0.45)" strokeWidth="1.5"
          />

          {/* Animated: right branch */}
          <line ref={rightLineRef}
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

  // All cards sit to the RIGHT of their respective branch line.
  // Left/trunk: CARD_LEFT_START% → CARD_LEFT_END%
  // Right:      CARD_RIGHT_START% → CARD_RIGHT_END%
  const leftPct  = `${(isRight ? CARD_RIGHT_START : CARD_LEFT_START) * 100}%`;
  const widthPct = `${((isRight ? CARD_RIGHT_END - CARD_RIGHT_START : CARD_LEFT_END - CARD_LEFT_START) * 100)}%`;

  return (
    <div
      ref={cardRef}
      data-branch={ev.branch}
      className="absolute"
      style={{ top: y - 12, left: leftPct, width: widthPct }}
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
