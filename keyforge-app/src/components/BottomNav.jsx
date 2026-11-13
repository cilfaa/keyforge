import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/keyboards', label: 'Keyboard', icon: '⌨️' },
  { to: '/switches', label: 'Switch', icon: '🔘' },
  { to: '/about', label: 'Profil', icon: '👤' },
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
          <span className="nav-icon">{it.icon}</span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
