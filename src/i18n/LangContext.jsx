import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shared } from '../data/shared'
import en from '../data/en'
import ar from '../data/ar'
import { jumpTo, lockScroll } from '../lib/scroll'

const DICTS = { en, ar }

function build(lang) {
  const t = DICTS[lang]
  return {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    ui: t.ui,
    profile: {
      ...shared,
      ...t.profile,
      socials: shared.socials.map((s) => ({ ...s, label: t.socialLabels[s.key] })),
    },
    about: t.about,
    stats: shared.stats.map((s, i) => ({ ...s, label: t.statLabels[i] })),
    skills: t.skills,
    projects: t.projects.map((p) => ({ ...shared.projects[p.id], ...p })),
    services: t.services,
    experience: t.experience,
    education: { ...t.education, tools: shared.tools },
  }
}

function initialLang() {
  try {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (param === 'ar' || param === 'en') return param
    const saved = localStorage.getItem('lang')
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  return 'en'
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)
  const busy = useRef(false)
  const content = useMemo(() => build(lang), [lang])

  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  // Curtain wipe → swap language under it → page re-intros as it lifts.
  const switchLang = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    const next = lang === 'ar' ? 'en' : 'ar'
    const curtain = document.querySelector('.lang-curtain')
    const label = curtain?.querySelector('.lang-curtain-label')
    if (label) label.textContent = next === 'ar' ? 'العربية' : 'English'

    lockScroll(true)
    if (curtain) {
      gsap.set(curtain, { display: 'grid', clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.fromTo(label, { yPercent: 120 }, { yPercent: 0, duration: 0.9, delay: 0.25, ease: 'expo.out' })
      await gsap.to(curtain, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
    }

    jumpTo(0)
    setLang(next)
    try {
      await Promise.race([
        document.fonts.load(next === 'ar' ? '700 1em Alexandria' : '700 1em "Bricolage Grotesque"'),
        new Promise((r) => setTimeout(r, 1200)),
      ])
    } catch {
      /* font API unavailable */
    }
    await new Promise((r) => setTimeout(r, 250))
    ScrollTrigger.refresh()

    if (curtain) {
      gsap.to(label, { yPercent: -120, duration: 0.6, ease: 'power3.in' })
      await gsap.to(curtain, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, delay: 0.2, ease: 'expo.inOut' })
      gsap.set(curtain, { display: 'none' })
    }
    lockScroll(false)
    busy.current = false
  }, [lang])

  const value = useMemo(() => ({ ...content, switchLang }), [content, switchLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  return useContext(LangContext)
}
