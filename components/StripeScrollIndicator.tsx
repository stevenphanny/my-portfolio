"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { SECTION_REGISTRY } from "@/components/sections/registry";

// Fade in slightly after the loading screen exits (5000ms + 700ms fade)
const APPEAR_DELAY_MS = 5800;

export default function StripeScrollIndicator() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const cursorTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        Math.floor(v * SECTION_REGISTRY.length),
        SECTION_REGISTRY.length - 1
      );
      setActiveIndex(idx);
    });
  }, [scrollYProgress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-0 top-0 h-screen w-1 hidden md:block z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Track — tan background */}
          <div className="absolute inset-0 bg-tan/30" />

          {/* Fill — cream progress bar growing from top */}
          <motion.div
            className="absolute inset-x-0 top-0 bg-cream origin-top"
            style={{ scaleY: scrollYProgress, height: "100%" }}
          />

          {/* Section dots — pointer-events re-enabled for hover labels */}
          <div className="pointer-events-auto">
            {SECTION_REGISTRY.map((section, i) => {
              const topPct = ((i + 0.5) / SECTION_REGISTRY.length) * 100;
              const isActive = i === activeIndex;
              return (
                <div
                  key={section.id}
                  className="absolute group"
                  style={{
                    top: `${topPct}%`,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-cream"
                    animate={{
                      scale: isActive ? 2 : 1,
                      opacity: isActive ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  {/* Section label — appears on hover */}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-poppins text-[9px] tracking-widest uppercase text-cream/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none">
                    {section.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
