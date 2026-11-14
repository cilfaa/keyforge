import { useEffect, useState } from 'react'
import useFetch from '../useFetch.js'
import { createMotif, deleteMotif, getMotifs, getRegions, updateMotif } from '../api.js'

const PROFILE = {
  nama: 'Greycilfa',
  nim: '21120124140158',
  kelas: 'Praktikum PPB 2026',
  github: 'https://github.com/cilfaa/keyforge',
}

const CATEGORIES = ['Keraton', 'Pesisir', 'Pedalaman', 'Nusantara']

const EMPTY_FORM = {
  name: '',
  region_id: '',
  category: 'Nusantara',
  occasion: 'Acara Resmi',
  philosophy: '',
  description: '',
  image_url: '',
}

export default function About() {
  const motifsRes = useFetch(getMotifs, '/api/motifs')
  const regionsRes = useFetch(getRegions, '/api/regions')

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  useEffect(() => {
    document.title = 'Profil & Kelola Data · WastraKu'
  }, [])

  const regions = regionsRes.data || []
  const motifs = motifsRes.data || []

  const filteredMotifs = motifs.filter((m) => {
    const q = filterText.trim().toLowerCase()
    if (!q) return true
    return [m.name, m.category, m.regions?.province, m.regions?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.philosophy.trim() || !form.description.trim()) {
      setFeedback({ type: 'error', text: 'Nama motif, filosofi, dan deskripsi wajib diisi.' })
      return
    }

    setSubmitting(true)
    setFeedback({ type: '', text: '' })

    const payload = {
      name: form.name.trim(),
      region_id: form.region_id || null,
      category: form.category,
      occasion: form.occasion.trim() || 'Acara Resmi',
      philosophy: form.philosophy.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
    }

    try {
      if (editingId) {
        await updateMotif(editingId, payload)
        setFeedback({ type: 'ok', text: `Motif "${payload.name}" berhasil diperbarui.` })
      } else {
        await createMotif(payload)
        setFeedback({ type: 'ok', text: `Motif "${payload.name}" berhasil ditambahkan.` })
      }
      resetForm()
      motifsRes.retry()
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (motif) => {
    setEditingId(motif.id)
    setForm({
      name: motif.name || '',
      region_id: motif.region_id || motif.regions?.id || '',
      category: motif.category || 'Nusantara',
      occasion: motif.occasion || 'Acara Resmi',
      philosophy: motif.philosophy || '',
      description: motif.description || '',
      image_url: motif.image_url || '',
    })
    setFeedback({ type: '', text: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (motif) => {
    if (!window.confirm(`Hapus motif "${motif.name}" dari katalog?`)) return
    setFeedback({ type: '', text: '' })
    try {
      await deleteMotif(motif.id)
      if (editingId === motif.id) resetForm()
      setFeedback({ type: 'ok', text: `Motif "${motif.name}" telah dihapus.` })
      motifsRes.retry()
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="page">
      <h1>Profil &amp; Kelola Motif</h1>

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

      <section className="panel">
        <h2>{editingId ? 'Edit Motif Batik' : 'Tambah Motif Batik (CRUD)'}</h2>
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="crud-grid">
            <label className="crud-field">
              <span>Nama Motif</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Batik Sekar Jagad"
                required
              />
            </label>

            <label className="crud-field">
              <span>Provinsi Asal</span>
              <select name="region_id" value={form.region_id} onChange={handleChange}>
                <option value="">Pilih Provinsi (Opsional)</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.province} — {r.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="crud-field">
              <span>Kategori</span>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="crud-field">
              <span>Penggunaan Adat</span>
              <input
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
                placeholder="Upacara Adat / Acara Resmi"
              />
            </label>
          </div>

          <label className="crud-field">
            <span>Makna &amp; Filosofi</span>
            <textarea
              name="philosophy"
              rows="2"
              value={form.philosophy}
              onChange={handleChange}
              placeholder="Tuliskan makna filosofis motif..."
              required
            />
          </label>

          <label className="crud-field">
            <span>Deskripsi Pola &amp; Ornamen</span>
            <textarea
              name="description"
              rows="2"
              value={form.description}
              onChange={handleChange}
              placeholder="Tuliskan ciri pola dan ornamen kain..."
              required
            />
          </label>

          <label className="crud-field">
            <span>URL Gambar Batik (Opsional)</span>
            <input
              name="image_url"
              type="url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://commons.wikimedia.org/..."
            />
          </label>

          {feedback.text && (
            <p className={feedback.type === 'error' ? 'crud-msg error' : 'crud-msg ok'} role="status">
              {feedback.text}
            </p>
          )}

          <div className="crud-actions">
            <button type="submit" className="btn crud-submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Motif'}
            </button>
            {editingId && (
              <button type="button" className="share-btn" onClick={resetForm}>
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-head" style={{ marginTop: 0 }}>
          <h2>Daftar Data Motif ({motifs.length})</h2>
        </div>
        <input
          className="search"
          type="search"
          placeholder="Cari motif untuk diedit atau dihapus..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {motifsRes.loading && <p className="muted" style={{ marginTop: 12 }}>Memuat daftar motif...</p>}
        {motifsRes.error && <p className="crud-msg error">{motifsRes.error}</p>}

        <ul className="crud-list">
          {filteredMotifs.map((m) => (
            <li key={m.id} className="crud-item">
              <div className="crud-item-info">
                <strong>{m.name}</strong>
                <span className="muted">
                  {m.regions?.province || 'Nusantara'} · {m.category}
                </span>
              </div>
              <div className="crud-item-btns">
                <button type="button" className="chip" onClick={() => handleEdit(m)}>
                  Edit
                </button>
                <button type="button" className="chip crud-del" onClick={() => handleDelete(m)}>
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
