import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getKeyboards, getSwitch } from '../api.js'
import SoundButton from '../components/SoundButton.jsx'
import KeyboardCard from '../components/KeyboardCard.jsx'
import State from '../components/State.jsx'

export default function SwitchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: sw, loading, error, retry } = useFetch((opts) => getSwitch(id, opts), `/api/switches/${id}`)
  const kbList = useFetch(getKeyboards, '/api/keyboards')

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

  const usedIn = (kbList.data || []).filter((k) => k.switch_id === id || k.switches?.id === id)

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>
      <State loading={loading} error={error} onRetry={retry} detail />
      {sw && (
        <>
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

          <h2>Dipakai di Keyboard</h2>
          {usedIn.length > 0 ? (
            <ul className="list">
              {usedIn.map((k) => (
                <KeyboardCard key={k.id} kb={k} />
              ))}
            </ul>
          ) : (
            <p className="muted">Belum ada keyboard di katalog yang memakai switch ini.</p>
          )}
        </>
      )}
    </div>
  )
}
