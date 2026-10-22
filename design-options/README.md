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
| `index.html` | The brochure: every option side by side, questions to decide, inspiration board |
| `option-a-red-slab/` | Option A: red welcome card, credentials ticker, priced service cards |
| `option-b-shapes-and-woodland/` | Option B: Yardstick-style service shapes, High Tails-style photo sections |
| `option-c-muddy-paws/` | Option C: rural, photo-led, forest green with OS-map touches |
| `option-d-clinic-calm/` | Option D: premium and minimal, vet-nurse led, "a day with us" timeline |
| `option-e-village-noticeboard/` | Option E: corkboard notes, Polaroids, hand-drawn and chatty |
| `option-f-bold-and-loud/` | Option F: black and red, poster type, spinning stamp, marquee |
| `option-g-clean-modern/` | Option G: clean and modern, scroll animations, cursor-tracking spaniel who catches thrown treats in slow motion. `dog3/` holds 42 frames of one real head turn (frames 125–190 of `inspiration/Spaniel_moving_head_in_studio_….mp4`, after the fly has gone) and two catch clips cut from the treat-catching video, lined up to the same framing, with the slow-motion sections motion-interpolated |
| Option H | The current Astro build, live at https://takethelead.damiankennedy-pt.workers.dev/. No folder here: the brochure card links to the live site, with screenshots in `thumbs/option-h-current-build-*.jpg` |
| `shared/` | Compressed real photos and the logo, used by options C to F |
| `thumbs/` | Laptop and phone screenshots of the first screen of each option |
| `inspiration/` | Screenshots of the sites the ideas came from |

## Known gaps

- The two options were written from different drafts, so some facts differ (areas covered, meet & greet vs trial day, opening hours). Pick the look first, then we settle the words.
- Option B has photo placeholders for the woodland and the review. It also has a `[REVIEW COUNT]` placeholder.
- Links and buttons inside the options don't go anywhere yet.
- Option D's "A day with us" times are examples. They need the real daycare routine.
- Option F calls Matt "a copper". Check he's happy with that.
- Option G uses stand-in footage. For the real thing, film one of Take The Lead's dogs sitting in front of a plain backdrop: a slow head turn from full left to full right, and a few treat catches, with the camera locked off and the same framing throughout.
- Options C to F all lead with the free meet & greet and use facts from the current `content/` files (as of October 2026).

## Adding another option

Make a new folder `option-i-<name>/` with an `index.html`. Add a screenshot pair to `thumbs/`. Copy one of the `<article class="opt">` blocks in `index.html` and point it at the new folder.
