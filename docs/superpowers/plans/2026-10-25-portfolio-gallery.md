# Portfolio Gallery Implementation Plan

**Goal:** Apply the approved image-focused layout and softer Mist & Navy palette, verify it, and push to main.

**Architecture:** Keep existing content sources and animation logic. Add a reusable artwork component and a gallery with persistent category panels and native detail disclosures. Update the homepage composition and shared palette, preserving the brain and secondary routes.

**Tech Stack:** Next.js, React, TypeScript, CSS, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-25-portfolio-gallery-design.md`

## Constraints and review focus

- Exact approved palette; local imagery; Manrope and Geist Mono.
- Preserve facts, links, resume, brain behavior, and detailed walkthroughs.
- All entries remain reachable with keyboard navigation, hash links, and without JavaScript.
- Ruler positions must follow real scroll coordinates after disclosures and category changes.
- Mobile captions, controls, artwork, and expanded demos must fit at 320px.
- First paint uses the final palette; reduced motion and closed/hidden demos must not animate.

## Tasks

1. **Artwork:** Create `components/projects/ProjectArtwork.tsx` and `app/project-artwork.css`; add the existing Quantiv capture to public media. Export `ArtworkKind` and `ProjectArtwork({ kind })`. Preserve real assets and label illustrations.
2. **Gallery:** Replace `components/sections/Projects.tsx` with Work / Research / Awards panels using existing data, expandable titles, and lazy detailed walkthroughs. Preserve history/hash navigation and provide a no-script fallback.
3. **Page and palette:** Update `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/portfolio.css`, Hero, Columbia, and the ruler's gallery label. Match the compact preview while retaining the brain below the introduction.
4. **Verification:** Adapt animation tests to open the new disclosures. Add meaningful category/deep-link/content/image/mobile checks. Run lint, typecheck, production build, and relevant Playwright suites. Inspect desktop and mobile screenshots and obtain a focused code review.
5. **Delivery:** Inspect the final diff, commit the approved change, push main, and verify the remote revision.

The user has authorized implementation and push; execute directly in the existing clean checkout. Production source data stays unchanged. Artwork and test adaptations run independently while the gallery and layout are integrated.

## Completed verification

- Implemented all five tasks, with the final push following verification.
- Lint, TypeScript, and the production build pass.
- Initial browser suite passed 39 of 42 tests. The three failures were resolved: gallery scroll offset, corresponding ruler activation, and an obsolete assumption that adjacent gallery walkthroughs cannot both be visible. A production rerun passed all 10 affected tests, including the seven new gallery checks.
- Verified desktop and 320/390px layouts, reduced motion, first paint, brain behavior, complete content and links, category history, no-JavaScript fallback, and finite artwork playback.
- Resume and blog return successful responses. Independent review found no remaining high or medium issues.
- Existing portfolio data, contact/link configuration, resume, and brain rendering source are unchanged.
