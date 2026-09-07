> **Superseded 2026-09-07.** This document describes a "sellable generic UI
> template" pivot that was never carried out — the repo instead became the
> ResumeReview resume-parser SaaS (see the current `CONTEXT.md` at the repo
> root). Kept here for history only; do not treat as current.

# Project Context

## What this project actually is

This repository started as Li Soh's personal AI-Engineer portfolio (Next.js Pages Router, Tailwind, framer-motion, deployed to Cloudflare Workers via OpenNext). It is being **repurposed into a sellable, general-purpose UI design template** for organizations that need a product-launch page or an event-landing page. This is a pivot in purpose, not just a visual refresh — the personal content (resume, real project screenshots, AI-engineer copy) goes away in favor of generic, config-driven, swappable content aimed at a paying template market.

## Target audience / market

- Buyers are **organizations** building a product-launch or event-landing page — not recruiters, not a personal-brand audience.
- Two delivery paths, both wanted:
  1. **Self-serve**: a public demo the user hosts (marketplace-style — buyers see it, then get/customize their own copy).
  2. **Bespoke**: the user personally customizes a copy for individual client organizations.
- "Delivered end-to-end" for *this* build = the template is fully built, genericized, config-driven, and **live on the existing Cloudflare Workers deployment as the public demo**. No licensing/client-management tooling is in scope now — the bespoke path is expected to fall out naturally once the site is config-driven (clone + edit config per client).

## Product shape

- **One flexible template**, not two separate products — a shared design system with **swappable sections**, rather than a hard fork into "product template" vs "event template."
- The live demo shows this duality via **two separate, fully-populated demo pages** (e.g. `/demo/product` and `/demo/event`), each with realistic **fictional** content (invented by the builder — no real company/event names), linked from a simple showcase landing page. Rejected alternative: a single page with a mode-toggle switcher (less convincing to an evaluating buyer, more fragile to build).
- The demo includes a visible **"Get this template" CTA** that routes to a contact form, reusing the existing Resend-backed `Contact`/`EmailSection` components — without this, the delivery doesn't actually close the loop to a sale, which is the point of the pivot.

## Section/module inventory (v1)

Grounded in research on current best-selling ThemeForest/Framer/Webflow product and event templates (see Research findings below).

**Shared core**: Hero, About/Value-prop, Gallery, Contact/Footer.

**Product-specific modules**:
- Social-proof/logo band (placed immediately after hero)
- Features, as a **bento grid** (not icon rows)
- How-it-works (steps)
- Tiered pricing (transparent, middle tier emphasized)
- Testimonials
- Single-action final CTA

**Event-specific modules**:
- Hero with date/location + countdown
- Speakers/lineup grid
- Tabbed agenda/schedule
- Venue/map
- Tickets/RSVP (tiered)
- Sponsor logo strip

## Visual direction

- The current "playful paper/scrapbook" theme (from the most recent commit prior to this pivot) is **not** the template's baseline look — it's a personal-portfolio experiment, too narrow/niche for a template sold broadly to organizations. It may be kept as an optional alt-theme later if cheap to preserve, but it is not the default.
- New baseline direction goes **all-in** on current (2025–2026) market trends rather than a light-touch modernization, since "market compatible" was the explicit point of this pivot:
  - Bento-grid feature layouts
  - Bold/expressive display type paired with a quiet neutral body font
  - Dark mode as a **low-light default** (muted charcoal, not pure black, not toggle-only)
  - Visible scroll-triggered / micro-interaction motion, treated as a real feature (not decoration)

## Technical architecture

- **Config-driven content**: all swappable content (copy, images, colors, section on/off, links) moves out of hardcoded component code (e.g. `components/Project.jsx`'s `projectData`, the copy baked into `pages/index.js`) into a config layer (e.g. `site.config.js`/JSON) that components read from. This is close to a requirement for something sellable as a "template" — a buyer customizes via config, never touching component logic.
- **Migrate Pages Router → App Router.** This reopens an earlier assumption: research explicitly flagged Pages-Router-only templates as declining/outdated, with App Router + React + Tailwind now the de facto expected baseline for credible dev-facing templates. Since buyers here include technical teams/agencies who will judge the codebase itself, this migration is in scope for this build (cheaper now than retrofitting after the redesign is built on Pages Router).
- Otherwise, keep the existing stack: Next.js, Tailwind, framer-motion, Cloudflare Workers deployment (via OpenNext/Wrangler). The pivot doesn't justify a broader rewrite.

## Preserving the existing personal content

- Before the personal portfolio content is overwritten, **tag the current commit** (e.g. `git tag pre-template-pivot`) so it stays recoverable. No separate branch or external redeploy needed.
- The existing Cloudflare Workers deployment will be **repurposed in place** to serve the new template demo — it is not being kept live as the personal portfolio elsewhere. (Confirmed: acceptable to overwrite; the git tag is the safety net.)

## Research findings (grounding "market compatible")

Sources: ThemeForest ("Eventer," "Appilo"), Framer Marketplace ("Grovia," "Suprema," "Lunera"), Webflow ("Aura," "Evento"), Envato Elements event-template category.

- Winning product pages: hero → social-proof band → benefits → bento-grid features → how-it-works → tiered pricing → testimonials → FAQ → single-action CTA.
- Winning event pages: hero+countdown → speakers grid → tabbed agenda → venue/map → tickets → sponsor strip → FAQ.
- Design trends: bento grids, bold display type + quiet body font, low-light dark-mode default, visible scroll/micro-interaction motion as a marketed feature.
- What buyers actually complain about: templates that all look the same, code bloat, thin documentation. Clean code + genuine visual distinctiveness + good docs are the real differentiators — more than chasing any single trend.
- Stack: Next.js (App Router) + Tailwind is the current expected baseline for dev-facing templates; Framer/Webflow dominate the no-code buyer segment but aren't required here.

## Open / deferred (not blocking this build)

- Whether to keep the scrapbook theme as an optional alt-theme — a build-time nice-to-have, not a scope decision.
- Licensing/access-control tooling for the bespoke-client path — explicitly out of scope for this delivery; revisit only if actually needed later.
