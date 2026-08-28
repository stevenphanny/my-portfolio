"use client";

import { useEffect, useRef } from "react";

const NOISE_SCALE = 0.4;
const FRAME_INTERVAL_MS = 1000 / 15;

export function IntroStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId: number | undefined;
    let lastFrameTime = 0;
    let imageData: ImageData | undefined;

    const drawNoise = () => {
      if (!imageData) return;
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        // Mid-grey is neutral in soft-light mode; the small variations become TV snow.
        const shade = 88 + Math.floor(Math.random() * 96);
        pixels[index] = shade;
        pixels[index + 1] = shade;
        pixels[index + 2] = shade;
        pixels[index + 3] = 255;
      }

      context.putImageData(imageData, 0, 0);
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * NOISE_SCALE));
      canvas.height = Math.max(1, Math.round(height * NOISE_SCALE));
      imageData = context.createImageData(canvas.width, canvas.height);
      drawNoise();
    };

    const animate = (time: number) => {
      if (time - lastFrameTime >= FRAME_INTERVAL_MS) {
        drawNoise();
        lastFrameTime = time;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
        frameId = undefined;
      }
    };

    const startAnimation = () => {
      if (!motionQuery.matches && !document.hidden && frameId === undefined) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const updateAnimationState = () => {
      stopAnimation();
      drawNoise();
      startAnimation();
    };

    resize();
    startAnimation();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", updateAnimationState);
    motionQuery.addEventListener("change", updateAnimationState);

    return () => {
      stopAnimation();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", updateAnimationState);
      motionQuery.removeEventListener("change", updateAnimationState);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="intro-static" />;
}
