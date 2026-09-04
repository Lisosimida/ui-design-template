import { getCloudflareContext } from '@opennextjs/cloudflare'

// Runs `task` without making the caller wait for it. On Workers, code after
// the response is returned doesn't get to run unless the runtime is told to
// keep the request alive for it — `ctx.waitUntil` is that mechanism. Outside
// the Cloudflare adapter (e.g. `next dev`), there's no such teardown, so the
// promise is simply left to run; errors are the task's own responsibility to
// handle, since nothing here awaits or reports them.
export async function runInBackground(task: () => Promise<void>): Promise<void> {
  try {
    const { ctx } = await getCloudflareContext({ async: true })
    ctx.waitUntil(task())
  } catch {
    void task()
  }
}
