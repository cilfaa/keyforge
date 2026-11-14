import { Link } from 'react-router-dom'
import { MotifThumb } from './Thumbs.jsx'

export default function MotifCard({ motif }) {
  const origin = motif.regions
    ? `${motif.regions.province} · ${motif.regions.name}`
    : 'Nusantara'

  return (
    <li>
      <Link to={`/motifs/${motif.id}`} className="card">
        <MotifThumb motif={motif} size="card" />
        <div className="card-body">
          <h3>{motif.name}</h3>
          <p className="muted">{origin}</p>
          <div className="card-foot">
            <span className={`tag cat-${motif.category.toLowerCase()}`}>{motif.category}</span>
            <span className="chevron" aria-hidden="true">
              ›
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}
