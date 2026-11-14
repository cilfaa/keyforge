import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import useFetch from '../useFetch.js'
import { getOrdersByUser } from '../api.js'
import AuthCard from '../components/AuthCard.jsx'
import State from '../components/State.jsx'
import { rupiah } from '../components/KeyboardCard.jsx'

export function formatOrderDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const PAYMENT_LABEL = {
  Pending: 'Menunggu Pembayaran',
  Paid: 'Lunas',
  Failed: 'Gagal',
}

export const ORDER_LABEL = {
  Pending: 'Menunggu',
  Processing: 'Diproses',
  Shipped: 'Dikirim',
  Completed: 'Selesai',
}

export default function Orders() {
  const { user } = useAuth()
  const { data: orders, loading, error, retry } = useFetch(
    (opts) => (user ? getOrdersByUser(user.id, opts) : Promise.resolve([])),
    user ? `/api/orders?user_id=${user.id}` : null,
  )

  useEffect(() => {
    document.title = 'Riwayat Pembelian · KeyForge'
  }, [])

  if (!user) {
    return (
      <div className="page">
        <h1>Riwayat Pembelian</h1>
        <AuthCard
          title="Masuk untuk Melihat Riwayat"
          subtitle="Riwayat transaksi tersimpan di akunmu dan tetap ada walaupun kamu keluar atau ganti perangkat."
        />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="list-head">
        <h1>Riwayat Pembelian</h1>
        <span className="muted">{user.name}</span>
      </div>

      <State loading={loading} error={error} onRetry={retry} count={3} />

      {!loading && !error && orders && orders.length === 0 && (
        <div className="state empty-box">
          <p>Kamu belum memiliki riwayat transaksi.</p>
          <Link to="/keyboards" className="btn">
            Mulai Belanja Keyboard
          </Link>
        </div>
      )}

      <ul className="list">
        {(orders || []).map((o) => {
          const itemCount = (o.order_items || []).reduce((s, it) => s + Number(it.quantity || 0), 0)
          const firstItem = o.order_items?.[0]?.keyboard_name || 'Keyboard'
          const extraCount = (o.order_items?.length || 0) - 1

          return (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`} className="card order-card">
                <div className="order-top">
                  <strong className="order-code">{o.order_code}</strong>
                  <span className="muted">{formatOrderDate(o.created_at)}</span>
                </div>

                <div className="order-mid">
                  <p className="order-items-summary">
                    {firstItem}
                    {extraCount > 0 ? ` (+${extraCount} produk lainnya)` : ''} · {itemCount} item
                  </p>
                  <p className="muted">Metode: {o.payment_method}</p>
                </div>

                <div className="order-bottom">
                  <div className="order-badges">
                    <span className={`badge pay-${(o.payment_status || 'pending').toLowerCase()}`}>
                      {PAYMENT_LABEL[o.payment_status] || o.payment_status}
                    </span>
                    <span className={`badge ord-${(o.order_status || 'pending').toLowerCase()}`}>
                      {ORDER_LABEL[o.order_status] || o.order_status}
                    </span>
                  </div>
                  <strong className="order-total">{rupiah(o.total_price)} ›</strong>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
