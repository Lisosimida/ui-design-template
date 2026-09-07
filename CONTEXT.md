# Project Context

## What this project actually is

**ResumeReview** — an AI-powered resume review SaaS. A user signs up, uploads
a PDF or DOCX resume, and gets back structured, specific feedback (clarity,
impact, "worth fixing" gaps) plus an extracted breakdown of skills,
experience, and education. A separate job-match feature lets the user paste
a job description against one of their uploaded resumes and get a fit score
with strengths/gaps/recommendations.

Two prior planning documents in this repo (`archive/CONTEXT-2026-09-02-ui-template-pivot.md`,
describing a pivot to a sellable generic UI template, and
`archive/saas-platform-build-brief-2026-09-03.md`, speccing a different
Vercel/Stripe/Upstash/pgvector stack) were **never carried out** — this file
replaces both as of 2026-09-07. Treat the archived files as history only.

## Domain vocabulary

- **Resume** — one uploaded file, owned by exactly one user (RLS-scoped).
  Holds `original_filename`, `extracted_text`, `parsed_data` (skills,
  experience, education), and `feedback` (clarity, impact, gaps).
- **Feedback** — the qualitative review Gemini produces for a resume on
  upload: clarity notes, impact notes, and a gaps/"worth fixing" list. Not
  a numeric score today.
- **Job match** — a one-shot comparison of a specific resume against a
  pasted job description: a `fitScore` (0-100), summary, strengths, gaps,
  recommendations. Currently **not persisted** — computed and shown once,
  lost on refresh (see Open/deferred).
- **Resume Lab** — the in-app codename/eyebrow badge shown on the upload
  and results screens; the external product/brand name is **ResumeReview**.
  Don't conflate the two in copy — "Resume Lab" is flavor text, not the
  product name.

## Technical architecture (as actually shipped)

| Layer | Tool |
|---|---|
| Frontend + API | Next.js (App Router), mixed TS/JS, deployed on **Cloudflare Workers** via `@opennextjs/cloudflare` + Wrangler |
| Database, auth | Supabase (Postgres + Supabase Auth), **Row Level Security** as the real access-control boundary |
| LLM | **Gemini** (not Claude, not OpenAI) — `GEMINI_API_KEY` / `GEMINI_MODEL` |
| Analytics | PostHog |
| Error tracking | Sentry |
| Email | Resend (present as a dependency; used by the legacy contact form, not the resume flow) |
| Tests | Vitest — integration tests hit a **real** Supabase project (`tests/*.test.ts`), not mocks |

Not present, and not to be introduced without a real requirement: Stripe/billing,
Redis/QStash, pgvector/vector search, Clerk. No enterprise SSO.

Auth flow: Supabase Auth (email/password) → session cookie → RLS scopes every
query to `user_id` automatically (see `supabase/migrations` and
`tests/rls.test.ts`) — route handlers don't add `.eq('user_id', ...)` manually.

## Current UI (as of 2026-09-07)

The whole app was just redesigned end-to-end into the "Resume Lab" visual
system — cream/paper background with a dot-grid, thick ink borders, hard
offset ("sticker") drop shadows, hand-drawn squiggle underlines, an
orange/blue/lime/pink OKLCH accent palette, Space Grotesk (display) + Plus
Jakarta Sans (body). Lives in `styles/resume-lab.css` (the `.resume-lab`
scope) plus `components/resume-lab/*` (landing: Navbar, Hero, Features,
HowItWorks, FinalCta, Footer) and the existing `app/dashboard/ResumeDashboard.tsx`
/ `JobMatchForm.tsx`, which originated the look. Auth pages and the dashboard
shell were brought in line with it in the same pass. Motion (button
press-physics, card hover-lift, scroll-reveal easing) was polished afterward;
`prefers-reduced-motion` is respected throughout.

**`app/demo/product` is unrelated legacy scaffolding** — an older generic
"Launchbase" template demo (its own Navbar/Hero/FeaturesBento components
under `components/`, not `components/resume-lab/`), predating the resume
SaaS pivot. Not linked from the real product experience; left untouched by
the redesign on purpose so as not to break an unrelated demo page.

## Shipped so far

Per `archive/`-adjacent handover notes and git history: resume upload +
Gemini parsing, resume history + delete, resume-to-job-description matching,
CI (tests + migration check on every PR), production deploy on Cloudflare
Workers.

## Open / deferred (not blocking, scoped but not built)

- **Job-match history** — persist past job-match runs instead of losing them
  on refresh. Needs a new `job_matches` table + list endpoint. Cheapest of
  the three, recommended first.
- **Resume version comparison** — let a re-upload be tagged as a revision of
  an earlier resume and diff the feedback. Needs a resume-quality score
  independent of any job (doesn't exist yet) — a product decision, not just
  a migration. Needs its own spec pass before scoping further.
- **Live upload progress** — replace the decorative analyzing checklist with
  real backend-stage progress (polling a status endpoint, since Cloudflare
  Workers don't hold long-lived SSE connections well). Lowest priority —
  marginal UX gain for the added infra.
- **Job-platform browser extension** (in progress as of 2026-09-07, see the
  wayfinder map) — a companion extension that lets a user diagnose their
  resume against a job description found on LinkedIn/Glassdoor/JobStreet/etc.
  Recommended approach: text-selection + context-menu (platform-agnostic, no
  per-site DOM scraping, lower ToS exposure) over per-platform auto-detection.
  Open: auth handoff model (leaning API token), repo structure, platform
  priority.
