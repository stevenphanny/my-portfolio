import type { ComponentType } from "react";

import { AboutSection } from "@/components/sections/AboutSection";
import { CardDeckSection } from "@/components/sections/CardDeckSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { VenetianSection } from "@/components/sections/VenetianSection";

export type SectionProps = {
  id: string;
  label: string;
  bgClass?: string;
  navColor: "cream" | "navy";
  Component: ComponentType;
};

export const SECTION_REGISTRY: SectionProps[] = [
  {
    id: "intro",
    label: "Intro",
    bgClass: "bg-navy",
    navColor: "cream",
    Component: IntroSection,
  },
  {
    id: "about",
    label: "About",
    bgClass: "bg-cream",
    navColor: "navy",
    Component: AboutSection,
  },
  {
    id: "work",
    label: "Work",
    bgClass: "bg-navy",
    navColor: "cream",
    Component: VenetianSection,
  },
  {
    id: "other-projects",
    label: "Other Projects",
    bgClass: "bg-cream",
    navColor: "navy",
    Component: CardDeckSection,
  },
  {
    id: "contact",
    label: "Contact",
    bgClass: "bg-tan",
    navColor: "navy",
    Component: ContactSection,
  },
];
