"use client";

import { useState } from "react";
import { useLenis } from "@/components/LenisProvider";

type NavSection = {
  id: string;
  label: string;
};

type NavbarProps = {
  sections: NavSection[];
};

export function Navbar({ sections }: NavbarProps) {
  // Lenis smooth-scroll: navbar links scroll to section by id instead of native scrollIntoView
  const { scrollTo } = useLenis();

  // Tracks whether the mobile full-screen menu is open (burger was tapped)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    scrollTo(`#${id}`); // target matches <section id="…"> in page.tsx
  };

  // When user picks a section on mobile, scroll there and close the overlay
  const handleMobileNavClick = (id: string) => {
    handleScrollTo(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ----- Small screens: burger + full-screen overlay ----- */}
      {/* Burger button: only visible on small breakpoints; toggles the overlay */}
      <div className="fixed right-5 top-5 z-[60] md:hidden">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border-2 border-navy bg-cream text-navy transition-colors hover:bg-navy hover:text-cream"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {/* Each span is a line in the burger */}
          <span
            className={`h-0.5 w-5 bg-current transition-all duration-300 ${
              isMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-current transition-all duration-300 ${
              isMenuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-current transition-all duration-300 ${
              isMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Full-screen overlay: grows from top-right to cover the viewport */}
      <div
        className={`fixed inset-0 z-50 flex origin-top-right flex-col items-end justify-start bg-cream pt-20 pr-8 transition-all duration-300 ease-out md:hidden ${
          isMenuOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-0 opacity-0 pointer-events-none"
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

      {/* ----- Medium to large screens: fixed navbar ----- */}
      <header className="fixed right-0 left-0 top-0 z-50 border-color-white border-2 bg-cream backdrop-blur-xs">
        <div className="mx-auto flex max-w items-center justify-between p-5">
          <button
            type="button"
            onClick={() => handleScrollTo("intro")}
            className="cursor-pointer font-instrument-serif text-xl tracking-wide text-navy"
          >
            Stevenphanny
          </button>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-2 text-xs sm:text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleScrollTo(section.id)}
                    className="cursor-pointer rounded-sm px-3 py-1.5 font-poppins text-navy transition-colors duration-300 hover:bg-navy hover:text-cream"
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

