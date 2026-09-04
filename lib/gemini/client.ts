import { getCloudflareBinding } from '@/lib/cloudflare/env'

// A real secret (unlike the Ollama base URL it replaces) — set via
// `wrangler secret put GEMINI_API_KEY` in production. `wrangler secret put`
// values never appear in wrangler.jsonc, so this is read generically via
// lib/cloudflare/env.ts rather than the cf-typegen-generated CloudflareEnv
// interface, which only covers declared bindings.
export async function getGeminiApiKey(): Promise<string | undefined> {
  return (await getCloudflareBinding<string>('GEMINI_API_KEY')) ?? process.env.GEMINI_API_KEY
}

// gemini-3.8-flash is on the free tier (per ai.google.dev/gemini-api/docs/pricing)
// — overridable since the right model is a per-deployment choice, same as
// the Ollama model override it replaces.
export async function getGeminiModel(): Promise<string> {
  return (await getCloudflareBinding<string>('GEMINI_MODEL')) ?? process.env.GEMINI_MODEL ?? 'gemini-3.8-flash'
}
