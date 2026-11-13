import { Link } from 'react-router-dom'
import { playSwitchSound } from '../sound.js'

export default function SwitchCard({ sw }) {
  // Tombol suara ada di dalam kartu, jadi klik-nya tidak boleh ikut membuka halaman detail
  const onSound = (e) => {
    e.preventDefault()
    e.stopPropagation()
    playSwitchSound(sw.type)
  }

  return (
    <li>
      <Link to={`/switches/${sw.id}`} className="card">
        <div className="card-main">
          <h3>{sw.name}</h3>
          <p className="muted">
            {sw.actuation_force} gf · {sw.sound}
          </p>
          <span className={`tag type-${sw.type.toLowerCase()}`}>{sw.type}</span>
        </div>
        <div className="card-side">
          <button
            type="button"
            className="sound-btn"
            onClick={onSound}
            aria-label={`Dengarkan suara ${sw.name}`}
            title="Dengarkan suara"
          >
            🔊
          </button>
          <span className="chevron">›</span>
        </div>
      </Link>
    </li>
  )
}
