// Everything the page renders: the text in en.js merged with the links,
// colours and images in shared.js.
import { shared } from './shared'
import t from './en'

const content = {
  ui: t.ui,
  profile: {
    ...shared,
    ...t.profile,
    socials: shared.socials.map((s) => ({ ...s, label: t.socialLabels[s.key] })),
  },
  about: t.about,
  stats: shared.stats.map((s, i) => ({ ...s, label: t.statLabels[i] })),
  skills: t.skills,
  projects: t.featured.map((p) => ({ ...shared.featured[p.id], ...p })),
  archive: t.archive.map((p) => ({ ...shared.archive[p.id], ...p })),
  services: t.services,
  experience: t.experience,
  education: { ...t.education, tools: shared.tools },
}

export function useContent() {
  return content
}
