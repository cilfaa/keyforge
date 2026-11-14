import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'keyforge_cart_v1'
const CartContext = createContext(null)

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Abaikan jika storage penuh/diblokir
    }
  }, [items])

  const addItem = (kb) => {
    if (!kb?.id) return
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === kb.id)
      if (idx >= 0) {
        return prev.map((it, i) => (i === idx ? { ...it, qty: it.qty + 1 } : it))
      }
      return [
        ...prev,
        {
          id: kb.id,
          name: kb.name,
          brand: kb.brand,
          layout: kb.layout,
          price: Number(kb.price || 0),
          switchName: kb.switches?.name || '',
          qty: 1,
        },
      ]
    })
  }

  const setQty = (id, qty) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((it) => it.id !== id) : prev.map((it) => (it.id === id ? { ...it, qty } : it)),
    )
  }

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id))
  const clearCart = () => setItems([])

  const totalCount = items.reduce((sum, it) => sum + it.qty, 0)
  const totalPrice = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, setQty, removeItem, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
