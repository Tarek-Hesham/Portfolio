import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { lockScroll } from '../lib/scroll'
import ProjectArt from './ProjectArt'
import { Magnetic, RollText } from './ui'

export default function ProjectModal({ project, index, onClose }) {
  const root = useRef(null)
  const closeBtn = useRef(null)
  const closing = useRef(false)

  const close = () => {
    if (closing.current) return
    closing.current = true
    gsap
      .timeline({
        onComplete: () => {
          lockScroll(false)
          onClose()
        },
      })
      .to('.modal-content > *', { y: -30, opacity: 0, duration: 0.3, stagger: 0.03, ease: 'power2.in' })
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, '-=0.1')
  }

  useEffect(() => {
    lockScroll(true)
    closeBtn.current?.focus()
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(root.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' })
        .fromTo('.modal-art', { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.2)
        .fromTo('.modal-content > *', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.07, ease: 'expo.out' }, 0.5)
    }, root)

    const onKey = (e) => {
      if (e.key === 'Escape') close()
      // Keep focus inside the dialog.
      if (e.key === 'Tab') {
        const items = root.current.querySelectorAll('a[href], button')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      ctx.revert()
      lockScroll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div ref={root} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-lenis-prevent>
      <button ref={closeBtn} className="modal-close" onClick={close} aria-label="Close project">
        <span />
        <span />
      </button>
      <div className="modal-art">
        <ProjectArt project={project} index={index} large />
      </div>
      <div className="modal-content container">
        <p className="mono">
          ({String(index + 1).padStart(2, '0')}) — {project.category}
        </p>
        <h2 id="modal-title" className="modal-title">
          {project.title}
        </h2>
        <div className="modal-grid">
          <p className="modal-desc">{project.description}</p>
          <dl className="modal-meta">
            <div>
              <dt className="mono">Context</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt className="mono">Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt className="mono">Scope</dt>
              <dd>{project.scope.join(' · ')}</dd>
            </div>
          </dl>
        </div>
        {project.link && (
          <Magnetic>
            <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-pill btn-accent">
              <RollText>{project.link.includes('behance') ? 'View case study on Behance' : 'Visit live site'}</RollText>{' '}
              <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        )}
      </div>
    </div>,
    document.body,
  )
}
