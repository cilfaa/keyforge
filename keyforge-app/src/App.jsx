import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Keyboards from './pages/Keyboards.jsx'
import KeyboardDetail from './pages/KeyboardDetail.jsx'
import Switches from './pages/Switches.jsx'
import SwitchDetail from './pages/SwitchDetail.jsx'
import About from './pages/About.jsx'
import './App.css'

export default function App() {
  return (
    <div className="shell">
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/keyboards" element={<Keyboards />} />
          <Route path="/keyboards/:id" element={<KeyboardDetail />} />
          <Route path="/switches" element={<Switches />} />
          <Route path="/switches/:id" element={<SwitchDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<p className="state">Halaman tidak ditemukan.</p>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
