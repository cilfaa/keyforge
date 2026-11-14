import { Link } from 'react-router-dom'
import { MotifThumb } from './Thumbs.jsx'

export default function MotifCard({ motif }) {
  return (
    <li>
      <Link to={`/motifs/${motif.id}`} className="card">
        <div className="card-left">
          <MotifThumb motif={motif} size="sm" />
          <div className="card-main">
            <h3>{motif.name}</h3>
            <p className="muted">
              {motif.regions ? motif.regions.name : 'Nusantara'} · {motif.occasion}
            </p>
            <span className={`tag cat-${motif.category.toLowerCase()}`}>{motif.category}</span>
          </div>
        </div>
        <div className="card-side">
          <span className="chevron" aria-hidden="true">
            ›
          </span>
        </div>
      </Link>
    </li>
  )
}
