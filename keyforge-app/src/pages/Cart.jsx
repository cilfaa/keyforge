import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart.jsx'
import { formatLayout, rupiah } from '../components/KeyboardCard.jsx'
import { KeyboardThumb } from '../components/Thumbs.jsx'

export default function Cart() {
  const { items, setQty, removeItem, clearCart, totalCount, totalPrice } = useCart()
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    document.title = totalCount > 0 ? `Keranjang (${totalCount}) · KeyForge` : 'Keranjang · KeyForge'
  }, [totalCount])

  const handleCheckout = (e) => {
    e.preventDefault()
    if (items.length === 0) return
    setReceipt({
      code: 'KF-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      customer: name.trim() || 'Pembeli',
      note: note.trim(),
      items: items.map((it) => ({ ...it })),
      total: totalPrice,
      count: totalCount,
    })
    clearCart()
    setName('')
    setNote('')
  }

  if (receipt) {
    return (
      <div className="page">
        <div className="panel receipt-box">
          <p className="receipt-badge">Pesanan Berhasil Dibuat</p>
          <h1>Terima kasih, {receipt.customer}!</h1>
          <p className="muted">Kode Pesanan: <strong>{receipt.code}</strong></p>

          <ul className="receipt-list">
            {receipt.items.map((it) => (
              <li key={it.id} className="receipt-row">
                <span>
                  {it.name} × {it.qty}
                </span>
                <strong>{rupiah(it.price * it.qty)}</strong>
              </li>
            ))}
          </ul>

          <div className="receipt-total">
            <span>Total ({receipt.count} item)</span>
            <strong>{rupiah(receipt.total)}</strong>
          </div>

          {receipt.note && <p className="muted note">Catatan: {receipt.note}</p>}

          <button type="button" className="btn" onClick={() => setReceipt(null)}>
            Selesai
          </button>
          <Link to="/keyboards" className="btn btn-secondary">
            Belanja Lagi
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="list-head">
        <h1>Keranjang</h1>
        {items.length > 0 && (
          <button type="button" className="link-danger" onClick={clearCart}>
            Kosongkan
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="state empty-box">
          <p>Keranjang kamu masih kosong.</p>
          <Link to="/keyboards" className="btn">
            Jelajahi Keyboard
          </Link>
        </div>
      ) : (
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

          <form className="panel checkout-box" onSubmit={handleCheckout}>
            <h2>Ringkasan Pesanan</h2>
            <div className="summary-row">
              <span className="muted">Total item</span>
              <span>{totalCount} keyboard</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total harga</span>
              <strong>{rupiah(totalPrice)}</strong>
            </div>

            <input
              className="search"
              type="text"
              placeholder="Nama penerima (opsional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="search"
              type="text"
              placeholder="Catatan pesanan (opsional, misal alamat/warna)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button type="submit" className="btn">
              Checkout Sekarang ({rupiah(totalPrice)})
            </button>
          </form>
        </>
      )}
    </div>
  )
}
