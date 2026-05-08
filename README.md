# Ken Cheng

Personal portfolio built with Next.js 16, TypeScript, Tailwind CSS, Framer
Motion, MDX, and Resend. The site uses an F1-inspired visual system with a
lights-out intro, telemetry-style sections, project cards, a resume download,
MDX blog support, and a contact form.

## Development

```bash
pnpm install
pnpm dev
```

The local site runs at `http://localhost:3000`.

## Environment

Copy the example env file and fill in local secrets:

```bash
cp .env.example .env.local
```

Required variables:

```env
RESEND_API_KEY=...
CONTACT_TO_EMAIL=kc3843@columbia.edu
CONTACT_FROM_EMAIL="Ken Cheng Portfolio <contact@kencheng.me>"
```

For local testing, `CONTACT_FROM_EMAIL` can use
`Ken Cheng Portfolio <onboarding@resend.dev>`. Production should use a sender
on a verified Resend domain.

## Content

Experience, projects, awards, and site metadata live in:

```text
content/
lib/site.ts
```

Blog posts live in `content/blog/*.mdx`:

```mdx
---
title: "Post title"
date: "2026-05-07"
summary: "Short summary."
tags: ["ML", "Systems"]
---

Post content.
```

## Assets

```text
public/resume/Ken_Cheng_Resume.pdf
public/images/embers/cover.png
public/images/quantiv/cover.png
public/images/gc-inf/cover.png
public/images/vrp/cover.png
```

Missing project images fall back to styled placeholders.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Deployment

The project is configured for Vercel with `vercel.json`. Add the same Resend
environment variables in Vercel project settings, then redeploy after changes.
