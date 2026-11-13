import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getSwitches } from '../api.js'
import SwitchCard from '../components/SwitchCard.jsx'
import State from '../components/State.jsx'

const TYPES = ['Semua', 'Linear', 'Tactile', 'Clicky']

export default function Switches() {
  const { data, loading, error, retry } = useFetch(getSwitches, '/api/switches')
  const [searchParams, setSearchParams] = useSearchParams()

  const type = searchParams.get('type') || 'Semua'
  const q = searchParams.get('q') || ''

  useEffect(() => {
    document.title = 'Daftar Switch · KeyForge'
  }, [])

  const updateParam = (key, val, defaultVal) => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  const shown = (data || []).filter(
    (s) =>
      (type === 'Semua' || s.type === type) &&
      (s.name + ' ' + (s.type || '') + ' ' + (s.sound || '') + ' ' + (s.description || ''))
        .toLowerCase()
        .includes(q.toLowerCase()),
  )

  const resetFilter = () => setSearchParams({}, { replace: true })

  return (
    <div className="page">
      <h1>Daftar Switch</h1>
      <p className="muted">Switch adalah &quot;rasa&quot; tombol keyboard: mulus, ada bump, atau berbunyi klik.</p>

      <input
        className="search"
        type="search"
        placeholder="Cari nama switch atau karakter suara…"
        value={q}
        onChange={(e) => updateParam('q', e.target.value, '')}
      />

      <div className="chips" role="group" aria-label="Filter tipe switch">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={'chip' + (type === t ? ' on' : '')}
            onClick={() => updateParam('type', t, 'Semua')}
          >
            {t}
          </button>
        ))}
      </div>

      {data && (
        <div className="toolbar">
          <span className="count-label">{shown.length} switch</span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={5} />

      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada switch yang cocok dengan pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset filter
          </button>
        </div>
      )}

      <ul className="list">
        {shown.map((s) => (
          <SwitchCard key={s.id} sw={s} />
        ))}
      </ul>
    </div>
  )
}
