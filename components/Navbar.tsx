"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/LenisProvider";
import { SECTION_REGISTRY } from "@/components/sections/registry";

// Delay matches loading screen exit: 5s timer + 0.7s overlay fade
const NAV_DELAY = 5.7;

const listVariants = {
  hidden: {},
  show:   { transition: { delayChildren: NAV_DELAY + 0.12, staggerChildren: 0.11 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

type NavSection = {
  id: string;
  label: string;
};

type NavbarProps = {
  sections: NavSection[];
};

export function Navbar({ sections }: NavbarProps) {
  const { scrollTo } = useLenis();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    function updateLogo() {
      setShowLogo(window.scrollY >= window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", updateLogo, { passive: true });
    updateLogo();
    return () => window.removeEventListener("scroll", updateLogo);
  }, []);

  // ── Colour-aware navbar ────────────────────────────────────────────────────
  // Tracks which section is currently under the navbar and switches colours.
  const [scheme, setScheme] = useState<"cream" | "navy">("cream");
  const schemeRef = useRef<"cream" | "navy">("cream");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      let activeColor: "cream" | "navy" = SECTION_REGISTRY[0].navColor;
      let activeId: string | null = null;
      for (const s of SECTION_REGISTRY) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 60) {
          activeColor = s.navColor;
          activeId = s.id;
        }
      }
      if (activeColor !== schemeRef.current) {
        schemeRef.current = activeColor;
        setScheme(activeColor);
      }
      setActiveSection(activeId);
    }

    window.addEventListener("scroll", update, { passive: true });
    update(); // run once on mount
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Derived colour classes — CSS transition-colors handles the smooth swap
  const fg        = scheme === "cream" ? "text-cream"                  : "text-navy";
  const tanNavy = scheme === "cream" ? "text-tan" : "text-navy";
  const itemHover = scheme === "cream" ? "hover:bg-cream hover:text-navy" : "hover:bg-navy hover:text-cream";
  const itemActive = scheme === "cream" ? "bg-cream text-navy" : "bg-navy text-cream";
  // ──────────────────────────────────────────────────────────────────────────

  const handleScrollTo = (id: string) => scrollTo(`#${id}`);

  const handleMobileNavClick = (id: string) => {
    handleScrollTo(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ----- Small screens: burger + full-screen overlay ----- */}
      <div className="fixed right-5 top-5 z-[60] md:hidden">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border-2 border-navy bg-cream text-navy transition-colors hover:bg-navy hover:text-cream"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-50 flex origin-top-right flex-col items-end justify-start bg-cream pt-20 pr-8 transition-all duration-300 ease-out md:hidden ${
          isMenuOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col gap-4 text-right">
          <button
            type="button"
            onClick={() => handleMobileNavClick("intro")}
            className="text-xl font-instrument-serif tracking-wide text-navy hover:underline"
          >
            Stevenphanny
          </button>
          <ul className="flex flex-col gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => handleMobileNavClick(section.id)}
                  className="rounded-sm px-3 py-2 font-poppins text-navy transition-colors hover:bg-navy hover:text-cream"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ----- Medium+ screens: fixed navbar ----- */}
      <header className="fixed right-0 left-0 top-0 z-50">
        <div className="mx-auto flex max-w items-center justify-end p-5 relative">
          <motion.button
            type="button"
            onClick={() => handleScrollTo("intro")}
            className={`absolute left-5 cursor-pointer font-instrument-serif tracking-wide transition-colors duration-[600ms] pointer-events-auto ${tanNavy}`}
            style={{ fontSize: "clamp(0.8rem, 2.6vw, 2.8rem)" }}
            animate={{ opacity: showLogo ? 1 : 0, y: showLogo ? 0 : -8 }}
            transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
          >
            <span>@stevenphanny</span>
          </motion.button>

          <nav className="hidden md:block">
            <motion.ul
              className="flex items-center gap-2 text-xs sm:text-sm"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {sections.map((section) => (
                <motion.li key={section.id} variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => handleScrollTo(section.id)}
                    className={`cursor-pointer px-3 py-1.5 font-poppins rounded-sm transition-colors duration-[600ms] ${section.id === activeSection ? itemActive : `${fg} ${itemHover}`}`}
                  >
                    {section.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        </div>
      </header>
    </>
  );
}
