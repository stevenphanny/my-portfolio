import type { ComponentType } from "react";

import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WorkSection } from "@/components/sections/WorkSection";

export type SectionProps = {
  id: string;       // used for scroll target (navbar) and <section id="…">; keep unique
  label: string;   // text shown in the navbar for this section
  bgClass?: string; // Tailwind class for section background (e.g. "bg-navy", "bg-cream")
  navColor: "cream" | "navy"; // navbar text colour when this section is under the nav bar
  Component: ComponentType; // the React component rendered inside the section
};

/**
 * Single source of truth for the one-page layout: order here = navbar order and section order.
 * Edit this array to reorder sections, add new ones, or change labels/backgrounds.
 */
export const SECTION_REGISTRY: SectionProps[] = [
  {
    id: "intro",
    label: "Intro",
    bgClass: "bg-navy",
    navColor: "cream",
    Component: IntroSection,
  },
  {
    id: "work",
    label: "Work",
    bgClass: "bg-tan",
    navColor: "navy",
    Component: WorkSection,
  },
  {
    id: "about",
    label: "About",
    bgClass: "bg-navy",
    navColor: "cream",
    Component: AboutSection,
  },
  // {
  //   id: "skills",
  //   label: "Skills",
  //   bgClass: "bg-tan",
  //   navColor: "navy",
  //   Component: SkillsSection,
  // },
  {
    id: "contact",
    label: "Contact",
    bgClass: "bg-tan",
    navColor: "navy",
    Component: ContactSection,
  },
];

