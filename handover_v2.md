# Handover v2 — Resume-Parser SaaS Pivot

Last updated: 2026-09-03, mid-session on ticket #4.

This supersedes `handover.md` in spirit but not in place — that file covers an **earlier, unrelated body of work** (a personal-portfolio visual redesign, pre-Pages-Router-removal, pre-both-pivots) and has been left untouched in git history. Don't merge the two; they're about different projects that happen to share a repo.

## What this repo actually is right now

This repo (`Lisosimida/ui-design-template`, branch `test`) is mid-pivot from a sellable UI template product into a **resume-parser SaaS**. The pivot decision, product scope, and every architecture call are recorded in the GitHub issue tracker, not in `CONTEXT.md` — that file is still the *old* template-business narrative and hasn't been rewritten yet (see Known follow-ups below). Don't trust `CONTEXT.md` for current direction; trust the issues.

- **Spec**: [#2](https://github.com/Lisosimida/ui-design-template/issues/2) — full problem statement, user stories, implementation/testing decisions, out-of-scope list.
- **Tickets**, in dependency order: [#3](https://github.com/Lisosimida/ui-design-template/issues/3) Auth foundation, [#4](https://github.com/Lisosimida/ui-design-template/issues/4) Observability foundation, [#5](https://github.com/Lisosimida/ui-design-template/issues/5) Resume upload/parse/feedback, [#6](https://github.com/Lisosimida/ui-design-template/issues/6) Resume history/delete, [#7](https://github.com/Lisosimida/ui-design-template/issues/7) Resume↔job match, [#8](https://github.com/Lisosimida/ui-design-template/issues/8) Marketing reskin, [#9](https://github.com/Lisosimida/ui-design-template/issues/9) CI/CD gate.

Two deliberate deviations from the original build brief (`saas-platform-build-brief.md`), both approved: **Cloudflare Workers** as host (not Vercel — this repo already deploys there via OpenNext), and **Cloudflare-native Queues/Rate Limiting/KV** instead of Upstash. Neither has been ADR-documented yet (also in Known follow-ups).

## Ticket status

- **#3 Auth foundation — done, committed, pushed.** Commit `b165f87` on `test`. Sign up/in/out via Supabase Auth, RLS-gated `resumes` table, gating middleware (since renamed — see below), Vitest introduced, 7 tests passing against a real cloud Supabase project (no local Docker available on this machine).
- **#4 Observability foundation — code complete, verified, code review clean, *not yet committed*.** Sentry (client+server) and PostHog wired, both fired a real test event/error and confirmed delivered — checked via an actual browser (network tab + a real client-side throw for Sentry, a real capture POST for PostHog), not just guessed. Code review came back with zero findings, and separately resolved an open worry: the installed `@sentry/nextjs` has explicit OpenNext/Cloudflare Workers detection built in (`getCloudflareRuntimeConfig`), so the server-side Sentry-on-Workers compatibility risk that's a known open issue upstream doesn't actually apply here. **Next action: commit + push this ticket**, same message style as `b165f87` in `git log`.
- **#5–#9 — not started.** #5 and #6/#7 are blocked on #4 landing; #8 and #9 are already unblocked (only needed #3).

## Environment setup — read this before doing anything

This machine has real quirks that will silently break things if you don't know about them. All discovered this session, none are obvious from the code alone.

1. **No Docker, no WSL2.** `supabase start` (local Supabase) doesn't work here. We use a real Supabase **cloud** dev project instead (`rassprkwzsyookujmlef`, already linked via `npx supabase link`). This is why the RLS/proxy tests hit a real network endpoint, not a local instance.

2. **Corporate TLS interception breaks Node's networking by default.** This laptop has Netskope + a CelcomDigi internal root CA doing HTTPS inspection. Windows trusts them; **Node.js does not**, by default — every `fetch`/`npx supabase`/`npm test` call that touches the internet fails with `SELF_SIGNED_CERT_IN_CHAIN` unless you set:
   ```
   $env:NODE_EXTRA_CA_CERTS = "C:\Users\200724\.node-corporate-ca\corporate-ca-bundle.pem"
   ```
   before running it. That bundle file already exists (exported once this session) — you don't need to regenerate it, just set the env var in each new PowerShell session. **This was never made permanent** (`setx`) — the user was asked and hasn't answered yet. Worth doing so it stops being a per-session chore.

3. **`git-bash`'s `fork()` is broken system-wide** (same corporate-security root cause, DLL rebasing issue) — any bash script that forks subprocesses fails with `Could not fork child process`. Use **PowerShell** for everything shell-related on this machine, not Bash. `bash -n` (syntax-check only, no fork) works fine if you ever need it.

4. **Credentials live in `.env.local`** (gitignored, already populated): Supabase URL/anon key, `NEXT_PUBLIC_SENTRY_DSN` + `SENTRY_ORG`/`SENTRY_PROJECT`, `NEXT_PUBLIC_POSTHOG_KEY` (+ empty `NEXT_PUBLIC_POSTHOG_HOST`, defaults to US cloud in code). None of these are secrets by design (see the comment in `instrumentation-client.ts` for why) — that's a deliberate architecture call, not an oversight. `.env.local.example` documents each one and where to get it. One gotcha already hit and fixed: PostHog's key must be the `phc_`-prefixed **Project API Key** — a `phs_`-prefixed key looked plausible but got a real 401 from PostHog's `/flags/` endpoint.

## To resume right now

```powershell
$env:NODE_EXTRA_CA_CERTS = "C:\Users\200724\.node-corporate-ca\corporate-ca-bundle.pem"
npx tsc --noEmit        # should exit 0
npm test                 # should be 7 passed (7)
npm run dev               # http://localhost:3000 — home page is still the old
                           # "Launchbase" template copy; /sign-in, /sign-up,
                           # /dashboard are the new product
```

Immediate next action: **commit + push ticket #4** (code review is already clean), then start ticket #5.

## Known follow-ups (flagged, not done — don't lose these)

- `CONTEXT.md` still describes the old template-business pivot. Needs a full rewrite to match the actual SaaS pivot, or it'll actively mislead whoever/whatever reads it next.
- Two stack deviations (Cloudflare over Vercel, Cloudflare-native over Upstash) should be recorded as ADRs — the original brief marked its stack "fixed, do not substitute without approval," so the reasoning should be on record somewhere durable, not just in this repo's issue comments.
- `next lint` is broken repo-wide (removed in Next.js 16; this repo's `lint` script predates the upgrade). There's an official codemod (`npx @next/codemod@canary next-lint-to-eslint-cli .`) but it refuses to run on a dirty git tree — run it once the working tree is clean, review the diff, don't just trust it blindly.
- `middleware.ts` → `proxy.ts` rename (Next.js 16 deprecated the old convention) already happened as part of ticket #4's work, not #3 — mentioned here so it isn't mistaken for scope creep if you're diffing against the ticket #3 description.
- `NODE_EXTRA_CA_CERTS` permanence — see Environment setup #2 above.
