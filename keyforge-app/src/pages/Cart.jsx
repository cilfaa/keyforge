import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../api.js'
import { useAuth } from '../auth.jsx'
import { useCart } from '../cart.jsx'
import AuthCard from '../components/AuthCard.jsx'
import { formatLayout, rupiah } from '../components/KeyboardCard.jsx'
import { KeyboardThumb } from '../components/Thumbs.jsx'

const PAYMENT_METHODS = [
  { id: 'Transfer Bank', label: 'Transfer Bank (BCA / BNI / Mandiri)', desc: 'Verifikasi via Virtual Account' },
  { id: 'E-Wallet (DANA)', label: 'E-Wallet DANA', desc: 'Bayar langsung dari saldo DANA' },
  { id: 'E-Wallet (OVO)', label: 'E-Wallet OVO', desc: 'Bayar langsung dari saldo OVO' },
  { id: 'E-Wallet (GoPay)', label: 'E-Wallet GoPay', desc: 'Bayar langsung dari saldo GoPay' },
  { id: 'QRIS', label: 'QRIS', desc: 'Scan QR dari semua e-wallet & m-banking' },
  { id: 'COD', label: 'Bayar di Tempat (COD)', desc: 'Bayar tunai ke kurir saat paket tiba' },
]

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, setQty, removeItem, clearCart, totalCount, totalPrice } = useCart()

  const [step, setStep] = useState('cart')
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID())
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (user?.name && !customerName) setCustomerName(user.name)
  }, [user, customerName])

  useEffect(() => {
    document.title = totalCount > 0 ? `Keranjang (${totalCount}) · KeyForge` : 'Keranjang · KeyForge'
  }, [totalCount])

  const shippingCost = totalPrice >= 1500000 || totalPrice === 0 ? 0 : 20000
  const grandTotal = totalPrice + shippingCost

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user || items.length === 0 || busy) return
    setErr('')
    setBusy(true)
    try {
      const order = await createOrder({
        user_id: user.id,
        customer_name: customerName,
        shipping_address: address,
        note,
        payment_method: paymentMethod,
        idempotency_key: idempotencyKey,
        items: items.map((it) => ({ keyboard_id: it.id, quantity: it.qty })),
      })
      clearCart()
      setIdempotencyKey(crypto.randomUUID())
      navigate(`/orders/${order.id}`)
    } catch (error) {
      setErr(error.message || 'Gagal membuat pesanan.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="list-head">
        <h1>{step === 'checkout' ? 'Checkout & Pembayaran' : 'Keranjang'}</h1>
        {step === 'cart' && items.length > 0 && (
          <button type="button" className="link-danger" onClick={clearCart}>
            Kosongkan
          </button>
        )}
        {step === 'checkout' && (
          <button type="button" className="back" onClick={() => setStep('cart')}>
            ← Ubah Keranjang
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="state empty-box">
          <p>Keranjang kamu masih kosong.</p>
          <Link to="/keyboards" className="btn">
            Jelajahi Keyboard
          </Link>
          <Link to="/orders" className="btn btn-secondary">
            Lihat Riwayat Pembelian
          </Link>
        </div>
      ) : step === 'cart' ? (
        <>
          <ul className="list">
            {items.map((it) => (
              <li key={it.id} className="card cart-item">
                <Link to={`/keyboards/${it.id}`} className="cart-link">
                  <KeyboardThumb kb={it} size="sm" />
                  <div className="card-main">
                    <h3>{it.name}</h3>
                    <p className="muted">
                      {it.brand} · {formatLayout(it.layout)}
                    </p>
                    <p className="cart-unit">{rupiah(it.price)}</p>
                  </div>
                </Link>

                <div className="cart-actions">
                  <div className="qty-box" role="group" aria-label={`Jumlah ${it.name}`}>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQty(it.id, it.qty - 1)}
                      aria-label={`Kurangi ${it.name}`}
                    >
                      −
                    </button>
                    <span className="qty-num">{it.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQty(it.id, it.qty + 1)}
                      aria-label={`Tambah ${it.name}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-sub-col">
                    <span className="cart-subtotal">
                      Subtotal: <strong>{rupiah(it.price * it.qty)}</strong>
                    </span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(it.id)}
                      aria-label={`Hapus ${it.name}`}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <section className="panel checkout-box">
            <h2>Ringkasan Keranjang</h2>
            <div className="summary-row">
              <span className="muted">Total item</span>
              <span>{totalCount} keyboard</span>
            </div>
            <div className="summary-row">
              <span className="muted">Ongkos kirim</span>
              <span>{shippingCost === 0 ? 'Gratis (min. Rp 1,5 jt)' : rupiah(shippingCost)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Estimasi total</span>
              <strong>{rupiah(grandTotal)}</strong>
            </div>

            <button type="button" className="btn" onClick={() => setStep('checkout')}>
              Lanjut ke Checkout ›
            </button>
          </section>
        </>
      ) : !user ? (
        <AuthCard
          title="Masuk Sebelum Checkout"
          subtitle="Masuk atau daftar akun dulu agar pesanan dan riwayat pembelianmu tersimpan aman di database."
        />
      ) : (
        <form onSubmit={handleCheckout}>
          <section className="panel">
            <h2>Ringkasan Pesanan ({totalCount} item)</h2>
            <ul className="receipt-list">
              {items.map((it) => (
                <li key={it.id} className="receipt-row">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <strong>{rupiah(it.price * it.qty)}</strong>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span className="muted">Subtotal produk</span>
              <span>{rupiah(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span className="muted">Ongkos kirim</span>
              <span>{shippingCost === 0 ? 'Gratis' : rupiah(shippingCost)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total pembayaran</span>
              <strong>{rupiah(grandTotal)}</strong>
            </div>
          </section>

          <section className="panel">
            <h2>Data Pengiriman</h2>
            <input
              className="search"
              type="text"
              placeholder="Nama lengkap penerima"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              className="search"
              type="text"
              placeholder="Alamat lengkap pengiriman"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              className="search"
              type="text"
              placeholder="Catatan untuk penjual (opsional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </section>

          <section className="panel">
            <h2>Pilih Metode Pembayaran</h2>
            <div className="pay-methods" role="radiogroup" aria-label="Metode pembayaran">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm.id} className={'pay-option' + (paymentMethod === pm.id ? ' on' : '')}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                  />
                  <div>
                    <strong>{pm.label}</strong>
                    <p className="muted">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {err && <p className="form-error">{err}</p>}

          <button type="submit" className="btn" disabled={busy}>
            {busy ? 'Memproses Pesanan…' : `Konfirmasi Pesanan (${rupiah(grandTotal)})`}
          </button>
        </form>
      )}
    </div>
  )
}
