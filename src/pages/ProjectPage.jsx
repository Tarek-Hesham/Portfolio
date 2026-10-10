import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../i18n/LangContext'
import { isRTL, prefersReducedMotion } from '../lib/scroll'
import { curtainTo, openProject } from '../lib/transitions'
import Contact from '../components/Contact'
import { dirOf, Magnetic, RollText, SectionLabel, splitGlyphs } from '../components/ui'

const pad = (n) => String(n).padStart(2, '0')

// Plays only while on screen, to keep the page light.
function InViewVideo({ src, poster }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || prefersReducedMotion) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.25,
    })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" controls={prefersReducedMotion} />
}

export default function ProjectPage({ project: p, ready }) {
  const { projects, ui, lang } = useContent()
  const t = ui.case
  const root = useRef(null)
  const index = projects.findIndex((x) => x.slug === p.slug)
  const next = projects[(index + 1) % projects.length]

  useGSAP(
    () => {
      if (!ready) {
        gsap.set('.case-char', { yPercent: 115 })
        gsap.set('.case-reveal', { opacity: 0 })
        return
      }
      gsap
        .timeline({ delay: 0.35, defaults: { ease: 'expo.out' } })
        .fromTo('.case-char', { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.04 })
        .fromTo('.case-reveal', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.08 }, 0.3)
    },
    { scope: root, dependencies: [ready] },
  )

  useGSAP(
    () => {
      // Hero: cover sinks and blurs into the page as you scroll away.
      const hero = { trigger: '.case-hero', start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.case-cover', { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: hero })
      gsap.to('.case-hero-inner', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: hero })
      gsap.to('.case-hero-shade', { opacity: 1, ease: 'none', scrollTrigger: hero })

      gsap.fromTo(
        '.case-lead .w',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: '.case-lead', start: 'top 80%', end: 'bottom 50%', scrub: true },
        },
      )
      gsap.utils.toArray('.case-fade').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } },
        )
      })
      gsap.fromTo(
        '.case-feature',
        { y: 80, opacity: 0, rotateX: -12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.case-features', start: 'top 80%' },
        },
      )

      // Reel frame opens up as it reaches the middle of the screen.
      gsap.fromTo(
        '.case-reel-frame',
        { clipPath: 'inset(10% 12% 10% 12% round 40px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 18px)',
          ease: 'none',
          scrollTrigger: { trigger: '.case-reel', start: 'top 85%', end: 'center 55%', scrub: true },
        },
      )

      // Case-study boards rise in as you read down.
      if (!prefersReducedMotion) {
        gsap.set('.case-slide', { y: 80, opacity: 0, scale: 0.97 })
        ScrollTrigger.batch('.case-slide', {
          start: 'top 92%',
          onEnter: (els) =>
            gsap.to(els, { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
        })
      }

      gsap.fromTo(
        '.case-next-media img',
        { scale: 1.3 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: '.case-next', start: 'top bottom', end: 'bottom bottom', scrub: true } },
      )
    },
    { scope: root },
  )

  const back = (e) => {
    e.preventDefault()
    curtainTo('/', { label: ui.case.home, hash: '#work' })
  }
  const goNext = (e) => {
    e.preventDefault()
    openProject(next, e.currentTarget.querySelector('img'))
  }

  return (
    <div ref={root} className="case" style={{ '--accent': p.color }} data-scene="project">
      <header className="case-hero">
        <img className="case-cover" src={p.cover} alt={p.title} />
        <div className="case-hero-shade" />
        <div className="case-hero-gradient" />
        <div className="container case-hero-inner">
          <a href="/" className="case-back case-reveal" onClick={back}>
            <span aria-hidden="true">{isRTL() ? '→' : '←'}</span> <RollText>{t.back}</RollText>
          </a>
          <p className="mono case-reveal">
            ({pad(index + 1)}/{pad(projects.length)}) — {p.category} — {p.year}
          </p>
          <h1 className="case-title" aria-label={p.title} dir={dirOf(p.title)}>
            {splitGlyphs(p.title, lang).map((c, i) => (
              <span key={i} className="case-char-mask" aria-hidden="true">
                <span className="case-char">{c === ' ' ? ' ' : c}</span>
              </span>
            ))}
          </h1>
          <p className="case-tagline case-reveal">{p.tagline}</p>
        </div>
        <p className="case-scroll mono case-reveal" aria-hidden="true">
          {t.scroll} <span>↓</span>
        </p>
      </header>

      <section className="case-intro section">
        <div className="container case-intro-grid">
          <div>
            <SectionLabel index="01">{t.overview}</SectionLabel>
            <p className="case-lead">
              {p.overview.split(' ').map((w, i) => (
                <span key={i} className="w">
                  {w}{' '}
                </span>
              ))}
            </p>
          </div>
          <aside className="case-aside case-fade">
            <dl className="case-facts">
              {p.facts.map((f) => (
                <div key={f.label}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="case-stats">
              {p.stats.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="case-features-wrap">
        <div className="container">
          <SectionLabel index="02">{t.highlights}</SectionLabel>
          <ol className="case-features">
            {p.highlights.map((h, i) => (
              <li key={h.title} className="case-feature">
                <span className="mono case-feature-index">{pad(i + 1)}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {p.reel && (
        <section className="case-reel section">
          <div className="container">
            <SectionLabel index="03">{t.motion}</SectionLabel>
            <div className="case-reel-frame">
              <InViewVideo src={p.reel} poster={p.cover} />
            </div>
          </div>
        </section>
      )}

      <section className="case-gallery">
        <div className="container">
          <SectionLabel index="04">{t.gallery}</SectionLabel>
        </div>
        <div className="case-slides">
          {p.slides.map((s, i) => (
            <figure key={s.src} className="case-slide">
              <img src={s.src} width={s.w} height={s.h} alt={`${p.title} — ${i + 1}`} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        {p.link && (
          <div className="container case-cta case-fade">
            <Magnetic>
              <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-pill btn-accent">
                <RollText>{t.behance}</RollText> <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </div>
        )}
      </section>

      <a href={`/work/${next.slug}`} className="case-next" onClick={goNext} data-cursor={ui.work.cursor}>
        <div className="case-next-media">
          <img src={next.cardCover} alt="" loading="lazy" />
        </div>
        <div className="case-next-shade" />
        <div className="container case-next-inner">
          <p className="mono">{t.next}</p>
          <p className="case-next-title" dir={dirOf(next.title)}>{next.title}</p>
          <p className="case-next-tag">{next.tagline}</p>
        </div>
      </a>

      <Contact />
    </div>
  )
}
