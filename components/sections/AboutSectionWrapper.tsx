import { client } from "@/sanity/lib/client";
import { timelinePanelsQuery, trailImagesQuery } from "@/sanity/lib/queries";
import { TIMELINE } from "./about/timelineData";
import { AboutSection } from "./AboutSection";

type SanityPanel = {
  eventKey: string;
  panelImages: string[] | null;
  panelLayout: "hero" | "grid" | "strip" | null;
  panelSize: "small" | "medium" | "large" | null;
};

const FALLBACK_TRAIL_IMAGES = [
  "/about/cats/Vi1.JPG",
  "/about/cats/Vi2.JPG",
];

export async function AboutSectionWrapper() {
  const [panels, trailDocs] = await Promise.all([
    client.fetch<SanityPanel[]>(timelinePanelsQuery).catch(() => []),
    client.fetch<{ url: string }[]>(trailImagesQuery).catch(() => []),
  ]);

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

  const trailImages = trailDocs.map((d) => d.url).filter(Boolean);

  return (
    <AboutSection
      timeline={mergedTimeline}
      trailImages={trailImages.length > 0 ? trailImages : FALLBACK_TRAIL_IMAGES}
    />
  );
}
