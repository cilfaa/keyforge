export default function State({ loading, error }) {
  if (loading) return <p className="state">Memuat data…</p>
  if (error)
    return (
      <p className="state error">
        Oops, gagal memuat: {error}
        <br />
        Pastikan API sudah menyala dan VITE_API_URL benar.
      </p>
    )
  return null
}
