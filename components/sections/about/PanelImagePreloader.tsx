"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import Image from "next/image";
import type { TimelineEvent } from "./timelineData";
import { buildPanelImagePreloadQueue } from "./panelImagePreload";
import { isSanityImageUrl, sanityImageLoader } from "../imageLoading";

const INITIAL_PRELOAD_DELAY_MS = 250;
const STAGGER_PRELOAD_DELAY_MS = 250;
const PROXIMITY_ROOT_MARGIN = "900px 0px";

export function PanelImagePreloader({
  timeline,
  targetRef,
}: {
  timeline: TimelineEvent[];
  targetRef: RefObject<HTMLDivElement | null>;
}) {
  const queue = useMemo(() => buildPanelImagePreloadQueue(timeline), [timeline]);
  const [preloadCount, setPreloadCount] = useState(0);

  useEffect(() => {
    if (queue.length === 0) return;

    let cancelled = false;
    let timer: number | undefined;

    const scheduleNext = (index: number) => {
      const delay =
        index === 0 ? INITIAL_PRELOAD_DELAY_MS : STAGGER_PRELOAD_DELAY_MS;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setPreloadCount((current) => Math.max(current, index + 1));
        if (index + 1 < queue.length) scheduleNext(index + 1);
      }, delay);
    };

    scheduleNext(0);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [queue]);

  useEffect(() => {
    if (preloadCount >= queue.length) return;
    const target = targetRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPreloadCount(queue.length);
        observer.disconnect();
      },
      { rootMargin: PROXIMITY_ROOT_MARGIN },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [preloadCount, queue.length, targetRef]);

  if (preloadCount === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
    >
      {queue.slice(0, preloadCount).map((image) => {
        const imageProps = isSanityImageUrl(image.src)
          ? { loader: sanityImageLoader }
          : {};

        return (
          <div className="relative h-px w-px" key={image.key}>
            <Image
              src={image.src}
              alt=""
              fill
              loading="eager"
              fetchPriority="low"
              sizes={image.sizes}
              {...imageProps}
            />
          </div>
        );
      })}
    </div>
  );
}
