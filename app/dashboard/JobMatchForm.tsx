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
    <div className="rl-card" style={{ marginTop: 40, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, transform: 'rotate(-0.3deg)' }}>
      <div>
        <span className="rl-eyebrow" style={{ transform: 'none' }}>
          Job match
        </span>
        <h2 className="rl-display" style={{ margin: '12px 0 0', fontSize: 20, fontWeight: 700 }}>
          See how this resume fits a job posting
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--rl-muted)' }}>
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
            style={{
              borderRadius: 14,
              border: '2.5px solid var(--rl-ink)',
              background: 'var(--rl-surface)',
              color: 'var(--rl-ink)',
              padding: '12px 16px',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.original_filename}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--rl-muted)' }}>
          Job description
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            required
            rows={6}
            placeholder="Paste the job description here…"
            style={{
              borderRadius: 14,
              border: '2.5px solid var(--rl-ink)',
              background: 'var(--rl-surface)',
              color: 'var(--rl-ink)',
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: 14,
              resize: 'vertical',
            }}
          />
        </label>

        {error && (
          <p role="alert" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--rl-danger)' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={status === 'loading'} className="rl-btn rl-btn-primary" style={{ alignSelf: 'flex-start' }}>
          {status === 'loading' ? 'Comparing…' : 'Compare'}
        </button>
      </form>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '2px dashed oklch(22% 0.03 50 / 0.2)', paddingTop: 20 }}>
          <div>
            <span style={{ fontWeight: 700 }}>Fit score &mdash; </span>
            <span className="rl-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--rl-blue)' }}>
              {result.fitScore}
            </span>
            <span style={{ color: 'var(--rl-muted)' }}>/100</span>
          </div>

          <p style={{ margin: 0, fontSize: 14, color: 'var(--rl-muted)' }}>{result.summary}</p>

          {result.strengths.length > 0 && (
            <div>
              <span style={{ fontWeight: 700 }}>Strengths</span>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14, color: 'var(--rl-muted)' }}>
                {result.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {result.gaps.length > 0 && (
            <div>
              <span style={{ fontWeight: 700 }}>Gaps</span>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14, color: 'var(--rl-muted)' }}>
                {result.gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendations.length > 0 && (
            <div>
              <span style={{ fontWeight: 700 }}>Recommendations</span>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14, color: 'var(--rl-muted)' }}>
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
