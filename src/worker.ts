// ---------------------------------------------------------------------------
// Cloudflare Worker entry point (wraps the Astro adapter's default handler).
//
// Every request goes through here (wrangler.jsonc: assets.run_worker_first),
// so we can tell search engines not to index the site when it is reached on a
// *.workers.dev address (the preview / branch URLs). The real domain is never
// affected, so nothing needs changing at go-live.
//
// Running first also means the old Weebly redirects must be handled here
// (see below).
// ---------------------------------------------------------------------------
import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { handle } from "@astrojs/cloudflare/handler";

const isPreviewHost = (url: string) => new URL(url).hostname.endsWith(".workers.dev");

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request: Request, env: any, ctx: any): Promise<Response> {
        // Old Weebly *.html addresses: ask the static assets layer directly so
        // the 301s in public/_redirects apply. (The adapter's handler strips
        // ".html" before looking up files, which would skip those rules.)
        let response: Response | undefined;
        if (new URL(request.url).pathname.endsWith(".html")) {
          const asset = await env.ASSETS.fetch(request);
          if (asset.status !== 404) response = asset;
        }
        response ??= await handle(manifest, app, request, env, ctx);
        if (!isPreviewHost(request.url)) return response;
        // Re-wrap so the headers are mutable, then mark as not for indexing.
        const res = new Response(response.body, response);
        res.headers.set("X-Robots-Tag", "noindex, nofollow");
        return res;
      },
    },
  };
}
