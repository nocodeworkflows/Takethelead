# Take The Lead Services — Astro site

A fast, mobile-first marketing site for Take The Lead Services (dog day care,
home boarding, walking, training & grooming across Surrey & Hampshire), built
with [Astro](https://astro.build) and designed to be **hosted free on
Cloudflare Pages**.

## Tech / approach

- **Astro** static output — ships almost no JavaScript, loads fast.
- **Cloudflare Pages** for free static hosting + **Pages Functions** for the
  contact form (`functions/api/contact.ts`).
- **Mobile-first & CRO focused**: sticky mobile call/book bar, persistent CTAs,
  trust signals, social proof, click-to-call, short conversion path.
- **SEO**: per-page titles/meta, Open Graph, `LocalBusiness` + `FAQPage`
  structured data, sitemap, canonical URLs.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview
```

> The contact form posts to `/api/contact`, which is a Cloudflare Pages
> Function. It only runs on Cloudflare (or via `wrangler pages dev`), not in
> `astro dev`. The form fails gracefully to phone/email if the endpoint isn't
> available.

## Editing content

Almost everything lives in a few files so it's easy to maintain:

| What | File |
| --- | --- |
| Business details, phone, email, services, nav, areas | `src/data/site.ts` |
| Reviews, FAQs, "how it works", differentiators | `src/data/content.ts` |
| **All photos (Weebly URLs)** | `src/data/images.ts` |
| Global styling / theme | `src/styles/global.css` |

### Images

Photos are hot-linked from the existing Weebly upload folder
(`https://www.taketheleadservices.co.uk/uploads/1/7/4/6/17463779/…`). To add
the real photos, open **`src/data/images.ts`** and replace each `FALLBACK`
with `weebly("filename.jpg")`. Get filenames by right-clicking a photo on the
live site → *Copy image address*. Any slot left as `FALLBACK` safely shows the
one known-good image, so nothing ever appears broken.

To use a self-hosted logo instead of the built-in SVG, drop the file in
`/public` and update `src/components/Logo.astro`.

## Deploy to Cloudflare Pages (free)

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Add the custom domain `www.taketheleadservices.co.uk`.

### Contact form email (Resend — free tier)

Set these environment variables in **Pages → Settings → Environment variables**:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Your [Resend](https://resend.com) API key |
| `TO_EMAIL` | Where enquiries are delivered |
| `FROM_EMAIL` | A verified Resend sender on your domain |

Until these are set, submissions are accepted and logged (visible in the
Function logs) so the form keeps working — they just won't be emailed yet.
