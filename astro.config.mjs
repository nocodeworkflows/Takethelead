// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static output deploys straight to Cloudflare Pages (free tier).
// The contact form is handled by a Cloudflare Pages Function in /functions.
export default defineConfig({
  site: "https://www.taketheleadservices.co.uk",
  output: "static",
  integrations: [sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
