import crypto from "crypto";
import { supabase } from "../config/supabaseClient.js";

const ORDER_SELECT = `
  id, order_code, user_id, customer_name, shipping_address, note,
  payment_method, payment_status, order_status,
  subtotal, shipping_cost, total_price, payment_ref, paid_at, created_at,
  order_items ( id, keyboard_id, keyboard_name, keyboard_brand, keyboard_layout, unit_price, quantity, subtotal )
`;

function makeOrderCode() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `KF-${d}-${rand}`;
}

function makePaymentRef(method) {
  const num = String(Math.floor(10000000 + Math.random() * 90000000));
  if (method.includes("Bank")) return `88001${num}`;
  if (method.includes("DANA")) return `0812-3456-${num.slice(0, 4)}`;
  if (method.includes("OVO")) return `0813-7788-${num.slice(0, 4)}`;
  if (method.includes("GoPay")) return `0815-9900-${num.slice(0, 4)}`;
  if (method.includes("QRIS")) return `QRIS-KF-${num}`;
  return `COD-${num.slice(0, 6)}`;
}

export const OrderModel = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create({ user_id, customer_name, shipping_address, note, payment_method, items, idempotency_key }) {
    // Cegah transaksi ganda jika tombol ditekan berulang
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("idempotency_key", idempotency_key)
        .maybeSingle();
      if (existing) return existing;
    }

    const ids = items.map((i) => i.keyboard_id);
    const { data: keyboards, error: kbErr } = await supabase
      .from("keyboards")
      .select("id, name, brand, layout, price, stock")
      .in("id", ids);
    if (kbErr) throw kbErr;

    const kbMap = new Map((keyboards || []).map((k) => [k.id, k]));
    const resolvedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const kb = kbMap.get(item.keyboard_id);
      if (!kb) {
        const err = new Error("Salah satu produk tidak ditemukan di database.");
        err.status = 404;
        throw err;
      }
      const currentStock = Number(kb.stock ?? 0);
      if (currentStock < qty) {
        const err = new Error(`Stok ${kb.name} tidak mencukupi (tersisa ${currentStock}).`);
        err.status = 400;
        throw err;
      }
      const unitPrice = Number(kb.price || 0);
      const lineSub = unitPrice * qty;
      subtotal += lineSub;
      resolvedItems.push({ kb, qty, unitPrice, lineSub, nextStock: currentStock - qty });
    }

    // Gratis ongkir untuk belanja >= Rp 1.500.000, selain itu Rp 20.000
    const shippingCost = subtotal >= 1500000 ? 0 : 20000;
    const totalPrice = subtotal + shippingCost;

    const { data: order, error: ordErr } = await supabase
      .from("orders")
      .insert([
        {
          order_code: makeOrderCode(),
          idempotency_key: idempotency_key || null,
          user_id,
          customer_name: String(customer_name).trim(),
          shipping_address: String(shipping_address).trim(),
          note: note ? String(note).trim() : null,
          payment_method,
          payment_status: "Pending",
          order_status: "Pending",
          subtotal,
          shipping_cost: shippingCost,
          total_price: totalPrice,
          payment_ref: makePaymentRef(payment_method),
        },
      ])
      .select()
      .single();
    if (ordErr) throw ordErr;

    const itemRows = resolvedItems.map((r) => ({
      order_id: order.id,
      keyboard_id: r.kb.id,
      keyboard_name: r.kb.name,
      keyboard_brand: r.kb.brand,
      keyboard_layout: r.kb.layout,
      unit_price: r.unitPrice,
      quantity: r.qty,
      subtotal: r.lineSub,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
    if (itemsErr) throw itemsErr;

    // Kurangi stok produk secara otomatis di database
    for (const r of resolvedItems) {
      const { error: stockErr } = await supabase
        .from("keyboards")
        .update({ stock: r.nextStock })
        .eq("id", r.kb.id);
      if (stockErr) throw stockErr;
    }

    return this.getById(order.id);
  },

  async updatePayment(id, status) {
    const allowed = ["Pending", "Paid", "Failed"];
    if (!allowed.includes(status)) {
      const err = new Error("Status pembayaran tidak valid.");
      err.status = 400;
      throw err;
    }

    const patch = { payment_status: status };
    if (status === "Paid") {
      patch.paid_at = new Date().toISOString();
      patch.order_status = "Processing";
    } else if (status === "Failed") {
      patch.order_status = "Pending";
    }

    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) throw error;
    return this.getById(id);
  },

  async updateStatus(id, orderStatus) {
    const allowed = ["Pending", "Processing", "Shipped", "Completed"];
    if (!allowed.includes(orderStatus)) {
      const err = new Error("Status pesanan tidak valid.");
      err.status = 400;
      throw err;
    }
    const { error } = await supabase.from("orders").update({ order_status: orderStatus }).eq("id", id);
    if (error) throw error;
    return this.getById(id);
  },
};
