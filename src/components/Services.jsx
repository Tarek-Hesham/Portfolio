import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { services } from '../data/content'
import { SectionLabel } from './ui'

export default function Services() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.services-title .mask > span',
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.1,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.services-title', start: 'top 85%' },
        },
      )
      gsap.utils.toArray('.service').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } })
        tl.fromTo(row.querySelector('.service-line'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }).fromTo(
          row.querySelectorAll('.service-anim'),
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.06, ease: 'expo.out' },
          0.3,
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="services" className="services section" data-scene="services">
      <div className="container">
        <SectionLabel index="03">Services</SectionLabel>
        <h2 className="services-title">
          <span className="mask">
            <span>What I</span>
          </span>{' '}
          <span className="mask">
            <span className="accent-italic">bring</span>
          </span>
        </h2>

        <ul className="services-list">
          {services.map((s, i) => (
            <li key={s.title} className="service" tabIndex={0}>
              <span className="service-line" />
              <span className="service-fill" />
              <span className="mono service-index service-anim">0{i + 1}</span>
              <h3 className="service-title service-anim">{s.title}</h3>
              <p className="service-desc service-anim">{s.description}</p>
              <ul className="service-tags service-anim" aria-label={`${s.title} tools`}>
                {s.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="service-end" aria-hidden="true">
            <span className="service-line" />
          </li>
        </ul>
      </div>
    </section>
  )
}
