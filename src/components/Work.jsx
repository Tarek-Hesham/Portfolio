import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../i18n/LangContext'
import { isRTL, isTouch, prefersReducedMotion, scrollToTarget } from '../lib/scroll'
import { openProject } from '../lib/transitions'
import ProjectModal from './ProjectModal'
import { dirOf, RollText, Scramble, splitGlyphs } from './ui'

const pad = (n) => String(n).padStart(2, '0')

function StackCard({ project, index, total, lang, ui }) {
  const root = useRef(null)
  const video = useRef(null)

  const open = (e) => {
    e.preventDefault()
    openProject(project, root.current.querySelector('.stack-media img'))
  }

  // Hover: warm up the hi-res cover and play the motion preview.
  const enter = () => {
    const img = new Image()
    img.src = project.cover
    if (isTouch || prefersReducedMotion || !video.current) return
    video.current.play().catch(() => {})
  }
  const leave = () => video.current?.pause()

  return (
    <article ref={root} className="stack-card" style={{ '--i': index, '--accent': project.color }}>
      <a
        href={`/work/${project.slug}`}
        className="stack-link"
        onClick={open}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onFocus={enter}
        data-cursor={ui.work.cursor}
        aria-label={`${project.title} — ${ui.work.viewCase}`}
      >
        <div className="stack-inner">
          <div className="stack-media">
            <img src={project.cardCover} alt="" decoding="async" loading={index ? 'lazy' : 'eager'} />
            {project.preview && (
              <video ref={video} src={project.preview} muted loop playsInline preload="none" aria-hidden="true" />
            )}
          </div>
          <div className="stack-shade" />
          <div className="stack-dim" />

          <div className="stack-top mono">
            <span className="stack-index">
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>

          <div className="stack-bottom">
            <h3 className="stack-title" aria-hidden="true" dir={dirOf(project.title)}>
              {splitGlyphs(project.title, lang).map((c, i) => (
                <span key={i} className="stack-char-mask">
                  <span className="stack-char">{c === ' ' ? ' ' : c}</span>
                </span>
              ))}
            </h3>
            <div className="stack-meta">
              <p className="stack-tagline">{project.tagline}</p>
              <ul className="stack-stats">
                {project.stats.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <span className="stack-cta">
              <RollText>{ui.work.viewCase}</RollText>
              <span className="stack-cta-arrow" aria-hidden="true">
                {isRTL() ? '↖' : '↗'}
              </span>
            </span>
          </div>
        </div>
      </a>
    </article>
  )
}

export default function Work() {
  const { projects, archive, ui, lang } = useContent()
  const root = useRef(null)
  const [active, setActive] = useState(null)
  const opener = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.work-intro-title .mask > span',
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.work-head', start: 'top 75%' } },
      )

      const cards = gsap.utils.toArray('.stack-card')
      cards.forEach((card, i) => {
        const inner = card.querySelector('.stack-inner')
        const media = card.querySelectorAll('.stack-media > *')

        // Title rises letter by letter once the card arrives.
        gsap.fromTo(
          card.querySelectorAll('.stack-char'),
          { yPercent: 115, rotate: 8 },
          {
            yPercent: 0,
            rotate: 0,
            stagger: 0.035,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 60%' },
          },
        )
        gsap.fromTo(
          card.querySelectorAll('.stack-top > *, .stack-meta, .stack-cta'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 55%' },
          },
        )

        if (prefersReducedMotion) return

        // Card unfolds from a smaller rounded window as it enters.
        gsap.fromTo(
          inner,
          { clipPath: 'inset(14% 9% 0% 9% round 40px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 18px)',
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 25%', scrub: true },
          },
        )
        // Cover drifts inside its frame.
        gsap.fromTo(
          media,
          { scale: 1.28, yPercent: -7 },
          {
            scale: 1.05,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )

        // When the next card slides over, this one tips back into the stack.
        const next = cards[i + 1]
        if (!next) return
        const st = { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true }
        gsap.to(inner, { scale: 0.9 - i * 0.02, rotateX: 9, yPercent: -3, ease: 'none', scrollTrigger: st })
        gsap.to(card.querySelector('.stack-dim'), { opacity: 0.72, ease: 'none', scrollTrigger: st })
      })

      gsap.utils.toArray('.archive-row').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 92%' } },
        )
      })
    },
    { scope: root },
  )

  const openArchive = (i, el) => {
    opener.current = el
    setActive(i)
  }
  const close = () => {
    setActive(null)
    opener.current?.focus()
  }

  return (
    <section ref={root} id="work" className="work section" data-scene="work">
      <div className="container">
        <div className="work-head">
          <p className="mono">
            <Scramble text={ui.work.label} />
          </p>
          <h2 className="work-intro-title">
            <span className="mask">
              <span>{ui.work.title1}</span>
            </span>
            <span className="mask">
              <span className="accent-italic">{ui.work.title2}</span>
            </span>
          </h2>
          <div className="work-head-side">
            <p className="work-intro-copy">{ui.work.intro}</p>
            <p className="mono work-count">
              {pad(projects.length)} {ui.work.count}
            </p>
          </div>
        </div>

        <div className="stack">
          {projects.map((p, i) => (
            <StackCard key={p.id} project={p} index={i} total={projects.length} lang={lang} ui={ui} />
          ))}
        </div>

        <div className="archive">
          <p className="mono archive-label">{ui.work.more}</p>
          <ul>
            {archive.map((p, i) => (
              <li key={p.id}>
                <button
                  className="archive-row"
                  style={{ '--accent': p.color }}
                  onClick={(e) => openArchive(i, e.currentTarget)}
                  data-cursor={ui.work.cursor}
                >
                  <span className="mono archive-index">{pad(projects.length + i + 1)}</span>
                  <span className="archive-title">{p.title}</span>
                  <span className="mono archive-cat">{p.category}</span>
                  <span className="mono archive-year">{p.year}</span>
                  <span className="archive-arrow" aria-hidden="true">
                    {isRTL() ? '↖' : '↗'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="work-outro-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#contact')
            }}
          >
            <RollText>{ui.work.outroLink}</RollText>
            <span aria-hidden="true">{isRTL() ? '↖' : '↗'}</span>
          </a>
        </div>
      </div>

      {active !== null && <ProjectModal project={archive[active]} index={projects.length + active} onClose={close} ui={ui.modal} />}
    </section>
  )
}
