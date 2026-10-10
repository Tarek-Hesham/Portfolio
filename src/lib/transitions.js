import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { navigate } from './router'
import { jumpTo, lockScroll, prefersReducedMotion, scrollState } from './scroll'

// Page transitions between home and the case-study pages.

let busy = false
let homeScroll = 0

export const isTransitioning = () => busy
export const savedHomeScroll = () => homeScroll

const frames = (n = 3) =>
  new Promise((resolve) => {
    const step = () => (--n ? requestAnimationFrame(step) : resolve())
    requestAnimationFrame(step)
  })

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

function rememberHome(nextPath) {
  if (window.location.pathname === '/' && nextPath !== '/') homeScroll = scrollState.y
}

// The clicked cover grows to fill the screen and becomes the case-study hero.
export async function openProject(project, fromImg) {
  const path = `/work/${project.slug}`
  if (busy) return
  if (!fromImg || prefersReducedMotion) return curtainTo(path, { label: project.title })
  busy = true
  rememberHome(path)
  lockScroll(true)

  const rect = fromImg.getBoundingClientRect()
  const clone = document.createElement('div')
  clone.className = 'route-clone'
  const img = document.createElement('img')
  img.alt = ''
  img.src = fromImg.currentSrc || fromImg.src
  clone.appendChild(img)
  document.body.appendChild(clone)
  gsap.set(clone, { top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 16 })

  const hiRes = preload(project.cover)
  await gsap.to(clone, {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    duration: 1.1,
    ease: 'expo.inOut',
  })
  await hiRes
  img.src = project.cover

  jumpTo(0)
  navigate(path)
  await frames()
  jumpTo(0)
  ScrollTrigger.refresh()

  await gsap.to(clone, { opacity: 0, duration: 0.6, delay: 0.15, ease: 'power2.out' })
  clone.remove()
  lockScroll(false)
  busy = false
}

// Accent curtain wipe for every other route change.
export async function curtainTo(path, { label = '', hash = null } = {}) {
  if (busy) return
  busy = true
  rememberHome(path)
  const curtain = document.querySelector('.lang-curtain')
  const text = curtain?.querySelector('.lang-curtain-label')
  if (text) text.textContent = label
  lockScroll(true)

  if (curtain) {
    gsap.set(curtain, { display: 'grid', clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.fromTo(text, { yPercent: 120 }, { yPercent: 0, duration: 0.9, delay: 0.25, ease: 'expo.out' })
    await gsap.to(curtain, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
  }

  jumpTo(0)
  navigate(path)
  await frames()
  ScrollTrigger.refresh()
  const target = hash && document.querySelector(hash)
  if (target) jumpTo(target.getBoundingClientRect().top + window.scrollY)
  else if (path === '/' && homeScroll) jumpTo(homeScroll)

  if (curtain) {
    gsap.to(text, { yPercent: -120, duration: 0.6, ease: 'power3.in' })
    await gsap.to(curtain, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, delay: 0.2, ease: 'expo.inOut' })
    gsap.set(curtain, { display: 'none' })
  }
  lockScroll(false)
  busy = false
}
