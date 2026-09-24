# Ken Cheng: personal site

Portfolio and landing site for **kencheng.me**: Columbia CS, Creative Machines Lab,
projects (Quantiv, FDRE, Embers), research, publications, optional MDX posts, resume
download, and a contact form backed by **Resend**.

The UI is mostly bespoke CSS (see `app/globals.css`, `v2-*` layout) with
**Tailwind** used for PostCSS, theme tokens, and a few utilities. **Next.js
16** (App Router), **React 19**, and **TypeScript**. Blog posts use
**gray-matter** for front matter and **next-mdx-remote** to render MDX.

There is an **F1-inspired** hero (racing line + car silhouette), a **lights-out**
intro, starfield background, and **Vercel Analytics** in production.

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Build uses webpack (`next build --webpack`) per `package.json`.

## Environment

```bash
cp .env.example .env.local
```

| Variable             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `RESEND_API_KEY`     | API key for the contact form                 |
| `CONTACT_TO_EMAIL`  | Inbox that receives submissions              |
| `CONTACT_FROM_EMAIL` | Verified sender (domain or `onboarding@resend.dev` for tests) |

Set the same values in the Vercel project for production.

## Where content lives

| Area | Location |
| ---- | -------- |
| Site copy, links, resume path | `lib/site.ts` |
| Homepage sections (hero, about, projects, contact, etc.) | `components/sections/*.tsx`. Project metrics, descriptions, research, and publication records live in **`data/portfolio.ts`**. |
| Publications strip on the homepage | **`components/sections/BlogList.tsx`** (static list; links out to papers) |
| Long-form posts under `/blog` | **`content/blog/*.mdx`** (or `.md`) with YAML front matter |
| Contact API | `app/api/contact/route.ts` |

Example front matter for `content/blog/your-post.mdx`:

```mdx
---
title: "Post title"
date: "2026-05-07"
summary: "Short summary."
tags: ["ML", "Systems"]
---

Post body…
```

Static files (logos, project media, PDF resume, credentials) live under
**`public/`** (e.g. `public/resume/`, `public/images/`, `public/media/`). Paths
are referenced as URLs from `/…` in components and `lib/site.ts`.

The September 24, 2026 content sync uses the ML/data and software engineering
resumes for current metrics and dates, plus the quantitative resume for additional
experience. The main resume download is the ML/data version. Keep evaluation
qualifications with the results: Quantiv's 31% weighted MAE improvement is from
development validation; Amazon's comparison-time reduction is survey-based; FDRE
recall and latency figures describe specific benchmarks.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

## Deployment

Configured for **Vercel** (`vercel.json`). Add the Resend-related env vars in
the dashboard and redeploy after changes.

Browser checks use Playwright. Install its browser once with `pnpm exec playwright install chromium --only-shell`; `pnpm test:e2e` starts the local server when needed.

The hero uses a pre-rendered digit atlas and matching static rain/reduced-motion frames for its initial page load. After changing the brain artwork or its starting arrangement, regenerate all assets with `node scripts/generate-brain-posters.mjs`. The browser decodes the atlas once and draws small cached bitmaps, so artwork generation never blocks startup.

To inspect first-load animation frame timing and a frame-by-frame filmstrip, run a production server on port 3001, then `node scripts/profile-brain-startup.mjs /tmp/brain-audit 4`. The last argument sets CPU slowdown; use `1` for normal speed. `AUDIT_URL` overrides the server URL. Timing measurements and compositor recordings run separately to avoid screenshot overhead skewing the results.
