import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Keyboards from './pages/Keyboards.jsx'
import KeyboardDetail from './pages/KeyboardDetail.jsx'
import Switches from './pages/Switches.jsx'
import SwitchDetail from './pages/SwitchDetail.jsx'
import About from './pages/About.jsx'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan · KeyForge'
  }, [])

  return (
    <div className="page state not-found">
      <h1>404</h1>
      <p>Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.</p>
      <Link to="/" className="btn">
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="shell">
      <ScrollToTop />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/keyboards" element={<Keyboards />} />
          <Route path="/keyboards/:id" element={<KeyboardDetail />} />
          <Route path="/switches" element={<Switches />} />
          <Route path="/switches/:id" element={<SwitchDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
