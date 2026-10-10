import { lazy, Suspense, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll, lockScroll } from './lib/scroll'
import { useContent } from './i18n/LangContext'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Marquee from './components/Marquee'
import Work from './components/Work'
import Services from './components/Services'
import Experience from './components/Experience'
import Contact from './components/Contact'

const Scene = lazy(() => import('./three/Scene'))

export default function App() {
  const { lang, ui, profile } = useContent()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initScroll()
    lockScroll(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    lockScroll(false)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [ready])

  return (
    <>
      <a href="#main" className="skip-link">
        {ui.skip}
      </a>
      <Suspense fallback={null}>
        <Scene ready={ready} lang={lang} portrait={profile.heroPortrait} />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      {loading && <Preloader onReveal={() => setReady(true)} onComplete={() => setLoading(false)} />}
      <div className="lang-curtain" aria-hidden="true">
        <span className="lang-curtain-mask">
          <span className="lang-curtain-label" />
        </span>
      </div>
      <Nav ready={ready} />
      {/* Remounting on language change replays every section's animations. */}
      <main id="main" key={lang}>
        <Hero ready={ready} />
        <About />
        <Marquee />
        <Work />
        <Services />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
