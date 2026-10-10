import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { isTouch } from '../lib/scroll'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (isTouch) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      root.classList.add('cursor-visible')
    }
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor]')
      const interactive = e.target.closest?.('a, button, [role="button"]')
      ring.current.classList.toggle('is-hover', !!interactive && !target)
      if (target) {
        label.current.textContent = target.dataset.cursor
        ring.current.classList.add('is-label')
      } else {
        ring.current.classList.remove('is-label')
      }
    }
    const down = () => ring.current.classList.add('is-down')
    const up = () => ring.current.classList.remove('is-down')
    const leave = () => root.classList.remove('cursor-visible')

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    return () => {
      root.classList.remove('has-cursor', 'cursor-visible')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])

  if (isTouch) return null

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
