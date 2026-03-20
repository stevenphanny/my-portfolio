"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Tune these to control the overall writing speed and feel
const FONT_SIZE = 200;
const WRITE_DELAY = 0.3;    // seconds before the first stroke begins
const WRITE_DURATION = 1.0; // seconds over which all strokes are staggered

interface SvgData {
  paths: string[]; // one SVG path `d` string per glyph
  viewBox: string;
}

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [svgData, setSvgData] = useState<SvgData | null>(null);
  const [fontError, setFontError] = useState(false);

  useEffect(() => {
    // Guard against state updates after unmount
    let cancelled = false;

    async function initFont() {
      try {
        // Dynamically import opentype.js so it doesn't bloat the initial bundle
        const { default: opentype } = await import("opentype.js");
        const font = await opentype.load("/fonts/Ballet-Regular.ttf");
        if (cancelled) return;

        // Convert each character of the name into an SVG path object
        const paths = font.getPaths("Steven Phan", 0, FONT_SIZE, FONT_SIZE);

        // Compute the tight bounding box across all non-empty glyphs
        // so the SVG viewBox fits the text exactly (plus padding)
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
        for (const p of paths) {
          const bb = p.getBoundingBox();
          if (bb.x2 > bb.x1 && bb.y2 > bb.y1) {
            x1 = Math.min(x1, bb.x1);
            y1 = Math.min(y1, bb.y1);
            x2 = Math.max(x2, bb.x2);
            y2 = Math.max(y2, bb.y2);
          }
        }

        const PAD = 10;
        setSvgData({
          paths: paths.map((p) => p.toPathData(2)),
          viewBox: `${x1 - PAD} ${y1 - PAD} ${x2 - x1 + PAD * 2} ${y2 - y1 + PAD * 2}`,
        });
      } catch {
        // If the font fails to load, fall back to a plain CSS text element
        if (!cancelled) setFontError(true);
      }
    }

    initFont();

    // Hide the loading screen after all animations have finished
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Point in time when writing finishes — used to delay the handle and loading bar
  const afterWrite = WRITE_DELAY + WRITE_DURATION;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-3 select-none">

            {/* Fallback if the font file fails to load — simple fade-up */}
            {fontError && (
              <motion.h1
                className="font-ballet text-cream text-6xl sm:text-7xl md:text-8xl leading-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.0, ease: [0.25, 0, 0, 1] }}
              >
                Steven Phan
              </motion.h1>
            )}

            {/* SVG writing animation — each glyph path is drawn via pathLength */}
            {svgData && (
              <div className="w-[min(82vw,580px)]">
                <svg
                  viewBox={svgData.viewBox}
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ overflow: "visible" }}
                >
                  {svgData.paths.map((d, i) => {
                    const n = svgData.paths.length;

                    // Normalised position of this glyph in the sequence (0 → 1)
                    const stagger = n > 1 ? i / (n - 1) : 0;

                    // Each glyph's stroke starts slightly later than the previous,
                    // spread across 70% of WRITE_DURATION so the last glyph
                    // still has plenty of time to finish drawing
                    const pathDelay = WRITE_DELAY + stagger * WRITE_DURATION * 0.7;

                    // Each stroke takes the full WRITE_DURATION to complete,
                    // meaning neighbouring glyphs overlap heavily — this is what
                    // creates the continuous, flowing feel instead of a stop-start one
                    const drawDuration = WRITE_DURATION * 4;

                    return (
                      <motion.path
                        key={i}
                        d={d}
                        stroke="#fcedd3"
                        strokeWidth={0.9}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="#fcedd3"
                        initial={{ pathLength: 0, fillOpacity: 0 }}
                        animate={{ pathLength: 1, fillOpacity: 1 }}
                        transition={{
                          pathLength: {
                            delay: pathDelay,
                            duration: drawDuration,
                            // Symmetric easeInOut — stroke accelerates in, decelerates out,
                            // like a pen lifting off the page at the end of each stroke
                            ease: [0.37, 0, 0.63, 1],
                          },
                          fillOpacity: {
                            // Fill begins fading in when the stroke is ~30% complete
                            // and takes 80% of the draw time, so ink seeps in gradually
                            delay: pathDelay + drawDuration * 0.3,
                            duration: drawDuration * 0.8,
                            ease: "easeOut",
                          },
                        }}
                      />
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Social handle — fades in once writing is done */}
            <motion.p
              className="font-poppins text-cream/50 text-xs tracking-[0.35em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: afterWrite + 0.25, duration: 0.8 }}
            >
              @stevenphanny
            </motion.p>

            {/* Loading bar — slides in after the handle */}
            <div className="mt-6 w-32 h-px bg-cream/15 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-cream/80"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  delay: afterWrite + 0.45,
                  duration: 1.4,
                  ease: [0.25, 1, 0.5, 1],
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
