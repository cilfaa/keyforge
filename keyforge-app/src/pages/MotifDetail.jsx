import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotif } from '../api.js'
import State from '../components/State.jsx'
import { MotifThumb } from '../components/Thumbs.jsx'

export default function MotifDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: motif, loading, error, retry } = useFetch((opts) => getMotif(id, opts), `/api/motifs/${id}`)

  useEffect(() => {
    document.title = motif ? `${motif.name} · WastraKu` : 'Detail Motif · WastraKu'
  }, [motif])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/motifs')
  }

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>

      <State loading={loading} error={error} onRetry={retry} detail />

      {motif && (
        <>
          <MotifThumb motif={motif} size="lg" />
          <h1>{motif.name}</h1>
          <p className="muted">
            {motif.regions ? motif.regions.name : 'Nusantara'} · {motif.occasion}
          </p>
          <span className={`tag cat-${motif.category.toLowerCase()}`}>{motif.category}</span>

          <section className="panel philosophy-box">
            <h2>Filosofi &amp; Makna</h2>
            <p>{motif.philosophy}</p>
          </section>

          <h2>Deskripsi Motif</h2>
          <p>{motif.description}</p>

          <h2>Informasi Lengkap</h2>
          <dl className="spec">
            <dt>Kategori</dt>
            <dd>{motif.category}</dd>
            <dt>Cocok Untuk</dt>
            <dd>{motif.occasion}</dd>
            <dt>Daerah Asal</dt>
            <dd>{motif.regions ? motif.regions.name : '-'}</dd>
            {motif.regions?.province && (
              <>
                <dt>Provinsi</dt>
                <dd>{motif.regions.province}</dd>
              </>
            )}
          </dl>

          {motif.regions && (
            <Link to={`/regions/${motif.regions.id}`} className="btn">
              Lihat profil batik {motif.regions.name} ›
            </Link>
          )}
        </>
      )}
    </div>
  )
}
