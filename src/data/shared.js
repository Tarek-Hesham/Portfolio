// Values that are the same in every language: links, colours, images.
// Translatable text lives in en.js and ar.js.
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
  // Optional photo for the About section: '/about.jpg' (put the file in /public)
  portrait: null,
  socials: [
    { key: 'behance', href: 'https://www.behance.net/heshamtareedf5' },
    { key: 'linkedin', href: 'https://www.linkedin.com/in/tarek-hesham-2581971a7' },
    { key: 'whatsapp', href: 'https://wa.me/201154333699' },
    { key: 'email', href: 'mailto:heshamtarek132@gmail.com' },
  ],
  featured: {
    bubblz: featured('bubblz', {
      color: '#9b7bff',
      link: 'https://www.behance.net/gallery/239845319/Bubbles-Laundry-Delivery',
    }),
    kinggo: featured('king-go', { color: '#4da3ff', link: null }),
    rafiky: featured('rafiky', { color: '#f5a524', link: null }),
  },
  // Smaller projects listed under the featured case studies.
  archive: {
    tadamun: { color: '#ff5a1f', image: null, link: null },
    trendora: { color: '#d7ff3a', image: null, link: null },
    learnnova: { color: '#9dff8a', image: null, link: 'https://www.behance.net/gallery/229712835/Learnnova-Learning-website' },
    easycar: {
      color: '#ffb36b',
      image: null,
      link: 'https://www.behance.net/gallery/154054045/Car-Finance-Mobile-App-Case-Study-Easy-Car',
    },
    realestate: { color: '#e8d5b0', image: null, link: 'https://www.behance.net/gallery/212660243/Real-Estate-Agency' },
    lcis: { color: '#ff4d8d', image: null, link: null },
  },
  stats: [
    { value: 3, suffix: '+' },
    { value: 8, suffix: '+' },
    { value: 20, suffix: '+' },
    { value: 3, suffix: '' },
  ],
  tools: ['Figma', 'Framer', 'Maze', 'Photoshop', 'Illustrator', 'Notion'],
}
