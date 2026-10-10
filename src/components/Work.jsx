import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../i18n/LangContext'
import { isRTL, isTouch, prefersReducedMotion, scrollState, scrollToTarget } from '../lib/scroll'
import ProjectArt from './ProjectArt'
import ProjectModal from './ProjectModal'
import { RollText, Scramble } from './ui'

const pad = (n) => String(n).padStart(2, '0')

function ProjectCard({ project, index, onOpen, cursor }) {
  const media = useRef(null)

  useEffect(() => {
    const el = media.current
    if (!el || isTouch || prefersReducedMotion) return
    gsap.set(el, { transformPerspective: 1100 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3' })
    const sc = gsap.quickTo(el, 'scale', { duration: 0.8, ease: 'power3' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * 14)
      rx(-py * 14)
      sc(1.02)
      el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
      el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
    }
    const leave = () => {
      rx(0)
      ry(0)
      sc(1)
    }
    const card = el.parentElement
    card.addEventListener('pointermove', move)
    card.addEventListener('pointerleave', leave)
    return () => {
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <article className="project-card" data-cursor={cursor}>
      <div ref={media} className="project-media">
        <div className="project-media-inner">
          <ProjectArt project={project} index={index} />
        </div>
        <div className="project-shine" />
      </div>
      <div className="project-info">
        <span className="mono project-index">{pad(index + 1)}</span>
        <h3 className="project-title">
          <button className="project-hit" onClick={(e) => onOpen(index, e.currentTarget)}>
            {project.title}
          </button>
        </h3>
        <span className="mono project-cat">{project.category}</span>
        <span className="mono project-year">{project.year}</span>
      </div>
    </article>
  )
}

export default function Work() {
  const { projects, ui } = useContent()
  const root = useRef(null)
  const track = useRef(null)
  const [active, setActive] = useState(null)
  const opener = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const rtl = isRTL()
      const sign = rtl ? 1 : -1

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => sign * distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.work-progress-fill', { scaleX: self.progress }),
          },
        })

        // Cards enter from the far edge (right in English, left in Arabic).
        const enter = rtl ? 'right left' : 'left right'
        const leave = rtl ? 'left right' : 'right left'
        gsap.utils.toArray('.project-card').forEach((card) => {
          gsap.fromTo(
            card.querySelector('.project-media-inner'),
            { xPercent: 8 * sign },
            {
              xPercent: -8 * sign,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: enter, end: leave, scrub: true },
            },
          )
          gsap.fromTo(
            card,
            { rotateY: 22 * sign, z: -260 },
            {
              rotateY: 0,
              z: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: enter,
                end: rtl ? 'center 40%' : 'center 60%',
                scrub: true,
              },
            },
          )
          gsap.fromTo(
            card.querySelector('.project-media'),
            { clipPath: rtl ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: enter,
                end: rtl ? 'center 30%' : 'center 70%',
                scrub: true,
              },
            },
          )
        })

        // Cards lean into the scroll speed.
        const cards = gsap.utils.toArray('.project-card')
        const skew = gsap.quickTo(cards, 'skewX', { duration: 0.6, ease: 'power3' })
        const tick = () => skew(gsap.utils.clamp(-6, 6, scrollState.velocity * 0.18 * (rtl ? 1 : -1)))
        gsap.ticker.add(tick)

        gsap.fromTo(
          '.work-intro-title .mask > span',
          { yPercent: 110 },
          { yPercent: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } },
        )
        return () => gsap.ticker.remove(tick)
      })

      mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray('.project-card').forEach((card) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%' } },
          )
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  const open = (i, el) => {
    opener.current = el
    setActive(i)
  }
  const close = () => {
    setActive(null)
    opener.current?.focus()
  }

  return (
    <section ref={root} id="work" className="work" data-scene="work">
      <div ref={track} className="work-track">
        <div className="work-intro">
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
          <p className="work-intro-copy">{ui.work.intro}</p>
          <p className="mono work-count">
            {pad(projects.length)} {ui.work.count}
          </p>
        </div>

        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={open} cursor={ui.work.cursor} />
        ))}

        <div className="work-outro">
          <p className="mono">{ui.work.outroLabel}</p>
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

      <div className="work-progress" aria-hidden="true">
        <span className="work-progress-fill" />
      </div>

      {active !== null && <ProjectModal project={projects[active]} index={active} onClose={close} ui={ui.modal} />}
    </section>
  )
}
