import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegion } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import { RegionThumb } from '../components/Thumbs.jsx'
import State from '../components/State.jsx'

export default function RegionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: region, loading, error, retry } = useFetch((opts) => getRegion(id, opts), `/api/regions/${id}`)
  const motifList = useFetch(getMotifs, '/api/motifs')

  useEffect(() => {
    document.title = region ? `${region.name} · WastraKu` : 'Detail Daerah · WastraKu'
  }, [region])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/regions')
  }

  const regionalMotifs = (motifList.data || []).filter((m) => m.region_id === id || m.regions?.id === id)

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>

      <State loading={loading} error={error} onRetry={retry} detail />

      {region && (
        <>
          <RegionThumb region={region} size="lg" />
          <h1>{region.name}</h1>
          <p className="muted">{region.province}</p>

          <section className="panel philosophy-box">
            <h2>Ciri Khas Batik</h2>
            <p>{region.characteristic}</p>
          </section>

          <h2>Sejarah &amp; Latar Budaya</h2>
          <p>{region.description}</p>

          <h2>Motif Khas {region.name}</h2>
          {regionalMotifs.length > 0 ? (
            <ul className="list">
              {regionalMotifs.map((m) => (
                <MotifCard key={m.id} motif={m} />
              ))}
            </ul>
          ) : (
            <p className="muted">Belum ada motif terdaftar untuk daerah ini.</p>
          )}
        </>
      )}
    </div>
  )
}
