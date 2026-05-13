# Ken Cheng: personal site

Portfolio and landing site for **kencheng.dev**: Columbia CS, projects (Quantiv,
Embers, research, competitions), publications list, optional MDX posts, résumé
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
| Site copy, links, résumé path | `lib/site.ts` |
| Homepage sections (hero, about, projects, contact, etc.) | `components/sections/*.tsx`. Project cards and copy live in **`Projects.tsx`**. |
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

Static files (logos, project media, PDF résumé, credentials) live under
**`public/`** (e.g. `public/resume/`, `public/images/`, `public/media/`). Paths
are referenced as URLs from `/…` in components and `lib/site.ts`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Deployment

Configured for **Vercel** (`vercel.json`). Add the Resend-related env vars in
the dashboard and redeploy after changes.
