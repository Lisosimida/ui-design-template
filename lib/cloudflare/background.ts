import { getCloudflareContext } from '@opennextjs/cloudflare'

// Runs `task` without making the caller wait for it. On Workers, code after
// the response is returned doesn't get to run unless the runtime is told to
// keep the request alive for it — `ctx.waitUntil` is that mechanism. Outside
// the Cloudflare adapter (e.g. `next dev`), there's no such teardown, so the
// promise is simply left to run; errors are the task's own responsibility to
// handle, since nothing here awaits or reports them.
export async function runInBackground(task: () => Promise<void>): Promise<void> {
  // Only context acquisition is expected to fail (outside the Cloudflare
  // adapter) — task() must run exactly once, so it's called after this
  // block, never inside the try, or a throw from waitUntil itself would
  // fall into the catch and run task() a second time.
  let ctx: { waitUntil: (promise: Promise<unknown>) => void } | undefined
  try {
    ;({ ctx } = await getCloudflareContext({ async: true }))
  } catch {
    // Not running under the Cloudflare adapter (e.g. plain `next build`/Node).
  }

  if (ctx) {
    ctx.waitUntil(task())
  } else {
    void task()
  }
}
