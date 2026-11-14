import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import State from '../components/State.jsx'

const CATEGORIES = ['Semua', 'Keraton', 'Pesisir', 'Pedalaman']

export default function Motifs() {
  const { data, loading, error, retry } = useFetch(getMotifs, '/api/motifs')
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('kategori') || 'Semua'
  const q = searchParams.get('q') || ''

  useEffect(() => {
    document.title = 'Daftar Motif Batik · WastraKu'
  }, [])

  const updateParam = (key, val, defaultVal) => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  const shown = (data || []).filter(
    (m) =>
      (category === 'Semua' || m.category === category) &&
      (m.name + ' ' + (m.philosophy || '') + ' ' + (m.occasion || '') + ' ' + (m.regions?.name || ''))
        .toLowerCase()
        .includes(q.toLowerCase()),
  )

  const resetFilter = () => setSearchParams({}, { replace: true })

  return (
    <div className="page">
      <h1>Daftar Motif Batik</h1>
      <input
        className="search"
        type="search"
        placeholder="Cari motif, filosofi, atau daerah asal…"
        value={q}
        onChange={(e) => updateParam('q', e.target.value, '')}
      />

      <div className="chips" role="group" aria-label="Filter kategori batik">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={'chip' + (category === c ? ' on' : '')}
            onClick={() => updateParam('kategori', c, 'Semua')}
          >
            {c}
          </button>
        ))}
      </div>

      {data && (
        <div className="toolbar">
          <span className="count-label">{shown.length} motif batik</span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={5} />

      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada motif batik yang cocok dengan pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset filter
          </button>
        </div>
      )}

      <ul className="list">
        {shown.map((m) => (
          <MotifCard key={m.id} motif={m} />
        ))}
      </ul>
    </div>
  )
}
