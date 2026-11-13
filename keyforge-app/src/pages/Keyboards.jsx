import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboards } from '../api.js'
import KeyboardCard from '../components/KeyboardCard.jsx'
import State from '../components/State.jsx'

const SIZES = [
  { label: 'Semua', layouts: null },
  { label: 'Kecil', layouts: ['60%', '65%'] },
  { label: 'Sedang', layouts: ['75%'] },
  { label: 'Besar', layouts: ['TKL', 'Full'] },
]

export default function Keyboards() {
  const { data, loading, error, retry } = useFetch(getKeyboards, '/api/keyboards')
  const [searchParams, setSearchParams] = useSearchParams()

  const ukuran = searchParams.get('ukuran') || 'Semua'
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'name'

  useEffect(() => {
    document.title = 'Daftar Keyboard · KeyForge'
  }, [])

  const updateParam = (key, val, defaultVal) => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  const activeSize = SIZES.find((s) => s.label === ukuran) || SIZES[0]

  const shown = (data || [])
    .filter(
      (k) =>
        (!activeSize.layouts || activeSize.layouts.includes(k.layout)) &&
        (k.name + ' ' + (k.brand || '') + ' ' + (k.switches?.name || '') + ' ' + (k.layout || ''))
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .slice()
    .sort((a, b) => {
      if (sort === 'price-asc') return (a.price || 0) - (b.price || 0)
      if (sort === 'price-desc') return (b.price || 0) - (a.price || 0)
      return a.name.localeCompare(b.name)
    })

  const resetFilter = () => setSearchParams({}, { replace: true })

  return (
    <div className="page">
      <h1>Daftar Keyboard</h1>
      <input
        className="search"
        type="search"
        placeholder="Cari keyboard, merek, atau switch…"
        value={q}
        onChange={(e) => updateParam('q', e.target.value, '')}
      />
      <div className="chips" role="group" aria-label="Filter ukuran keyboard">
        {SIZES.map((s) => (
          <button
            key={s.label}
            type="button"
            className={'chip' + (ukuran === s.label ? ' on' : '')}
            onClick={() => updateParam('ukuran', s.label, 'Semua')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {data && (
        <div className="toolbar">
          <span className="count-label">{shown.length} keyboard</span>
          <label className="sort-wrap">
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value, 'name')}
              aria-label="Urutkan daftar keyboard"
            >
              <option value="name">Urut: Nama (A–Z)</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Termahal</option>
            </select>
          </label>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={5} />

      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada keyboard yang cocok dengan pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset filter
          </button>
        </div>
      )}

      <ul className="list">
        {shown.map((k) => (
          <KeyboardCard key={k.id} kb={k} />
        ))}
      </ul>
    </div>
  )
}
