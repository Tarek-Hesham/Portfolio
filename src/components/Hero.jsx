import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { isTouch, scrollToTarget } from '../lib/scroll'
import { Magnetic, RollText } from './ui'

// The first intro plays after the preloader; later ones (coming back from a
// case study) wait for the curtain to start lifting.
let introPlayed = false

function Glyphs({ text }) {
  return text.split('').map((c, i) => (
    <span key={i} className="hero-char-mask">
      <span className="hero-char">{c}</span>
    </span>
  ))
}

function LocalTime({ timezone }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    })
    const update = () => setTime(fmt.format(new Date()))
    update()
    const id = setInterval(update, 15000)
    return () => clearInterval(id)
  }, [timezone])
  return <span>{time}</span>
}

export default function Hero({ ready }) {
  const { profile, ui } = useContent()
  const root = useRef(null)

  // Intro, once the preloader lifts.
  useGSAP(
    () => {
      if (!ready) {
        gsap.set('.hero-char', { yPercent: 115, rotate: 6 })
        gsap.set('.hero-reveal', { opacity: 0 })
        gsap.set('.hero-line', { scaleX: 0 })
        return
      }
      const delay = introPlayed ? 1.1 : 0
      introPlayed = true
      gsap
        .timeline({ delay, defaults: { ease: 'expo.out' } })
        .fromTo('.hero-char', { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.045 })
        .fromTo('.hero-reveal', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08 }, 0.5)
        .fromTo('.hero-line', { scaleX: 0 }, { scaleX: 1, duration: 1.4 }, 0.6)
    },
    { scope: root, dependencies: [ready] },
  )

  // Scroll-out parallax + letters that jump when the cursor touches them.
  useGSAP(
    (ctx, contextSafe) => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-title-1', { xPercent: -14, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-title-2', { xPercent: 10, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-inner', { yPercent: 28, opacity: 0, ease: 'none', scrollTrigger: st })

      if (isTouch) return
      const masks = gsap.utils.toArray('.hero-char-mask', root.current)
      const handlers = masks.map((mask) => {
        const glyph = mask.firstElementChild
        const onEnter = contextSafe(() => {
          if (gsap.isTweening(glyph)) return
          gsap
            .timeline()
            .to(glyph, { yPercent: -22, scaleY: 1.08, color: '#ff5a1f', duration: 0.25, ease: 'power2.out' })
            .to(glyph, {
              yPercent: 0,
              scaleY: 1,
              color: getComputedStyle(mask).color,
              duration: 0.9,
              ease: 'elastic.out(1, 0.35)',
              clearProps: 'color',
            })
        })
        mask.addEventListener('pointerenter', onEnter)
        return () => mask.removeEventListener('pointerenter', onEnter)
      })
      return () => handlers.forEach((off) => off())
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="hero">
      <div className="hero-inner container">
        <div className="hero-top">
          <p className="mono hero-reveal">
            {ui.hero.portfolio} ©{new Date().getFullYear()}
          </p>
          <p className="mono hero-reveal">
            {profile.location} — <LocalTime timezone={profile.timezone} />
          </p>
        </div>

        <h1 className="hero-title" aria-label={`${profile.firstName} ${profile.lastName}`}>
          <span className="hero-title-1" aria-hidden="true">
            <Glyphs text={profile.firstName} />
          </span>
          <span className="hero-title-2" aria-hidden="true">
            <Glyphs text={profile.lastName} />
          </span>
        </h1>

        <div className="hero-line" />

        <div className="hero-bottom">
          <div className="hero-role">
            <p className="mono hero-reveal">{ui.hero.roleLabel}</p>
            <p className="hero-reveal hero-role-text">{profile.role}</p>
            <p className="hero-reveal hero-role-detail">{profile.roleDetail}</p>
          </div>
          <p className="hero-tagline hero-reveal">{profile.tagline}</p>
          <div className="hero-actions hero-reveal">
            <div className="hero-status">
              {profile.available && (
                <span className="status">
                  <span className="status-dot" /> {profile.availability}
                </span>
              )}
              {profile.cv && (
                <a href={profile.cv} className="hero-cv" download>
                  <RollText>{ui.hero.downloadCv}</RollText>
                </a>
              )}
            </div>
            <Magnetic>
              <a
                href="#work"
                className="btn btn-circle"
                data-cursor={ui.hero.cursor}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget('#work')
                }}
              >
                <RollText>{ui.hero.viewWork}</RollText>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M12 4v16m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <div className="hero-scroll mono" aria-hidden="true">
        <span>{ui.hero.scroll}</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}
