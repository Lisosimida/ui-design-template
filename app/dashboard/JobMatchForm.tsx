'use client'

import { useEffect, useState, type FormEvent } from 'react'
import type { StoredResume } from './types'
import type { JobMatch } from '@/lib/match/schema'
import { fetchJson } from './fetch-json'

export default function JobMatchForm({ resumes }: { resumes: StoredResume[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<JobMatch | null>(null)

  // Pins the selection to a specific resume once one exists, instead of
  // re-deriving "resumes[0]" on every render — the latter silently swapped
  // the effective selection to whatever the user had most recently uploaded
  // (new uploads are unshifted to the front in ResumeDashboard), changing
  // what Compare would run against without the user touching the dropdown.
  // Still falls back to the first resume if the pinned one gets deleted.
  useEffect(() => {
    if (selectedId !== null && resumes.some((resume) => resume.id === selectedId)) return
    setSelectedId(resumes[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumes])

  const resumeId = selectedId ?? ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!resumeId || !jobDescription.trim()) return

    setStatus('loading')
    setError(null)
    setResult(null)

    const response = await fetchJson<JobMatch>(`/api/resumes/${resumeId}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription }),
    })

    if (!response.ok) {
      setError(response.error)
      setStatus('error')
      return
    }

    setResult(response.data)
    setStatus('idle')
  }

  if (resumes.length === 0) return null

  return (
    <div className="card mt-10 flex flex-col gap-4 p-8">
      <div>
        <span className="eyebrow">Job match</span>
        <h2 className="mt-3 font-display text-xl font-bold text-fg">See how a resume fits a job posting</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Resume
          <select
            value={resumeId}
            onChange={(event) => {
              setSelectedId(event.target.value)
              // The result/error on screen describe the previous selection
              // — carrying them over would misattribute a stale fit score
              // (or error) to whichever resume is now picked.
              setResult(null)
              setError(null)
            }}
            className="rounded-xl border border-border/15 bg-surface-2 px-4 py-3 text-fg outline-none focus-visible:border-accent"
          >
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.original_filename}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Job description
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            required
            rows={6}
            placeholder="Paste the job description here…"
            className="rounded-xl border border-border/15 bg-surface-2 px-4 py-3 text-fg outline-none focus-visible:border-accent"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary self-start disabled:opacity-60">
          {status === 'loading' ? 'Comparing…' : 'Compare'}
        </button>
      </form>

      {result && (
        <div className="flex flex-col gap-4 border-t border-border/10 pt-6">
          <div>
            <span className="font-semibold text-fg">Fit score — </span>
            <span className="font-display text-2xl font-bold text-accent">{result.fitScore}</span>
            <span className="text-muted">/100</span>
          </div>

          <p className="text-sm text-muted">{result.summary}</p>

          {result.strengths.length > 0 && (
            <div>
              <span className="font-semibold text-fg">Strengths</span>
              <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                {result.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {result.gaps.length > 0 && (
            <div>
              <span className="font-semibold text-fg">Gaps</span>
              <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                {result.gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendations.length > 0 && (
            <div>
              <span className="font-semibold text-fg">Recommendations</span>
              <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
