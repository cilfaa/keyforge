import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getOrderById, simulateOrderPayment, updateOrderStatus } from '../api.js'
import State from '../components/State.jsx'
import { formatLayout, rupiah } from '../components/KeyboardCard.jsx'
import { formatOrderDate, ORDER_LABEL, PAYMENT_LABEL } from './Orders.jsx'

function getPaymentInstruction(order) {
  const m = order.payment_method || ''
  if (m.includes('Bank')) {
    return {
      title: 'Transfer Bank (Virtual Account)',
      detail: `Transfer ke Nomor Virtual Account: ${order.payment_ref}`,
      steps: 'Buka aplikasi mobile banking atau ATM, pilih Transfer Virtual Account, masukkan nomor VA di atas sesuai total tagihan.',
    }
  }
  if (m.includes('DANA') || m.includes('OVO') || m.includes('GoPay')) {
    return {
      title: `Pembayaran ${m}`,
      detail: `Nomor Tujuan / Kode Bayar: ${order.payment_ref}`,
      steps: `Buka aplikasi ${m.replace('E-Wallet ', '')}, pilih Bayar / Transfer, masukkan nomor tujuan dan nominal persis seperti total pembayaran.`,
    }
  }
  if (m.includes('QRIS')) {
    return {
      title: 'Pembayaran QRIS',
      detail: `Kode Referensi QRIS: ${order.payment_ref}`,
      steps: 'Scan kode QRIS (simulasi) menggunakan aplikasi e-wallet atau mobile banking yang mendukung QRIS, lalu konfirmasi pembayaran.',
    }
  }
  return {
    title: 'Bayar di Tempat (COD)',
    detail: `Kode Pesanan Kurir: ${order.payment_ref}`,
    steps: 'Siapkan uang pas sesuai total pembayaran untuk diberikan kepada kurir saat paket tiba di alamat tujuan.',
  }
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: initialOrder, loading, error, retry } = useFetch((opts) => getOrderById(id, opts), `/api/orders/${id}`)
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionErr, setActionErr] = useState('')

  const current = order || initialOrder

  useEffect(() => {
    document.title = current ? `${current.order_code} · KeyForge` : 'Detail Pesanan · KeyForge'
  }, [current])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/orders')
  }

  const handlePaySim = async (status) => {
    if (!current || busy) return
    setBusy(true)
    setActionErr('')
    try {
      const updated = await simulateOrderPayment(current.id, status)
      setOrder(updated)
    } catch (err) {
      setActionErr(err.message || 'Gagal memperbarui status pembayaran.')
    } finally {
      setBusy(false)
    }
  }

  const handleOrderStep = async (nextStatus) => {
    if (!current || busy) return
    setBusy(true)
    setActionErr('')
    try {
      const updated = await updateOrderStatus(current.id, nextStatus)
      setOrder(updated)
    } catch (err) {
      setActionErr(err.message || 'Gagal memperbarui status pesanan.')
    } finally {
      setBusy(false)
    }
  }

  const instr = current ? getPaymentInstruction(current) : null

  return (
    <div className="page">
      <button type="button" className="back" onClick={handleBack}>
        ← Kembali
      </button>

      <State loading={loading && !current} error={error} onRetry={retry} detail />

      {current && (
        <>
          <div className="list-head">
            <h1>{current.order_code}</h1>
            <span className={`badge pay-${(current.payment_status || 'pending').toLowerCase()}`}>
              {PAYMENT_LABEL[current.payment_status] || current.payment_status}
            </span>
          </div>
          <p className="muted">Tanggal: {formatOrderDate(current.created_at)}</p>

          <section className="panel">
            <h2>Status Transaksi</h2>
            <dl className="spec spec-plain">
              <dt>Pembayaran</dt>
              <dd>
                <span className={`badge pay-${(current.payment_status || 'pending').toLowerCase()}`}>
                  {PAYMENT_LABEL[current.payment_status] || current.payment_status}
                </span>
              </dd>
              <dt>Status Pesanan</dt>
              <dd>
                <span className={`badge ord-${(current.order_status || 'pending').toLowerCase()}`}>
                  {ORDER_LABEL[current.order_status] || current.order_status}
                </span>
              </dd>
              <dt>Metode Bayar</dt>
              <dd>{current.payment_method}</dd>
              {current.paid_at && (
                <>
                  <dt>Dibayar Pada</dt>
                  <dd>{formatOrderDate(current.paid_at)}</dd>
                </>
              )}
            </dl>
          </section>

          {current.payment_status !== 'Paid' && instr && (
            <section className="panel pay-instruct">
              <h2>{instr.title}</h2>
              <p className="pay-ref">{instr.detail}</p>
              <p className="muted">{instr.steps}</p>

              <p className="muted note">
                Mode simulasi: belum terhubung ke payment gateway nyata. Gunakan tombol di bawah untuk menguji status
                pembayaran.
              </p>

              {actionErr && <p className="form-error">{actionErr}</p>}

              <button type="button" className="btn" disabled={busy} onClick={() => handlePaySim('Paid')}>
                {busy ? 'Memproses…' : 'Simulasikan Pembayaran Berhasil'}
              </button>
              {current.payment_status !== 'Failed' && (
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  disabled={busy}
                  onClick={() => handlePaySim('Failed')}
                >
                  Simulasikan Pembayaran Gagal
                </button>
              )}
            </section>
          )}

          {current.payment_status === 'Paid' && current.order_status !== 'Completed' && (
            <section className="panel">
              <h2>Simulasi Pengiriman Pesanan</h2>
              <p className="muted">Pembayaran sudah diterima. Kamu bisa mensimulasikan progres pengiriman pesanan ini:</p>
              {actionErr && <p className="form-error">{actionErr}</p>}
              {current.order_status === 'Processing' && (
                <button type="button" className="btn" disabled={busy} onClick={() => handleOrderStep('Shipped')}>
                  {busy ? 'Memperbarui…' : 'Tandai Sedang Dikirim'}
                </button>
              )}
              {current.order_status === 'Shipped' && (
                <button type="button" className="btn" disabled={busy} onClick={() => handleOrderStep('Completed')}>
                  {busy ? 'Memperbarui…' : 'Konfirmasi Pesanan Selesai'}
                </button>
              )}
            </section>
          )}

          <section className="panel">
            <h2>Produk yang Dibeli</h2>
            <ul className="receipt-list">
              {(current.order_items || []).map((it) => (
                <li key={it.id} className="receipt-row">
                  <div>
                    <strong>{it.keyboard_name}</strong>
                    <p className="muted">
                      {it.keyboard_brand} · {formatLayout(it.keyboard_layout)} · {it.quantity} × {rupiah(it.unit_price)}
                    </p>
                  </div>
                  <strong>{rupiah(it.subtotal)}</strong>
                </li>
              ))}
            </ul>

            <div className="summary-row">
              <span className="muted">Subtotal produk</span>
              <span>{rupiah(current.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span className="muted">Ongkos kirim</span>
              <span>{Number(current.shipping_cost) === 0 ? 'Gratis' : rupiah(current.shipping_cost)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total pembayaran</span>
              <strong>{rupiah(current.total_price)}</strong>
            </div>
          </section>

          <section className="panel">
            <h2>Info Pengiriman</h2>
            <dl className="spec spec-plain">
              <dt>Penerima</dt>
              <dd>{current.customer_name}</dd>
              <dt>Alamat</dt>
              <dd>{current.shipping_address}</dd>
              {current.note && (
                <>
                  <dt>Catatan</dt>
                  <dd>{current.note}</dd>
                </>
              )}
            </dl>
          </section>

          <Link to="/orders" className="btn btn-secondary">
            Lihat Semua Riwayat Pembelian ›
          </Link>
        </>
      )}
    </div>
  )
}
