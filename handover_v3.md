# Handover v3 — Resume-Parser SaaS, tickets #5–#8 shipped

Last updated: 2026-09-04, end of session. Supersedes `handover_v2.md` in spirit but not in place — that file is left untouched in git history per its own note about `handover.md`. Read this one first; only fall back to v2 for environment-setup details this file doesn't repeat, and don't trust either for ticket status — trust the GitHub issues and the git log.

## What changed since v2

v2 ended with ticket #4 (observability) just committed and #5 about to start. This session implemented #5, #6, #7, and most of #8, end to end, with live verification and code review on each. Everything below is pushed to `origin/test` as of commit `8597087`.

## Ticket status

- **#3 Auth foundation, #4 Observability — done** (unchanged from v2).
- **#5 Resume upload, AI parsing, and feedback — done.** Upload a PDF/DOCX from the dashboard, get AI-structured data (skills/experience/education) + written feedback (clarity/impact/gaps), persisted to the RLS-protected `resumes` table.
  - **The AI backend is not Claude.** The ticket spec calls for the Claude API, but the user doesn't have Anthropic API billing set up (only a Claude.ai Pro subscription, which doesn't include API access — confirmed and explained this session). By explicit user request, went Claude → local Ollama → **Google Gemini**, landing on Gemini because it has a genuinely free tier with no billing setup. This is a deliberate, discussed deviation from the ticket spec, not an oversight — flagged here again because it's easy to miss on a skim.
  - Gemini wiring: `lib/gemini/generate.ts` (shared structured-output call, extracted during #7's code review), `lib/gemini/client.ts` (`getGeminiApiKey`/`getGeminiModel`). Default model is **`gemini-3.6-flash`** — not the newest (`gemini-3.8-flash`, which was hitting real, repeated `503 UNAVAILABLE`/high-demand errors when tried) and not `gemini-2.5-flash` (a hard 404 for new users now — Google deprecated it mid-session). If resume analysis or job matching starts failing with a model error, that's the first thing to check — these model names rotate.
  - `GEMINI_API_KEY` is a real secret (unlike the Supabase anon key etc.) — set in `.env.local` for local dev already; needs `wrangler secret put GEMINI_API_KEY` for a real deploy. Not committed anywhere.
  - Free-tier caveat (documented in `.env.local.example`): Google's own pricing page states free-tier content is "used to improve our products." Real uploaded resumes go through this. Fine for testing, worth revisiting before real users' data goes through it.
- **#6 Resume history and delete — done.** Dashboard lists all of a user's resumes (newest first) with full feedback, each with a Delete button (behind a `window.confirm()`). `DELETE /api/resumes/[id]` is RLS-scoped — deleting someone else's resume 404s rather than erroring.
- **#7 Resume ↔ job-description match — done.** Paste a job description, pick one of your resumes from a dropdown, get a fit score (0–100) + summary + strengths + gaps + recommendations. `POST /api/resumes/[id]/match`. Computed at request time from the resume's already-extracted text — no embeddings, nothing persisted beyond the response, per the ticket's explicit constraint.
- **#8 Marketing page reskin — done.** Homepage (`app/page.js`) rebuilt with real resume-parser copy and working sign-up/sign-in CTAs, reusing the existing config-driven component system (`Hero`, `FeaturesBento`, `HowItWorks`, `FinalCta`). `/demo/event` and its dedicated components (`components/event/*`, `config/event.js`) are deleted — confirmed via a live `GET` that it now 404s. `/demo/product` is deliberately left alone; the ticket's acceptance criteria only named the event demo.
- **#9 CI/CD gate — not started.** No `.github/workflows` exist. This is the only ticket left from the original spec.

## Architecture notes worth knowing

- **Shared helpers introduced this session** (mostly extracted during code review, not planned upfront — look here before adding a new API route so you don't re-duplicate what's already been pulled out twice):
  - `lib/gemini/generate.ts` — the actual Gemini call/parse/validate logic, shared by resume analysis and job matching. Takes the caller's own `Error` subclass so `ResumeAnalysisError` and `JobMatchError` stay genuinely distinct classes.
  - `lib/cloudflare/rate-limit.ts` — generic Cloudflare Rate Limiting binding lookup; `lib/resume/rate-limit.ts` and `lib/match/rate-limit.ts` are now thin wrappers. Two bindings exist in `wrangler.jsonc`: `RESUME_UPLOAD_RATE_LIMITER`, `JOB_MATCH_RATE_LIMITER`.
  - `lib/supabase/route.ts` — `getRequestUser(request)` (client + `auth.getUser()` in one step) and `invalidResumeIdResponse(error)` (malformed-UUID Postgres error → 400), shared by every `/api/resumes*` route.
  - `app/dashboard/fetch-json.ts` — shared client-side fetch/parse/error-handling, used by `ResumeDashboard.tsx` and `JobMatchForm.tsx`.
- **`app/dashboard/ResumeDashboard.tsx` owns the resume list as local React state**, updated directly by upload/delete (not `router.refresh()`). This was a real bug fix mid-session: an earlier version split "just-uploaded result" and "history list" into two components synced via `router.refresh()`, which left a stale duplicate resume on screen after deleting it. `JobMatchForm.tsx` is rendered *inside* `ResumeDashboard`, fed by that same state — not as a sibling fed by a separate static fetch — for the identical reason (a second copy would drift the same way; this one got caught by code review before it shipped).
- **Postgres columns `parsed_data`/`feedback`/`extracted_text` are nullable jsonb/text.** `app/dashboard/types.ts` types the raw DB row honestly (nullable) and filters to complete rows before rendering, rather than force-casting. If you add a new insert path for `resumes`, make sure it either sets all of these or accepts that incomplete rows get silently filtered out of the dashboard list.
- **Testing convention, established in #5 and followed since**: route handlers read cookies straight off `NextRequest` via `lib/supabase/route.ts` (not `next/headers`), so they're callable directly in Vitest with no live Next.js request context. Every new route handler this session got a test file that signs in a real user against the real test Supabase project, and mocks only the Gemini SDK boundary (`vi.mock('@google/genai', ...)`). 32 tests across 6 files, all passing.

## Environment setup — still true from v2, one addition

Everything in v2's "Environment setup" section (no Docker, corporate TLS interception needing `NODE_EXTRA_CA_CERTS`, git-bash's broken `fork()`) is still accurate and still not made permanent — same per-session `$env:NODE_EXTRA_CA_CERTS = "C:\Users\200724\.node-corporate-ca\corporate-ca-bundle.pem"` chore.

**New this session: browser automation (Claude-in-Chrome) was unreliable on this machine.** Clicks frequently didn't register (silently — no error, just no effect), across multiple tickets, with no clear pattern. Workarounds that helped:
- `find`-based refs worked more often than raw coordinate clicks, but not reliably.
- Keyboard `Return` to submit a form worked when clicking the submit button didn't.
- For cases where nothing else worked, injecting values via `javascript_tool` using the native `HTMLInputElement`/`HTMLTextAreaElement` value setter + dispatching an `input` event (so React's controlled state picks it up), then calling `form.requestSubmit()` directly, was the most reliable path.
- **Chrome autofilled a real saved credential** (`guanlisoh20@gmail.com`, presumably the user's own) into the `/sign-in` form on page load, unprompted, multiple times across the session. Never submitted — always overwritten with the test account first, or the tab was closed instead of risking it. Worth checking Chrome's saved passwords for `localhost:3000` if that's unexpected.
- If browser verification is fighting you like this again, don't burn turns on it — a direct script that imports and calls the route handler / library function (see how the Gemini model choice was verified: a throwaway `describe.skip`-free Vitest test, run once, deleted after) is a faster, equally trustworthy substitute for exercising real logic against real services.

## To resume right now

```powershell
$env:NODE_EXTRA_CA_CERTS = "C:\Users\200724\.node-corporate-ca\corporate-ca-bundle.pem"
npx tsc --noEmit        # should exit 0
npm test                 # should be 32 passed (32) across 6 files
npm run dev               # http://localhost:3000 — real homepage now, not Launchbase;
                           # /sign-in, /sign-up, /dashboard are the product;
                           # /demo/product still exists (old template demo, unlinked)
```

A working `GEMINI_API_KEY` is already in `.env.local` — resume upload and job matching will actually call the live Gemini API when tested manually (the automated tests mock this; manual browser/script testing does not).

Immediate next action: **ticket #9 (CI/CD gate)** is the only ticket left. Otherwise, the user mentioned wanting to explore a visual redesign via a Claude-generated Artifact mockup before implementing it for real — that's a distinct, not-yet-started conversation, unrelated to any numbered ticket.

## Known follow-ups (flagged, not done — carried over or new)

- `CONTEXT.md` and `README.md` still describe the old Launchbase template business, not the resume-parser pivot. Flagged in v2, still true, still not addressed — nobody has rewritten either.
- The two stack-deviation ADRs (Cloudflare over Vercel, Cloudflare-native over Upstash) from v2 are still not written.
- **New deviation not yet ADR'd either**: Claude → Gemini for the AI backend, for the reasons above. If this project ever gets a "why did we deviate from the spec" document, this needs to be in it alongside the Cloudflare ones.
- `next lint` is still broken repo-wide (v2's note about the Next.js 16 codemod still applies, still not run).
- `/demo/product` still exists, serving old fictional "Nimbus" SaaS template content, unlinked from anything real. Ticket #8's acceptance criteria didn't call for removing it, so it wasn't touched, but it's the same kind of stale leftover `/demo/event` was.
- `NODE_EXTRA_CA_CERTS` permanence — still an open question from v2, still not answered, still a per-session `$env:` line.
- No rate-limit test coverage exists for either `RESUME_UPLOAD_RATE_LIMITER` or `JOB_MATCH_RATE_LIMITER` — both fail open when the binding is missing (expected in local dev), but the 429 path itself has never been exercised by a test, in this session or before it. Not a regression, just never covered.
