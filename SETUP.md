# Keystatic CMS — one-time GitHub App setup

The Keystatic admin lives at **`/keystatic`** and saves changes by committing to
this GitHub repo. To log in, it needs a **GitHub App**.

> **Important:** Keystatic's built-in "Create GitHub App" wizard
> (`/api/keystatic/setup`) **only works when running locally in dev mode** — it
> cannot run on Cloudflare Workers. On the live site that route returns a 500,
> and "Login with GitHub" returns a 500 until the app + env vars exist. So we
> create the app **manually** on GitHub (below), then add the credentials to
> Cloudflare. This is a one-time setup.

Live URL used below:
`https://takethelead.damiankennedy-pt.workers.dev`

---

## 1. Create the GitHub App

Go to **https://github.com/settings/apps/new** and set:

| Field | Value |
| --- | --- |
| **GitHub App name** | `Take The Lead CMS` (any unique name) |
| **Homepage URL** | `https://takethelead.damiankennedy-pt.workers.dev` |
| **Callback URL** | `https://takethelead.damiankennedy-pt.workers.dev/api/keystatic/github/oauth/callback` |
| **Request user authorization (OAuth) during installation** | ✅ ticked |
| **Webhook → Active** | ☐ unticked |

**Permissions → Repository permissions:**

| Permission | Access |
| --- | --- |
| **Contents** | Read and write |
| **Metadata** | Read-only (auto-selected) |

**Where can this GitHub App be installed?** → *Only on this account*

Click **Create GitHub App**.

> Adding a custom domain later? Add a second Callback URL:
> `https://www.taketheleadservices.co.uk/api/keystatic/github/oauth/callback`

## 2. Collect the credentials

On the new app's settings page:

- Copy the **Client ID**.
- Click **Generate a new client secret** → copy it now (shown once).
- Note the **app slug** — the kebab-case name in the page URL
  (`github.com/settings/apps/<slug>`), e.g. `take-the-lead-cms`.

## 3. Install the app on the repo

App page → **Install App** (left menu) → install on **`nocodeworkflows/Takethelead`**
→ *Only select repositories* → choose this repo.

## 4. Add environment variables in Cloudflare

Cloudflare dashboard → your **`takethelead`** Worker → **Settings → Variables and
Secrets** → add:

| Name | Value | Type |
| --- | --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Client ID from step 2 | Secret |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Client secret from step 2 | Secret |
| `KEYSTATIC_SECRET` | A random string ≥ 32 chars — `openssl rand -hex 32` | Secret |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The app slug, e.g. `take-the-lead-cms` | Plaintext |

Notes:
- `KEYSTATIC_SECRET` **must be at least 32 characters** or login 500s.
- The three runtime vars are read from the Worker env at request time.
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is **inlined at build time** — see step 5.

## 5. Redeploy

Because `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is baked in during `npm run build`,
you **must trigger a new deploy** after setting it (push a commit, or use the
Cloudflare dashboard → Deployments → re-deploy).

## 6. Log in

Visit `https://takethelead.damiankennedy-pt.workers.dev/keystatic` →
**Sign in with GitHub** → authorise. You can now edit content; each save commits
to the repo and the site rebuilds automatically (~1 min).

---

## Giving the client access

The client needs to be a **collaborator** on `nocodeworkflows/Takethelead`
with **write** access (GitHub repo → Settings → Collaborators → Add people).
They then sign in at `/keystatic` with their own GitHub account.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| 500 on "Login with GitHub" | One of the 4 vars missing, or `KEYSTATIC_SECRET` < 32 chars. |
| 500 on `/api/keystatic/setup` | Expected — the creation wizard can't run on Workers. Use this manual flow. |
| `redirect_uri_mismatch` | Callback URL in the GitHub App must exactly match the deployed origin + `/api/keystatic/github/oauth/callback`. |
| Login works but "repo not found" | Install the GitHub App on `nocodeworkflows/Takethelead` (step 3). |
| Changed the slug but still failing | Redeploy — the slug is inlined at build time (step 5). |
