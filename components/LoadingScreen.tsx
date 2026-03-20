"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-3 select-none">
            {/* Name */}
            <motion.h1
              className="font-ballet text-cream text-6xl sm:text-7xl md:text-8xl leading-none"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.0, ease: [0.25, 0, 0, 1] }}
            >
              Steven Phan
            </motion.h1>

            {/* Handle */}
            <motion.p
              className="font-poppins text-cream/50 text-xs tracking-[0.35em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
            >
              @stevenphanny
            </motion.p>

            {/* Loading bar */}
            <div className="mt-6 w-32 h-px bg-cream/15 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-cream/80"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 1.0, duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
