import { useState } from 'react'
import useFetch from '../useFetch.js'
import { getKeyboards } from '../api.js'
import KeyboardCard from '../components/KeyboardCard.jsx'
import State from '../components/State.jsx'

const LAYOUTS = ['Semua', '60%', '65%', '75%', 'TKL', 'Full']

export default function Keyboards() {
  const { data, loading, error } = useFetch(getKeyboards)
  const [layout, setLayout] = useState('Semua')
  const [q, setQ] = useState('')

  const shown = (data || []).filter(
    (k) =>
      (layout === 'Semua' || k.layout === layout) &&
      (k.name + ' ' + (k.brand || '')).toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="page">
      <h1>Daftar Keyboard</h1>
      <input
        className="search"
        type="search"
        placeholder="Cari keyboard atau merek…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="chips">
        {LAYOUTS.map((l) => (
          <button key={l} className={'chip' + (layout === l ? ' on' : '')} onClick={() => setLayout(l)}>
            {l}
          </button>
        ))}
      </div>
      <State loading={loading} error={error} />
      {data && shown.length === 0 && <p className="state">Tidak ada keyboard yang cocok.</p>}
      <ul className="list">
        {shown.map((k) => (
          <KeyboardCard key={k.id} kb={k} />
        ))}
      </ul>
    </div>
  )
}
