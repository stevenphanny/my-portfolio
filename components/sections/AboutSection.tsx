"use client";

import { AboutBio } from "./about/AboutBio";
import { GitGraph } from "./about/GitGraph";

export function AboutSection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-16 md:gap-0">

        {/* Left — Git-graph timeline */}
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="font-poppins text-xs tracking-[0.3em] uppercase text-cream/40 mb-16">
            Journey
          </p>
          <GitGraph />
        </div>

        {/* Right — Bio, sticky on desktop */}
        <div className="w-full md:w-1/2 md:pl-16 md:sticky md:top-24 md:self-start">
          <AboutBio />
        </div>

      </div>
    </div>
  );
}
