"use client";

/**
 * LenisProvider — smooth scrolling for the whole page
 *
 * Wraps the app in layout.tsx and provides a single Lenis instance so that:
 * - Mouse/trackpad scrolling is smoothed (no janky native scroll).
 * - Navbar "scroll to section" uses Lenis too, so it feels consistent.
 *
 * Any component can call useLenis() to get scrollTo(target) and scroll
 * programmatically (target = "#sectionId", an HTMLElement, or a number).
 */

import Lenis from "@studio-freight/lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type LenisContextValue = {
  scrollTo: (target: HTMLElement | string | number) => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

/** Use inside LenisProvider to get scrollTo for programmatic smooth scroll (e.g. navbar links). */
export function useLenis(): LenisContextValue {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error("useLenis must be used within LenisProvider");
  }
  return ctx;
}

type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  const scrollTo = useCallback((target: HTMLElement | string | number) => {
    lenisRef.current?.scrollTo(target);
  }, []);

  useEffect(() => {
    // ——— Edit these to change scroll feel ———
    const LENIS_OPTIONS = {
      /** How long (seconds) programmatic scrolls (e.g. navbar click) take. Higher = slower, smoother. */
      duration: 1.2,
      /** Easing for programmatic scroll. t goes 0→1. This one is a gentle ease-out. */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      /** If true, wheel/trackpad input is smoothed too; if false, only programmatic scrolls use Lenis. */
      smoothWheel: true,
    };
    // ——— End editable options ———

    const lenis = new Lenis({
      duration: LENIS_OPTIONS.duration,
      easing: LENIS_OPTIONS.easing,
      smoothWheel: LENIS_OPTIONS.smoothWheel,
    });
    lenisRef.current = lenis;

    // Lenis needs to be updated every frame; this loop does that.
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
