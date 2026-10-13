import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useContent } from '../data/content'
import { lockScroll, scrollState, scrollToTarget } from '../lib/scroll'
import { curtainTo } from '../lib/transitions'
import { Magnetic, RollText } from './ui'

const LINKS = ['work', 'about', 'services', 'experience', 'contact']

export default function Nav({ ready, page }) {
  const { profile, ui } = useContent()
  const bar = useRef(null)
  const progress = useRef(null)
  const menu = useRef(null)
  const [open, setOpen] = useState(false)

  // Hide on scroll down, reveal on scroll up; drive the progress line.
  useEffect(() => {
    let hidden = false
    const tick = () => {
      if (progress.current) progress.current.style.transform = `scaleX(${scrollState.progress})`
      const shouldHide = scrollState.y > 200 && scrollState.direction === 1 && Math.abs(scrollState.velocity) > 0.5
      const shouldShow = scrollState.direction === -1 || scrollState.y < 200
      if (shouldHide && !hidden) {
        hidden = true
        gsap.to(bar.current, { yPercent: -120, duration: 0.6, ease: 'power3.out' })
      } else if (shouldShow && hidden) {
        hidden = false
        gsap.to(bar.current, { yPercent: 0, duration: 0.6, ease: 'power3.out' })
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  useEffect(() => {
    if (!ready) return
    gsap.fromTo(bar.current, { yPercent: -120 }, { yPercent: 0, duration: 1, delay: 0.6, ease: 'expo.out' })
  }, [ready])

  useEffect(() => {
    const el = menu.current
    lockScroll(open)
    if (open) {
      gsap.set(el, { visibility: 'visible' })
      const corner = '100% 0%'
      gsap
        .timeline()
        .fromTo(el, { clipPath: `circle(0% at ${corner})` }, { clipPath: `circle(150% at ${corner})`, duration: 0.9, ease: 'expo.inOut' })
        .fromTo('.menu-link', { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out' }, '-=0.4')
      el.querySelector('a')?.focus()
      const onKey = (e) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    } else if (el.style.visibility === 'visible') {
      gsap.to(el, {
        clipPath: 'circle(0% at 50% 0%)',
        duration: 0.7,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(el, { visibility: 'hidden' }),
      })
    }
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    if (page === 'home') scrollToTarget(href)
    else curtainTo('/', { label: ui.case.home, hash: href })
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progress} />
      </div>
      <header ref={bar} className={`nav ${open ? 'is-menu-open' : ''}`}>
        <a
          href="#top"
          className="nav-logo"
          onClick={(e) => go(e, '#top')}
          aria-label={`${profile.firstName} ${profile.lastName} — ${ui.nav.home}`}
        >
          <span className="nav-logo-mark">
            TH
          </span>
          <span className="nav-logo-text">
            <RollText>
              {profile.firstName} {profile.lastName}
            </RollText>
          </span>
        </a>
        <nav aria-label="Primary" className="nav-links">
          {LINKS.map((key) => (
            <a key={key} href={`#${key}`} onClick={(e) => go(e, `#${key}`)}>
              <RollText>{ui.nav[key]}</RollText>
            </a>
          ))}
        </nav>
        <Magnetic strength={0.3}>
          <a href="#contact" className="btn btn-pill nav-cta" onClick={(e) => go(e, '#contact')}>
            <span className="btn-dot" />
            <RollText>{ui.nav.letsTalk}</RollText>
          </a>
        </Magnetic>
        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div id="menu" ref={menu} className="menu" aria-hidden={!open} style={{ visibility: 'hidden' }}>
        <nav aria-label="Mobile">
          {LINKS.map((key, i) => (
            <a key={key} href={`#${key}`} onClick={(e) => go(e, `#${key}`)} tabIndex={open ? 0 : -1}>
              <span className="menu-link-mask">
                <span className="menu-link">
                  <small>0{i + 1}</small>
                  {ui.nav[key]}
                </span>
              </span>
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1}>
            {profile.email}
          </a>
          <span>{profile.location}</span>
        </div>
      </div>
    </>
  )
}
