import { getCloudflareContext } from '@opennextjs/cloudflare'

// Reads one binding/secret off the Cloudflare env, returning undefined when
// not running under the Cloudflare adapter (e.g. plain `next build`/Node) —
// callers fall back to process.env for local dev. Shared by resume analysis
// (lib/gemini/client.ts) and rate limiting (lib/resume/rate-limit.ts); the
// pre-existing contact form (app/api/contact/route.js) has its own
// hand-rolled equivalent from before this helper existed and wasn't
// migrated to it.
export async function getCloudflareBinding<T>(name: string): Promise<T | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return (env as Record<string, T | undefined>)[name]
  } catch {
    return undefined
  }
}
