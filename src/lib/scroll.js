import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Shared, mutable scroll state. Read it inside animation loops
// (useFrame / gsap.ticker) — it never triggers React renders.
export const scrollState = { y: 0, velocity: 0, direction: 1, progress: 0 }

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

let lenis = null

function raf(time) {
  lenis?.raf(time * 1000)
}

function onNativeScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrollState.y = window.scrollY
  scrollState.progress = max > 0 ? window.scrollY / max : 0
}

export function initScroll() {
  if (lenis || typeof window === 'undefined') return

  if (prefersReducedMotion) {
    window.addEventListener('scroll', onNativeScroll, { passive: true })
    onNativeScroll()
    return
  }

  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.4 })
  lenis.on('scroll', (e) => {
    scrollState.y = e.scroll
    scrollState.velocity = e.velocity
    scrollState.direction = e.direction || scrollState.direction
    scrollState.progress = e.progress
    ScrollTrigger.update()
  })
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
}

export function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : null
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    else window.scrollTo({ top: typeof target === 'number' ? target : 0 })
  }
}

export function jumpTo(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
  scrollState.y = y
}


export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.classList.toggle('is-locked', locked)
}
