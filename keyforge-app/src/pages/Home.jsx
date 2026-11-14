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
    document.title = 'WastraKu — Ensiklopedia Digital Batik Nusantara'
  }, [])

  return (
    <div className="page">
      <section className="masthead">
        <p className="masthead-eyebrow">Ensiklopedia Digital Batik Indonesia</p>
        <h1>WastraKu</h1>
        <p>
          Menghimpun motif batik autentik dari 38 provinsi di Indonesia lengkap dengan filosofi, sejarah budaya,
          simbolisme, serta penggunaan tradisionalnya.
        </p>
      </section>

      <section className="stats">
        <Link to="/motifs" className="stat">
          <strong>{motifs.data ? motifs.data.length : '–'}</strong>
          <span>Motif Batik</span>
        </Link>
        <Link to="/regions" className="stat">
          <strong>{regions.data ? regions.data.length : '–'}</strong>
          <span>Provinsi Indonesia</span>
        </Link>
      </section>

      <div className="list-head">
        <h2>Motif Pilihan Nusantara</h2>
        <Link to="/motifs">Jelajahi semua ›</Link>
      </div>
      <State loading={motifs.loading} error={motifs.error} onRetry={motifs.retry} count={3} />
      <ul className="list">
        {motifs.data && motifs.data.slice(0, 6).map((m) => <MotifCard key={m.id} motif={m} />)}
      </ul>
    </div>
  )
}
