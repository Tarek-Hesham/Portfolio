import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { isTouch } from '../lib/scroll'

// Pulls its child toward the cursor, then springs back.
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isTouch) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  )
}

// Text that rolls up to a duplicate copy on hover.
export function RollText({ children }) {
  return (
    <span className="roll" aria-hidden="false">
      <span className="roll-inner">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}

// Splits a string into masked words for reveal animations.
export function SplitWords({ text, className = 'word' }) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="word-mask">
      <span className={className}>{w}</span>{' '}
    </span>
  ))
}

export function SectionLabel({ index, children }) {
  return (
    <p className="section-label">
      <span className="section-label-index">{index}</span>
      <span className="section-label-line" />
      {children}
    </p>
  )
}
