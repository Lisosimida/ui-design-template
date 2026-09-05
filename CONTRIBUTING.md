# Contributing

## CI

`.github/workflows/ci.yml` runs on every PR (and on push to `prod`, the branch Cloudflare Workers Builds deploys to production from):

1. Spins up a fresh local Supabase stack (`supabase start`), which applies every migration in `supabase/migrations/` to a brand-new database. If a migration doesn't apply cleanly, this step fails the job — there's no separate "migration check" step, that's what this is.
2. Type-checks (`tsc --noEmit`).
3. Runs the Vitest suite (`npm test`) against that local stack — no secrets required, since it's a throwaway instance created fresh for the run.

This is a required status check on `prod` (repo Settings → Branches), so PRs into it can't merge with a red build.

## Deploys

Cloudflare Workers Builds watches `prod` and deploys on every push. The
dashboard's Deploy command is `npx wrangler deploy`, so a green build goes
straight to 100% production traffic automatically — no manual promotion
step. (It previously defaulted to `npx wrangler versions upload`, which
only uploads a version at 0% traffic and requires a separate
`wrangler versions deploy <id>@100` to go live; that's Cloudflare's
Gradual Deployments canary flow, switched off here since this project
has no canary-testing workflow to make it worth the extra step.)

## Database migrations

There are no down-migrations in `supabase/migrations/`, and none are required by tooling — this is a process rule, enforced by code review, not by CI:

**Every migration must ship with a documented reversal procedure**, either as a paired down-migration file or as a comment/PR-description note describing the manual steps to undo it (e.g. `drop table`, backfill-then-drop-column ordering, etc.). A reviewer should not approve a migration PR that doesn't say how to undo it.

This matters most for anything run against production once real user data exists — CI only proves a migration applies to an empty database, not that it's safe to reverse against a live one.
