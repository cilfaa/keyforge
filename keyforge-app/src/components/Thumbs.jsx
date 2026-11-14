function getMotifPalette(motif) {
  const cat = String(motif?.category || '').toLowerCase()
  if (cat === 'pesisir') return { bg: '#132234', primary: '#56b4ff', secondary: '#ffd27a' }
  if (cat === 'pedalaman') return { bg: '#27171b', primary: '#ff7b8a', secondary: '#f5c26b' }
  return { bg: '#241a10', primary: '#f5a623', secondary: '#d9b98c' }
}

export function MotifThumb({ motif, size = 'sm' }) {
  const n = String(motif?.name || '').toLowerCase()
  const { bg, primary, secondary } = getMotifPalette(motif)

  return (
    <div className={`thumb-box thumb-${size}`} style={{ background: bg }} aria-hidden="true">
      <svg viewBox="0 0 120 80" className="thumb-svg">
        {n.includes('parang') ? (
          <g stroke={primary} strokeWidth="3.5" fill="none" strokeLinecap="round">
            <path d="M-10 25 Q15 5 30 25 T70 25 T110 25 T150 25" transform="rotate(-22 60 40)" />
            <path d="M-10 45 Q15 25 30 45 T70 45 T110 45 T150 45" stroke={secondary} transform="rotate(-22 60 40)" />
            <path d="M-10 65 Q15 45 30 65 T70 65 T110 65 T150 65" transform="rotate(-22 60 40)" />
          </g>
        ) : n.includes('mega') ? (
          <g fill="none" strokeWidth="2.8" strokeLinecap="round">
            <path d="M10 54 C20 34, 46 34, 56 48 C68 30, 96 32, 108 50" stroke={primary} />
            <path d="M18 62 C28 44, 50 44, 60 56 C72 40, 94 42, 104 58" stroke={secondary} />
            <path d="M24 32 C34 18, 56 18, 66 28 C76 16, 94 18, 102 30" stroke={primary} strokeOpacity="0.7" />
          </g>
        ) : n.includes('kawung') ? (
          <g fill="none" stroke={primary} strokeWidth="2.4">
            {[30, 60, 90].map((cx) =>
              [24, 56].map((cy) => (
                <g key={`${cx}-${cy}`} transform={`translate(${cx},${cy})`}>
                  <ellipse rx="11" ry="5" fill={primary} fillOpacity="0.2" />
                  <ellipse rx="5" ry="11" fill={secondary} fillOpacity="0.2" stroke={secondary} />
                  <circle r="2" fill={primary} />
                </g>
              )),
            )}
          </g>
        ) : (
          <g fill="none" stroke={primary} strokeWidth="2.2">
            {[25, 60, 95].map((cx) =>
              [22, 58].map((cy) => (
                <g key={`${cx}-${cy}`} transform={`translate(${cx},${cy})`}>
                  <path d="M0 -13 L11 0 L0 13 L-11 0 Z" fill={primary} fillOpacity="0.16" />
                  <circle r="4" stroke={secondary} fill={secondary} fillOpacity="0.35" />
                </g>
              )),
            )}
          </g>
        )}
      </svg>
    </div>
  )
}

export function RegionThumb({ region, size = 'sm' }) {
  const initials = String(region?.name || 'ID')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`thumb-box thumb-${size}`} style={{ background: '#1a202c' }} aria-hidden="true">
      <svg viewBox="0 0 100 80" className="thumb-svg">
        <circle cx="50" cy="40" r="28" fill="#f5a623" fillOpacity="0.14" stroke="#f5a623" strokeWidth="2" />
        <circle cx="50" cy="40" r="20" fill="none" stroke="#f5a623" strokeOpacity="0.45" strokeDasharray="3 3" />
        <text x="50" y="45" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f5a623">
          {initials}
        </text>
      </svg>
    </div>
  )
}
