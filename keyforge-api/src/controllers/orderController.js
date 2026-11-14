import { OrderModel } from "../models/orderModel.js";

export const OrderController = {
  async getAll(req, res) {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: "Parameter user_id wajib disertakan." });
      }
      const orders = await OrderModel.getByUser(user_id);
      res.json(orders);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const order = await OrderModel.getById(req.params.id);
      if (!order) return res.status(404).json({ error: "Pesanan tidak ditemukan." });
      res.json(order);
    } catch (err) {
      res.status(err.status || 404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { user_id, customer_name, shipping_address, note, payment_method, items, idempotency_key } = req.body || {};
      if (!user_id || !customer_name || !shipping_address || !payment_method || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Data pesanan belum lengkap." });
      }
      const order = await OrderModel.create({
        user_id,
        customer_name,
        shipping_address,
        note,
        payment_method,
        items,
        idempotency_key,
      });
      res.status(201).json(order);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async updatePayment(req, res) {
    try {
      const { status } = req.body || {};
      const order = await OrderModel.updatePayment(req.params.id, status);
      res.json(order);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { order_status } = req.body || {};
      const order = await OrderModel.updateStatus(req.params.id, order_status);
      res.json(order);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
