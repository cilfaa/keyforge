// Semua pemanggilan ke API KeyForge ada di sini + cache sementara di memori
// agar pindah halaman terasa instan tanpa loading berulang.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const cache = new Map()
const inflight = new Map()

export function getCached(path) {
  return cache.get(path) ?? null
}

export function invalidateKeyboardsCache() {
  for (const key of cache.keys()) {
    if (key.startsWith('/api/keyboards')) cache.delete(key)
  }
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

async function mutate(path, method, payload) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Terjadi kendala saat memproses permintaan.')
  }
  return data
}

export const getKeyboards = (opts) => request('/api/keyboards', opts)
export const getKeyboard = (id, opts) => request(`/api/keyboards/${id}`, opts)
export const getSwitches = (opts) => request('/api/switches', opts)
export const getSwitch = (id, opts) => request(`/api/switches/${id}`, opts)

export const registerUser = (payload) => mutate('/api/auth/register', 'POST', payload)
export const loginUser = (payload) => mutate('/api/auth/login', 'POST', payload)

export const createOrder = async (payload) => {
  const order = await mutate('/api/orders', 'POST', payload)
  invalidateKeyboardsCache()
  return order
}
export const getOrdersByUser = (userId, opts) =>
  request(`/api/orders?user_id=${encodeURIComponent(userId)}`, { force: true, ...opts })
export const getOrderById = (id, opts) => request(`/api/orders/${id}`, { force: true, ...opts })
export const simulateOrderPayment = (id, status) => mutate(`/api/orders/${id}/payment`, 'PATCH', { status })
export const updateOrderStatus = (id, order_status) => mutate(`/api/orders/${id}/status`, 'PATCH', { order_status })
