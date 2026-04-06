"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { TimelineEvent, NodePanel as NodePanelData } from "./timelineData";

export function NodePanel({ event }: { event: TimelineEvent | null }) {
  const panel = event?.panel;

  return (
    <AnimatePresence mode="wait">
      {panel && (
        <motion.div
          key={event!.event}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.38, ease: [0.25, 0, 0, 1] }}
          className="absolute inset-0 bg-cream flex flex-col gap-5 overflow-y-auto"
        >
          {/* Event header */}
          <div>
            <span className="font-poppins text-[10px] tracking-[0.3em] uppercase text-navy/30">
              {event!.year}
            </span>
            <h3 className="font-instrument-serif text-4xl text-navy mt-1 leading-tight">
              {event!.event}
            </h3>
            {event!.detail && (
              <p className="font-poppins text-xs tracking-[0.15em] text-navy/40 mt-2">
                {event!.detail}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-navy/10" />

          {/* Images */}
          {panel.images && panel.images.length > 0 && (
            <ImageLayout images={panel.images} layout={panel.layout} />
          )}

          {/* Caption */}
          {panel.caption && (
            <p className="font-lora text-sm text-navy/55 leading-relaxed">
              {panel.caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ImageLayout({
  images,
  layout,
}: {
  images: string[];
  layout?: NodePanelData["layout"];
}) {
  const mode = layout ?? (images.length === 1 ? "hero" : "grid");

  if (mode === "hero") {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm">
        <Image src={images[0]} alt="" fill className="object-cover" />
      </div>
    );
  }

  if (mode === "strip") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-44 aspect-[3/4] overflow-hidden rounded-sm"
          >
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // grid — 2-column mosaic
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, i) => (
        <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image src={src} alt="" fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
