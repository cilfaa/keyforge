import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getSwitch } from '../api.js'
import SoundButton from '../components/SoundButton.jsx'
import { SwitchThumb } from '../components/Thumbs.jsx'
import State from '../components/State.jsx'

export default function SwitchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: sw, loading, error, retry } = useFetch((opts) => getSwitch(id, opts), `/api/switches/${id}`)

  useEffect(() => {
    document.title = sw ? `${sw.name} · KeyForge` : 'Detail Switch · KeyForge'
  }, [sw])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/switches')
    }
  }

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>
      <State loading={loading} error={error} onRetry={retry} detail />
      {sw && (
        <>
          <SwitchThumb sw={sw} size="lg" />
          <h1>{sw.name}</h1>
          <span className={`tag type-${sw.type.toLowerCase()}`}>{sw.type}</span>
          <p>{sw.description}</p>

          <SoundButton type={sw.type} name={sw.name} big />
          <p className="muted note">Suara adalah simulasi untuk gambaran jenis {sw.type}, bukan rekaman asli.</p>

          <h2>Spesifikasi</h2>
          <dl className="spec">
            <dt>Tipe</dt>
            <dd>{sw.type}</dd>
            <dt>Gaya tekan</dt>
            <dd>{sw.actuation_force} gf</dd>
            <dt>Jarak tekan</dt>
            <dd>{sw.travel_mm} mm</dd>
            <dt>Suara</dt>
            <dd>{sw.sound}</dd>
          </dl>
        </>
      )}
    </div>
  )
}
