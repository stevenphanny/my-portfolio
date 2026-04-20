"use client";

import { useRef, useEffect, useCallback } from "react";
// Type-only import — erased at compile time, never evaluated on the server
import type GsapDefault from "gsap";

const IMAGES = [
  "/about/cats/Vi1.JPG",
  "/about/cats/Vi2.JPG",
];

const IMG_W    = 160;  // px
const IMG_H    = 200;  // px
const MIN_DIST = 90;   // px — min cursor travel before spawning next image
const BORDER_R = 16;   // px — border-radius

export function ImageTrailSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos      = useRef<{ x: number; y: number } | null>(null);
  const imgIndex     = useRef(0);
  const zCounter     = useRef(1);
  // GSAP loaded lazily — never imported at module-eval time (avoids SSR URL error)
  const gsapRef      = useRef<typeof GsapDefault | null>(null);

  useEffect(() => {
    import("gsap").then((mod) => {
      gsapRef.current = mod.default;
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const gsap      = gsapRef.current;
    if (!container || !gsap) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Enforce distance threshold
    if (lastPos.current) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;
    }
    lastPos.current = { x, y };

    // Create image element — centered via negative margins so GSAP owns transform
    const img = document.createElement("img");
    img.src = IMAGES[imgIndex.current % IMAGES.length];
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
      .fromTo(
        img,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1.12, duration: 0.25, ease: "power2.out" }
      )
      .to(img, { opacity: 0, scale: 0.78, duration: 0.75, ease: "power2.in" });
  }, []);

  // Kill all in-flight tweens on unmount to prevent memory leaks
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
      {/* Hint label — above trail images */}
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
