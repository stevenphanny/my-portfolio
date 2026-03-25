"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/LenisProvider";

// Matches the navbar/loading-screen exit delay so everything arrives together
const HERO_DELAY = 5.7;

// ── Particle field ─────────────────────────────────────────────────────────────
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 55;
    const CONNECT_DIST = 130;
    const SPEED = 0.35;
    // cream colour components
    const DOT_COLOR = "252, 237, 211"; // #fcedd3

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];

    function resize() {
      W = canvas!.offsetWidth;
      H = canvas!.offsetHeight;
      canvas!.width = W;
      canvas!.height = H;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Subtle mouse parallax offset
      const mx = (mouseRef.current.x / W - 0.5) * 18;
      const my = (mouseRef.current.y / H - 0.5) * 18;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const px = p.x + mx;
        const py = p.y + my;

        // Draw dot
        ctx!.beginPath();
        ctx!.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${DOT_COLOR}, 0.55)`;
        ctx!.fill();

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qx = q.x + mx;
          const qy = q.y + my;
          const dx = px - qx;
          const dy = py - qy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.2;
            ctx!.beginPath();
            ctx!.moveTo(px, py);
            ctx!.lineTo(qx, qy);
            ctx!.strokeStyle = `rgba(${DOT_COLOR}, ${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden="true"
    />
  );
}

// ── Animation variants ─────────────────────────────────────────────────────────

// Each name line clips upward out of its container
const lineVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 12 },
  show: (i: number) => ({
    clipPath: "inset(0 0 0% 0)",
    y: 0,
    transition: {
      delay: HERO_DELAY + i * 0.18,
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: HERO_DELAY + 0.5 + i * 0.12,
      duration: 0.65,
      ease: [0.25, 0, 0, 1] as [number, number, number, number],
    },
  }),
};

const canvasFadeVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay: HERO_DELAY + 0.3, duration: 1.2, ease: "easeOut" },
  },
};

// ── IntroSection ───────────────────────────────────────────────────────────────
export function IntroSection() {
  const { scrollTo } = useLenis();

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6 md:px-12">
      <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-2 md:gap-8">

        {/* ── Left: text ─────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center gap-6">

          {/* Eyebrow */}
          <motion.p
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="show"
            className="font-poppins text-xs tracking-[0.35em] uppercase text-cream/50"
          >
            Software Engineer
          </motion.p>

          {/* Name — two clip-reveal lines */}
          <div className="flex flex-col gap-0 leading-none">
            {["Steven", "Phan"].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.h1
                  custom={i}
                  variants={lineVariants}
                  initial="hidden"
                  animate="show"
                  className="font-instrument-serif text-[clamp(4rem,10vw,8rem)] text-cream"
                >
                  {word}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            custom={0}
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              show: {
                scaleX: 1,
                opacity: 1,
                transition: {
                  delay: HERO_DELAY + 0.45,
                  duration: 0.8,
                  ease: [0.25, 0, 0, 1] as [number, number, number, number],
                },
              },
            }}
            initial="hidden"
            animate="show"
            style={{ originX: 0 }}
            className="h-px w-16 bg-cream/25"
          />

          {/* Tagline */}
          <motion.p
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="show"
            className="font-lora text-base text-cream/60 leading-relaxed max-w-xs"
          >
            Full-stack development &amp; design.
            <br />
            Building things that feel as good as they look.
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="show"
          >
            <button
              type="button"
              onClick={() => scrollTo("#work")}
              className="group inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 font-poppins text-sm text-cream/80 transition-all duration-300 hover:border-cream/50 hover:text-cream cursor-pointer"
            >
              View Work
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* ── Right: particle field ───────────────────────────────────── */}
        <motion.div
          variants={canvasFadeVariants}
          initial="hidden"
          animate="show"
          className="hidden md:block h-[420px] w-full"
        >
          <ParticleCanvas />
        </motion.div>
      </div>
    </div>
  );
}
