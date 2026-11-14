import { useEffect } from 'react'

const PROFILE = {
  nama: 'Greycilfa',
  nim: '21120124140158',
  kelas: 'Praktikum PPB 2026',
  github: 'https://github.com/cilfaa/keyforge',
}

const TECH_STACK = ['React', 'Vite', 'React Router', 'Workbox PWA', 'Node.js & Express', 'Supabase']

export default function About() {
  useEffect(() => {
    document.title = 'Profil & Tentang · WastraKu'
  }, [])

  return (
    <div className="page">
      <h1>Profil &amp; Tentang</h1>

      <section className="panel">
        <h2>Tentang Aplikasi</h2>
        <p>
          <strong>WastraKu</strong> adalah ensiklopedia digital Batik Nusantara yang menghimpun ragam motif autentik
          dari 38 provinsi di Indonesia, lengkap dengan makna filosofis, sejarah budaya, simbolisme, serta penggunaan
          adatnya.
        </p>
        <p className="muted" style={{ marginTop: 10 }}>
          Dikembangkan sebagai Progressive Web App (PWA) dengan dukungan disk cache dan query caching agar tetap cepat
          serta nyaman diakses kapan saja.
        </p>
        <div className="tech-tags" aria-label="Teknologi yang digunakan">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Pembuat</h2>
        <div className="profile-head">
          <div className="profile-avatar" aria-hidden="true">
            {PROFILE.nama.charAt(0)}
          </div>
          <div>
            <strong className="profile-name">{PROFILE.nama}</strong>
            <p className="muted">
              NIM {PROFILE.nim} · {PROFILE.kelas}
            </p>
          </div>
        </div>
        <dl className="spec spec-plain">
          <dt>Nama</dt>
          <dd>{PROFILE.nama}</dd>
          <dt>NIM</dt>
          <dd>{PROFILE.nim}</dd>
          <dt>Kelas</dt>
          <dd>{PROFILE.kelas}</dd>
          <dt>Repositori</dt>
          <dd>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              github.com/cilfaa/keyforge ↗
            </a>
          </dd>
        </dl>
      </section>
    </div>
  )
}
