import { PostHog } from 'posthog-node'

// Same non-secret NEXT_PUBLIC_ vars instrumentation-client.ts uses — no
// getCloudflareContext needed, Cloudflare exposes plain env vars through
// process.env same as sentry.server.config.ts already does for the DSN.
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) return

  const client = new PostHog(apiKey, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  })

  try {
    client.capture({ distinctId, event, properties })
    // Workers tears down the runtime once the response is sent, so flush
    // synchronously here rather than relying on posthog-node's own batching.
    await client.shutdown()
  } catch (err) {
    console.error('[posthog] failed to capture event:', event, err)
  }
}
