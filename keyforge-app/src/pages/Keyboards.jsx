import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboards } from '../api.js'
import KeyboardCard from '../components/KeyboardCard.jsx'
import State from '../components/State.jsx'

const LAYOUTS = ['Semua', '60%', '65%', '75%', 'TKL', 'Full']

export default function Keyboards() {
  const { data, loading, error, retry } = useFetch(getKeyboards, '/api/keyboards')
  const [searchParams, setSearchParams] = useSearchParams()

  const layout = searchParams.get('layout') || 'Semua'
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

  const shown = (data || [])
    .filter(
      (k) =>
        (layout === 'Semua' || k.layout === layout) &&
        (k.name + ' ' + (k.brand || '') + ' ' + (k.switches?.name || ''))
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
      <div className="chips" role="group" aria-label="Filter layout keyboard">
        {LAYOUTS.map((l) => (
          <button
            key={l}
            type="button"
            className={'chip' + (layout === l ? ' on' : '')}
            onClick={() => updateParam('layout', l, 'Semua')}
          >
            {l}
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
