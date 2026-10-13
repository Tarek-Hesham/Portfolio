import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { scrollToTarget } from '../lib/scroll'
import { Magnetic, RollText, SectionLabel } from './ui'

function GiantWord({ text, className = '' }) {
  return (
    <span className={`giant-word ${className}`}>
      {text.split('').map((c, i) => (
        <span key={i} className="giant-char">
          {c}
        </span>
      ))}
    </span>
  )
}

export default function Contact() {
  const { profile, ui } = useContent()
  const t = ui.contact
  const root = useRef(null)
  const [copied, setCopied] = useState(false)

  useGSAP(
    () => {
      gsap.fromTo(
        '.contact-title .mask > span',
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          stagger: 0.12,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
        },
      )
      gsap.fromTo(
        '.contact-fade',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.contact-actions', start: 'top 92%' },
        },
      )
      // Giant name rises letter by letter as you reach the very bottom.
      gsap.fromTo(
        '.giant-char',
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.footer-giant', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        },
      )
      // The contact orb breathes slowly so it invites a click.
      gsap.to('.contact-orb', { scale: 1.06, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: root },
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const year = new Date().getFullYear()

  return (
    <section ref={root} id="contact" className="contact section">
      <div className="container">
        <SectionLabel index="05">{t.label}</SectionLabel>
        <h2 className="contact-title">
          <span className="mask">
            <span>{t.title1}</span>
          </span>
          <span className="mask">
            <span>
              {t.title2a} <span className="accent-italic">{t.title2b}</span>
            </span>
          </span>
        </h2>

        <div className="contact-actions">
          <Magnetic strength={0.4} className="contact-fade">
            <a href={`mailto:${profile.email}`} className="contact-orb" data-cursor={t.cursor}>
              <span>{t.orb}</span>
            </a>
          </Magnetic>

          <div className="contact-details">
            <p className="mono contact-fade">{t.dropLine}</p>
            <a href={`mailto:${profile.email}`} className="contact-email contact-fade" dir="ltr">
              <RollText>{profile.email}</RollText>
            </a>
            <div className="contact-buttons contact-fade">
              <button className="btn btn-pill btn-ghost" onClick={copy}>
                <span aria-live="polite">{copied ? t.copied : t.copy}</span>
              </button>
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-pill btn-ghost"
                >
                  <RollText>
                    {t.whatsapp} <bdi dir="ltr">{profile.whatsapp}</bdi>
                  </RollText>
                </a>
              )}
            </div>
            <p className="mono contact-fade">
              {profile.location} · {profile.availability}
            </p>
          </div>
        </div>

        <footer className="footer">
          <ul className="footer-socials">
            {profile.socials.map((s) => (
              <li key={s.key}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  <RollText>{s.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
          <div className="footer-bottom mono">
            <span>
              © {year} {profile.firstName} {profile.lastName}
            </span>
            <span>{t.madeWith}</span>
            <button className="footer-top" onClick={() => scrollToTarget(0)}>
              <RollText>{t.backTop}</RollText>
            </button>
          </div>
        </footer>
      </div>
      <p className="footer-giant" aria-hidden="true">
        <GiantWord text={profile.firstName} />
        <GiantWord text={profile.lastName} className="is-accent" />
      </p>
    </section>
  )
}
