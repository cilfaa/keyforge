import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegion } from '../api.js'
import { RegionThumb } from '../components/Thumbs.jsx'
import State from '../components/State.jsx'

export default function RegionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: region, loading, error, retry } = useFetch((opts) => getRegion(id, opts), `/api/regions/${id}`)
  const motifList = useFetch(getMotifs, '/api/motifs')

  useEffect(() => {
    document.title = region ? `${region.province} · WastraKu` : 'Detail Provinsi · WastraKu'
  }, [region])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/regions')
  }

  const regionalMotif = (motifList.data || []).find((m) => (m.region_id === id || m.regions?.id === id) && m.image_url)

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
        </>
      )}
    </div>
  )
}
