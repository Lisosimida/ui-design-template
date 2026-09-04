import { getCloudflareBinding } from '@/lib/cloudflare/env'

// Unlike the Supabase anon key or the Sentry/PostHog identifiers, this key
// really is a secret (it authenticates billed API calls) — set via
// `wrangler secret put ANTHROPIC_API_KEY` in production. `wrangler secret
// put` values never appear in wrangler.jsonc, so they're read generically
// (see lib/cloudflare/env.ts) rather than via the `cf-typegen`-generated
// CloudflareEnv interface, which only covers declared bindings.
export async function getAnthropicApiKey(): Promise<string | undefined> {
  return (await getCloudflareBinding<string>('ANTHROPIC_API_KEY')) ?? process.env.ANTHROPIC_API_KEY
}
