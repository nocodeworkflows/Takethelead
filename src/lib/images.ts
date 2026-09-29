// ---------------------------------------------------------------------------
// Build-time photo resizing.
//
// Photos uploaded through Keystatic are committed to src/assets/images and
// their paths (e.g. "/src/assets/images/team/terena/terena.jpg") are stored
// in the content JSON. At build time we look each path up here and let Astro
// produce a resized WebP, so a full-size phone photo never reaches visitors.
// Anything else (a full URL, or a /public path) is passed through unchanged.
// ---------------------------------------------------------------------------
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{jpg,jpeg,png,webp,gif,avif,JPG,JPEG,PNG,WEBP,GIF,AVIF}",
  { eager: true }
);

export async function optimise(
  path: string | null | undefined,
  width: number,
  format: "webp" | "jpg" = "webp"
): Promise<string> {
  if (!path) return "";
  const meta = files[path]?.default;
  if (!meta) return path;
  const img = await getImage({ src: meta, width: Math.min(width, meta.width), format });
  return img.src;
}
