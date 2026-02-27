import type { ComponentType } from "react";

import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WorkSection } from "@/components/sections/WorkSection";

export type SectionProps = {
  id: string;
  label: string;
  bgClass?: string;
  Component: ComponentType;
};

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
    bgClass: "bg-tan",
    Component: SkillsSection,
  },
  {
    id: "contact",
    label: "Contact",
    bgClass: "bg-cream",
    Component: ContactSection,
  },
];

