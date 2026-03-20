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
    Component: IntroSection,
  },
  {
    id: "about",
    label: "About",
    bgClass: "bg-navy",
    Component: AboutSection,
  },
  {
    id: "work",
    label: "Work",
    bgClass: "bg-dark",
    Component: WorkSection,
  },
  {
    id: "skills",
    label: "Skills",
    bgClass: "bg-cream",
    Component: SkillsSection,
  },
  {
    id: "contact",
    label: "Contact",
    bgClass: "bg-tan",
    Component: ContactSection,
  },
];

