// GANTI data di bawah dengan data dirimu sendiri.
const PROFILE = {
  nama: 'Greycilfa',
  nim: '21120124140158',
  kelas: 'Praktikum PPB 2026',
  github: 'https://github.com/cilfaa/keyforge',
}

export default function About() {
  return (
    <div className="page">
      <h1>Profil &amp; Tentang</h1>

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
        <dl className="spec">
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
