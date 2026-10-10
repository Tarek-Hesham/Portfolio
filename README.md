# Tarek Hesham — Portfolio

Immersive portfolio built with React, Three.js (react-three-fiber), GSAP and Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Edit your content

Text lives in two files — `src/data/en.js` (English) and `src/data/ar.js` (Arabic).
Links, colours, images and numbers shared by both languages live in `src/data/shared.js`.
Visitors switch language from the nav button; `?lang=ar` opens the Arabic version directly.

- **Case studies (Bubblz, King Go, Rafiky):** each has its own page at `/work/<slug>`. Web-sized covers,
  slides and videos live in `public/projects/<slug>/` (generated from the `مشاريع` folder, which git ignores).
  Text for each case study is under `featured` in `en.js` / `ar.js`; the slide list is `src/data/projects.manifest.json`.
- **Smaller projects** are under `archive` and open in a quick-view overlay.
- **CV:** source in `cv/cv.html`; the PDF in `public/` is what visitors download.
- **Hero 3D portrait:** replace `public/portrait.jpg` (square, dark background works best — a larger image gives more detail).
- **About photo:** put a file in `public/` and set `portrait` in `shared.js`.
- **Accent colour:** change `--accent` in `src/styles/global.css` (and `#ff5a1f` in `src/three/Scene.jsx`).

## What's inside

| Area | File |
| --- | --- |
| 3D scene (chrome blob, particles, scroll keyframes) | `src/three/Scene.jsx` |
| Particle portrait (cursor lens, assemble/dissolve) | `src/three/Portrait.jsx` |
| Floating 3D design-tool icons | `src/three/ToolIcons.jsx` |
| Language switching | `src/i18n/LangContext.jsx` |
| Smooth scroll + shared scroll state | `src/lib/scroll.js` |
| Preloader, cursor, nav, sections | `src/components/` |
| Styles & design tokens | `src/styles/global.css` |

The site respects `prefers-reduced-motion` (no smooth scroll, no pinning, calmer 3D)
and swaps the horizontal project scroll for a vertical list on screens under 900px.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages): build command `npm run build`,
output folder `dist`. `vercel.json` and `public/_redirects` make `/work/...` links work on refresh.
