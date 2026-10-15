import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { isTouch, prefersReducedMotion, scrollToTarget } from '../lib/scroll'
import { wordChars } from '../lib/text'
import { openProject } from '../lib/transitions'
import ProjectModal from './ProjectModal'
import { RollText, Scramble } from './ui'

const pad = (n) => String(n).padStart(2, '0')

// Showcase timeline: each project change is one flip of the cover slats.
const SLATS = 8
const SEG = 1.2 // timeline time per project
const LEAD = 0.2 // hold before each flip
const FLIP = 0.5 + 0.06 * (SLATS - 1) // one flip, stagger included
const flipEnd = (k) => (k ? (k - 1) * SEG + LEAD + FLIP : 0)

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return match
}

// The cover cut into vertical strips; each strip shows its own slice of the whole image.
function Slats({ src }) {
  return Array.from({ length: SLATS }, (_, k) => (
    <span key={k} className="slat" style={{ '--k': k }}>
      <span className="slat-art" style={{ backgroundImage: `url(${src})` }} />
    </span>
  ))
}

function ProjectInfo({ project, ui, onOpen }) {
  return (
    <>
      <h3 className="showcase-title" aria-label={project.title}>
        {wordChars(project.title).map((word, w) => (
          <span key={w} className="title-word">
            {word.map(({ c, i }) => (
              <span key={i} className="showcase-char-mask" aria-hidden="true">
                <span className="showcase-char" style={{ '--c': i }}>
                  {c}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h3>
      <p className="showcase-tagline">{project.tagline}</p>
      <ul className="showcase-stats">
        {project.stats.map((s) => (
          <li key={s} className="tag">
            {s}
          </li>
        ))}
      </ul>
      <a href={`/work/${project.slug}`} className="showcase-cta" onClick={onOpen} data-cursor={ui.work.cursor}>
        <RollText>{ui.work.viewCase}</RollText>
        <span className="showcase-cta-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </>
  )
}

function FrameCaption({ project, index, total }) {
  return (
    <span className="frame-caption mono">
      <span>
        ({pad(index + 1)}/{pad(total)})
      </span>
      <span>{project.category}</span>
      <span>{project.year}</span>
    </span>
  )
}

// Desktop: one framed cover pinned in place; scrolling flips the next project in slat by slat.
function Showcase({ projects, ui }) {
  const root = useRef(null)
  const frame = useRef(null)
  const frameImg = useRef(null)
  const video = useRef(null)
  const trigger = useRef(null)
  const shown = useRef(0)
  const tilt = useRef(null)
  const [active, setActive] = useState(0)
  const total = projects.length
  const p = projects[active]

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      gsap.utils.toArray('.frame-layer', root.current).forEach((layer, k) => {
        if (!k) return
        tl.fromTo(
          layer.querySelectorAll('.slat'),
          // Past 90° the strip shows its hidden back face, so it is gone even under perspective.
          { rotateY: -110 },
          { rotateY: 0, duration: 0.5, stagger: 0.06 },
          (k - 1) * SEG + LEAD,
        )
      })
      tl.to({}, { duration: LEAD })

      // The visible project switches halfway through each flip.
      tl.eventCallback('onUpdate', () => {
        root.current?.style.setProperty('--progress', tl.progress().toFixed(4))
        let next = 0
        for (let k = 1; k < total; k++) if (tl.time() >= flipEnd(k) - FLIP / 2) next = k
        if (next !== shown.current) {
          shown.current = next
          setActive(next)
        }
      })

      trigger.current = ScrollTrigger.create({
        animation: tl,
        trigger: root.current,
        start: 'top top',
        end: () => `+=${tl.duration() * window.innerHeight * 0.75}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      })

      // The frame swings up into place as the section arrives.
      gsap.fromTo(
        '.showcase-stage',
        { y: 90, rotateX: 16, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 10%', scrub: true } },
      )

      if (isTouch) return
      tilt.current = {
        x: gsap.quickTo(frame.current, 'rotateY', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(frame.current, 'rotateX', { duration: 0.9, ease: 'power3.out' }),
      }
    },
    { scope: root, dependencies: [total], revertOnUpdate: true },
  )

  const goTo = (k) => {
    const st = trigger.current
    if (!st) return
    const time = k ? flipEnd(k) + 0.05 : 0
    scrollToTarget(st.start + (time / st.animation.duration()) * (st.end - st.start))
  }

  const open = (e) => {
    e.preventDefault()
    openProject(p, frameImg.current)
  }

  // Hover: warm up the hi-res cover, play the motion preview and lean toward the cursor.
  const enter = () => {
    const img = new Image()
    img.src = p.cover
    if (isTouch || !video.current) return
    video.current.play().catch(() => {})
  }
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    tilt.current?.x(((e.clientX - r.left) / r.width - 0.5) * 12)
    tilt.current?.y(-((e.clientY - r.top) / r.height - 0.5) * 9)
  }
  const leave = () => {
    video.current?.pause()
    tilt.current?.x(0)
    tilt.current?.y(0)
  }

  return (
    <div className="showcase-wrap">
      <div ref={root} className="showcase" style={{ '--accent': p.color }}>
        <div className="showcase-side">
          <span className="showcase-progress" aria-hidden="true">
            <span />
          </span>
          <ol className="showcase-index">
            {projects.map((q, k) => (
              <li key={q.id}>
                <button className={k === active ? 'is-active' : ''} onClick={() => goTo(k)} aria-current={k === active}>
                  <span className="mono">{pad(k + 1)}</span>
                  <span>{q.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="showcase-detail" key={p.id}>
            <p className="mono showcase-meta">
              {p.category} — {p.year}
            </p>
            <ProjectInfo project={p} ui={ui} onOpen={open} />
          </div>
        </div>

        <div className="showcase-stage">
          <a
            ref={frame}
            href={`/work/${p.slug}`}
            className="showcase-frame"
            onClick={open}
            onPointerEnter={enter}
            onPointerMove={move}
            onPointerLeave={leave}
            onFocus={enter}
            onBlur={leave}
            data-cursor={ui.work.cursor}
            aria-label={`${p.title} — ${ui.work.viewCase}`}
          >
            <FrameCaption project={p} index={active} total={total} />
            <span className="frame-window" style={{ '--slats': SLATS }}>
              {projects.map((q, k) => (
                <span key={q.id} className="frame-layer" style={{ zIndex: k }}>
                  <Slats src={q.cardCover} />
                </span>
              ))}
              <img ref={frameImg} className="frame-src" src={p.cardCover} alt="" />
              {p.preview && (
                <video key={p.preview} ref={video} className="frame-video" src={p.preview} muted loop playsInline preload="none" aria-hidden="true" />
              )}
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

// Phones and reduced motion: the same frames, one after another.
function ShowcaseList({ projects, ui }) {
  const root = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion) return
      gsap.utils.toArray('.showcase-item', root.current).forEach((item) => {
        gsap.fromTo(
          item.querySelector('.frame-window'),
          { clipPath: 'inset(14% 10% 14% 10% round 12px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 12px)', ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 35%', scrub: true } },
        )
        gsap.fromTo(
          item.querySelectorAll('.showcase-char'),
          { yPercent: 115, rotate: 8 },
          { yPercent: 0, rotate: 0, stagger: 0.035, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 55%' } },
        )
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="showcase-list">
      {projects.map((p, i) => {
        const open = (e) => {
          e.preventDefault()
          openProject(p, root.current.querySelectorAll('.frame-img')[i])
        }
        return (
          <article key={p.id} className="showcase-item" style={{ '--accent': p.color }}>
            <a
              href={`/work/${p.slug}`}
              className="showcase-frame"
              onClick={open}
              data-cursor={ui.work.cursor}
              aria-label={`${p.title} — ${ui.work.viewCase}`}
            >
              <FrameCaption project={p} index={i} total={projects.length} />
              <span className="frame-window">
                <img className="frame-img" src={p.cardCover} alt="" decoding="async" loading={i ? 'lazy' : 'eager'} />
              </span>
            </a>
            <div className="showcase-info">
              <ProjectInfo project={p} ui={ui} onOpen={open} />
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function Work() {
  const { projects, archive, ui } = useContent()
  const root = useRef(null)
  const [active, setActive] = useState(null)
  const opener = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const pinned = wide && !prefersReducedMotion

  useGSAP(
    () => {
      gsap.fromTo(
        '.work-intro-title .mask > span',
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.work-head', start: 'top 75%' } },
      )

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
    <section ref={root} id="work" className="work section">
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

        {pinned ? (
          <Showcase projects={projects} ui={ui} />
        ) : (
          <ShowcaseList projects={projects} ui={ui} />
        )}

        <div className="archive">
          {/* The smaller-projects list only shows when there is something in it. */}
          {archive.length > 0 && <p className="mono archive-label">{ui.work.more}</p>}
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
                    ↗
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
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {active !== null && <ProjectModal project={archive[active]} index={projects.length + active} onClose={close} ui={ui.modal} />}
    </section>
  )
}
