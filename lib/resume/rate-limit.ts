import { isRateLimited } from '@/lib/cloudflare/rate-limit'

export function isResumeUploadRateLimited(userId: string): Promise<boolean> {
  return isRateLimited('RESUME_UPLOAD_RATE_LIMITER', userId)
}
