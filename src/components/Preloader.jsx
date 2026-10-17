import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { prefersReducedMotion } from '../lib/scroll'

// Project reel: while the count runs to 100, a framed window flips through every
// project cover under the name, then grows to fill the screen before the site wipes in.
export default function Preloader({ onReveal, onComplete }) {
  const { profile, projects, ui } = useContent()
  const root = useRef(null)
  const count = useRef(null)
  const frame = useRef(null)
  // Reversed so the reel lands on the first (lead) project.
  const reel = [...projects].reverse()

  useGSAP(
    () => {
      const counter = { v: 0 }
      const shots = gsap.utils.toArray('.pl-shot', root.current)
      // Decode every cover up front so none flashes blank the first time it shows.
      shots.forEach((s) => s.decode?.().catch(() => {}))
      let shown = -1
      const tl = gsap.timeline({ onComplete })
      const duration = prefersReducedMotion ? 0.4 : 1.3

      tl.fromTo(frame.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0)
        .from('.pl-char', { yPercent: 115, duration: 0.7, stagger: 0.025, ease: 'expo.out' }, 0.1)
        .from('.pl-role', { yPercent: 115, duration: 0.7, ease: 'expo.out' }, 0.3)
        .to(
          counter,
          {
            v: 100,
            duration,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
              // Shutter: each cover gets an equal slice of the count.
              const next = prefersReducedMotion ? shots.length - 1 : Math.min(shots.length - 1, Math.floor((counter.v / 100) * shots.length))
              if (next !== shown) {
                shots.forEach((s, i) => (s.style.opacity = i === next ? 1 : 0))
                shown = next
              }
            },
          },
          0,
        )
        .to('.pl-bar-fill', { scaleX: 1, duration, ease: 'power2.inOut' }, 0)
        .to('.pl-char', { yPercent: -115, duration: 0.45, stagger: 0.015, ease: 'power3.in' })
        .to('.pl-role', { yPercent: -115, duration: 0.45, ease: 'power3.in' }, '<')
        .to('.pl-meta', { opacity: 0, duration: 0.3 }, '<')
        // The frame opens up to the whole screen…
        .to(frame.current, { width: '100vw', height: '100vh', borderRadius: 0, duration: 0.7, ease: 'expo.inOut' }, '<0.15')
        .to('.pl-shot', { filter: 'brightness(1)', duration: 0.7, ease: 'power2.out' }, '<')
        // …then the reel wipes away to reveal the site.
        .call(onReveal)
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' })
    },
    { scope: root },
  )

  const name = `${profile.firstName} ${profile.lastName}`

  return (
    <div ref={root} className="preloader" role="status" aria-label={ui.loading}>
      <div ref={frame} className="pl-frame" aria-hidden="true">
        {reel.map((p, i) => (
          <img key={p.id} className="pl-shot" src={p.cardCover} alt="" style={{ opacity: i ? 0 : 1 }} />
        ))}
      </div>
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
