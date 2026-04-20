import { client } from "@/sanity/lib/client";
import { timelinePanelsQuery } from "@/sanity/lib/queries";
import { TIMELINE } from "./about/timelineData";
import { AboutSection } from "./AboutSection";

type SanityPanel = {
  eventKey: string;
  panelImages: string[] | null;
  panelLayout: "hero" | "grid" | "strip" | null;
  panelSize: "small" | "medium" | "large" | null;
};

export async function AboutSectionWrapper() {
  const panels: SanityPanel[] = await client
    .fetch(timelinePanelsQuery)
    .catch(() => []);

  const panelMap = new Map(panels.map((p) => [p.eventKey, p]));

  const mergedTimeline = TIMELINE.map((event) => {
    if (!event.eventKey || !event.panel) return event;
    const sanity = panelMap.get(event.eventKey);
    if (!sanity) return event;
    return {
      ...event,
      panel: {
        ...event.panel,
        ...(sanity.panelImages?.length ? { images: sanity.panelImages.filter(Boolean) } : {}),
        ...(sanity.panelLayout ? { layout: sanity.panelLayout } : {}),
        ...(sanity.panelSize   ? { size:   sanity.panelSize   } : {}),
      },
    };
  });

  return <AboutSection timeline={mergedTimeline} />;
}
