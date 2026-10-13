import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { prefersReducedMotion, scrollState } from '../lib/scroll'

function Row({ items, reverse }) {
  const list = [...items, ...items]
  return (
    <div className={`marquee-row ${reverse ? 'is-reverse' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {list.map((s, i) => (
          <span key={i} className="marquee-item">
            {s}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0 14.6 9.4 24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  const { skills } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      const tracks = gsap.utils.toArray('.marquee-track')
      const tweens = tracks.map((t, i) =>
        gsap.fromTo(t, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38, ease: 'none', repeat: -1 }),
      )
      const skew = gsap.quickTo('.marquee-row', 'skewX', { duration: 0.5, ease: 'power3' })
      const tick = () => {
        const v = scrollState.velocity
        const boost = 1 + Math.min(Math.abs(v) * 0.35, 9)
        tweens.forEach((tw) => tw.timeScale(gsap.utils.interpolate(tw.timeScale(), boost * (v < 0 ? -1 : 1), 0.1)))
        skew(gsap.utils.clamp(-8, 8, v * -0.35))
      }
      gsap.ticker.add(tick)

      // Whole band tilts in on entry, then flattens.
      gsap.fromTo(
        '.marquee-row',
        { rotate: (i) => (i % 2 ? 3 : -3), scale: 1.08 },
        {
          rotate: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true },
        },
      )
      return () => gsap.ticker.remove(tick)
    },
    { scope: root },
  )

  return (
    <section ref={root} className="marquee" aria-label="Skills">
      <p className="sr-only">{skills.join(', ')}</p>
      <Row items={skills} />
      <Row items={[...skills].reverse()} reverse />
    </section>
  )
}
