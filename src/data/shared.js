// Links, colours and images.
// The text lives in en.js.
import manifest from './projects.manifest.json'

// Featured case studies — each gets its own page at /work/<slug>.
// Images are generated from the source folders into /public/projects/<slug>/.
const featured = (slug, extra) => ({
  slug,
  cover: `/projects/${slug}/cover.webp`,
  cardCover: `/projects/${slug}/cover-card.webp`,
  preview: `/projects/${slug}/preview.mp4`,
  reel: `/projects/${slug}/reel.mp4`,
  slides: manifest[slug]?.slides ?? [],
  ...extra,
})

export const shared = {
  email: 'heshamtarek132@gmail.com',
  whatsapp: '+20 115 433 3699',
  cv: '/Tarek_Hesham_Product_Designer_CV.pdf',
  timezone: 'Africa/Cairo',
  available: true,
  // Photo used for the 3D particle portrait in the hero.
  heroPortrait: '/portrait.jpg',
  // Photo in the About section frame (shown as initials when null).
  portrait: '/portrait.jpg',
  socials: [
    { key: 'behance', href: 'https://www.behance.net/heshamtareedf5' },
    { key: 'linkedin', href: 'https://www.linkedin.com/in/tarek-hesham-2581971a7' },
    { key: 'whatsapp', href: 'https://wa.me/201154333699' },
    { key: 'email', href: 'mailto:heshamtarek132@gmail.com' },
  ],
  featured: {
    // Reel and preview cut from the project's own motion clips.
    kalo: featured('kalo', { color: '#5cc98b', link: null }),
    bubblz: featured('bubblz', {
      color: '#9b7bff',
      link: 'https://www.behance.net/gallery/239845319/Bubbles-Laundry-Delivery',
    }),
    kinggo: featured('king-go', { color: '#4da3ff', link: null }),
    rafiky: featured('rafiky', { color: '#f5a524', link: null }),
    // No hover preview yet: the cover motion still needs compressing.
    trendora: featured('trendora', { color: '#2ee5f5', link: null, preview: null }),
    // Slides only: this project has no motion files.
    learnnova: featured('learnnova', {
      color: '#c8ff3d',
      link: 'https://www.behance.net/gallery/229712835/Learnnova-Learning-website',
      preview: null,
      reel: null,
    }),
    // Reels and previews rendered from the redesign pages (desktop + mobile).
    dreamhome: featured('dream-home', { color: '#e2963a', link: null }),
    premiumaqar: featured('premium-aqar', { color: '#d6c3a0', link: null }),
    // Reel scrolls through key case-study slides (no full pages for this app).
    easycar: featured('easy-car', {
      color: '#ff7eb6',
      link: 'https://www.behance.net/gallery/154054045/Car-Finance-Mobile-App-Case-Study-Easy-Car',
    }),
  },
  // Smaller projects listed under the featured case studies.
  archive: {},
  stats: [
    { value: 3, suffix: '+' },
    { value: 8, suffix: '+' },
    { value: 20, suffix: '+' },
    { value: 3, suffix: '' },
  ],
  tools: ['Figma', 'Framer', 'Maze', 'Photoshop', 'Illustrator', 'Notion'],
}
