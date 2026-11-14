import { NavLink } from 'react-router-dom'
import { IconHome, IconMotif, IconRegion, IconUser } from './Icons.jsx'

const ITEMS = [
  { to: '/', label: 'Beranda', Icon: IconHome, end: true },
  { to: '/motifs', label: 'Motif', Icon: IconMotif },
  { to: '/regions', label: 'Daerah', Icon: IconRegion },
  { to: '/about', label: 'Profil', Icon: IconUser },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {ITEMS.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <it.Icon />
          </span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
