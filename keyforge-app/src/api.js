// Semua pemanggilan ke API KeyForge ada di sini.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

async function request(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Gagal memuat data (${res.status})`)
  }
  return res.json()
}

export const getKeyboards = () => request('/api/keyboards')
export const getKeyboard = (id) => request(`/api/keyboards/${id}`)
export const getSwitches = () => request('/api/switches')
export const getSwitch = (id) => request(`/api/switches/${id}`)
