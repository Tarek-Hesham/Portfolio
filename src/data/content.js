// ─────────────────────────────────────────────────────────────
//  All site content lives here (sourced from Tarek's CV).
//  Edit this file to update the portfolio — no component changes needed.
//
//  Project images: drop files into /public/projects/ and set
//  `image: '/projects/your-file.jpg'`. Without an image, the
//  card renders generated artwork in the project's `color`.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: 'Tarek',
  lastName: 'Hesham',
  role: 'UI/UX Designer',
  roleDetail: 'Mobile & Web Product Design · Fintech · Arabic/English (RTL)',
  tagline:
    'I design mobile and web products that turn complex workflows into simple, bilingual experiences — from user research to pixel-perfect developer handoff.',
  location: 'Cairo, Egypt',
  availability: 'Open to remote & GCC',
  timezone: 'Africa/Cairo',
  available: true,
  email: 'heshamtarek132@gmail.com',
  whatsapp: '+20 115 433 3699',
  cv: '/Tarek_Hesham_UIUX_Designer_CV.pdf',
  // Optional portrait: '/portrait.jpg' (put the file in /public)
  portrait: null,
  socials: [
    { label: 'Behance', href: 'https://www.behance.net/heshamtareedf5' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tarek-hesham-2581971a7' },
    { label: 'WhatsApp', href: 'https://wa.me/201154333699' },
    { label: 'Email', href: 'mailto:heshamtarek132@gmail.com' },
  ],
}

export const about = {
  statement:
    'I turn complex financial and operational workflows into simple, human interfaces — in Arabic and English.',
  paragraphs: [
    'UI/UX Designer with 3+ years of end-to-end product design for mobile and web — user research, user flows and wireframes through high-fidelity prototypes, design systems and developer handoff — built on 8+ years of graphic design.',
    'Today I lead the digital transformation of loan operations at a microfinance institution, turning manual field and back-office processes into mobile apps for clients, loan officers and monitoring teams. I’ve shipped work across fintech, on-demand services, marketplaces, e-learning and real estate, including fully bilingual RTL products for the Saudi market — and my accounting background helps me make money-heavy flows feel effortless.',
  ],
  details: [
    { label: 'Based in', value: 'Cairo, Egypt' },
    { label: 'Focus', value: 'Mobile · Web · Fintech · RTL' },
    { label: 'Working', value: 'Remote & GCC' },
  ],
}

export const stats = [
  { value: 3, suffix: '+', label: 'Years in UI/UX' },
  { value: 8, suffix: '+', label: 'Years of graphic design' },
  { value: 20, suffix: '+', label: 'Projects completed' },
  { value: 3, suffix: '', label: 'Client markets — KSA, UK, EG' },
]

export const skills = [
  'User Research',
  'Usability Testing',
  'User Flows',
  'Wireframing',
  'Prototyping',
  'Design Systems',
  'Arabic / RTL',
  'Mobile Apps',
  'Responsive Web',
  'Information Architecture',
  'Figma',
  'Framer',
  'Maze',
]

export const projects = [
  {
    title: 'Al Tadamun Loan Suite',
    category: 'Fintech · Mobile Apps',
    year: '2023 — Now',
    role: 'Lead UI/UX Designer',
    color: '#ff5a1f',
    image: null,
    link: null,
    scope: ['User Research', 'Workflow Mapping', 'Usability Testing', 'Design System'],
    description:
      'Digital transformation of loan operations at Al Tadamun Microfinance Foundation. I mapped manual field and back-office workflows and redesigned them as three connected mobile apps: a client loan application app, a loan officer app for targets, incentives and repayment follow-ups, and a monitoring & reporting app that gives supervisors real-time visibility into field operations.',
  },
  {
    title: 'Bubblz',
    category: 'On-demand · Mobile App',
    year: 'Saudi Arabia',
    role: 'UI/UX Designer',
    color: '#4dd9ff',
    image: null,
    link: 'https://www.behance.net/gallery/239845319/Bubbles-Laundry-Delivery',
    scope: ['Customer App', 'Provider Dashboard', 'Payments', 'Arabic / English RTL'],
    description:
      'A laundry delivery app for the Saudi market. I designed the full customer and service-provider experience — ordering, payments, urgent service and provider dashboards — with complete Arabic/English (RTL/LTR) support localized for Saudi users.',
  },
  {
    title: 'Trendora',
    category: 'Marketplace · Mobile App',
    year: 'Freelance',
    role: 'UI/UX Designer',
    color: '#d7ff3a',
    image: null,
    link: null,
    scope: ['Bidding System', 'User Flows', 'Component Library'],
    description:
      'A social media marketplace with a bidding system for account and growth services. I built intuitive buying and bidding flows and a clean component library for a young, digital-native audience.',
  },
  {
    title: 'Learnnova',
    category: 'E-learning · Web Platform',
    year: 'Freelance',
    role: 'UI/UX Designer',
    color: '#9dff8a',
    image: null,
    link: 'https://www.behance.net/gallery/229712835/Learnnova-Learning-website',
    scope: ['Responsive Web', 'Course Discovery', 'Mentorship Flows', 'Design System'],
    description:
      'A responsive learning platform for students and mentors, covering course discovery, course detail pages and mentorship flows — backed by a scalable design system.',
  },
  {
    title: 'Easy Car',
    category: 'Fintech · Mobile App',
    year: 'Case Study',
    role: 'UI/UX Designer',
    color: '#ffb36b',
    image: null,
    link: 'https://www.behance.net/gallery/154054045/Car-Finance-Mobile-App-Case-Study-Easy-Car',
    scope: ['UX Case Study', 'Mobile App', 'Finance Flows'],
    description:
      'A car finance mobile app case study — exploring how to make browsing, comparing and financing a car a clear, guided experience on mobile.',
  },
  {
    title: 'Premium Real Estate',
    category: 'Real Estate · Website',
    year: 'Freelance',
    role: 'Design & Build',
    color: '#e8d5b0',
    image: null,
    link: 'https://www.behance.net/gallery/212660243/Real-Estate-Agency',
    scope: ['Responsive Web', 'Listings', 'Framer'],
    description:
      'A corporate website I designed and built for property listings, investment opportunities and services — responsive and easy to browse on any device.',
  },
  {
    title: 'LCIS London',
    category: 'Consultancy · Brand & Web',
    year: 'United Kingdom',
    role: 'Brand & UI/UX Designer',
    color: '#ff4d8d',
    image: null,
    link: null,
    scope: ['Visual Identity', 'Website UI/UX', 'Social Media System'],
    description:
      'A study-abroad consultancy in London. I created the visual identity, the website UI/UX and a social media design system that keeps every touchpoint consistent.',
  },
]

export const services = [
  {
    title: 'Mobile App Design',
    description:
      'iOS and Android apps designed end-to-end — flows, wireframes, high-fidelity UI and interactive prototypes.',
    tags: ['iOS', 'Android', 'Prototyping'],
  },
  {
    title: 'Web & Dashboard Design',
    description:
      'Responsive websites, platforms and dashboards that make dense information easy to scan and act on.',
    tags: ['Responsive', 'Dashboards', 'Framer'],
  },
  {
    title: 'UX Research & Testing',
    description:
      'User research, competitor analysis, journeys and usability testing to design on evidence, not guesses.',
    tags: ['Research', 'Maze', 'User Journeys'],
  },
  {
    title: 'Design Systems & Handoff',
    description:
      'Scalable component libraries and clean specs that keep products consistent and speed up development.',
    tags: ['Figma', 'Components', 'Handoff'],
  },
  {
    title: 'Arabic / RTL Localization',
    description:
      'Fully bilingual Arabic/English products, localized for Saudi and GCC users — not just mirrored layouts.',
    tags: ['RTL', 'Bilingual', 'GCC'],
  },
]

export const experience = [
  {
    role: 'UI/UX Designer',
    company: 'Al Tadamun Microfinance Foundation',
    period: '2023 — Present',
    place: 'Cairo, Egypt · Microfinance / Fintech',
    points: [
      'Led the digital transformation of the Operations Department, redesigning manual loan workflows as digital flows.',
      'Designed the client loan application app, the loan officer app and the monitoring & reporting app.',
      'Ran usability tests with staff and clients and maintained a shared design system for faster handoff.',
    ],
  },
  {
    role: 'Freelance UI/UX Designer',
    company: 'Self-employed',
    period: '2023 — Present',
    place: 'Remote · Clients in Saudi Arabia, the UK and Egypt',
    points: [
      'Bubblz, Trendora, Learnnova, Premium Real Estate and LCIS — apps, platforms, websites and identities.',
      'Delivered fully bilingual Arabic/English (RTL/LTR) products localized for the Saudi market.',
    ],
  },
  {
    role: 'Graphic Designer & Photographer',
    company: 'EX Egypt',
    period: '2019 — Present',
    place: 'Remote · International health & student-exchange organization',
    points: [
      'Designed campaign visuals and documented international programs hosting 500+ students from around the world.',
    ],
  },
  {
    role: 'Graphic Designer & Accountant',
    company: 'Dar Al-Emara',
    period: '2017 — 2021',
    place: 'Cairo, Egypt · Finishing & engineering design',
    points: ['Produced marketing and presentation visuals for engineering projects alongside accounting duties.'],
  },
]

export const education = {
  degree: 'B.Com. in Accounting',
  school: 'Helwan University, Cairo',
  year: '2021',
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
  tools: ['Figma', 'Framer', 'Maze', 'Photoshop', 'Illustrator', 'Notion'],
}
