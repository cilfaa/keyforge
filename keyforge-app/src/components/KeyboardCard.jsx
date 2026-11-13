import { Link } from 'react-router-dom'
import { KeyboardThumb } from './Thumbs.jsx'

export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

export default function KeyboardCard({ kb }) {
  return (
    <li>
      <Link to={`/keyboards/${kb.id}`} className="card">
        <div className="card-left">
          <KeyboardThumb kb={kb} size="sm" />
          <div className="card-main">
            <h3>{kb.name}</h3>
            <p className="muted">
              {kb.brand} · {kb.layout}
            </p>
            {kb.switches && <span className="tag">{kb.switches.name}</span>}
          </div>
        </div>
        <div className="card-side">
          <strong>{rupiah(kb.price)}</strong>
          <span className="chevron" aria-hidden="true">›</span>
        </div>
      </Link>
    </li>
  )
}
