# Ken Cheng Personal Website

F1-themed portfolio for recruiters and engineers, built with Next.js 16,
TypeScript, Tailwind CSS, Framer Motion, MDX, and Resend.

## Local Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Environment

Create `.env.local`:

```bash
RESEND_API_KEY=...
CONTACT_TO_EMAIL=kc3843@columbia.edu
CONTACT_FROM_EMAIL="Ken Cheng Portfolio <onboarding@resend.dev>"
```

`CONTACT_FROM_EMAIL` can stay on `onboarding@resend.dev` during early testing.
Use a verified Resend domain before production launch.

## Content

Blog posts live in `content/blog/*.mdx` with frontmatter:

```mdx
---
title: "Post title"
date: "2026-05-07"
summary: "Short index summary."
tags: ["ML", "Systems"]
---

Post content.
```

Project and experience copy lives in typed files under `content/`.

## Assets

The resume download is served from:

```text
public/resume/Ken_Cheng_Resume.pdf
```

Image placeholders are already wired for:

```text
public/images/embers/cover.png
public/images/quantiv/cover.png
public/images/gc-inf/cover.png
public/images/vrp/cover.png
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Manual checks: first-session lights-out intro and skip button, mobile nav drawer,
resume download, blog empty state plus a sample MDX post, and contact form
success/error states with Resend env vars configured.
