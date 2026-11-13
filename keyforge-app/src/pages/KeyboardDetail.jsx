import { Link, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboard } from '../api.js'
import State from '../components/State.jsx'
import { rupiah } from '../components/KeyboardCard.jsx'

export default function KeyboardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: kb, loading, error } = useFetch(() => getKeyboard(id), [id])

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)}>
        ← Kembali
      </button>
      <State loading={loading} error={error} />
      {kb && (
        <>
          <h1>{kb.name}</h1>
          <p className="muted">{kb.brand}</p>
          <p className="price">{rupiah(kb.price)}</p>
          <p>{kb.description}</p>

          <h2>Spesifikasi</h2>
          <dl className="spec">
            <dt>Merek</dt>
            <dd>{kb.brand}</dd>
            <dt>Layout</dt>
            <dd>{kb.layout}</dd>
            <dt>Switch</dt>
            <dd>{kb.switches ? kb.switches.name : '-'}</dd>
          </dl>

          {kb.switches && (
            <Link to={`/switches/${kb.switches.id}`} className="btn">
              Lihat detail switch {kb.switches.name} ›
            </Link>
          )}
        </>
      )}
    </div>
  )
}
