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

## Editing content (Keystatic CMS)

The client edits content through a built-in CMS — **Keystatic** — with no code.

- **Admin URL:** `https://<your-site>/keystatic`
- **Login:** "Sign in with GitHub". The editor needs a GitHub account and must
  be a **collaborator on the repo** (write access). One-time setup.
- **How saving works:** every change is committed to this repo, which triggers
  a Cloudflare Pages rebuild. The live site updates ~1 minute later.

What's editable in the CMS (stored as JSON under [`/content`](./content)):

| Section | Where |
| --- | --- |
| Services (titles, copy, highlights, icon, order, homepage highlight) | Services collection |
| Reviews | Reviews collection |
| FAQs | FAQs collection |
| Phone, email, WhatsApp, hours, socials, areas label | Site settings |
| Areas covered (chips) | Areas covered |

Still in code (developer edits):

| What | File |
| --- | --- |
| "How it works" steps & "why us" differentiators (use icon keys) | `src/data/content.ts` |
| **All photos (Weebly URLs)** | `src/data/images.ts` |
| Navigation (auto-derived from Services) | `src/lib/content.ts` |
| Global styling / theme | `src/styles/global.css` |
| CMS schema (add/rename fields) | `keystatic.config.ts` |

The site reads CMS content at **build time** via the Keystatic Reader
(`src/lib/content.ts`), so all marketing pages stay fully static and fast.

### Local CMS editing (developer)

`keystatic.config.ts` uses **local storage in dev** and **GitHub storage in
production**. Run `npm run dev` and open `http://localhost:4321/keystatic` to
edit the local files directly (no login needed).

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

### Environment variables (Pages → Settings → Environment variables)

**Contact form email (Resend — free tier):**

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Your [Resend](https://resend.com) API key |
| `TO_EMAIL` | Where enquiries are delivered |
| `FROM_EMAIL` | A verified Resend sender on your domain |

Until these are set, submissions are accepted and logged (visible in the
Function logs) so the form keeps working — they just won't be emailed yet.

**Keystatic CMS (GitHub login):**

| Variable | Value |
| --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | From the Keystatic GitHub App |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | From the Keystatic GitHub App |
| `KEYSTATIC_SECRET` | A random string (e.g. `openssl rand -hex 32`) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The GitHub App's slug |

First-time CMS setup: deploy the site, visit `/keystatic`, and follow
Keystatic's prompt to **create a GitHub App** — it generates the client
ID/secret/app-slug above. Paste them into the Pages env vars and redeploy.
Then add the client as a repo collaborator; they sign in at `/keystatic` with
GitHub and can edit. (Docs: https://keystatic.com/docs/github-mode)

> **Note:** because this project uses the Astro Cloudflare adapter, the contact
> handler is an Astro endpoint at `src/pages/api/contact.ts` (not a
> `functions/` Pages Function). The adapter generates `dist/_routes.json`
> automatically so only `/api/*` and `/keystatic/*` hit the worker — everything
> else is served as static files.
