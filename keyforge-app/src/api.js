// Pemanggilan API WastraKu dengan Query Caching (memori + sessionStorage) & dukungan Disk Cache
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const STORAGE_PREFIX = 'wastraku_qcache_v1:'
const TTL_MS = 1000 * 60 * 15 // 15 menit

const cache = new Map()
const inflight = new Map()

function readDiskQuery(path) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + path)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeDiskQuery(path, data) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + path, JSON.stringify({ ts: Date.now(), data }))
  } catch {
    // Abaikan jika storage penuh
  }
}

export function getCached(path) {
  if (cache.has(path)) return cache.get(path)
  const stored = readDiskQuery(path)
  if (stored) {
    cache.set(path, stored)
    return stored
  }
  return null
}

async function request(path, { force = false } = {}) {
  if (!force) {
    const hit = getCached(path)
    if (hit) return hit
  }
  if (!force && inflight.has(path)) return inflight.get(path)

  const promise = (async () => {
    let res
    try {
      res = await fetch(`${BASE}${path}`, { cache: force ? 'reload' : 'default' })
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
    writeDiskQuery(path, data)

    if (path === '/api/motifs' && Array.isArray(data)) {
      data.forEach((m) => {
        cache.set(`/api/motifs/${m.id}`, m)
        writeDiskQuery(`/api/motifs/${m.id}`, m)
      })
    }
    if (path === '/api/regions' && Array.isArray(data)) {
      data.forEach((r) => {
        cache.set(`/api/regions/${r.id}`, r)
        writeDiskQuery(`/api/regions/${r.id}`, r)
      })
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

function clearMotifCache() {
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith('/api/motifs')) cache.delete(key)
  }
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i -= 1) {
      const k = sessionStorage.key(i)
      if (k && k.startsWith(`${STORAGE_PREFIX}/api/motifs`)) sessionStorage.removeItem(k)
    }
  } catch {
    // Abaikan jika sessionStorage tidak tersedia
  }
}

async function mutate(path, method, body) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.')
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.error || 'Gagal menyimpan perubahan ke server.')
  }
  clearMotifCache()
  return res.json()
}

export const createMotif = (payload) => mutate('/api/motifs', 'POST', payload)
export const updateMotif = (id, payload) => mutate(`/api/motifs/${id}`, 'PUT', payload)
export const deleteMotif = (id) => mutate(`/api/motifs/${id}`, 'DELETE')
