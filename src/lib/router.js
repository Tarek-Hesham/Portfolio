import { useSyncExternalStore } from 'react'

// Tiny History-API router: "/" is home, "/work/<slug>" is a case study.

const listeners = new Set()

function parse(pathname) {
  const m = pathname.match(/^\/work\/([\w-]+)\/?$/)
  if (m) return { name: 'project', slug: m[1], path: pathname }
  return { name: 'home', path: '/' }
}

let current = typeof window !== 'undefined' ? parse(window.location.pathname) : { name: 'home', path: '/' }

function emit() {
  current = parse(window.location.pathname)
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') window.addEventListener('popstate', emit)

export function navigate(path) {
  if (path === window.location.pathname) return
  window.history.pushState({}, '', path + window.location.search)
  emit()
}

export function useRoute() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
  )
}
