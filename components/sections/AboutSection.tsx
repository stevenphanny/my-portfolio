"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AboutBio } from "./about/AboutBio";
import { GitGraph } from "./about/GitGraph";
import { NodePanel } from "./about/NodePanel";
import type { TimelineEvent } from "./about/timelineData";

export function AboutSection() {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const showPanel = Boolean(hoveredEvent?.panel);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-16 md:gap-0">

        {/* Left — Git-graph timeline */}
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="font-poppins text-sm tracking-[0.3em] uppercase text-navy/85 mb-16">
            Journey
          </p>
          <GitGraph onNodeHover={setHoveredEvent} />
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
          <NodePanel event={hoveredEvent} />
        </div>

      </div>
    </div>
  );
}
