// Suara switch dibuat langsung oleh browser (Web Audio API), tanpa file audio.
// Ini simulasi sederhana yang membedakan 3 jenis switch: Linear, Tactile, Clicky.
let ctx

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Bunyi "thock": nada rendah yang cepat mengecil
function thock(c, t, { freq = 180, vol = 0.6, len = 0.12 } = {}) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, t)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + len)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + len)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + len)
}

// Bunyi "klik/tik": noise pendek yang tajam
function noise(c, t, { freq = 3500, q = 1, vol = 0.5, len = 0.02 } = {}) {
  const size = Math.max(1, Math.floor(c.sampleRate * len))
  const buffer = c.createBuffer(1, size, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size)
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = q
  const gain = c.createGain()
  gain.gain.value = vol
  src.connect(filter).connect(gain).connect(c.destination)
  src.start(t)
}

export function playSwitchSound(type) {
  const c = getCtx()
  if (!c) return
  const t = c.currentTime + 0.01
  const kind = String(type || '').toLowerCase()

  if (kind === 'clicky') {
    // klik tajam + thock, lalu klik pelan saat tombol naik
    noise(c, t, { freq: 4200, q: 2, vol: 0.9, len: 0.025 })
    thock(c, t, { freq: 220, vol: 0.5, len: 0.1 })
    noise(c, t + 0.09, { freq: 3800, q: 2, vol: 0.45, len: 0.02 })
  } else if (kind === 'tactile') {
    // bump halus di tengah tekanan + thock
    noise(c, t, { freq: 1300, q: 1, vol: 0.35, len: 0.03 })
    thock(c, t + 0.02, { freq: 170, vol: 0.6, len: 0.12 })
    thock(c, t + 0.1, { freq: 150, vol: 0.2, len: 0.06 })
  } else {
    // linear: mulus, thock lembut tanpa bump
    thock(c, t, { freq: 150, vol: 0.55, len: 0.14 })
    thock(c, t + 0.1, { freq: 130, vol: 0.18, len: 0.07 })
  }
}
