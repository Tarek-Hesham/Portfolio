import { lazy, Suspense, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll, jumpTo, lockScroll } from './lib/scroll'
import { useRoute } from './lib/router'
import { isTransitioning, savedHomeScroll } from './lib/transitions'
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
import ProjectPage from './pages/ProjectPage'

const Scene = lazy(() => import('./three/Scene'))

export default function App() {
  const { lang, ui, profile, projects } = useContent()
  const route = useRoute()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const project = route.name === 'project' ? projects.find((p) => p.slug === route.slug) : null
  const page = project ? 'project' : 'home'

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

  // Browser back/forward: no animated transition is running, so reset scroll here.
  useEffect(() => {
    if (isTransitioning()) return
    jumpTo(page === 'home' ? savedHomeScroll() : 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [route.path, page])

  useEffect(() => {
    const name = `${profile.firstName} ${profile.lastName}`
    document.title = project ? `${project.title} — ${name}` : `${name} — ${profile.role}`
  }, [project, profile])

  return (
    <>
      <a href="#main" className="skip-link">
        {ui.skip}
      </a>
      <Suspense fallback={null}>
        <Scene ready={ready} lang={lang} portrait={profile.heroPortrait} page={page} />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      {loading && <Preloader onReveal={() => setReady(true)} onComplete={() => setLoading(false)} />}
      <div className="lang-curtain" aria-hidden="true">
        <span className="lang-curtain-mask">
          <span className="lang-curtain-label" />
        </span>
      </div>
      <Nav ready={ready} page={page} />
      {/* Remounting on language/route change replays every section's animations. */}
      <main id="main" key={`${lang}:${route.path}`}>
        {project ? (
          <ProjectPage project={project} ready={ready} />
        ) : (
          <>
            <Hero ready={ready} />
            <About />
            <Marquee />
            <Work />
            <Services />
            <Experience />
            <Contact />
          </>
        )}
      </main>
    </>
  )
}
