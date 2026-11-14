import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart.jsx'
import { KeyboardThumb } from './Thumbs.jsx'

export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

export function formatLayout(layout) {
  if (layout === '60%' || layout === '65%') return `Kecil (${layout})`
  if (layout === '75%') return `Sedang (${layout})`
  if (layout === 'TKL' || layout === 'Full') return `Besar (${layout})`
  return layout || '-'
}

export default function KeyboardCard({ kb }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const timerRef = useRef(null)

  const onAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(kb)
    setAdded(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAdded(false), 700)
  }

  return (
    <li>
      <Link to={`/keyboards/${kb.id}`} className="card">
        <div className="card-left">
          <KeyboardThumb kb={kb} size="sm" />
          <div className="card-main">
            <h3>{kb.name}</h3>
            <p className="muted">
              {kb.brand} · {formatLayout(kb.layout)}
            </p>
            {kb.switches && <span className="tag">{kb.switches.name}</span>}
          </div>
        </div>
        <div className="card-side">
          <div className="card-price-col">
            <strong>{rupiah(kb.price)}</strong>
          </div>
          <button
            type="button"
            className={'cart-add-btn' + (added ? ' is-added' : '')}
            onClick={onAdd}
            aria-label={`Tambah ${kb.name} ke keranjang`}
            title="Tambah ke keranjang"
          >
            {added ? '✓' : '+'}
          </button>
          <span className="chevron" aria-hidden="true">›</span>
        </div>
      </Link>
    </li>
  )
}
