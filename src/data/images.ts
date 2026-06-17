// ---------------------------------------------------------------------------
// CENTRAL IMAGE MAP
//
// All site photography is hot-linked from the existing Weebly upload folder.
// Visitors' browsers load these directly from Weebly — no re-hosting needed.
//
// HOW TO UPDATE:
//   1. On the live site, right-click a photo → "Copy image address".
//   2. It will look like:  {WEEBLY_BASE}/somefile.jpg
//   3. Paste just the filename into the matching slot below.
//
// Any slot left as `FALLBACK` will safely render the one known-good image,
// so the production site never shows a broken image while you fill these in.
// ---------------------------------------------------------------------------

const WEEBLY_BASE = "https://www.taketheleadservices.co.uk/uploads/1/7/4/6/17463779";

/** Build a full Weebly image URL from a filename. */
export const weebly = (filename: string) => `${WEEBLY_BASE}/${filename}`;

// The one confirmed image — used as the safe fallback everywhere.
const FALLBACK = weebly("a79i1518.jpg");

/**
 * Named image slots used across the site.
 * Replace `FALLBACK` with `weebly("<filename>.jpg")` as you gather them.
 */
export const images = {
  // Logo lives in /public so it works without the Weebly CDN.
  logo: "/logo.png",

  // Home — real photography from the Weebly library (no AI-generated images)
  heroMain: weebly("a79i2712_orig.jpg"),
  whyTall: weebly("a79i2366.jpg"),
  whySquare1: weebly("a79i1518.jpg"),
  whySquare2: weebly("a79i9611.jpg"),

  // NOTE: Per-service hero photos are set in each service's CMS entry
  // (content/services/*.json → "photo"), not here. The dynamic
  // [service].astro route reads service.photo and falls back to heroMain.

  // About / team
  about: weebly("a79i2712_orig.jpg"),
  team: weebly("published/terena.jpg"),

  // Open Graph / social share
  og: weebly("a79i2712_orig.jpg"),
} as const;

export type ImageKey = keyof typeof images;
