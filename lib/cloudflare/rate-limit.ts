import { getCloudflareBinding } from './env'

interface CloudflareRateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

// Fails open when the binding isn't available — local `next dev` doesn't
// proxy Rate Limiting bindings; a real Workers deploy always has the named
// binding (declared in wrangler.jsonc), so a missing binding only affects
// local dev. A *runtime* error from the binding itself (the service being
// briefly down, say) also fails open rather than blocking the request on an
// ancillary service's outage, but — unlike the missing-binding case —
// that's logged, since it's not expected. Shared by every rate-limited
// route (resume upload, job match) rather than each hand-rolling this.
export async function isRateLimited(bindingName: string, userId: string): Promise<boolean> {
  const limiter = await getCloudflareBinding<CloudflareRateLimiter>(bindingName)
  if (!limiter) return false

  try {
    const { success } = await limiter.limit({ key: userId })
    return !success
  } catch (err) {
    console.error(`[rate-limit] ${bindingName} call failed, allowing the request:`, err)
    return false
  }
}
