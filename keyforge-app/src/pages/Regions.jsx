import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getRegions } from '../api.js'
import RegionCard from '../components/RegionCard.jsx'
import State from '../components/State.jsx'

const PROVINCES = ['Semua', 'DI Yogyakarta', 'Jawa Tengah', 'Jawa Barat', 'Jawa Timur']

export default function Regions() {
  const { data, loading, error, retry } = useFetch(getRegions, '/api/regions')
  const [searchParams, setSearchParams] = useSearchParams()

  const province = searchParams.get('provinsi') || 'Semua'
  const q = searchParams.get('q') || ''

  useEffect(() => {
    document.title = 'Daerah Asal Batik · WastraKu'
  }, [])

  const updateParam = (key, val, defaultVal) => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  const shown = (data || []).filter(
    (r) =>
      (province === 'Semua' || r.province === province) &&
      (r.name + ' ' + (r.province || '') + ' ' + (r.characteristic || ''))
        .toLowerCase()
        .includes(q.toLowerCase()),
  )

  const resetFilter = () => setSearchParams({}, { replace: true })

  return (
    <div className="page">
      <h1>Daerah Asal Batik</h1>
      <p className="muted">Setiap daerah di Nusantara memiliki ciri khas warna dan corak batik tersendiri.</p>

      <input
        className="search"
        type="search"
        placeholder="Cari nama kota, provinsi, atau ciri khas…"
        value={q}
        onChange={(e) => updateParam('q', e.target.value, '')}
      />

      <div className="chips" role="group" aria-label="Filter provinsi">
        {PROVINCES.map((p) => (
          <button
            key={p}
            type="button"
            className={'chip' + (province === p ? ' on' : '')}
            onClick={() => updateParam('provinsi', p, 'Semua')}
          >
            {p}
          </button>
        ))}
      </div>

      {data && (
        <div className="toolbar">
          <span className="count-label">{shown.length} daerah</span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={4} />

      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada daerah yang cocok dengan pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset filter
          </button>
        </div>
      )}

      <ul className="list">
        {shown.map((r) => (
          <RegionCard key={r.id} region={r} />
        ))}
      </ul>
    </div>
  )
}
