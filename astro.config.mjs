// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

// Marketing pages stay prerendered (fast, free static hosting on Cloudflare
// Pages). Only the Keystatic admin (`/keystatic`), its GitHub API routes, and
// the contact endpoint (`/api/contact`) render on-demand via the Cloudflare
// adapter — these set `export const prerender = false`.
export default defineConfig({
  site: "https://www.taketheleadservices.co.uk",
  output: "static",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react(), keystatic(), sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
