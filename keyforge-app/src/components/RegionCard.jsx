import { Link } from 'react-router-dom'
import { RegionThumb } from './Thumbs.jsx'

export default function RegionCard({ region, imageUrl }) {
  return (
    <li>
      <Link to={`/regions/${region.id}`} className="card region-card">
        <RegionThumb region={region} imageUrl={imageUrl} size="sm" />
        <div className="card-main">
          <h3>{region.province}</h3>
          <p className="muted">{region.name}</p>
          <p className="muted region-char">{region.characteristic}</p>
        </div>
        <span className="chevron" aria-hidden="true">
          ›
        </span>
      </Link>
    </li>
  )
}
