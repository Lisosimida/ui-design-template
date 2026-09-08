'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Replaces window.confirm() for destructive actions — a native browser
// dialog drops out of the app's visual language entirely (no border, no
// shadow, no motion), which reads as a craft regression at the one moment
// (an irreversible delete) where it matters most. Materializes with a
// critically-damped spring (no overshoot) rather than the app's usual
// slight-bounce hover easing — this is a serious confirmation, not a
// playful sticker, so it settles rather than bounces.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const shouldReduceMotion = useReducedMotion()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'oklch(22% 0.03 50 / 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="rl-confirm-title"
            aria-describedby="rl-confirm-message"
            onClick={(event) => event.stopPropagation()}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.3 }}
            className="rl-card"
            style={{ maxWidth: 380, width: '100%', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <div>
              <p id="rl-confirm-title" className="rl-display" style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>
                {title}
              </p>
              <p
                id="rl-confirm-message"
                style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--rl-muted)', fontWeight: 500, lineHeight: 1.5 }}
              >
                {message}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="rl-btn rl-btn-outline"
                style={{ padding: '10px 20px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button type="button" onClick={onConfirm} className="rl-btn rl-btn-danger" style={{ padding: '10px 20px', fontSize: 13 }}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
