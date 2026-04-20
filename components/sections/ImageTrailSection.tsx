import { client } from "@/sanity/lib/client";
import { trailImagesQuery } from "@/sanity/lib/queries";
import { ImageTrailClient } from "./ImageTrailClient";

const FALLBACK_IMAGES = [
  "/about/cats/Vi1.JPG",
  "/about/cats/Vi2.JPG",
];

export async function ImageTrailSection() {
  const docs: { url: string }[] = await client
    .fetch(trailImagesQuery)
    .catch(() => []);

  const images = docs.map((d) => d.url).filter(Boolean);

  return <ImageTrailClient images={images.length > 0 ? images : FALLBACK_IMAGES} />;
}
