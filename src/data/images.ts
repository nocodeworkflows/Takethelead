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

  // Home
  heroMain: weebly("a79i1518.jpg"),
  whyTall: FALLBACK,
  whySquare1: FALLBACK,
  whySquare2: FALLBACK,

  // Service hero photos
  dayCare: FALLBACK,
  boarding: FALLBACK,
  walking: FALLBACK,
  training: FALLBACK,
  grooming: FALLBACK,

  // About / team
  about: FALLBACK,
  team: FALLBACK,

  // Open Graph / social share
  og: weebly("a79i1518.jpg"),
} as const;

export type ImageKey = keyof typeof images;
