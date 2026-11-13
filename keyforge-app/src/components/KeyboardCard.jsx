import { Link } from 'react-router-dom'

export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

export default function KeyboardCard({ kb }) {
  return (
    <li>
      <Link to={`/keyboards/${kb.id}`} className="card">
        <div className="card-main">
          <h3>{kb.name}</h3>
          <p className="muted">
            {kb.brand} · {kb.layout}
          </p>
          {kb.switches && <span className="tag">{kb.switches.name}</span>}
        </div>
        <div className="card-side">
          <strong>{rupiah(kb.price)}</strong>
          <span className="chevron">›</span>
        </div>
      </Link>
    </li>
  )
}
