import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { SectionLabel } from './ui'

export default function About() {
  const { about, profile, stats, ui } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      // Word-by-word light-up, scrubbed with scroll.
      gsap.fromTo(
        '.about-statement .w',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.about-statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )

      gsap.utils.toArray('.about-fade').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } },
        )
      })

      // Portrait: clip reveal.
      gsap.fromTo(
        '.about-portrait',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '.about-portrait', start: 'top 80%' },
        },
      )

      // Count-up stats.
      gsap.utils.toArray('.stat-value').forEach((el) => {
        const end = Number(el.dataset.value)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        })
      })
    },
    { scope: root },
  )

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`

  return (
    <section ref={root} id="about" className="about section">
      <div className="container">
        <SectionLabel index="01">{ui.about.label}</SectionLabel>
        <h2 className="about-statement">
          {about.statement.split(' ').map((w, i) => (
            <span key={i} className="w">
              {w}{' '}
            </span>
          ))}
        </h2>

        <div className="about-grid">
          <figure className="about-portrait">
            <div className="about-portrait-inner">
              {profile.portrait ? (
                <>
                  <img
                    className="about-portrait-art"
                    src={profile.portrait}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    loading="lazy"
                  />
                  <img className="about-portrait-photo" src={profile.portrait} alt="" aria-hidden="true" loading="lazy" />
                </>
              ) : (
                <div className="about-portrait-placeholder" aria-hidden="true">
                  <span>{initials}</span>
                </div>
              )}
            </div>
            <figcaption className="mono">({profile.firstName} — {profile.location})</figcaption>
            {/* Poster look: the photo flattened into four tones of the site palette. */}
            <svg className="about-portrait-filter" aria-hidden="true">
              <filter id="portrait-poster" colorInterpolationFilters="sRGB">
                <feColorMatrix type="saturate" values="0" />
                {/* Six equal brightness bands: black, brown, accent ×2, cream ×2. */}
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues="0.039 0.29 1 1 0.945 0.945" />
                  <feFuncG type="discrete" tableValues="0.039 0.141 0.353 0.353 0.929 0.929" />
                  <feFuncB type="discrete" tableValues="0.039 0.078 0.122 0.122 0.902 0.902" />
                </feComponentTransfer>
              </filter>
            </svg>
          </figure>

          <div className="about-copy">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="about-fade">
                {p}
              </p>
            ))}
            <dl className="about-details about-fade">
              {about.details.map((d) => (
                <div key={d.label}>
                  <dt className="mono">{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <ul className="stats" aria-label={ui.about.highlights}>
          {stats.map((s) => (
            <li key={s.label} className="stat about-fade">
              <p className="stat-number">
                <span className="stat-value" data-value={s.value}>
                  {s.value}
                </span>
                <span className="stat-suffix">{s.suffix}</span>
              </p>
              <p className="mono stat-label">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
