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
  heroMain: weebly("chatgpt-image-may-14-2026-02-18-25-pm_orig.png"),
  whyTall: weebly("a79i2366.jpg"),
  whySquare1: weebly("a79i1518.jpg"),
  whySquare2: weebly("a79i9611.jpg"),

  // Service hero photos
  dayCare: weebly("published/chatgpt-image-may-14-2026-02-49-50-pm.png"),
  boarding: weebly("chatgpt-image-may-17-2026-11-36-51-am_orig.png"),
  walking: weebly("chatgpt-image-may-18-2026-01-27-29-pm_orig.png"),
  training: weebly("training-puppy_orig.jpg"),
  grooming: weebly("27066990-1000572143416810-5902798051555064526-n_2.jpg"),

  // About / team
  about: weebly("chatgpt-image-may-14-2026-03-32-52-pm_orig.png"),
  team: weebly("published/terena.jpg"),

  // Open Graph / social share
  og: weebly("chatgpt-image-may-14-2026-02-18-25-pm_orig.png"),
} as const;

export type ImageKey = keyof typeof images;
