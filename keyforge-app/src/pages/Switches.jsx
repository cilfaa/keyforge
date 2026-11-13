import { useState } from 'react'
import useFetch from '../useFetch.js'
import { getSwitches } from '../api.js'
import SwitchCard from '../components/SwitchCard.jsx'
import State from '../components/State.jsx'

const TYPES = ['Semua', 'Linear', 'Tactile', 'Clicky']

export default function Switches() {
  const { data, loading, error } = useFetch(getSwitches)
  const [type, setType] = useState('Semua')

  const shown = (data || []).filter((s) => type === 'Semua' || s.type === type)

  return (
    <div className="page">
      <h1>Daftar Switch</h1>
      <p className="muted">Switch adalah &quot;rasa&quot; tombol keyboard: mulus, ada bump, atau berbunyi klik.</p>
      <div className="chips">
        {TYPES.map((t) => (
          <button key={t} className={'chip' + (type === t ? ' on' : '')} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      <State loading={loading} error={error} />
      <ul className="list">
        {shown.map((s) => (
          <SwitchCard key={s.id} sw={s} />
        ))}
      </ul>
    </div>
  )
}
