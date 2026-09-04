import { getCloudflareBinding } from '@/lib/cloudflare/env'

// A real secret (unlike the Ollama base URL it replaces) — set via
// `wrangler secret put GEMINI_API_KEY` in production. `wrangler secret put`
// values never appear in wrangler.jsonc, so this is read generically via
// lib/cloudflare/env.ts rather than the cf-typegen-generated CloudflareEnv
// interface, which only covers declared bindings.
export async function getGeminiApiKey(): Promise<string | undefined> {
  // `||`, not `??` — Next.js inlines an unset env var as "" (not undefined),
  // same gotcha documented in instrumentation-client.ts for PostHog's host.
  return (await getCloudflareBinding<string>('GEMINI_API_KEY')) || process.env.GEMINI_API_KEY || undefined
}

// gemini-3.6-flash is on the free tier (per ai.google.dev/gemini-api/docs/pricing)
// and verified working end-to-end against the real API — gemini-2.5-flash
// (an earlier default) is a hard 404 for new users now ("no longer
// available"), and gemini-3.8-flash (the newest) was hitting real, repeated
// 503 UNAVAILABLE/high-demand responses when this was picked. Overridable
// since the right model is a per-deployment/point-in-time choice.
export async function getGeminiModel(): Promise<string> {
  return (await getCloudflareBinding<string>('GEMINI_MODEL')) || process.env.GEMINI_MODEL || 'gemini-3.6-flash'
}
