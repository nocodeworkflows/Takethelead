# Design directions

A brochure of possible looks for the new Take The Lead website, for Matt and Karina to compare before we pick a theme for the Astro build.

This folder is not part of the live site. It sits outside `public/` and `src/`, so Astro and Cloudflare ignore it.

## Viewing it

1. `git pull`
2. Open `design-options/index.html` in a browser (double-click it). That's the brochure. Each option opens from there.

Every page works straight from disk. Fonts load from Google Fonts, so you need an internet connection for the right lettering.

To show it on a phone, run `npx serve design-options` and open the address it prints on a phone on the same Wi-Fi.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The brochure: both options side by side, questions to decide, inspiration board |
| `option-a-red-slab/` | Option A: red welcome card, credentials ticker, priced service cards |
| `option-b-shapes-and-woodland/` | Option B: Yardstick-style service shapes, High Tails-style photo sections |
| `thumbs/` | Laptop and phone screenshots of each option (first screen and whole page) |
| `inspiration/` | Screenshots of the sites the ideas came from |

## Known gaps

- The two options were written from different drafts, so some facts differ (areas covered, meet & greet vs trial day, opening hours). Pick the look first, then we settle the words.
- Option B has photo placeholders for the woodland and the review. It also has a `[REVIEW COUNT]` placeholder.
- Links and buttons inside the options don't go anywhere yet.

## Adding another option

Make a new folder `option-c-<name>/` with an `index.html`. Add a screenshot pair to `thumbs/`. Copy one of the `<article class="opt">` blocks in `index.html` and point it at the new folder.
