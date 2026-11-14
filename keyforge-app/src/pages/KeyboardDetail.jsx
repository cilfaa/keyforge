import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboard } from '../api.js'
import { useCart } from '../cart.jsx'
import State from '../components/State.jsx'
import SoundButton from '../components/SoundButton.jsx'
import { KeyboardThumb } from '../components/Thumbs.jsx'
import { formatLayout, rupiah } from '../components/KeyboardCard.jsx'

export default function KeyboardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, totalCount } = useCart()
  const [added, setAdded] = useState(false)
  const timerRef = useRef(null)
  const { data: kb, loading, error, retry } = useFetch((opts) => getKeyboard(id, opts), `/api/keyboards/${id}`)

  useEffect(() => {
    document.title = kb ? `${kb.name} · KeyForge` : 'Detail Keyboard · KeyForge'
  }, [kb])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/keyboards')
    }
  }

  const handleAdd = () => {
    addItem(kb)
    setAdded(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>
      <State loading={loading} error={error} onRetry={retry} detail />
      {kb && (
        <>
          <KeyboardThumb kb={kb} size="lg" />
          <h1>{kb.name}</h1>
          <p className="muted">
            {kb.brand} · {formatLayout(kb.layout)}
          </p>
          <p className="price">{rupiah(kb.price)}</p>
          <p>{kb.description}</p>

          <button type="button" className={'btn' + (added ? ' is-added' : '')} onClick={handleAdd}>
            {added ? '✓ Ditambahkan ke Keranjang' : '+ Tambah ke Keranjang'}
          </button>
          {totalCount > 0 && (
            <Link to="/cart" className="btn btn-secondary">
              Lihat Keranjang ({totalCount}) ›
            </Link>
          )}

          <h2>Spesifikasi</h2>
          <dl className="spec">
            <dt>Merek</dt>
            <dd>{kb.brand}</dd>
            <dt>Ukuran</dt>
            <dd>{formatLayout(kb.layout)}</dd>
            <dt>Switch</dt>
            <dd>
              {kb.switches ? (
                <span className="spec-switch">
                  <span>{kb.switches.name}</span>
                  <span className={`tag type-${kb.switches.type.toLowerCase()}`}>{kb.switches.type}</span>
                </span>
              ) : (
                '-'
              )}
            </dd>
            {kb.switches?.sound && (
              <>
                <dt>Karakter Suara</dt>
                <dd>
                  {kb.switches.sound} ({kb.switches.actuation_force} gf)
                </dd>
              </>
            )}
          </dl>

          {kb.switches && (
            <>
              <SoundButton type={kb.switches.type} name={kb.switches.name} big />
              <Link to={`/switches/${kb.switches.id}`} className="btn btn-secondary">
                Lihat detail switch {kb.switches.name} ›
              </Link>
            </>
          )}
        </>
      )}
    </div>
  )
}
