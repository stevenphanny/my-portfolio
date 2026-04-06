"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AboutBio } from "./about/AboutBio";
import { GitGraph } from "./about/GitGraph";
import { NodePanel } from "./about/NodePanel";
import type { TimelineEvent } from "./about/timelineData";

export function AboutSection() {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [lockedEvent,  setLockedEvent]  = useState<TimelineEvent | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto-unlock when the section scrolls fully out of view
  useEffect(() => {
    if (!lockedEvent) return;
    const el = sectionRef.current;
    if (!el) return;
    function onScroll() {
      const rect = el!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) setLockedEvent(null);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lockedEvent]);

  function handleNodeClick(ev: TimelineEvent) {
    // Use branch+event as composite key so same-named nodes (e.g. "What's next...") don't collide
    setLockedEvent(prev =>
      prev?.event === ev.event && prev?.branch === ev.branch ? null : ev
    );
  }

  const displayedEvent = lockedEvent ?? hoveredEvent;
  const showPanel = Boolean(displayedEvent?.panel);

  return (
    <div ref={sectionRef} className="mx-auto w-full max-w-6xl px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-16 md:gap-0">

        {/* Left — Git-graph timeline */}
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="font-poppins text-sm tracking-[0.3em] uppercase text-navy/85 mb-16">
            Journey
          </p>
          <GitGraph
            onNodeHover={setHoveredEvent}
            lockedEvent={lockedEvent}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Right — Bio sticky on desktop, panel overlays on hover */}
        <div className="w-full md:w-1/2 md:pl-16 md:sticky md:top-24 md:self-start relative">
          <motion.div
            animate={{ opacity: showPanel ? 0 : 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
            style={{ pointerEvents: showPanel ? "none" : "auto" }}
          >
            <AboutBio />
          </motion.div>
          <NodePanel event={displayedEvent} isLocked={Boolean(lockedEvent)} />
        </div>

      </div>
    </div>
  );
}
