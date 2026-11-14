import { useSearchParams } from 'react-router-dom'

export default function useQueryFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const getParam = (key, fallback = '') => searchParams.get(key) || fallback

  const setParam = (key, val, defaultVal = '') => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  const resetParams = () => setSearchParams({}, { replace: true })

  return { getParam, setParam, resetParams }
}
