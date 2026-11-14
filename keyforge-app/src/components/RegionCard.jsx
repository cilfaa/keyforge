import { Link } from 'react-router-dom'
import { RegionThumb } from './Thumbs.jsx'

export default function RegionCard({ region }) {
  return (
    <li>
      <Link to={`/regions/${region.id}`} className="card">
        <div className="card-left">
          <RegionThumb region={region} size="sm" />
          <div className="card-main">
            <h3>{region.name}</h3>
            <p className="muted">{region.province}</p>
            <p className="muted region-char">{region.characteristic}</p>
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
