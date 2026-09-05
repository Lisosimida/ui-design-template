'use client'

import { useCallback, useRef, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { useReducedMotion } from 'framer-motion'
import confetti from 'canvas-confetti'
import '@/styles/resume-lab.css'
import type { StoredResume } from './types'
import { fetchJson } from './fetch-json'
import JobMatchForm from './JobMatchForm'

// Owns the resume list as local state (seeded from the server's initial
// fetch) rather than re-fetching via router.refresh() after every upload or
// delete — a prior version kept the just-uploaded result in separate state
// from the list and used router.refresh(), which left a stale duplicate of
// the result on screen after the same resume was later deleted from the
// list. One state, updated directly by each action, can't drift like that.
// JobMatchForm's resume picker is rendered here (fed by this same state)
// rather than as a sibling fed by the server's static initial fetch, for
// the same reason — a separate copy would drift out of sync on upload/delete.

const TAG_PALETTE = ['orange', 'blue', 'lime', 'pink', 'surface'] as const
const TAG_TEXT_COLOR: Record<(typeof TAG_PALETTE)[number], string> = {
  orange: 'var(--rl-orange-ink)',
  blue: 'var(--rl-blue-fg)',
  lime: 'var(--rl-lime-ink)',
  pink: 'var(--rl-pink-ink)',
  surface: 'var(--rl-ink)',
}
const TIMELINE_PALETTE = ['blue', 'orange', 'lime', 'pink'] as const

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

function fireSuccessConfetti() {
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    origin: { y: 0.6 },
    colors: ['#e0742a', '#3a4fb0', '#c8e06e', '#e8a8b0'],
  })
}

export default function ResumeDashboard({ initialResumes }: { initialResumes: StoredResume[] }) {
  const [resumes, setResumes] = useState<StoredResume[]>(initialResumes)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [pendingFileName, setPendingFileName] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const errorKeyRef = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  async function uploadFile(file: File) {
    setStatus('loading')
    setError(null)
    setPendingFileName(file.name)

    const formData = new FormData()
    formData.append('file', file)

    const result = await fetchJson<StoredResume>('/api/resumes', { method: 'POST', body: formData })

    if (!result.ok) {
      errorKeyRef.current += 1
      setError(result.error)
      setStatus('error')
      return
    }

    setResumes((prev) => [result.data, ...prev])
    setStatus('idle')
    setPendingFileName(null)
    if (!shouldReduceMotion) fireSuccessConfetti()
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        errorKeyRef.current += 1
        setError('That file type isn’t supported — upload a PDF or DOCX.')
        setStatus('error')
        return
      }
      const file = acceptedFiles[0]
      if (file) void uploadFile(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldReduceMotion]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    disabled: status === 'loading',
  })

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return

    setDeletingId(id)
    setError(null)

    const result = await fetchJson<{ id: string }>(`/api/resumes/${id}`, { method: 'DELETE' })

    if (!result.ok) {
      errorKeyRef.current += 1
      setError(result.error)
    } else {
      setResumes((prev) => prev.filter((resume) => resume.id !== id))
    }

    setDeletingId(null)
  }

  return (
    <div className="resume-lab mt-10">
      <div className="rl-eyebrow">
        <SparkleIcon />
        Resume Lab
      </div>

      <div style={{ marginTop: 28 }}>
        <h1 className="rl-display" style={{ margin: 0, fontSize: 40, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.01em' }}>
          {status === 'loading' ? (
            'Reading between the lines…'
          ) : (
            <>
              Drop it like it&rsquo;s
              <br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                your GPA
                <svg width="220" height="14" viewBox="0 0 220 14" className="rl-squiggle-underline">
                  <path d="M2 10 C 40 2, 80 2, 110 8 S 180 14, 218 4" fill="none" stroke="var(--rl-orange)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </>
          )}
        </h1>
        <p style={{ margin: '18px 0 0', fontSize: 16, color: 'var(--rl-muted)', maxWidth: '46ch', fontWeight: 500 }}>
          {status === 'loading'
            ? `${pendingFileName ?? 'Your resume'} is in the lab. Hang tight.`
            : "PDF or DOCX. We'll read between the lines and tell you what's actually working."}
        </p>
      </div>

      {status === 'loading' ? (
        <div style={{ position: 'relative', marginTop: 36 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'var(--rl-ink)', borderRadius: 28, transform: 'rotate(1.2deg) translate(9px, 9px)' }}
          />
          <div
            className="rl-card"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22,
              padding: '52px 32px',
              borderRadius: 28,
              transform: 'rotate(-0.6deg)',
              overflow: 'hidden',
            }}
          >
            <div
              className="rl-scanbar"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 120,
                background: 'linear-gradient(180deg, transparent, oklch(68% 0.19 45 / 0.35), transparent)',
                pointerEvents: 'none',
              }}
            />
            <div
              className="rl-pulsebadge"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 76,
                height: 76,
                borderRadius: 999,
                background: 'var(--rl-blue)',
                border: '3px solid var(--rl-ink)',
                boxShadow: '5px 5px 0 var(--rl-ink)',
              }}
            >
              <SpinnerIcon color="var(--rl-blue-fg)" size={32} />
            </div>
            <p className="rl-display" style={{ position: 'relative', margin: 0, fontSize: 20, fontWeight: 700 }}>
              Scanning your skills, experience &amp; gaps
            </p>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', marginTop: 36 }} {...getRootProps()}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'var(--rl-ink)', borderRadius: 28, transform: 'rotate(1.2deg) translate(9px, 9px)' }}
          />
          <div
            className="rl-dropzone"
            data-drag-active={isDragActive && !isDragReject}
            data-drag-reject={isDragReject}
          >
            <input {...getInputProps()} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 76,
                height: 76,
                borderRadius: 999,
                background: 'var(--rl-orange)',
                border: '3px solid var(--rl-ink)',
                boxShadow: '5px 5px 0 var(--rl-ink)',
              }}
            >
              <CloudUploadIcon />
            </div>

            <div style={{ textAlign: 'center' }}>
              <p className="rl-display" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                {isDragReject ? 'PDF or DOCX only' : 'Drag & drop your resume'}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--rl-muted)', fontWeight: 500 }}>or browse from your computer</p>
            </div>

            <button type="button" onClick={open} disabled={status !== 'idle' && status !== 'error'} className="rl-btn rl-btn-primary">
              {status === 'error' ? 'Retry upload' : 'Browse files'}
              <ArrowRightIcon />
            </button>

            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--rl-muted)', fontWeight: 600 }}>Max 10MB &middot; PDF or DOCX</p>
          </div>

          <div
            className="rl-sticker"
            style={{ position: 'absolute', top: -18, right: -14, background: 'var(--rl-lime)', color: 'var(--rl-lime-ink)', transform: 'rotate(6deg)' }}
          >
            <LockIcon />
            Private &amp; yours only
          </div>

          <div
            className="rl-sticker"
            style={{ position: 'absolute', bottom: -16, left: -16, background: 'var(--rl-pink)', color: 'var(--rl-orange-ink)', transform: 'rotate(-5deg)' }}
          >
            <BoltIcon />
            Results in ~30 sec
          </div>
        </div>
      )}

      {error && (
        <div
          key={errorKeyRef.current}
          role="alert"
          className={`rl-card ${shouldReduceMotion ? '' : 'rl-shake'}`}
          style={{
            marginTop: status === 'loading' ? 20 : 48,
            padding: '16px 20px',
            borderColor: 'var(--rl-danger)',
            borderStyle: 'dashed',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: 'none',
          }}
        >
          <WarningIcon />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--rl-danger)' }}>{error}</p>
        </div>
      )}

      {resumes.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 48,
            paddingTop: 24,
            borderTop: '2px dashed oklch(22% 0.03 50 / 0.2)',
          }}
        >
          <HistoryIcon />
          <p style={{ margin: 0, fontSize: 13, color: 'var(--rl-muted)', fontWeight: 600 }}>
            Your uploaded resumes will show up here once you&rsquo;ve got one in.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 40 }}>
          {resumes.map((resume) => (
            <ResumeResultCard key={resume.id} resume={resume} onDelete={handleDelete} isDeleting={deletingId === resume.id} />
          ))}
        </div>
      )}

      <JobMatchForm resumes={resumes} />
    </div>
  )
}

function ResumeResultCard({
  resume,
  onDelete,
  isDeleting,
}: {
  resume: StoredResume
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  return (
    <div>
      <div className="rl-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'var(--rl-orange)',
              border: '2.5px solid var(--rl-ink)',
              flexShrink: 0,
            }}
          >
            <FileIcon />
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              className="rl-display"
              style={{ margin: 0, fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {resume.original_filename}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--rl-muted)', fontWeight: 600 }}>
              {new Date(resume.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(resume.id)}
          disabled={isDeleting}
          className="rl-btn rl-btn-danger"
          style={{ flexShrink: 0 }}
        >
          <TrashIcon />
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginTop: 24 }}>
        <div
          style={{
            padding: 22,
            background: 'var(--rl-blue)',
            color: 'var(--rl-blue-fg)',
            border: '3px solid var(--rl-ink)',
            borderRadius: 20,
            boxShadow: '5px 5px 0 var(--rl-ink)',
            transform: 'rotate(-0.6deg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClarityIcon />
            <span className="rl-display" style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Clarity
            </span>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.55, fontWeight: 600 }}>{resume.feedback.clarity}</p>
        </div>
        <div
          style={{
            padding: 22,
            background: 'var(--rl-lime)',
            color: 'var(--rl-lime-ink)',
            border: '3px solid var(--rl-ink)',
            borderRadius: 20,
            boxShadow: '5px 5px 0 var(--rl-ink)',
            transform: 'rotate(0.6deg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ImpactIcon />
            <span className="rl-display" style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Impact
            </span>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.55, fontWeight: 500 }}>{resume.feedback.impact}</p>
        </div>
      </div>

      {resume.feedback.gaps.length > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: 22,
            background: 'var(--rl-surface)',
            border: '3px dashed var(--rl-orange)',
            borderRadius: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GapsIcon />
            <span
              className="rl-display"
              style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--rl-orange-ink)' }}
            >
              Worth fixing
            </span>
          </div>
          <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resume.feedback.gaps.map((gap) => (
              <li key={gap} style={{ display: 'flex', gap: 10, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: 999, background: 'var(--rl-orange)', marginTop: 7 }} />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resume.parsed_data.skills.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <p className="rl-display" style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Skills we found
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {resume.parsed_data.skills.map((skill, index) => {
              const color = TAG_PALETTE[index % TAG_PALETTE.length]
              const rotation = index % 2 === 0 ? -2 : 1.5
              return (
                <span
                  key={skill}
                  className="rl-tag"
                  style={{
                    background: `var(--rl-${color})`,
                    color: TAG_TEXT_COLOR[color],
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  {skill}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {resume.parsed_data.experience.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <p className="rl-display" style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Experience
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {resume.parsed_data.experience.map((role, index) => {
              const isLast = index === resume.parsed_data.experience.length - 1
              const dotColor = TIMELINE_PALETTE[index % TIMELINE_PALETTE.length]
              return (
                <div key={`${role.title}-${index}`} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, background: `var(--rl-${dotColor})`, border: '2.5px solid var(--rl-ink)' }} />
                    {!isLast && <div style={{ width: 3, flex: 1, background: 'var(--rl-ink)', opacity: 0.15, minHeight: 40 }} />}
                  </div>
                  <div style={{ paddingBottom: isLast ? 0 : 24 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                      {role.title} <span style={{ fontWeight: 500, color: 'var(--rl-muted)' }}>&mdash; {role.company}</span>
                    </p>
                    {role.duration && <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: 'var(--rl-muted)' }}>{role.duration}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {resume.parsed_data.education.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <p className="rl-display" style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Education
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resume.parsed_data.education.map((entry, index) => (
              <div key={`${entry.institution}-${index}`} className="rl-card" style={{ padding: '18px 22px', boxShadow: 'none', borderWidth: 2.5 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{entry.institution}</p>
                {(entry.degree || entry.year) && (
                  <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 500, color: 'var(--rl-muted)' }}>
                    {[entry.degree, entry.year].filter(Boolean).join(' — ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    </svg>
  )
}

function CloudUploadIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--rl-orange-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rl-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9" />
      <path d="M3 3v6h6" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rl-orange-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  )
}

function ClarityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    </svg>
  )
}

function ImpactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

function GapsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rl-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rl-danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </svg>
  )
}

function SpinnerIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rl-spinner">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
    </svg>
  )
}
