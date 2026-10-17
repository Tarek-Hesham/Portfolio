import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { prefersReducedMotion } from '../lib/scroll'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#/*+<>'

// Name-first loading screen: the name rises, an accent line under it fills with the count,
// the role decodes into place, then the screen splits like two doors to reveal the site.
export default function Preloader({ onReveal, onComplete }) {
  const { profile, ui } = useContent()
  const root = useRef(null)
  const count = useRef(null)
  const role = useRef(null)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const decode = { p: 0 }
      const text = profile.role.toUpperCase()
      const tl = gsap.timeline({ onComplete })
      const duration = prefersReducedMotion ? 0.4 : 1.4

      const renderRole = () => {
        const shown = Math.floor(decode.p * text.length)
        let out = text.slice(0, shown)
        for (let i = shown; i < text.length; i++) out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        if (role.current) role.current.textContent = out
      }

      tl.from('.pl-char', { yPercent: 115, duration: 0.75, stagger: 0.03, ease: 'expo.out' }, 0)
        .to(
          counter,
          {
            v: 100,
            duration,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('.pl-line-fill', { scaleX: 1, duration, ease: 'power2.inOut' }, 0)
        .fromTo('.pl-role', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.35)
        .to(decode, { p: 1, duration: prefersReducedMotion ? 0.01 : 0.9, ease: 'none', onUpdate: renderRole }, 0.35)
        .to('.pl-head', { scale: 0.96, opacity: 0, duration: 0.4, ease: 'power3.in' }, '>0.1')
        .to('.pl-meta', { opacity: 0, duration: 0.3 }, '<')
        // The two halves part like doors.
        .call(onReveal)
        .to('.pl-door-top', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '<0.1')
        .to('.pl-door-bottom', { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, '<')
    },
    { scope: root },
  )

  const name = `${profile.firstName} ${profile.lastName}`

  return (
    <div ref={root} className="preloader" role="status" aria-label={ui.loading}>
      <span className="pl-door pl-door-top" aria-hidden="true" />
      <span className="pl-door pl-door-bottom" aria-hidden="true" />
      <div className="pl-head" aria-hidden="true">
        <div className="pl-name">
          {name.split('').map((c, i) => (
            <span key={i} className="pl-char-mask">
              <span className="pl-char">{c === ' ' ? ' ' : c}</span>
            </span>
          ))}
        </div>
        <span className="pl-line">
          <span className="pl-line-fill" />
        </span>
        <span ref={role} className="pl-role mono">
          {profile.role.toUpperCase()}
        </span>
      </div>
      <div className="pl-meta">
        <span>{ui.hero.portfolio} ©{new Date().getFullYear()}</span>
        <span ref={count} className="pl-count">
          000
        </span>
      </div>
    </div>
  )
}
