"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AboutBio } from "./about/AboutBio";
import { GitGraph } from "./about/GitGraph";
import { NodePanel } from "./about/NodePanel";
import { TIMELINE, type TimelineEvent } from "./about/timelineData";
import { ImageTrailClient } from "./ImageTrailClient";

export function AboutSection({
  timeline = TIMELINE,
  trailImages = [],
}: {
  timeline?: TimelineEvent[];
  trailImages?: string[];
}) {
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
    <div ref={sectionRef} className="w-full flex flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-16 md:gap-0">

          {/* Left — Git-graph timeline */}
          <div className="w-full md:w-1/2 md:pr-16">
            <p className="font-poppins text-sm tracking-[0.3em] uppercase text-navy/85 mb-16">
              Journey
            </p>
            <GitGraph
              timeline={timeline}
              onNodeHover={setHoveredEvent}
              lockedEvent={lockedEvent}
              onNodeClick={handleNodeClick}
            />
          </div>

          {/* Right — Bio sticky on desktop, panel overlays on hover */}
          <div
            className="w-full md:w-1/2 md:pl-16 md:sticky md:top-24 md:self-start relative"
            style={{
              minHeight: showPanel ? "calc(100vh - 7rem)" : undefined,
              overflowY: showPanel ? "clip" : "visible",
            }}
          >
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

      {/* Trail — full-bleed cursor trail under the git branch */}
      {trailImages.length > 0 && (
        <div id="trail" className="w-full bg-cream">
          <div className="px-6 pt-16 md:pt-24 pb-10 text-center">
            <h2 className="font-instrument-serif text-5xl md:text-7xl text-navy">
              Trail
            </h2>
            <p className="font-lora text-sm md:text-base text-navy/70 mt-4 max-w-md mx-auto leading-relaxed">
              A few moments worth keeping. Drag your cursor across to surface them.
            </p>
          </div>

          {/* Section start separator */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-px bg-navy/45" />
            <span className="w-1.5 h-1.5 rotate-45 bg-navy/70" />
            <div className="w-32 h-px bg-navy/45" />
          </div>

          <ImageTrailClient images={trailImages} />
        </div>
      )}
    </div>
  );
}
