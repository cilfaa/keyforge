import { useState } from 'react'

function getKeyboardPhoto(layout) {
  if (layout === '60%' || layout === '65%') return '/images/kb-kecil.jpg'
  if (layout === '75%') return '/images/kb-sedang.jpg'
  return '/images/kb-besar.jpg'
}

function getSwitchPhoto(type) {
  const t = String(type || '').toLowerCase()
  if (t === 'clicky') return '/images/sw-clicky.jpg'
  if (t === 'tactile') return '/images/sw-tactile.jpg'
  return '/images/sw-linear.jpg'
}

export function KeyboardThumb({ kb, size = 'sm' }) {
  const src = getKeyboardPhoto(kb?.layout)
  return (
    <div className={`thumb-box thumb-photo thumb-${size}`}>
      <img
        src={src}
        alt={`Foto keyboard ${kb?.name || 'mekanik'} (${kb?.layout || ''})`}
        className="thumb-img"
        loading="lazy"
      />
      {kb?.layout && <span className="thumb-badge">{kb.layout}</span>}
    </div>
  )
}

export function SwitchThumb({ sw, size = 'sm' }) {
  const [fallback, setFallback] = useState(false)
  const src = getSwitchPhoto(sw?.type)

  if (fallback) {
    return (
      <div className={`thumb-box thumb-${size}`} aria-hidden="true">
        <span className="tag">{sw?.type}</span>
      </div>
    )
  }

  return (
    <div className={`thumb-box thumb-photo thumb-${size}`}>
      <img
        src={src}
        alt={`Foto switch ${sw?.name || ''} (${sw?.type || ''})`}
        className="thumb-img"
        loading="lazy"
        onError={() => setFallback(true)}
      />
    </div>
  )
}
