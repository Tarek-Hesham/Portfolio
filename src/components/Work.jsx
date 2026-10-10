import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data/content'
import { isTouch, prefersReducedMotion, scrollToTarget } from '../lib/scroll'
import ProjectArt from './ProjectArt'
import ProjectModal from './ProjectModal'
import { RollText } from './ui'

const pad = (n) => String(n).padStart(2, '0')

function ProjectCard({ project, index, onOpen }) {
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
    <article className="project-card" data-cursor="View">
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
  const root = useRef(null)
  const track = useRef(null)
  const [active, setActive] = useState(null)
  const opener = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => -distance(),
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

        gsap.utils.toArray('.project-card').forEach((card) => {
          gsap.fromTo(
            card.querySelector('.project-media-inner'),
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          )
          gsap.fromTo(
            card,
            { rotateY: -22, z: -260 },
            {
              rotateY: 0,
              z: 0,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'center 60%', scrub: true },
            },
          )
        })

        gsap.fromTo(
          '.work-intro-title span',
          { yPercent: 110 },
          { yPercent: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } },
        )
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
          <p className="mono">(02) — Selected work</p>
          <h2 className="work-intro-title">
            <span className="mask"><span>Selected</span></span>
            <span className="mask"><span className="accent-italic">Works</span></span>
          </h2>
          <p className="work-intro-copy">
            Product work across fintech, on-demand services, marketplaces, e-learning and real estate. Click any
            project for the full story.
          </p>
          <p className="mono work-count">{pad(projects.length)} projects →</p>
        </div>

        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} onOpen={open} />
        ))}

        <div className="work-outro">
          <p className="mono">Next could be yours</p>
          <a
            href="#contact"
            className="work-outro-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#contact')
            }}
          >
            <RollText>Start a project</RollText>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="work-progress" aria-hidden="true">
        <span className="work-progress-fill" />
      </div>

      {active !== null && <ProjectModal project={projects[active]} index={active} onClose={close} />}
    </section>
  )
}
