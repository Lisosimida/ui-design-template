import { isRateLimited } from '@/lib/cloudflare/rate-limit'

export function isJobMatchRateLimited(userId: string): Promise<boolean> {
  return isRateLimited('JOB_MATCH_RATE_LIMITER', userId)
}
