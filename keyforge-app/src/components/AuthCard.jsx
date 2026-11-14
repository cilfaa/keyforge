import { useState } from 'react'
import { useAuth } from '../auth.jsx'

export default function AuthCard({ title = 'Masuk ke Akun', subtitle }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      if (mode === 'register') {
        await register({ name, email, password })
      } else {
        await login({ email, password })
      }
    } catch (error) {
      setErr(error.message || 'Gagal memproses akun.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel auth-box" onSubmit={handleSubmit}>
      <h2>{mode === 'login' ? title : 'Daftar Akun Baru'}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}

      {mode === 'register' && (
        <input
          className="search"
          type="text"
          placeholder="Nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        className="search"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="search"
        type="password"
        placeholder="Kata sandi (minimal 4 karakter)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={4}
        required
      />

      {err && <p className="form-error">{err}</p>}

      <button type="submit" className="btn" disabled={busy}>
        {busy ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Daftar & Masuk'}
      </button>

      <button
        type="button"
        className="link-switch"
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login')
          setErr('')
        }}
      >
        {mode === 'login' ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
      </button>
    </form>
  )
}
