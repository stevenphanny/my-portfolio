import type { ComponentType } from "react";

import { AboutSection } from "@/components/sections/AboutSection";
import { CardDeckSection } from "@/components/sections/CardDeckSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { MagazineSection } from "@/components/sections/MagazineSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { VenetianSection } from "@/components/sections/VenetianSection";
import { WorkSection } from "@/components/sections/WorkSection";

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
    id: "work",
    label: "Work",
    bgClass: "bg-cream",
    navColor: "navy",
    Component: WorkSection,
  },
  // ── Prototypes ─────────────────────────────────────────────────────────────
  {
    id: "magazine",
    label: "F: Magazine",
    bgClass: "bg-cream",
    navColor: "navy",
    Component: MagazineSection,
  },
  {
    id: "venetian",
    label: "G: Venetian",
    bgClass: "bg-cream",
    navColor: "navy",
    Component: VenetianSection,
  },
  {
    id: "carddeck",
    label: "K: Card Deck",
    bgClass: "bg-cream",
    navColor: "navy",
    Component: CardDeckSection,
  },
  // ── End prototypes ─────────────────────────────────────────────────────────
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
