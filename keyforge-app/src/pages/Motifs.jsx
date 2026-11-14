import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegions } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import State from '../components/State.jsx'

const CATEGORIES = ['Semua', 'Keraton', 'Pesisir', 'Pedalaman', 'Nusantara']

export default function Motifs() {
  const { data, loading, error, retry } = useFetch(getMotifs, '/api/motifs')
  const regionsRes = useFetch(getRegions, '/api/regions')
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('kategori') || 'Semua'
  const province = searchParams.get('provinsi') || 'Semua'
  const q = searchParams.get('q') || ''

  useEffect(() => {
    document.title = 'Katalog Motif Batik · WastraKu'
  }, [])

  const updateParam = (key, val, defaultVal) => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  const provinces = Array.from(
    new Set((regionsRes.data || []).map((r) => r.province).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))

  const query = q.trim().toLowerCase()
  const shown = (data || []).filter((m) => {
    const matchCat = category === 'Semua' || m.category === category
    const matchProv = province === 'Semua' || m.regions?.province === province
    if (!matchCat || !matchProv) return false
    if (!query) return true

    const haystack = [
      m.name,
      m.category,
      m.occasion,
      m.philosophy,
      m.history,
      m.symbolism,
      m.description,
      m.regions?.name,
      m.regions?.province,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })

  const resetFilter = () => setSearchParams({}, { replace: true })

  return (
    <div className="page">
      <h1>Katalog Motif Batik</h1>
      <p className="muted">Cari berdasarkan nama motif, provinsi, kota asal, filosofi, atau acara adat.</p>

      <div className="filter-bar">
        <input
          className="search"
          type="search"
          placeholder="Cari motif, provinsi, filosofi, atau acara…"
          value={q}
          onChange={(e) => updateParam('q', e.target.value, '')}
        />

        <select
          className="province-select"
          value={province}
          onChange={(e) => updateParam('provinsi', e.target.value, 'Semua')}
          aria-label="Filter berdasarkan provinsi"
        >
          <option value="Semua">Semua Provinsi ({provinces.length || 38})</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

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
          <span className="count-label">
            Menampilkan {shown.length} motif batik
            {province !== 'Semua' ? ` dari ${province}` : ''}
          </span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={6} />

      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada motif batik yang cocok dengan filter atau pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset semua filter
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
