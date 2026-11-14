import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Motifs from './pages/Motifs.jsx'
import MotifDetail from './pages/MotifDetail.jsx'
import Regions from './pages/Regions.jsx'
import RegionDetail from './pages/RegionDetail.jsx'
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
    document.title = 'Halaman Tidak Ditemukan · WastraKu'
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
          <Route path="/motifs" element={<Motifs />} />
          <Route path="/motifs/:id" element={<MotifDetail />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/regions/:id" element={<RegionDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
