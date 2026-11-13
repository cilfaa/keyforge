// Semua pemanggilan ke API KeyForge ada di sini + cache sementara di memori
// agar pindah halaman terasa instan tanpa loading berulang.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const cache = new Map()
const inflight = new Map()

export function getCached(path) {
  return cache.get(path) ?? null
}

async function request(path, { force = false } = {}) {
  if (!force && cache.has(path)) {
    return cache.get(path)
  }
  if (!force && inflight.has(path)) {
    return inflight.get(path)
  }

  const promise = (async () => {
    let res
    try {
      res = await fetch(`${BASE}${path}`)
    } catch {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.')
    }
    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? 'Data yang dicari tidak ditemukan.'
          : 'Terjadi kendala saat mengambil data dari server.',
      )
    }
    const data = await res.json()
    cache.set(path, data)

    // Simpan juga tiap item ke cache detail supaya buka halaman detail langsung instan
    if (path === '/api/keyboards' && Array.isArray(data)) {
      data.forEach((k) => cache.set(`/api/keyboards/${k.id}`, k))
    }
    if (path === '/api/switches' && Array.isArray(data)) {
      data.forEach((s) => cache.set(`/api/switches/${s.id}`, s))
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

export const getKeyboards = (opts) => request('/api/keyboards', opts)
export const getKeyboard = (id, opts) => request(`/api/keyboards/${id}`, opts)
export const getSwitches = (opts) => request('/api/switches', opts)
export const getSwitch = (id, opts) => request(`/api/switches/${id}`, opts)
