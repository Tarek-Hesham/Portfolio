import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { profile } from '../data/content'
import { scrollToTarget } from '../lib/scroll'
import { Magnetic, RollText, SectionLabel } from './ui'

export default function Contact() {
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
    <section ref={root} id="contact" className="contact section" data-scene="contact">
      <div className="container">
        <SectionLabel index="05">Contact</SectionLabel>
        <h2 className="contact-title">
          <span className="mask">
            <span>Let's build</span>
          </span>
          <span className="mask">
            <span>
              something <span className="accent-italic">bold.</span>
            </span>
          </span>
        </h2>

        <div className="contact-actions">
          <Magnetic strength={0.4} className="contact-fade">
            <a href={`mailto:${profile.email}`} className="contact-orb" data-cursor="Say hi">
              <span>Get in touch</span>
            </a>
          </Magnetic>

          <div className="contact-details">
            <p className="mono contact-fade">Drop me a line</p>
            <a href={`mailto:${profile.email}`} className="contact-email contact-fade">
              <RollText>{profile.email}</RollText>
            </a>
            <div className="contact-buttons contact-fade">
              <button className="btn btn-pill btn-ghost" onClick={copy}>
                <span aria-live="polite">{copied ? 'Copied to clipboard ✓' : 'Copy email'}</span>
              </button>
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-pill btn-ghost"
                >
                  <RollText>WhatsApp {profile.whatsapp}</RollText>
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
              <li key={s.label}>
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
            <span>Designed & built with care</span>
            <button className="footer-top" onClick={() => scrollToTarget(0)}>
              <RollText>Back to top ↑</RollText>
            </button>
          </div>
        </footer>
      </div>
      <p className="footer-giant" aria-hidden="true">
        {profile.firstName}
        <span>{profile.lastName}</span>
      </p>
    </section>
  )
}
