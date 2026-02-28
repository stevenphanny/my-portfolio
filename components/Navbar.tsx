"use client";

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

  const handleScrollTo = (id: string) => {
    scrollTo(`#${id}`); // target matches <section id="…"> in page.tsx
  };

  return (
    <header className="fixed right-0 left-0 top-0 z-50 border-color-white border-2 bg-cream backdrop-blur-xs">
      <div className="mx-auto flex max-w items-center justify-between p-5">
          
          <button
          type="button"
           onClick={() => handleScrollTo("intro")} 
           className="text-xl text-navy font-instrument-serif tracking-wide cursor-pointer">
            Stevenphanny
          </button>

        <nav>
          <ul className="flex items-center gap-2 text-xs sm:text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => handleScrollTo(section.id)}
                  className="px-3 py-1.5 font-poppins rounded-sm text-navy hover:text-cream hover:bg-navy transition-colors duration-300 cursor-pointer"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

