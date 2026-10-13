import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isTouch, prefersReducedMotion } from '../lib/scroll'

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
    <span className="roll">
      <span className="roll-inner">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}

const GLYPHS = {
  latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>',
  arabic: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩',
}

// Decodes its text from random glyphs the first time it scrolls into view.
export function Scramble({ text, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion) return
    const pool = /[؀-ۿ]/.test(text) ? GLYPHS.arabic : GLYPHS.latin
    const state = { p: 0 }
    let tween
    const render = () => {
      const revealed = Math.floor(state.p * text.length)
      let out = text.slice(0, revealed)
      for (let i = revealed; i < text.length; i++) {
        out += text[i] === ' ' ? ' ' : pool[(Math.random() * pool.length) | 0]
      }
      el.textContent = out
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        tween = gsap.to(state, { p: 1, duration: 0.9, ease: 'none', onUpdate: render, onComplete: () => (el.textContent = text) })
      },
    })
    return () => {
      st.kill()
      tween?.kill()
      el.textContent = text
    }
  }, [text])

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

export function SectionLabel({ index, children }) {
  return (
    <p className="section-label">
      <span className="section-label-index">{index}</span>
      <span className="section-label-line" />
      <Scramble text={children} />
    </p>
  )
}
