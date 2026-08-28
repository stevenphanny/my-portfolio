"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CURSOR_SIZE = 24;
const CREAM = "#fcedd3";
const TAN = "#d2b48c";
const NAVY = "#001E40";
const DEFAULT_COLOR = CREAM;
const COLOR_TRANSITION_MS = 90;
const REST_DELAY_MS = 120;

const CURSOR_COLORS: Record<string, string> = {
  navy: CREAM,
  tan: NAVY,
  cream: NAVY,
  black: CREAM,
};

const ANIMATED_TEXT_SELECTOR = "[data-cursor-text]";
const TEXT_CONTAINER_SELECTOR =
  "h1, h2, h3, h4, h5, h6, p, a, button, label, li";
// Lower damping = less resistance and more bounce. Raise it for a firmer cursor.
const CURSOR_BOUNCE_DAMPING = 5;
const BOUNCE_SPRING = {
  stiffness: 1800,
  damping: CURSOR_BOUNCE_DAMPING,
  mass: 0.1,
};

type RgbColor = readonly [red: number, green: number, blue: number];

const TEXT_REVEAL_PALETTE: ReadonlyArray<{
  source: RgbColor;
  reveal: string;
}> = [
  { source: [210, 180, 140], reveal: CREAM }, // tan -> cream
  { source: [252, 237, 211], reveal: TAN }, // creamLight -> tan
  { source: [217, 205, 180], reveal: TAN }, // cream -> tan
  { source: [0, 30, 64], reveal: CREAM }, // navy -> cream
];

function parseCssColor(color: string): RgbColor | null {
  const channels = color.match(/\d+(?:\.\d+)?/g);
  if (!channels || channels.length < 3) return null;

  return [Number(channels[0]), Number(channels[1]), Number(channels[2])];
}

function getTextRevealColor(originalColor: string) {
  const color = parseCssColor(originalColor);
  if (!color) return TAN;

  return TEXT_REVEAL_PALETTE.reduce(
    (closest, candidate) => {
      const distance = candidate.source.reduce(
        (total, channel, index) => total + (channel - color[index]) ** 2,
        0,
      );

      return distance < closest.distance
        ? { distance, reveal: candidate.reveal }
        : closest;
    },
    { distance: Number.POSITIVE_INFINITY, reveal: TAN },
  ).reveal;
}

export function CustomCursor() {
  // Position and direction follow the pointer 1:1. Only the stretch bounces.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scaleXTarget = useMotionValue(1);
  const scaleYTarget = useMotionValue(1);
  const rotate = useMotionValue(0);
  const scaleX = useSpring(scaleXTarget, BOUNCE_SPRING);
  const scaleY = useSpring(scaleYTarget, BOUNCE_SPRING);
  const directionalTransform = useTransform(
    [rotate, scaleX, scaleY],
    ([angle, horizontalScale, verticalScale]) =>
      `rotate(${angle}deg) scaleX(${horizontalScale}) scaleY(${verticalScale})`,
  );

  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const pointerPos = useRef({ cx: -1, cy: -1, time: 0 });
  const colorRef = useRef(DEFAULT_COLOR);
  const activeTextRef = useRef<HTMLElement | null>(null);
  const textOverlayRef = useRef<HTMLElement | null>(null);
  const originalTextColors = useRef(new WeakMap<HTMLElement, string>());
  const restTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let overlayFrame: number | undefined;

    const setCursorColor = (nextColor: string) => {
      if (colorRef.current === nextColor) return;
      colorRef.current = nextColor;
      setColor(nextColor);
    };

    const clearTextReveal = () => {
      if (overlayFrame !== undefined) {
        window.cancelAnimationFrame(overlayFrame);
        overlayFrame = undefined;
      }
      textOverlayRef.current?.remove();
      textOverlayRef.current = null;
      activeTextRef.current = null;

      const { cx, cy } = pointerPos.current;
      if (cx >= 0 && cy >= 0) {
        x.set(cx - CURSOR_SIZE / 2);
        y.set(cy - CURSOR_SIZE / 2);
      }
    };

    const copyTextMetrics = (source: HTMLElement, overlay: HTMLElement) => {
      const style = window.getComputedStyle(source);
      overlay.style.fontFamily = style.fontFamily;
      overlay.style.fontSize = style.fontSize;
      overlay.style.fontStyle = style.fontStyle;
      overlay.style.fontWeight = style.fontWeight;
      overlay.style.letterSpacing = style.letterSpacing;
      overlay.style.lineHeight = style.lineHeight;
      overlay.style.textAlign = style.textAlign;
      overlay.style.textTransform = style.textTransform;
      overlay.style.whiteSpace = style.whiteSpace;
    };

    const createTextOverlay = (textElement: HTMLElement) => {
      const overlay = textElement.cloneNode(true) as HTMLElement;
      overlay.removeAttribute("id");
      overlay.querySelectorAll("[id]").forEach((element) =>
        element.removeAttribute("id"),
      );
      overlay.classList.add("cursor-text-overlay");
      overlay.setAttribute("aria-hidden", "true");
      overlay.setAttribute("inert", "");
      overlay.style.setProperty("transform", "none", "important");
      copyTextMetrics(textElement, overlay);
      document.body.appendChild(overlay);

      return overlay;
    };

    const getAnimatedTextOffset = (textElement: HTMLElement) => {
      if (!textElement.matches(ANIMATED_TEXT_SELECTOR)) return { x: 0, y: 0 };

      const transform = window.getComputedStyle(textElement).transform;
      if (transform === "none") return { x: 0, y: 0 };

      const matrix = new DOMMatrixReadOnly(transform);
      return { x: matrix.m41, y: matrix.m42 };
    };

    const syncTextOverlay = () => {
      const textElement = activeTextRef.current;
      const overlay = textOverlayRef.current;
      if (!textElement || !overlay) return;

      const rect = textElement.getBoundingClientRect();
      const { cx, cy } = pointerPos.current;
      const offset = getAnimatedTextOffset(textElement);
      const visualCx = cx + offset.x;
      const visualCy = cy + offset.y;

      x.set(visualCx - CURSOR_SIZE / 2);
      y.set(visualCy - CURSOR_SIZE / 2);
      overlay.style.left = `${rect.left}px`;
      overlay.style.top = `${rect.top}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.setProperty("--cursor-reveal-x", `${visualCx - rect.left}px`);
      overlay.style.setProperty("--cursor-reveal-y", `${visualCy - rect.top}px`);
    };

    const runOverlayFrame = () => {
      syncTextOverlay();
      if (activeTextRef.current && textOverlayRef.current) {
        overlayFrame = window.requestAnimationFrame(runOverlayFrame);
      } else {
        overlayFrame = undefined;
      }
    };

    const resolveTextElement = (target: Element | null, cx: number) => {
      const directLetter = target?.closest(
        ANIMATED_TEXT_SELECTOR,
      ) as HTMLElement | null;
      if (directLetter) return directLetter;

      const container = target?.closest(
        TEXT_CONTAINER_SELECTOR,
      ) as HTMLElement | null;
      if (!container) return null;

      const animatedLetters = Array.from(
        container.querySelectorAll<HTMLElement>(ANIMATED_TEXT_SELECTOR),
      );
      if (animatedLetters.length === 0) return container;

      const nearestLetter = animatedLetters.reduce<{
        element: HTMLElement | null;
        distance: number;
      }>(
        (nearest, element) => {
          const rect = element.getBoundingClientRect();
          const distance =
            cx < rect.left ? rect.left - cx : cx > rect.right ? cx - rect.right : 0;

          return distance < nearest.distance
            ? { element, distance }
            : nearest;
        },
        { element: null, distance: Number.POSITIVE_INFINITY },
      );

      return nearestLetter.distance <= CURSOR_SIZE / 2
        ? nearestLetter.element
        : container;
    };

    const startOverlaySync = () => {
      syncTextOverlay();
      if (overlayFrame === undefined) {
        overlayFrame = window.requestAnimationFrame(runOverlayFrame);
      }
    };

    const updateTextReveal = (
      textElement: HTMLElement | null,
      cx: number,
      cy: number,
    ) => {
      if (!textElement) {
        clearTextReveal();
        return false;
      }

      if (activeTextRef.current !== textElement) {
        clearTextReveal();
        activeTextRef.current = textElement;
        if (!originalTextColors.current.has(textElement)) {
          originalTextColors.current.set(
            textElement,
            window.getComputedStyle(textElement).color,
          );
        }
        textOverlayRef.current = createTextOverlay(textElement);
      }

      const overlay = textOverlayRef.current;
      const originalColor = originalTextColors.current.get(textElement) ?? CREAM;
      if (!overlay) return false;

      overlay.style.setProperty(
        "--cursor-reveal-color",
        getTextRevealColor(originalColor),
      );
      overlay.style.setProperty("--cursor-size", `${CURSOR_SIZE}px`);
      pointerPos.current.cx = cx;
      pointerPos.current.cy = cy;
      startOverlaySync();

      return true;
    };

    const detectColor = (cx: number, cy: number) => {
      const target = document.elementFromPoint(cx, cy);
      const bgEl = target?.closest("[data-bg]") as HTMLElement | null;
      const baseColor = CURSOR_COLORS[bgEl?.dataset.bg ?? ""] ?? DEFAULT_COLOR;
      const textElement = resolveTextElement(target, cx);

      const isOverText = updateTextReveal(textElement, cx, cy);
      setCursorColor(baseColor);

      return isOverText;
    };

    const resetShape = () => {
      scaleXTarget.set(1);
      scaleYTarget.set(1);
    };

    const onMove = (event: PointerEvent) => {
      if (!finePointerQuery.matches) return;

      const previous = pointerPos.current;
      const now = performance.now();
      const elapsed = Math.max(now - previous.time, 16);
      const deltaX = event.clientX - previous.cx;
      const deltaY = event.clientY - previous.cy;
      const speed = Math.min(Math.hypot(deltaX, deltaY) / elapsed, 2.2);

      x.set(event.clientX - CURSOR_SIZE / 2);
      y.set(event.clientY - CURSOR_SIZE / 2);
      pointerPos.current = { cx: event.clientX, cy: event.clientY, time: now };
      const isOverText = detectColor(event.clientX, event.clientY);
      setVisible(true);

      if (previous.time > 0 && !isOverText) {
        scaleXTarget.set(1 + speed * 0.4);
        scaleYTarget.set(Math.max(0.68, 1 - speed * 0.2));
        rotate.set((Math.atan2(deltaY, deltaX) * 180) / Math.PI);
      } else if (isOverText) {
        resetShape();
      }

      if (restTimer.current !== undefined) window.clearTimeout(restTimer.current);
      if (!isOverText) {
        restTimer.current = window.setTimeout(resetShape, REST_DELAY_MS);
      }
    };

    const onScroll = () => {
      const { cx, cy } = pointerPos.current;
      if (cx >= 0 && cy >= 0) detectColor(cx, cy);
    };

    const onEnter = () => {
      if (finePointerQuery.matches) setVisible(true);
    };
    const onLeave = () => {
      clearTextReveal();
      setVisible(false);
    };

    document.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerenter", onEnter);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (restTimer.current !== undefined) window.clearTimeout(restTimer.current);
      clearTextReveal();
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [rotate, scaleXTarget, scaleYTarget, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[10001] rounded-full pointer-events-none"
      style={{
        x,
        y,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          transform: directionalTransform,
          backgroundColor: color,
          transformOrigin: "center center",
          transition: `background-color ${COLOR_TRANSITION_MS}ms ease`,
        }}
      />
    </motion.div>
  );
}
