import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import AuthCard from '../components/AuthCard.jsx'

// GANTI data di bawah dengan data dirimu sendiri.
const PROFILE = {
  nama: 'Greycilfa',
  nim: '21120124140158',
  kelas: 'Praktikum PPB 2026',
  github: 'https://github.com/cilfaa/keyforge',
}

export default function About() {
  const { user, logout } = useAuth()

  useEffect(() => {
    document.title = 'Profil & Akun · KeyForge'
  }, [])

  return (
    <div className="page">
      <h1>Profil &amp; Akun</h1>

      {user ? (
        <section className="panel">
          <h2>Akun Pembeli</h2>
          <dl className="spec spec-plain">
            <dt>Nama</dt>
            <dd>{user.name}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </dl>
          <Link to="/orders" className="btn">
            Lihat Riwayat Pembelian ›
          </Link>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Keluar dari Akun
          </button>
        </section>
      ) : (
        <AuthCard
          title="Masuk ke Akun Pembeli"
          subtitle="Masuk atau daftar untuk menyimpan pesanan dan melihat riwayat pembelian."
        />
      )}

      <section className="panel">
        <h2>Tentang Aplikasi</h2>
        <p>
          <strong>KeyForge</strong> adalah aplikasi katalog keyboard mekanik dan switch berbasis Progressive Web App (PWA).
          Data diambil dari REST API buatan sendiri (Node.js + Express + Supabase).
        </p>
        <p className="muted">Teknologi: React, Vite, React Router, Workbox (Service Worker), Express, Supabase.</p>
      </section>

      <section className="panel">
        <h2>Pembuat</h2>
        <dl className="spec spec-plain">
          <dt>Nama</dt>
          <dd>{PROFILE.nama}</dd>
          <dt>NIM</dt>
          <dd>{PROFILE.nim}</dd>
          <dt>Kelas</dt>
          <dd>{PROFILE.kelas}</dd>
          <dt>GitHub</dt>
          <dd>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              {PROFILE.github}
            </a>
          </dd>
        </dl>
      </section>
    </div>
  )
}
