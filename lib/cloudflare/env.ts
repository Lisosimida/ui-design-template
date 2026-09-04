import { getCloudflareContext } from '@opennextjs/cloudflare'

// Reads one binding/secret off the Cloudflare env, returning undefined when
// not running under the Cloudflare adapter (e.g. plain `next build`/Node) —
// callers fall back to process.env for local dev. Shared so the contact
// form, resume analysis, and rate limiting don't each hand-roll this.
export async function getCloudflareBinding<T>(name: string): Promise<T | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    return (env as Record<string, T | undefined>)[name]
  } catch {
    return undefined
  }
}
