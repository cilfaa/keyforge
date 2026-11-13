import { Link } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboards, getSwitches } from '../api.js'
import KeyboardCard from '../components/KeyboardCard.jsx'
import State from '../components/State.jsx'

export default function Home() {
  const kb = useFetch(getKeyboards)
  const sw = useFetch(getSwitches)

  return (
    <div className="page">
      <section className="hero">
        <h1>KeyForge ⌨️</h1>
        <p>Katalog keyboard mekanik &amp; switch. Temukan keyboard yang pas untuk ngetik, kuliah, dan gaming.</p>
      </section>

      <section className="stats">
        <Link to="/keyboards" className="stat">
          <strong>{kb.data ? kb.data.length : '–'}</strong>
          <span>Keyboard</span>
        </Link>
        <Link to="/switches" className="stat">
          <strong>{sw.data ? sw.data.length : '–'}</strong>
          <span>Switch</span>
        </Link>
      </section>

      <div className="list-head">
        <h2>Keyboard Pilihan</h2>
        <Link to="/keyboards">Lihat semua</Link>
      </div>
      <State loading={kb.loading} error={kb.error} />
      <ul className="list">
        {kb.data && kb.data.slice(0, 3).map((k) => <KeyboardCard key={k.id} kb={k} />)}
      </ul>
    </div>
  )
}
