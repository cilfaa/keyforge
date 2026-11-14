import { useState } from 'react'

function getMotifPalette(motif) {
  const cat = String(motif?.category || '').toLowerCase()
  if (cat === 'pesisir') return { bg: '#e0f2fe', primary: '#0369a1', secondary: '#d97706' }
  if (cat === 'pedalaman') return { bg: '#fce7f3', primary: '#9d174d', secondary: '#b45309' }
  if (cat === 'nusantara') return { bg: '#dcfce7', primary: '#166534', secondary: '#b45309' }
  return { bg: '#fef3c7', primary: '#92400e', secondary: '#b45309' }
}

function MotifFallbackSvg({ motif }) {
  const { bg, primary, secondary } = getMotifPalette(motif)
  return (
    <svg viewBox="0 0 120 80" className="thumb-svg" style={{ background: bg }} aria-hidden="true">
      {[25, 60, 95].map((cx) =>
        [22, 58].map((cy) => (
          <g key={`${cx}-${cy}`} transform={`translate(${cx},${cy})`} fill="none" stroke={primary} strokeWidth="2">
            <path d="M0 -13 L11 0 L0 13 L-11 0 Z" fill={primary} fillOpacity="0.12" />
            <circle r="4" stroke={secondary} fill={secondary} fillOpacity="0.3" />
          </g>
        )),
      )}
    </svg>
  )
}

export function MotifThumb({ motif, size = 'card' }) {
  const [imgError, setImgError] = useState(false)
  const src = motif?.image_url

  return (
    <div className={`thumb-box thumb-${size}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={`Pola motif batik ${motif?.name || 'Nusantara'}`}
          className="thumb-img"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <MotifFallbackSvg motif={motif} />
      )}
    </div>
  )
}

export function RegionThumb({ region, size = 'sm' }) {
  const initials = String(region?.province || region?.name || 'ID')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`thumb-box thumb-${size}`} style={{ background: '#fffbeb' }} aria-hidden="true">
      <svg viewBox="0 0 100 80" className="thumb-svg">
        <circle cx="50" cy="40" r="28" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
        <circle cx="50" cy="40" r="21" fill="none" stroke="#d97706" strokeOpacity="0.45" strokeDasharray="3 3" />
        <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="700" fill="#92400e">
          {initials}
        </text>
      </svg>
    </div>
  )
}
