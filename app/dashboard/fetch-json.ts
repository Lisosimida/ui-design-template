// Shared by every dashboard client component that submits a request and
// expects a JSON body back (upload, delete, job match) — each previously
// hand-rolled the same fetch/parse/ok-check/catch shape with the same
// generic fallback messages.
export type FetchJsonResult<T> = { ok: true; data: T } | { ok: false; error: string }

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<FetchJsonResult<T>> {
  try {
    const response = await fetch(input, init)
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return { ok: false, error: data.error ?? 'Something went wrong. Please try again.' }
    }

    return { ok: true, data: data as T }
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' }
  }
}
