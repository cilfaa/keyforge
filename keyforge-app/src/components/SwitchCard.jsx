import { Link } from 'react-router-dom'
import SoundButton from './SoundButton.jsx'
import { SwitchThumb } from './Thumbs.jsx'

export default function SwitchCard({ sw }) {
  return (
    <li>
      <Link to={`/switches/${sw.id}`} className="card">
        <div className="card-left">
          <SwitchThumb sw={sw} size="sm" />
          <div className="card-main">
            <h3>{sw.name}</h3>
            <p className="muted">
              {sw.actuation_force} gf · {sw.sound}
            </p>
            <span className={`tag type-${sw.type.toLowerCase()}`}>{sw.type}</span>
          </div>
        </div>
        <div className="card-side">
          <SoundButton type={sw.type} name={sw.name} />
          <span className="chevron" aria-hidden="true">›</span>
        </div>
      </Link>
    </li>
  )
}
