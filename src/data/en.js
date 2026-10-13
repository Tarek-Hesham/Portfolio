// English content (sourced from Tarek's CV).
export default {
  profile: {
    firstName: 'Tarek',
    lastName: 'Hesham',
    role: 'Product Designer',
    roleDetail: 'UI/UX · Mobile & Web · Fintech · Arabic/English (RTL)',
    tagline:
      'I design mobile and web products that turn complex workflows into simple, bilingual experiences — from user research to pixel-perfect developer handoff.',
    location: 'Cairo, Egypt',
    availability: 'Open to remote & GCC',
  },

  ui: {
    skip: 'Skip to content',
    loading: 'Loading',
    nav: {
      home: 'home',
      work: 'Work',
      about: 'About',
      services: 'Services',
      experience: 'Experience',
      contact: 'Contact',
      letsTalk: "Let's talk",
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      portfolio: 'Portfolio',
      roleLabel: '(Role)',
      viewWork: 'View work',
      downloadCv: 'Download CV ↓',
      scroll: 'Scroll',
      cursor: 'Scroll',
    },
    about: { label: 'About', highlights: 'Highlights' },
    work: {
      label: '(02) — Selected work',
      title1: 'Selected',
      title2: 'Works',
      intro:
        'Eight in-depth case studies — plus more product work across fintech, e-learning and real estate. Open a project for the full story.',
      count: 'case studies ↓',
      more: 'More projects',
      viewCase: 'View case study',
      outroLabel: 'Next could be yours',
      outroLink: 'Start a project',
      cursor: 'View',
    },
    case: {
      back: 'Back to work',
      scroll: 'Scroll to explore',
      overview: 'Overview',
      highlights: 'Key design decisions',
      motion: 'In motion',
      gallery: 'The full case study',
      behance: 'View on Behance',
      next: 'Next project',
      home: 'Home',
    },
    modal: {
      context: 'Context',
      role: 'Role',
      scope: 'Scope',
      close: 'Close project',
      behance: 'View case study on Behance',
      live: 'Visit live site',
    },
    services: { label: 'Services', title1: 'What I', title2: 'bring', tools: 'tools' },
    experience: {
      label: 'Experience',
      title1: "Where I've",
      title2: 'worked',
      download: 'Download full CV',
      education: 'Education',
      languages: 'Languages',
      tools: 'Tools',
    },
    contact: {
      label: 'Contact',
      title1: "Let's build",
      title2a: 'something',
      title2b: 'bold.',
      orb: 'Get in touch',
      cursor: 'Say hi',
      dropLine: 'Drop me a line',
      copy: 'Copy email',
      copied: 'Copied to clipboard ✓',
      whatsapp: 'WhatsApp',
      backTop: 'Back to top ↑',
      madeWith: 'Designed & built with care',
    },
  },

  socialLabels: { behance: 'Behance', linkedin: 'LinkedIn', whatsapp: 'WhatsApp', email: 'Email' },

  about: {
    statement:
      'I turn complex financial and operational workflows into simple, human interfaces — in Arabic and English.',
    paragraphs: [
      'Product Designer with 3+ years of end-to-end product design for mobile and web — user research, user flows and wireframes through high-fidelity prototypes, design systems and developer handoff — built on 8+ years of graphic design.',
      'Today I lead the digital transformation of loan operations at a microfinance institution, turning manual field and back-office processes into mobile apps for clients, loan officers and monitoring teams. I’ve shipped work across fintech, on-demand services, marketplaces, e-learning and real estate, including fully bilingual RTL products for the Saudi market — and my accounting background helps me make money-heavy flows feel effortless.',
    ],
    details: [
      { label: 'Based in', value: 'Cairo, Egypt' },
      { label: 'Focus', value: 'Mobile · Web · Fintech · RTL' },
      { label: 'Working', value: 'Remote & GCC' },
    ],
  },

  statLabels: ['Years in product design', 'Years of graphic design', 'Projects completed', 'Client markets — KSA, UK, EG'],

  skills: [
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
  ],

  featured: [
    {
      id: 'bubblz',
      title: 'Bubblz',
      category: 'On-demand · Mobile App',
      year: '2025',
      tagline: 'Laundry pickup & delivery, reimagined for Saudi Arabia.',
      overview:
        'Bubblz is an Arabic-first laundry pickup and delivery app for the Saudi market. Users pick a subscription “bubble” that fits them, choose how each garment is washed, book a normal or urgent pickup, and follow every step until their clothes come back clean to their door.',
      facts: [
        { label: 'Role', value: 'UX/UI — research, identity, journeys, wireframes, UI & 3D icons' },
        { label: 'Platform', value: 'iOS & Android' },
        { label: 'Timeline', value: '7 weeks' },
        { label: 'Tools', value: 'Figma · Photoshop · Illustrator' },
      ],
      stats: ['60+ screens', '7 weeks', 'Arabic-first RTL'],
      highlights: [
        { title: 'Subscription bubbles', text: 'Monthly “bubbles” replace per-item pricing, so ordering becomes one tap instead of a calculation.' },
        { title: 'Normal or urgent', text: 'One clear decision point for pickup speed, with the price difference visible before checkout.' },
        { title: 'Live tracking', text: 'Every stage — pickup, washing, delivery — is tracked, with a hand-off and driver rating at the end.' },
        { title: 'Built for RTL', text: 'A complete Arabic/English system: mirrored layouts, bilingual type scale and a custom 3D icon set.' },
      ],
    },
    {
      id: 'kinggo',
      title: 'King Go',
      category: 'Super App · Mobile',
      year: 'Alexandria, EG',
      tagline: 'One local super app for everyday life in King Mariout.',
      overview:
        'King Go is a local super app built for the everyday life of King Mariout, Alexandria — food delivery, custom Pick & Go delivery, a local ads marketplace, clinics, real estate and one shared wallet, all from a single home screen.',
      facts: [
        { label: 'Role', value: 'Product Designer (UI/UX)' },
        { label: 'Platform', value: 'Mobile app' },
        { label: 'Scope', value: 'Food · Delivery · Ads · Clinics · Real estate · Wallet' },
        { label: 'Tools', value: 'Figma' },
      ],
      stats: ['88 hi-fi screens', '5 services', '1 shared wallet'],
      highlights: [
        { title: 'Group ordering', text: 'Discovery that shows what friends ordered, plus shared carts for ordering together.' },
        { title: '10-minute edit window', text: 'Live tracking with a short window to change an order before the kitchen starts.' },
        { title: 'Pick & Go', text: 'A five-step custom delivery flow for anything that isn’t on a menu.' },
        { title: 'Wallet & rewards', text: 'One wallet across every service, with rewards and support paths that turn problems into resolutions.' },
      ],
    },
    {
      id: 'rafiky',
      title: 'Rafiky',
      category: 'Travel · AI · Mobile App',
      year: '2026',
      tagline: 'Your travel ally — plan, compare, explore and pay in one app.',
      overview:
        'Rafiky is an AI-powered travel app for Egypt that brings smart trip planning, augmented-reality exploration, a marketplace of verified offers and secure payments together — one app for the whole journey.',
      facts: [
        { label: 'Role', value: 'UI/UX Designer' },
        { label: 'Platform', value: 'Mobile app' },
        { label: 'Features', value: 'AI planner · Smart bidding · AR · RafikyPay' },
        { label: 'Market', value: 'Egypt' },
      ],
      stats: ['80+ screens', 'AI trip planner', 'AR explorer'],
      highlights: [
        { title: 'From idea to itinerary', text: 'Destination, taste and budget turn into a full day-by-day plan in a few steps.' },
        { title: 'Smart bidding', text: 'Instead of searching agencies, the trip goes to them — verified companies compete with clear offers.' },
        { title: 'AR explorer', text: 'Point the camera at a landmark and Rafiky recognises it and tells its story in text and audio.' },
        { title: 'RafikyPay', text: 'Scan a QR at the table, browse the menu, order and pay — with exclusive discounts.' },
      ],
    },
    {
      id: 'trendora',
      title: 'Trendora',
      category: 'Social Growth · Marketplace',
      year: '2025',
      tagline: 'The social growth marketplace — buy reach you can trust.',
      overview:
        'Trendora is a social growth marketplace that connects creators, brands and small businesses with verified sellers of likes, followers and views. Every flow answers the buyer’s two questions before they ask them — who am I buying from, and where is my order? — while giving sellers a real storefront to run a business.',
      facts: [
        { label: 'Role', value: 'UX/UI & Branding' },
        { label: 'Platform', value: 'iOS & Android' },
        { label: 'Users', value: 'Merchants · Buyers' },
        { label: 'Tools', value: 'Figma' },
      ],
      stats: ['55+ screens', 'Live auctions', 'Two-sided marketplace'],
      highlights: [
        { title: 'Two roles, one app', text: 'Merchants open a store in minutes and track their sales; buyers discover rated stores — chosen on the very first screen.' },
        { title: 'Live auctions', text: 'A countdown with a draining bar, a minimum-bid hint so bids are never rejected, and outbid and won alerts that bring bidders back.' },
        { title: 'No more black boxes', text: 'Every order gets a status, a percentage and a colour, with “Contact support” right on the order it’s about.' },
        { title: 'Wallet & rewards', text: 'Points on every order move buyers from Bronze to Platinum, with referral codes and one-tap redemption.' },
      ],
    },
    {
      id: 'learnnova',
      title: 'Learnnova',
      category: 'E-learning · Web Platform',
      year: '2025',
      tagline: 'A learner’s journey from first course to first job.',
      overview:
        'Learnnova is an interactive learning platform with hands-on courses in UI/UX design, graphic design and programming. It connects learners with expert mentors for one-on-one sessions and a community for feedback — real skills, real projects and a real career path in one place. Designed by a team of five in six weeks, through the full design-thinking process.',
      facts: [
        { label: 'Role', value: 'UI/UX Designer — team of 5' },
        { label: 'Platform', value: 'Responsive web' },
        { label: 'Timeline', value: '6 weeks' },
        { label: 'Tools', value: 'Figma · Photoshop' },
      ],
      stats: ['30+ UI screens', '6 weeks', 'Team of 5'],
      highlights: [
        { title: 'Research first', text: 'A competitive analysis of platforms like Codecademy, Scrimba and LeetCode, plus a ten-question learner survey, shaped every feature.' },
        { title: 'Mentors on demand', text: 'Mentor profiles show experience, reviews and open time slots, so booking a one-on-one session takes a few taps.' },
        { title: 'Progress you can see', text: 'A profile dashboard tracks hours of activity, course progress and every certificate earned.' },
        { title: 'Learning together', text: 'Community pages, study groups and course reviews keep learners connected and accountable.' },
      ],
    },
    {
      id: 'dreamhome',
      title: 'Dream Home',
      category: 'Real Estate · Website Redesign',
      year: '2026',
      tagline: 'A calmer way to find a home in Egypt.',
      overview:
        'Dream Home is a redesign of an Arabic real-estate platform for Egypt. The original site worked, but it felt like a busy listing board — repeated call and WhatsApp buttons, no prices on the cards and a text-heavy project page. The new direction is editorial and trust-first, built around one goal: trust the project before the first phone call. Its visual language, “Night, Bone & Lamp”, shows homes that glow at dusk.',
      facts: [
        { label: 'Role', value: 'UX/UI Designer' },
        { label: 'Platform', value: 'Responsive web — desktop & mobile' },
        { label: 'Scope', value: '7 pages + UI kit' },
        { label: 'Tools', value: 'Figma' },
      ],
      stats: ['7 pages + UI kit', 'Arabic RTL', 'Desktop & mobile'],
      highlights: [
        { title: 'Decision data on every card', text: 'Price, area and delivery date sit on each listing, so buyers can compare without a single call.' },
        { title: 'One advisor per journey', text: 'One advisor follows the buyer instead of dozens of repeated call and WhatsApp buttons.' },
        { title: 'Search on a map', text: 'Results live on a map, so location is part of the decision from the very first screen.' },
        { title: 'Payment plans, visualised', text: 'Down payment and instalments shown as clear numbers instead of long paragraphs.' },
      ],
    },
    {
      id: 'premiumaqar',
      title: 'Premium Aqar',
      category: 'Real Estate · Web Platform',
      year: '2024',
      tagline: 'Egypt’s real estate, city by city — with an advisor one tap away.',
      overview:
        'Premium Aqar is an Arabic-first real-estate platform for Egypt that publishes compounds, villages and commercial projects across the country’s key cities — New Capital, North Coast, New Cairo, Sheikh Zayed and more. I designed the complete responsive experience in Figma, then explored a luxury redesign concept with a calm monochrome palette, large architectural imagery and a search-first hero.',
      facts: [
        { label: 'Role', value: 'UI/UX Designer' },
        { label: 'Platform', value: 'Responsive web — desktop & mobile' },
        { label: 'Scope', value: '12 screens + redesign concept' },
        { label: 'Tools', value: 'Figma' },
      ],
      stats: ['12 screens', 'Arabic-first RTL', 'Redesign concept'],
      highlights: [
        { title: 'City by city', text: 'Every project is organised by city, so browsing feels like a guide rather than a database.' },
        { title: 'Key numbers first', text: 'Down payment, starting price and instalment years sit at the top of each project.' },
        { title: 'Three-field search', text: 'Project name, location and type right in the hero — the fastest way into the listings.' },
        { title: 'Advisor in one tap', text: 'Call and WhatsApp stay visible on every page and at every breakpoint.' },
      ],
    },
    {
      id: 'easycar',
      title: 'Easy Car',
      category: 'Fintech · Mobile App',
      year: '2022',
      tagline: 'Buying a car on instalments, without the paperwork maze.',
      overview:
        'Easy Car is a mobile app that makes buying a car on instalments in Egypt simple — pick a car from brands and showrooms, compare instalment plans and insurance, and submit your documents in one guided flow. Designed in a team of five, it follows the full UX process: discovery, design and usability testing, then a redesign round based on what users struggled with.',
      facts: [
        { label: 'Role', value: 'UI/UX Designer — team of 5' },
        { label: 'Platform', value: 'Mobile app' },
        { label: 'Process', value: 'Discovery · Design · Testing' },
        { label: 'Testing', value: 'Maze usability tests & heatmaps' },
      ],
      stats: ['4 user interviews', 'Usability tested', 'Team of 5'],
      highlights: [
        { title: 'Research before pixels', text: 'A stakeholder interview, four user interviews and an analysis of Contact Cars and Hatla2ee defined the real problem.' },
        { title: 'One guided instalment flow', text: 'Find a car, check its details, choose a plan and insurance, upload documents and pay the first amount — one clear path.' },
        { title: 'Tested, then redesigned', text: 'Maze tests with heatmaps and misclick rates exposed confusing buttons, fixed in a redesign round.' },
        { title: 'Trust built in', text: 'Clear fees, reviews and a visible process answer the questions buyers raised in interviews.' },
      ],
    },
  ],

  archive: [
    {
      id: 'tadamun',
      title: 'Al Tadamun Loan Suite',
      category: 'Fintech · Mobile Apps',
      year: '2023 — Now',
      role: 'Lead Product Designer',
      scope: ['User Research', 'Workflow Mapping', 'Usability Testing', 'Design System'],
      description:
        'Digital transformation of loan operations at Al Tadamun Microfinance Foundation. I mapped manual field and back-office workflows and redesigned them as three connected mobile apps: a client loan application app, a loan officer app for targets, incentives and repayment follow-ups, and a monitoring & reporting app that gives supervisors real-time visibility into field operations.',
    },
    {
      id: 'realestate',
      title: 'Premium Real Estate',
      category: 'Real Estate · Website',
      year: 'Freelance',
      role: 'Design & Build',
      scope: ['Responsive Web', 'Listings', 'Framer'],
      description:
        'A corporate website I designed and built for property listings, investment opportunities and services — responsive and easy to browse on any device.',
    },
    {
      id: 'lcis',
      title: 'LCIS London',
      category: 'Consultancy · Brand & Web',
      year: 'United Kingdom',
      role: 'Brand & Product Designer',
      scope: ['Visual Identity', 'Website UI/UX', 'Social Media System'],
      description:
        'A study-abroad consultancy in London. I created the visual identity, the website UI/UX and a social media design system that keeps every touchpoint consistent.',
    },
  ],

  services: [
    {
      title: 'Mobile App Design',
      description:
        'iOS and Android apps designed end-to-end — flows, wireframes, high-fidelity UI and interactive prototypes.',
      tags: ['iOS', 'Android', 'Prototyping'],
    },
    {
      title: 'Web & Dashboard Design',
      description: 'Responsive websites, platforms and dashboards that make dense information easy to scan and act on.',
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
      description: 'Scalable component libraries and clean specs that keep products consistent and speed up development.',
      tags: ['Figma', 'Components', 'Handoff'],
    },
    {
      title: 'Arabic / RTL Localization',
      description: 'Fully bilingual Arabic/English products, localized for Saudi and GCC users — not just mirrored layouts.',
      tags: ['RTL', 'Bilingual', 'GCC'],
    },
  ],

  experience: [
    {
      role: 'Product Designer (UI/UX)',
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
      role: 'Freelance Product Designer',
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
  ],

  education: {
    degree: 'B.Com. in Accounting',
    school: 'Helwan University, Cairo',
    year: '2021',
    languages: [
      { name: 'Arabic', level: 'Native' },
      { name: 'English', level: 'Professional working proficiency' },
    ],
  },
}
