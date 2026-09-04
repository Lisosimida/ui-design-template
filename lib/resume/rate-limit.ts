import { getCloudflareBinding } from '@/lib/cloudflare/env'

interface CloudflareRateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

// Fails open when the binding isn't available — local `next dev` doesn't
// proxy Rate Limiting bindings; a real Workers deploy always has
// RESUME_UPLOAD_RATE_LIMITER (declared in wrangler.jsonc), so a missing
// binding only affects local dev. A *runtime* error from the binding itself
// (the service being briefly down, say) also fails open rather than
// blocking uploads on an ancillary service's outage, but — unlike the
// missing-binding case — that's logged, since it's not expected.
export async function isResumeUploadRateLimited(userId: string): Promise<boolean> {
  const limiter = await getCloudflareBinding<CloudflareRateLimiter>('RESUME_UPLOAD_RATE_LIMITER')
  if (!limiter) return false

  try {
    const { success } = await limiter.limit({ key: userId })
    return !success
  } catch (err) {
    console.error('[resumes] Rate limiter call failed, allowing the request:', err)
    return false
  }
}
