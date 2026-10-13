import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useContent } from '../data/content'
import { Magnetic, RollText, SectionLabel } from './ui'

export default function Experience() {
  const { education, experience, profile, ui } = useContent()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.exp-title .mask > span',
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.1,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.exp-title', start: 'top 85%' },
        },
      )

      // Timeline rail fills as you read down the list; each dot lights up as it's reached.
      gsap.fromTo(
        '.exp-rail-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.exp-list', start: 'top 70%', end: 'bottom 60%', scrub: true } },
      )

      gsap.utils.toArray('.exp-row').forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } })
          .fromTo(row.querySelector('.exp-line'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' })
          .fromTo(
            row.querySelectorAll('.exp-anim'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.06, ease: 'expo.out' },
            0.25,
          )
        gsap.fromTo(
          row.querySelector('.exp-dot'),
          { scale: 0.4, backgroundColor: 'rgba(241,237,230,0.25)' },
          {
            scale: 1,
            backgroundColor: '#ff5a1f',
            duration: 0.5,
            ease: 'back.out(3)',
            scrollTrigger: { trigger: row, start: 'top 62%', toggleActions: 'play none none reverse' },
          },
        )
      })

      gsap.fromTo(
        '.exp-extra > *',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.exp-extra', start: 'top 88%' },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="experience" className="experience section">
      <div className="container">
        <SectionLabel index="04">{ui.experience.label}</SectionLabel>
        <div className="exp-head">
          <h2 className="exp-title">
            <span className="mask">
              <span>{ui.experience.title1}</span>
            </span>{' '}
            <span className="mask">
              <span className="accent-italic">{ui.experience.title2}</span>
            </span>
          </h2>
          {profile.cv && (
            <Magnetic>
              <a href={profile.cv} className="btn btn-pill btn-accent" download>
                <RollText>{ui.experience.download}</RollText> <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
          )}
        </div>

        <div className="exp-wrap">
        <span className="exp-rail" aria-hidden="true">
          <span className="exp-rail-fill" />
        </span>
        <ol className="exp-list">
          {experience.map((job) => (
            <li key={job.company + job.role} className="exp-row">
              <span className="exp-line" />
              <span className="exp-dot" aria-hidden="true" />
              <p className="mono exp-period exp-anim">{job.period}</p>
              <div className="exp-anim">
                <h3 className="exp-role">{job.role}</h3>
                <p className="exp-company">{job.company}</p>
              </div>
              <div className="exp-body exp-anim">
                <p className="mono exp-place">{job.place}</p>
                <ul>
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        </div>

        <div className="exp-extra">
          <div>
            <p className="mono">{ui.experience.education}</p>
            <p className="exp-extra-main">{education.degree}</p>
            <p className="exp-extra-sub">
              {education.school} · {education.year}
            </p>
          </div>
          <div>
            <p className="mono">{ui.experience.languages}</p>
            {education.languages.map((l) => (
              <p key={l.name} className="exp-extra-main">
                {l.name} <span className="exp-extra-sub">— {l.level}</span>
              </p>
            ))}
          </div>
          <div>
            <p className="mono">{ui.experience.tools}</p>
            <ul className="exp-tools">
              {education.tools.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
