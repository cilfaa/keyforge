import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboard } from '../api.js'
import State from '../components/State.jsx'
import SoundButton from '../components/SoundButton.jsx'
import { rupiah } from '../components/KeyboardCard.jsx'

export default function KeyboardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
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

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>
      <State loading={loading} error={error} onRetry={retry} detail />
      {kb && (
        <>
          <h1>{kb.name}</h1>
          <p className="muted">
            {kb.brand} · {kb.layout}
          </p>
          <p className="price">{rupiah(kb.price)}</p>
          <p>{kb.description}</p>

          <h2>Spesifikasi</h2>
          <dl className="spec">
            <dt>Merek</dt>
            <dd>{kb.brand}</dd>
            <dt>Layout</dt>
            <dd>{kb.layout}</dd>
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
