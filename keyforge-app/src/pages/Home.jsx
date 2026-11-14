import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegions } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import State from '../components/State.jsx'

export default function Home() {
  const motifs = useFetch(getMotifs, '/api/motifs')
  const regions = useFetch(getRegions, '/api/regions')

  useEffect(() => {
    document.title = 'WastraKu — Katalog Batik Nusantara'
  }, [])

  return (
    <div className="page">
      <section className="hero">
        <h1>WastraKu</h1>
        <p>Katalog Batik Nusantara &amp; Filosofi Motif. Kenali makna luhur, sejarah, dan daerah asal batik Indonesia.</p>
      </section>

      <section className="stats">
        <Link to="/motifs" className="stat">
          <strong>{motifs.data ? motifs.data.length : '–'}</strong>
          <span>Motif Batik</span>
        </Link>
        <Link to="/regions" className="stat">
          <strong>{regions.data ? regions.data.length : '–'}</strong>
          <span>Daerah Asal</span>
        </Link>
      </section>

      <div className="list-head">
        <h2>Motif Pilihan</h2>
        <Link to="/motifs">Lihat semua ›</Link>
      </div>
      <State loading={motifs.loading} error={motifs.error} onRetry={motifs.retry} count={3} />
      <ul className="list">
        {motifs.data && motifs.data.slice(0, 3).map((m) => <MotifCard key={m.id} motif={m} />)}
      </ul>
    </div>
  )
}
