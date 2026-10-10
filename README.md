# Tarek Hesham — Portfolio

Immersive portfolio built with React, Three.js (react-three-fiber), GSAP and Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Edit your content

Everything — name, bio, projects, services, skills, stats, socials — lives in
`src/data/content.js`. The projects and stats there are **samples**; replace them.

- **Project images:** put files in `public/projects/` and set `image: '/projects/name.jpg'`.
  Without an image, the card shows generated art in the project's `color`.
- **Portrait:** put `portrait.jpg` in `public/` and set `portrait: '/portrait.jpg'`.
- **Accent colour:** change `--accent` in `src/styles/global.css` (and `#ff5a1f` in `src/three/Scene.jsx`).

## What's inside

| Area | File |
| --- | --- |
| 3D scene (chrome blob, particles, floating shapes, scroll keyframes) | `src/three/Scene.jsx` |
| Smooth scroll + shared scroll state | `src/lib/scroll.js` |
| Preloader, cursor, nav, sections | `src/components/` |
| Styles & design tokens | `src/styles/global.css` |

The site respects `prefers-reduced-motion` (no smooth scroll, no pinning, calmer 3D)
and swaps the horizontal project scroll for a vertical list on screens under 900px.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages): build command `npm run build`,
output folder `dist`.
