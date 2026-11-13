function getSwitchPalette(sw) {
  const n = (sw?.name || '').toLowerCase()
  const t = (sw?.type || '').toLowerCase()
  if (n.includes('pink')) return { stem: '#ff7eb6', glow: '#3a1c2d', housing: '#2a2230' }
  if (n.includes('white') || n.includes('box')) return { stem: '#e8edf5', glow: '#1e2c3d', housing: '#222834' }
  if (t === 'clicky' || n.includes('blue')) return { stem: '#4da6ff', glow: '#182b44', housing: '#1e2430' }
  if (t === 'tactile' || n.includes('brown')) return { stem: '#c8844b', glow: '#342416', housing: '#26211d' }
  return { stem: '#f05a5a', glow: '#3a1c1c', housing: '#281f22' }
}

function getKeyboardAccent(kb) {
  const b = (kb?.brand || '').toLowerCase()
  if (b.includes('akko')) return '#ff7eb6'
  if (b.includes('keychron')) return '#f5a623'
  if (b.includes('logitech')) return '#4da6ff'
  if (b.includes('ducky')) return '#ffd24c'
  if (b.includes('leobog')) return '#a78bfa'
  if (b.includes('fantech')) return '#34d399'
  if (b.includes('rexus')) return '#fb7185'
  return '#f5a623'
}

export function KeyboardThumb({ kb, size = 'sm' }) {
  const layout = kb?.layout || '75%'
  const accent = getKeyboardAccent(kb)
  const isFull = layout === 'Full'
  const isTkl = layout === 'TKL'
  const hasFnRow = isFull || isTkl || layout === '75%'
  const hasNav = isFull || isTkl

  return (
    <div className={`thumb-box thumb-${size}`} aria-hidden="true">
      <svg viewBox="0 0 160 88" className="thumb-svg">
        <rect x="6" y="10" width="148" height="68" rx="10" fill="#141820" stroke="#323949" strokeWidth="2" />
        <rect x="12" y="16" width="136" height="56" rx="6" fill="#1d222d" />

        {/* Function row for 75% / TKL / Full */}
        {hasFnRow && (
          <g fill="#2d3444">
            <rect x="16" y="20" width="9" height="6" rx="1.5" fill={accent} />
            <rect x="28" y="20" width="18" height="6" rx="1.5" />
            <rect x="49" y="20" width="18" height="6" rx="1.5" />
            <rect x="70" y="20" width="18" height="6" rx="1.5" />
            <rect x="91" y="20" width="18" height="6" rx="1.5" />
          </g>
        )}

        {/* Main alpha rows */}
        <g fill="#343c4e">
          <rect x="16" y={hasFnRow ? 29 : 22} width="94" height="7" rx="2" />
          <rect x="16" y={hasFnRow ? 39 : 32} width="94" height="7" rx="2" />
          <rect x="16" y={hasFnRow ? 49 : 42} width="94" height="7" rx="2" />
        </g>

        {/* Bottom row + spacebar */}
        <g fill="#343c4e">
          <rect x="16" y={hasFnRow ? 59 : 54} width="16" height="7" rx="2" />
          <rect x="35" y={hasFnRow ? 59 : 54} width="46" height="7" rx="2" fill={accent} fillOpacity="0.9" />
          <rect x="84" y={hasFnRow ? 59 : 54} width="26" height="7" rx="2" />
        </g>

        {/* Accent Esc key when no fn row */}
        {!hasFnRow && <rect x="16" y="22" width="10" height="7" rx="2" fill={accent} />}

        {/* Nav cluster / Numpad */}
        {hasNav && (
          <g fill="#2c3342">
            <rect x="114" y="29" width="12" height="17" rx="2" />
            <rect x="114" y="54" width="12" height="12" rx="2" />
          </g>
        )}
        {isFull && (
          <g fill="#2c3342">
            <rect x="129" y="29" width="15" height="37" rx="2" />
          </g>
        )}
        {!hasNav && (
          <g fill="#2c3342">
            <rect x="114" y={hasFnRow ? 29 : 22} width="30" height={hasFnRow ? 37 : 39} rx="3" fillOpacity="0.45" />
          </g>
        )}

        {/* Layout badge */}
        <rect x="112" y="6" width="38" height="14" rx="7" fill={accent} />
        <text x="131" y="16" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#111">
          {layout}
        </text>
      </svg>
    </div>
  )
}

export function SwitchThumb({ sw, size = 'sm' }) {
  const { stem, glow, housing } = getSwitchPalette(sw)

  return (
    <div className={`thumb-box thumb-${size}`} style={{ background: glow }} aria-hidden="true">
      <svg viewBox="0 0 100 88" className="thumb-svg">
        {/* Cross stem */}
        <rect x="38" y="10" width="24" height="18" rx="3" fill={stem} />
        <rect x="46" y="13" width="8" height="12" rx="1.5" fill="#111" fillOpacity="0.35" />
        <rect x="42" y="17" width="16" height="4" rx="1.5" fill="#111" fillOpacity="0.35" />

        {/* Top housing */}
        <path d="M24 28h52l6 16H18l6-16z" fill={housing} stroke="#444d61" strokeWidth="2" />
        {/* Bottom housing */}
        <rect x="18" y="44" width="64" height="24" rx="4" fill="#181c24" stroke="#363e4f" strokeWidth="2" />
        <rect x="28" y="50" width="44" height="6" rx="2" fill={stem} fillOpacity="0.28" />

        {/* Contact pins */}
        <rect x="34" y="68" width="4" height="11" rx="1.5" fill="#d9a441" />
        <rect x="62" y="68" width="4" height="11" rx="1.5" fill="#d9a441" />
        <rect x="47" y="68" width="6" height="9" rx="2" fill="#525b70" />
      </svg>
    </div>
  )
}
