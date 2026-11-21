"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

// A section counts as viewed once it reaches the middle of the viewport.
// (A visibility ratio would never trigger for sections taller than the screen.)
const VIEW_ROOT_MARGIN = "-50% 0px -50% 0px";

// Sends one `section_viewed` event per section per page load.
export function SectionViewTracker({ sectionIds }: { sectionIds: string[] }) {
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) return;
          seen.add(id);
          posthog.capture("section_viewed", {
            section_id: id,
            section_index: sectionIds.indexOf(id),
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: VIEW_ROOT_MARGIN },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return null;
}
