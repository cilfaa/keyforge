import { useRef, useState } from 'react'
import { playSwitchSound } from '../sound.js'
import { IconVolume } from './Icons.jsx'

export default function SoundButton({ type, name, big = false }) {
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    playSwitchSound(type)
    setPlaying(false)
    requestAnimationFrame(() => setPlaying(true))
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setPlaying(false), 360)
  }

  if (big) {
    return (
      <button
        type="button"
        className={'btn sound-big' + (playing ? ' is-playing' : '')}
        onClick={handleClick}
      >
        <IconVolume playing={playing} />
        <span>{playing ? 'Memutar suara switch…' : `Dengarkan suara switch (${type})`}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={'sound-btn' + (playing ? ' is-playing' : '')}
      onClick={handleClick}
      aria-label={`Dengarkan suara ${name || type}`}
      title={`Dengarkan suara ${type}`}
    >
      <IconVolume playing={playing} />
    </button>
  )
}
