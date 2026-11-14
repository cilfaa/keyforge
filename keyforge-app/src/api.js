// Semua pemanggilan ke API WastraKu ada di sini + cache sementara di memori
// agar pindah halaman terasa instan tanpa loading berulang.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const cache = new Map()
const inflight = new Map()

export function getCached(path) {
  return cache.get(path) ?? null
}

async function request(path, { force = false } = {}) {
  if (!force && cache.has(path)) return cache.get(path)
  if (!force && inflight.has(path)) return inflight.get(path)

  const promise = (async () => {
    let res
    try {
      res = await fetch(`${BASE}${path}`)
    } catch {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.')
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(
        body.error ||
          (res.status === 404
            ? 'Data yang dicari tidak ditemukan.'
            : 'Terjadi kendala saat mengambil data dari server.'),
      )
    }
    const data = await res.json()
    cache.set(path, data)

    if (path === '/api/motifs' && Array.isArray(data)) {
      data.forEach((m) => cache.set(`/api/motifs/${m.id}`, m))
    }
    if (path === '/api/regions' && Array.isArray(data)) {
      data.forEach((r) => cache.set(`/api/regions/${r.id}`, r))
    }

    return data
  })()

  inflight.set(path, promise)
  try {
    return await promise
  } finally {
    inflight.delete(path)
  }
}

export const getMotifs = (opts) => request('/api/motifs', opts)
export const getMotif = (id, opts) => request(`/api/motifs/${id}`, opts)
export const getRegions = (opts) => request('/api/regions', opts)
export const getRegion = (id, opts) => request(`/api/regions/${id}`, opts)
