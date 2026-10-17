import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { prefersReducedMotion } from '../lib/scroll'

export default function Preloader({ onReveal, onComplete }) {
  const { profile, ui } = useContent()
  const root = useRef(null)
  const count = useRef(null)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const tl = gsap.timeline({ onComplete })
      const duration = prefersReducedMotion ? 0.4 : 1.2

      tl.from('.pl-char', { yPercent: 115, duration: 0.7, stagger: 0.025, ease: 'expo.out' })
        .from('.pl-role', { yPercent: 115, duration: 0.7, ease: 'expo.out' }, 0.25)
        .to(
          counter,
          {
            v: 100,
            duration,
            ease: 'power3.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('.pl-bar-fill', { scaleX: 1, duration, ease: 'power3.inOut' }, 0)
        .to('.pl-char', { yPercent: -115, duration: 0.45, stagger: 0.015, ease: 'power3.in' })
        .to('.pl-role', { yPercent: -115, duration: 0.45, ease: 'power3.in' }, '<')
        .to('.pl-meta', { opacity: 0, duration: 0.3 }, '<')
        .call(onReveal)
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '<')
    },
    { scope: root },
  )

  const name = `${profile.firstName} ${profile.lastName}`

  return (
    <div ref={root} className="preloader" role="status" aria-label={ui.loading}>
      <div className="pl-head" aria-hidden="true">
        <div className="pl-name">
          {name.split('').map((c, i) => (
            <span key={i} className="pl-char-mask">
              <span className="pl-char">{c === ' ' ? ' ' : c}</span>
            </span>
          ))}
        </div>
        <span className="pl-role-mask">
          <span className="pl-role mono">{profile.role}</span>
        </span>
      </div>
      <div className="pl-meta">
        <span>{ui.hero.portfolio} ©{new Date().getFullYear()}</span>
        <span ref={count} className="pl-count">
          000
        </span>
      </div>
      <div className="pl-bar pl-meta">
        <span className="pl-bar-fill" />
      </div>
    </div>
  )
}
