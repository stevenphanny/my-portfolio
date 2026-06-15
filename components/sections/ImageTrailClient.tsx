"use client";

import {
  useRef,
  useEffect,
  useCallback,
  type PointerEvent,
  type ReactNode,
} from "react";
import type GsapDefault from "gsap";
import { getTrailImageSrc } from "./imageLoading";

// Trail config - tweak these to adjust feel.
const IMG_W = 160;
const IMG_H = 200;
const MIN_DIST = 180;
const COOLDOWN_MS = 100;
const BORDER_R = 16;
const MAX_ROTATION = 15;
const FADE_IN_DURATION = 0.35;
const FADE_IN_SCALE = 0.7;
const PEAK_SCALE = 1.08;
const LINGER_DURATION = 0.8;
const FADE_OUT_DURATION = 0.8;
const FADE_OUT_SCALE = 0.85;
const PRELOAD_ROOT_MARGIN = "1000px 0px";
const FIRST_WARM_COUNT = 8;

const warmedTrailImages = new Set<string>();
const warmingTrailImages = new Map<string, Promise<void>>();

function warmTrailImage(src: string, onReady?: (src: string) => void) {
  if (typeof window === "undefined") return Promise.resolve();

  if (warmedTrailImages.has(src)) {
    onReady?.(src);
    return Promise.resolve();
  }

  const existing = warmingTrailImages.get(src);
  if (existing) {
    existing.then(() => {
      if (warmedTrailImages.has(src)) onReady?.(src);
    });
    return existing;
  }

  const promise = new Promise<void>((resolve) => {
    let settled = false;
    const img = new window.Image();

    const finish = () => {
      if (settled) return;
      settled = true;
      warmedTrailImages.add(src);
      warmingTrailImages.delete(src);
      onReady?.(src);
      resolve();
    };

    const fail = () => {
      if (settled) return;
      settled = true;
      warmingTrailImages.delete(src);
      resolve();
    };

    img.decoding = "async";
    img.loading = "eager";
    img.onload = () => {
      img.decode?.().then(finish).catch(finish);
    };
    img.onerror = fail;
    img.src = getTrailImageSrc(src);

    if (img.complete) finish();
  });

  warmingTrailImages.set(src, promise);
  return promise;
}

export function ImageTrailClient({
  images,
  children,
}: {
  images: string[];
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const lastTime = useRef(0);
  const lastImageIndex = useRef<number | null>(null);
  const zCounter = useRef(1);
  const gsapRef = useRef<typeof GsapDefault | null>(null);
  const gsapImportRef = useRef<Promise<void> | null>(null);
  const readyImageSet = useRef<Set<string>>(new Set());
  const readyImages = useRef<string[]>([]);
  const restWarmTimer = useRef<number | null>(null);

  const markImageReady = useCallback(
    (src: string) => {
      if (!images.includes(src) || readyImageSet.current.has(src)) return;
      readyImageSet.current.add(src);
      readyImages.current = images.filter((image) =>
        readyImageSet.current.has(image),
      );
    },
    [images],
  );

  const prepareAssets = useCallback(() => {
    if (images.length === 0 || typeof window === "undefined") return;

    if (!gsapImportRef.current) {
      gsapImportRef.current = import("gsap").then((mod) => {
        gsapRef.current = mod.default;
      });
    }

    images.slice(0, FIRST_WARM_COUNT).forEach((src) => {
      void warmTrailImage(src, markImageReady);
    });

    const remainingImages = images.slice(FIRST_WARM_COUNT);
    if (remainingImages.length > 0 && restWarmTimer.current === null) {
      restWarmTimer.current = window.setTimeout(() => {
        restWarmTimer.current = null;
        remainingImages.forEach((src) => {
          void warmTrailImage(src, markImageReady);
        });
      }, 350);
    }
  }, [images, markImageReady]);

  useEffect(() => {
    readyImageSet.current = new Set(
      images.filter((src) => warmedTrailImages.has(src)),
    );
    readyImages.current = images.filter((src) =>
      readyImageSet.current.has(src),
    );
  }, [images]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      prepareAssets();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        prepareAssets();
        observer.disconnect();
      },
      { rootMargin: PRELOAD_ROOT_MARGIN },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [images.length, prepareAssets]);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;

      prepareAssets();

      const container = containerRef.current;
      const gsap = gsapRef.current;
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

      const sourceImages =
        readyImages.current.length > 0 ? readyImages.current : images;
      const rotation = (Math.random() - 0.5) * 2 * MAX_ROTATION;
      let imageIndex = Math.floor(Math.random() * sourceImages.length);

      if (sourceImages.length > 1 && imageIndex === lastImageIndex.current) {
        imageIndex = (imageIndex + 1) % sourceImages.length;
      }
      lastImageIndex.current = imageIndex;

      const img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      img.loading = "eager";
      img.draggable = false;
      img.src = getTrailImageSrc(sourceImages[imageIndex]);

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

      gsap
        .timeline({ onComplete: () => img.remove() })
        .fromTo(
          img,
          { opacity: 0, scale: FADE_IN_SCALE, rotation },
          {
            opacity: 1,
            scale: PEAK_SCALE,
            rotation,
            duration: FADE_IN_DURATION,
            ease: "power2.out",
          },
        )
        .to(img, { duration: LINGER_DURATION })
        .to(img, {
          opacity: 0,
          scale: FADE_OUT_SCALE,
          duration: FADE_OUT_DURATION,
          ease: "power2.in",
        });
    },
    [images, prepareAssets],
  );

  const handlePointerLeave = useCallback(() => {
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    return () => {
      if (restWarmTimer.current !== null)
        window.clearTimeout(restWarmTimer.current);
      const gsap = gsapRef.current;
      if (container && gsap) {
        gsap.killTweensOf(Array.from(container.querySelectorAll("img")));
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerEnter={prepareAssets}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ cursor: "none" }}
    >
      {children && (
        <div className="absolute top-0 left-0 right-0 z-[9999] pointer-events-none pt-16 md:pt-24 px-6 text-center">
          {children}
        </div>
      )}
    </div>
  );
}
