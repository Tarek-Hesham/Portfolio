import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { education, experience, profile } from '../data/content'
import { Magnetic, RollText, SectionLabel } from './ui'

export default function Experience() {
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
    <section ref={root} id="experience" className="experience section" data-scene="experience">
      <div className="container">
        <SectionLabel index="04">Experience</SectionLabel>
        <div className="exp-head">
          <h2 className="exp-title">
            <span className="mask">
              <span>Where I've</span>
            </span>{' '}
            <span className="mask">
              <span className="accent-italic">worked</span>
            </span>
          </h2>
          {profile.cv && (
            <Magnetic>
              <a href={profile.cv} className="btn btn-pill btn-accent" download>
                <RollText>Download full CV</RollText> <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
          )}
        </div>

        <ol className="exp-list">
          {experience.map((job) => (
            <li key={job.company + job.role} className="exp-row">
              <span className="exp-line" />
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

        <div className="exp-extra">
          <div>
            <p className="mono">Education</p>
            <p className="exp-extra-main">{education.degree}</p>
            <p className="exp-extra-sub">
              {education.school} · {education.year}
            </p>
          </div>
          <div>
            <p className="mono">Languages</p>
            {education.languages.map((l) => (
              <p key={l.name} className="exp-extra-main">
                {l.name} <span className="exp-extra-sub">— {l.level}</span>
              </p>
            ))}
          </div>
          <div>
            <p className="mono">Tools</p>
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
