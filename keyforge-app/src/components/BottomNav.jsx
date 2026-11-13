import { NavLink } from 'react-router-dom'
import { IconHome, IconKeyboard, IconSwitch, IconUser } from './Icons.jsx'

const ITEMS = [
  { to: '/', label: 'Beranda', Icon: IconHome, end: true },
  { to: '/keyboards', label: 'Keyboard', Icon: IconKeyboard },
  { to: '/switches', label: 'Switch', Icon: IconSwitch },
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
