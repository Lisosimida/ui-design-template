import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'

// The DSN and PostHog key below are not secrets — both are designed to ship
// in the browser bundle (Sentry DSNs only let someone *send* events to the
// project; PostHog client keys are scoped for exactly this). Same reasoning
// as the Supabase anon key: real protection lives on the project side, not
// in hiding these values.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    // `||` deliberately, not `??` — Next.js inlines an unset env var as ""
    // (not undefined), which `??` wouldn't fall back on, sending PostHog
    // requests to a relative "" host (i.e. this app's own origin) instead.
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  })
}
