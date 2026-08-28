import type { NodePanel, TimelineEvent } from "./timelineData";

export const PANEL_IMAGE_SIZES = {
  hero: "(min-width: 768px) 56rem, calc(100vw - 3rem)",
  grid: "(min-width: 768px) 28rem, calc((100vw - 4rem) / 2)",
  strip: "11rem",
} as const;

type PanelImageLayout = NonNullable<NodePanel["layout"]>;

export type PanelImagePreload = {
  key: string;
  src: string;
  sizes: string;
};

export function resolvePanelImageLayout(
  images: string[],
  layout?: NodePanel["layout"],
): PanelImageLayout {
  return layout ?? (images.length === 1 ? "hero" : "grid");
}

/** Mirrors the GitGraph's visual order: main nodes, then paired branch rows. */
function getVisualTimelineOrder(timeline: TimelineEvent[]) {
  const main = timeline.filter((event) => event.branch === "main");
  const left = timeline.filter((event) => event.branch === "left");
  const right = timeline.filter((event) => event.branch === "right");
  const branchRows = Array.from(
    { length: Math.max(left.length, right.length) },
    (_, index) => [left[index], right[index]].filter(Boolean) as TimelineEvent[],
  );

  return [...main, ...branchRows.flat()];
}

/**
 * Queue the first image for every panel before filling in remaining images
 * round-robin, so one future gallery cannot delay every other panel.
 */
export function buildPanelImagePreloadQueue(timeline: TimelineEvent[]) {
  const panels = getVisualTimelineOrder(timeline).flatMap((event) => {
    const images = event.panel?.images?.filter(Boolean) ?? [];
    if (images.length === 0) return [];

    const layout = resolvePanelImageLayout(images, event.panel?.layout);
    const sizes = PANEL_IMAGE_SIZES[layout];
    const panelKey = event.eventKey ?? `${event.branch}:${event.event}`;

    return [
      images.map((src, index) => ({
        key: `${panelKey}:${index}:${src}:${sizes}`,
        src,
        sizes,
      })),
    ];
  });

  const queue: PanelImagePreload[] = [];
  const seenVariants = new Set<string>();
  const add = (image: PanelImagePreload | undefined) => {
    if (!image) return;
    const variantKey = `${image.src}:${image.sizes}`;
    if (seenVariants.has(variantKey)) return;
    seenVariants.add(variantKey);
    queue.push(image);
  };

  panels.forEach((images) => add(images[0]));

  for (let imageIndex = 1; ; imageIndex += 1) {
    let foundImage = false;
    panels.forEach((images) => {
      const image = images[imageIndex];
      if (image) foundImage = true;
      add(image);
    });
    if (!foundImage) break;
  }

  return queue;
}
