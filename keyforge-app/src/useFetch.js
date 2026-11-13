import { useCallback, useEffect, useState } from 'react'
import { getCached } from './api.js'

// Hook ambil data dengan dukungan cache instan + tombol "Coba lagi" (retry)
export default function useFetch(fetcher, pathKey) {
  const initial = pathKey ? getCached(pathKey) : null
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(!initial)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    const cached = pathKey && tick === 0 ? getCached(pathKey) : null
    if (cached) {
      setData(cached)
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')
    fetcher({ force: tick > 0 })
      .then((d) => {
        if (alive) setData(d)
      })
      .catch((e) => {
        if (alive) setError(e.message || 'Gagal memuat data.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey, tick])

  const retry = useCallback(() => setTick((t) => t + 1), [])

  return { data, loading, error, retry }
}
