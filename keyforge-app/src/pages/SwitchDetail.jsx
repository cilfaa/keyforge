import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getSwitch } from '../api.js'
import { playSwitchSound } from '../sound.js'
import State from '../components/State.jsx'

export default function SwitchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: sw, loading, error } = useFetch(() => getSwitch(id), [id])

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)}>
        ← Kembali
      </button>
      <State loading={loading} error={error} />
      {sw && (
        <>
          <h1>{sw.name}</h1>
          <span className={`tag type-${sw.type.toLowerCase()}`}>{sw.type}</span>
          <p>{sw.description}</p>

          <button type="button" className="btn sound-big" onClick={() => playSwitchSound(sw.type)}>
            🔊 Dengarkan suara switch
          </button>
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
