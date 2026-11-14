import crypto from "crypto";
import { supabase } from "../config/supabaseClient.js";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = String(stored || "").split(":");
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

export const AuthModel = {
  async register({ name, email, password }) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const { data: existing } = await supabase
      .from("app_users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      const err = new Error("Email sudah terdaftar. Silakan masuk.");
      err.status = 409;
      throw err;
    }

    const { data, error } = await supabase
      .from("app_users")
      .insert([{ name: String(name).trim(), email: cleanEmail, password_hash: hashPassword(password) }])
      .select("id, name, email, created_at")
      .single();
    if (error) throw error;
    return data;
  },

  async login({ email, password }) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const { data, error } = await supabase
      .from("app_users")
      .select("id, name, email, password_hash, created_at")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (error) throw error;
    if (!data || !verifyPassword(password, data.password_hash)) {
      const err = new Error("Email atau kata sandi salah.");
      err.status = 401;
      throw err;
    }

    const { password_hash: _, ...user } = data;
    return user;
  },
};
