// Values that are the same in every language: links, colours, images.
// Translatable text lives in en.js and ar.js.
//
// Project images: drop files into /public/projects/ and set
// `image: '/projects/your-file.jpg'` below. Without an image, the
// card renders generated artwork in the project's `color`.

export const shared = {
  email: 'heshamtarek132@gmail.com',
  whatsapp: '+20 115 433 3699',
  cv: '/Tarek_Hesham_UIUX_Designer_CV.pdf',
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
  projects: {
    tadamun: { color: '#ff5a1f', image: null, link: null },
    bubblz: { color: '#4dd9ff', image: null, link: 'https://www.behance.net/gallery/239845319/Bubbles-Laundry-Delivery' },
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
