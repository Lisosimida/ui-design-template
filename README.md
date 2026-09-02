# Launchbase

A config-driven Next.js (App Router) template for product-launch pages and event-landing pages. One shared component system, swappable content — see it populated two ways at `/demo/product` and `/demo/event`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the showcase landing page, or go straight to a demo:

- `/demo/product` — fictional SaaS launch page ("Nimbus")
- `/demo/event` — fictional conference page ("Converge Summit")

## Structure

- `app/` — routes (App Router). `app/page.js` is the showcase landing page; `app/demo/*` are the two populated demos; `app/api/contact/route.js` is the contact-form backend.
- `config/` — all swappable content. `site.js` is the showcase page's own content; `product.js` and `event.js` are the fictional demo content. **Customize a copy of this template by editing these files, not the components.**
- `components/shared/` — modules used by both verticals (About/value-prop, Gallery, pricing/ticket tiers, contact form, nav/footer building blocks).
- `components/product/` and `components/event/` — modules specific to each vertical (bento features, pricing, testimonials / countdown hero, speakers, agenda, venue).
- `styles/globals.css` + `tailwind.config.js` — design tokens. The whole site is a single low-light dark theme (no toggle); each demo sets its own accent color via a `data-accent` attribute rather than a separate palette.

## Contact form

The contact form (`components/shared/ContactForm.jsx`) posts to `app/api/contact/route.js`, which sends mail via [Resend](https://resend.com). Set `RESEND_API_KEY`:

- **Local dev**: add it to `.dev.vars` (used by `initOpenNextCloudflareForDev`, already wired in `next.config.js`) or a `.env.local`.
- **Cloudflare Workers deploy**: this project deploys via OpenNext/Wrangler, so set it as a Worker secret — `.env.local` is not read at runtime on Workers:
  ```bash
  npx wrangler secret put RESEND_API_KEY
  ```

The destination address is `contactEmail` in `config/site.js`. The `from` address in the route defaults to Resend's shared `onboarding@resend.dev` sender — swap it for your own verified sending domain before going live.

## Deploying

```bash
npm run deploy
```

Builds with `@opennextjs/cloudflare` and deploys via Wrangler (see `wrangler.jsonc`).
