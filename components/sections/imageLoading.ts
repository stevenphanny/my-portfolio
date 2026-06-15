import type { ImageLoaderProps } from "next/image";

const SANITY_IMAGE_HOST = "cdn.sanity.io";

export function isSanityImageUrl(src: string) {
  try {
    return new URL(src).hostname === SANITY_IMAGE_HOST;
  } catch {
    return false;
  }
}

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!isSanityImageUrl(src)) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}

export function getTrailImageSrc(src: string) {
  if (!isSanityImageUrl(src)) return src;

  const url = new URL(src);
  url.searchParams.set("w", "320");
  url.searchParams.set("h", "400");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", "75");
  return url.toString();
}
