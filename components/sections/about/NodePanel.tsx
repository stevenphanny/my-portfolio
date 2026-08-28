"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { TimelineEvent, NodePanel as NodePanelData } from "./timelineData";
import { isSanityImageUrl, sanityImageLoader } from "../imageLoading";
import { PANEL_IMAGE_SIZES, resolvePanelImageLayout } from "./panelImagePreload";

const PANEL_SIZE = {
  small: "w-[110%] min-h-[300px]",
  medium: "w-[155%] min-h-[580px]",
  large: "w-[155%] min-h-[580px]",
};

export function NodePanel({
  event,
  isLocked,
}: {
  event: TimelineEvent | null;
  isLocked?: boolean;
}) {
  const panel = event?.panel;
  const sizeClass = PANEL_SIZE[panel?.size ?? "medium"];

  return (
    <AnimatePresence mode="wait">
      {panel && (
        <motion.div
          key={event!.event}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.38, ease: [0.25, 0, 0, 1] }}
          className={`absolute top-0 left-0 ${sizeClass} max-h-[calc(100vh-7rem)] bg-cream flex flex-col gap-5 overflow-y-auto overscroll-contain z-10 panel-scrollbar`}
          onWheel={(e) => {
            if (isLocked) e.stopPropagation();
          }}
        >
          {/* Event header */}
          <div>
            <span className="font-poppins text-[10px] tracking-[0.3em] uppercase text-navy/50">
              {event!.year}
            </span>
            <h3 className="font-instrument-serif text-4xl text-navy mt-1 leading-tight">
              {event!.event}
            </h3>
            {event!.detail && (
              <p className="font-poppins text-xs tracking-[0.15em] text-navy/60 mt-2">
                {event!.detail}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-navy/10" />

          {/* Images */}
          {panel.images && panel.images.length > 0 && (
            <ImageLayout
              images={panel.images}
              layout={panel.layout}
              imageFit={panel.imageFit}
            />
          )}

          {/* Caption */}
          {panel.caption && (
            <p className="font-lora text-sm text-navy/70 leading-relaxed">
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
  imageFit = "cover",
}: {
  images: string[];
  layout?: NodePanelData["layout"];
  imageFit?: NodePanelData["imageFit"];
}) {
  const mode = resolvePanelImageLayout(images, layout);
  const imageClassName =
    imageFit === "contain" ? "object-contain p-1" : "object-cover";
  const frameClassName = imageFit === "contain" ? "bg-navy/5" : "";

  if (mode === "hero") {
    const imageProps = isSanityImageUrl(images[0])
      ? { loader: sanityImageLoader }
      : {};

    return (
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden rounded-sm ${frameClassName}`}
      >
        <Image
          src={images[0]}
          alt=""
          fill
          sizes={PANEL_IMAGE_SIZES.hero}
          className={imageClassName}
          {...imageProps}
        />
      </div>
    );
  }

  if (mode === "strip") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => {
          const imageProps = isSanityImageUrl(src)
            ? { loader: sanityImageLoader }
            : {};

          return (
            <div
              key={i}
              className={`relative flex-shrink-0 w-44 aspect-[3/4] overflow-hidden rounded-sm ${frameClassName}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes={PANEL_IMAGE_SIZES.strip}
                className={imageClassName}
                {...imageProps}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // grid — 2-column mosaic
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, i) => {
        const imageProps = isSanityImageUrl(src)
          ? { loader: sanityImageLoader }
          : {};

        return (
          <div
            key={i}
            className={`relative aspect-[4/3] overflow-hidden rounded-sm ${frameClassName}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={PANEL_IMAGE_SIZES.grid}
              className={imageClassName}
              {...imageProps}
            />
          </div>
        );
      })}
    </div>
  );
}
