import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegion } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import { RegionThumb } from '../components/Thumbs.jsx'
import State from '../components/State.jsx'

export default function RegionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const fromMotifId = location.state?.fromMotifId
  const fromMotifName = location.state?.fromMotifName
  const { data: region, loading, error, retry } = useFetch((opts) => getRegion(id, opts), `/api/regions/${id}`)
  const motifList = useFetch(getMotifs, '/api/motifs')

  useEffect(() => {
    document.title = region ? `${region.province} · WastraKu` : 'Detail Provinsi · WastraKu'
  }, [region])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/regions')
  }

  const regionalMotifs = (motifList.data || []).filter((m) => m.region_id === id || m.regions?.id === id)
  const visibleMotifs = fromMotifId ? regionalMotifs.filter((m) => m.id !== fromMotifId) : regionalMotifs
  const regionalMotif = regionalMotifs.find((m) => m.image_url)

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>

      <State loading={loading} error={error} onRetry={retry} detail />

      {region && (
        <>
          <RegionThumb region={region} imageUrl={regionalMotif?.image_url} size="lg" />
          <h1>{region.province}</h1>
          <p className="muted">{region.name}</p>

          <section className="panel philosophy-box">
            <h2>Ciri Khas Batik</h2>
            <p>{region.characteristic}</p>
          </section>

          <section className="panel">
            <h2>Sejarah &amp; Latar Budaya</h2>
            <p>{region.description}</p>
          </section>

          {visibleMotifs.length > 0 ? (
            <>
              <div className="list-head">
                <h2>{fromMotifId ? `Motif Lainnya dari ${region.province}` : `Motif Batik ${region.province}`}</h2>
                {regionalMotifs.length > 1 && (
                  <Link to={`/motifs?provinsi=${encodeURIComponent(region.province)}`}>Lihat di Katalog ›</Link>
                )}
              </div>
              <ul className="list">
                {visibleMotifs.map((m) => (
                  <MotifCard key={m.id} motif={m} />
                ))}
              </ul>
            </>
          ) : (
            <section className="panel">
              <h2>Motif Batik {region.province}</h2>
              <p className="muted">
                {fromMotifId
                  ? `Saat ini baru tercatat 1 motif unggulan dari ${region.province}${fromMotifName ? ` (${fromMotifName})` : ''}.`
                  : 'Belum ada motif terdaftar untuk provinsi ini.'}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  )
}
