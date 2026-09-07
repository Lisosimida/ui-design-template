> **Superseded 2026-09-07.** This brief specs a Vercel/Stripe/Upstash/pgvector/
> Claude-API stack and leaves "which product" as an open decision. The repo
> instead shipped ResumeReview on Next.js + Supabase + Gemini + Cloudflare
> Workers (see the current `CONTEXT.md` at the repo root) with none of this
> brief's supporting infra (no billing, no Redis/QStash, no vector search).
> Kept here for history only; do not treat as current.

# Platform build brief

## 1. Stack (fixed, do not substitute without approval)

| Layer | Tool |
|---|---|
| Frontend + API | Next.js (App Router), TypeScript, deployed on Vercel |
| Database, auth, vector search | Supabase (Postgres + pgvector + Supabase Auth) |
| Cache / rate limit / background jobs | Upstash Redis + Upstash QStash |
| Payments | Stripe |
| Transactional email | Resend |
| DNS / CDN / WAF | Cloudflare (proxied in front of Vercel) |
| Domain registrar | Namecheap |
| Version control | GitHub |
| Product analytics | PostHog |
| Error tracking | Sentry |
| LLM | Claude API |

Do not introduce Clerk or Pinecone unless a specific requirement forces it (see section 7). Default is Supabase Auth and pgvector.

## 2. Architecture direction

Build a modular monolith: one Next.js app, one Supabase project per environment. No separate backend service, no microservices, until there is a measured reason to split (e.g. a workload that needs independent scaling or a separate team owns it). Background/slow work goes through Upstash QStash as jobs, not as separate services.

## 3. Request flow (implement in this order)

1. Request hits Cloudflare (DNS, CDN, WAF) → forwarded to Vercel.
2. Next.js middleware validates the Supabase Auth JWT (from cookie or Authorization header) before the request reaches any route handler or server action.
3. Route handler / server action executes business logic, queries Supabase.
4. Supabase Postgres enforces access control via Row Level Security (RLS) policies — this is the real security boundary, not application code.
5. For AI features: embed the query, run a pgvector similarity search scoped by RLS, build context, call the Claude API, stream the response back.
6. Response returns through the same chain to the browser.

## 4. Data and security requirements

- Every table with user data must have RLS policies enabled before it ships. No table goes to production auth-gated only in application code.
- All Stripe and other webhooks must verify signatures and be idempotent (store the event ID, skip duplicates on retry).
- Secrets (Stripe keys, Claude API key, Resend key) live in Vercel environment variables, never committed, never client-exposed unless explicitly a public key.

## 5. Supporting flows to build

- **Billing**: Stripe Checkout → webhook → update `subscriptions` table in Supabase → app reads that table to gate features. No feature gating logic duplicated elsewhere.
- **Email**: triggered from server actions or webhook handlers via Resend. No queue needed unless volume requires it later.
- **RAG ingestion**: file upload → text extraction → embedding → write to pgvector. If embedding is slow, push to a QStash job instead of blocking the request.
- **Observability**: Sentry SDK on client and server from day one. PostHog SDK firing key product events (signup, upgrade, core feature use) from day one, not bolted on later.

## 6. Environments

Three environments minimum: dev, staging, production.
- Separate Supabase project per environment.
- Separate Stripe keys (test vs live).
- Vercel preview deployments (per PR) serve as the staging tier — do not build a fourth environment for this.

## 7. CI/CD

GitHub → Vercel: push to branch gets a preview deployment with its own env vars; merge to main auto-deploys production. Add a GitHub Action only for what Vercel doesn't cover: running the test suite (block merge on failure) and checking Supabase migrations apply cleanly.

## 8. Rollback

- App rollback: instant via Vercel's previous deployment (redeploy prior build).
- Database rollback: Supabase schema migrations are not automatically reversible. Every migration must ship with a documented down-migration or manual reversal procedure before it runs against production, not written after the fact.

## 9. Open decisions (confirm before building)

- Which product this platform serves (resume-parser SaaS / vertical RAG product / Florrari) — determines the domain schema and core feature set. Not yet fixed.
- Whether enterprise SSO is a near-term requirement — if yes, keep Clerk instead of Supabase Auth; if no, use Supabase Auth only.
- Expected vector volume — if it will clearly exceed a few million vectors, plan the Pinecone migration path now; otherwise build on pgvector.
