// Generated cover art used until a real project image is provided.
const LAYOUTS = [
  { x: '68%', y: '40%', size: '46%' },
  { x: '30%', y: '58%', size: '52%' },
  { x: '60%', y: '62%', size: '40%' },
  { x: '38%', y: '36%', size: '48%' },
  { x: '72%', y: '55%', size: '44%' },
]

export default function ProjectArt({ project, index = 0, large = false }) {
  if (project.image) {
    return <img className="art-img" src={project.image} alt={project.title} loading="lazy" />
  }
  const l = LAYOUTS[index % LAYOUTS.length]
  return (
    <div
      className={`art ${large ? 'art-large' : ''}`}
      style={{ '--c': project.color, '--x': l.x, '--y': l.y, '--s': l.size }}
      role="img"
      aria-label={`${project.title} cover`}
    >
      <div className="art-grid" />
      <div className="art-glow" />
      <div className="art-orb" />
      <div className="art-ring" />
      <span className="art-title" aria-hidden="true">
        {project.title}
      </span>
      <span className="art-meta mono" aria-hidden="true">
        {project.category}
      </span>
    </div>
  )
}
