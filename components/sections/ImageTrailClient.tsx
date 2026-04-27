"use client";

import { useRef, useEffect, useCallback } from "react";
import type GsapDefault from "gsap";

// ═══ TRAIL CONFIG — tweak these to adjust feel ═══
const IMG_W             = 160;   // image width (px)
const IMG_H             = 200;   // image height (px)
const MIN_DIST          = 180;   // min px between spawns (↑ = less overlap)
const COOLDOWN_MS       = 100;    // min ms between spawns (↑ = slower trail)
const BORDER_R          = 16;    // border-radius (px)
const MAX_ROTATION      = 15;    // max random tilt in degrees (0 = no tilt)
const FADE_IN_DURATION  = 0.35;  // seconds to appear
const FADE_IN_SCALE     = 0.7;   // start scale
const PEAK_SCALE        = 1.08;  // max scale at full opacity
const LINGER_DURATION   = 0.8;   // seconds image stays at full opacity before fading
const FADE_OUT_DURATION = 0.8;   // seconds to disappear
const FADE_OUT_SCALE    = 0.85;  // end scale
// SHADOW: add boxShadow to img.style.cssText for depth, e.g. "box-shadow: 0 4px 24px rgba(0,0,0,0.15);"
// DRIFT: add { y: "-=20" } to the linger/fadeOut tween for a floating feel

export function ImageTrailClient({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos      = useRef<{ x: number; y: number } | null>(null);
  const lastTime     = useRef(0);
  const imgIndex     = useRef(0);
  const zCounter     = useRef(1);
  const gsapRef      = useRef<typeof GsapDefault | null>(null);

  useEffect(() => {
    import("gsap").then((mod) => { gsapRef.current = mod.default; });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const gsap      = gsapRef.current;
    if (!container || !gsap || images.length === 0) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    if (now - lastTime.current < COOLDOWN_MS) return;

    if (lastPos.current) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;
    }
    lastPos.current = { x, y };
    lastTime.current = now;

    const rotation = (Math.random() - 0.5) * 2 * MAX_ROTATION;

    const img = document.createElement("img");
    img.src = images[imgIndex.current % images.length];
    imgIndex.current++;

    img.style.cssText = `
      position: absolute;
      width: ${IMG_W}px;
      height: ${IMG_H}px;
      left: ${x}px;
      top: ${y}px;
      margin-left: ${-IMG_W / 2}px;
      margin-top: ${-IMG_H / 2}px;
      object-fit: cover;
      border-radius: ${BORDER_R}px;
      pointer-events: none;
      will-change: transform, opacity;
      z-index: ${zCounter.current++};
    `;

    container.appendChild(img);

    gsap.timeline({ onComplete: () => img.remove() })
      .fromTo(img,
        { opacity: 0, scale: FADE_IN_SCALE, rotation },
        { opacity: 1, scale: PEAK_SCALE, rotation, duration: FADE_IN_DURATION, ease: "power2.out" },
      )
      .to(img, { duration: LINGER_DURATION })
      .to(img, { opacity: 0, scale: FADE_OUT_SCALE, duration: FADE_OUT_DURATION, ease: "power2.in" });
  }, [images]);

  useEffect(() => {
    const container = containerRef.current;
    return () => {
      const gsap = gsapRef.current;
      if (container && gsap) {
        gsap.killTweensOf(Array.from(container.querySelectorAll("img")));
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ cursor: "none" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <p className="font-poppins text-xs tracking-[0.3em] uppercase text-navy/25 select-none">
          move your cursor
        </p>
      </div>
    </div>
  );
}
