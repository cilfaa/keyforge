import { supabase } from "../config/supabaseClient.js";

// Kolom keyboard + data switch yang terhubung (relasi lewat switch_id)
const COLUMNS = `
  id, name, brand, layout, price, stock, description, switch_id,
  switches ( id, name, type, actuation_force, travel_mm, sound )
`;

export const KeyboardModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("keyboards")
      .select(COLUMNS)
      .order("name");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("keyboards")
      .select(COLUMNS)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("keyboards")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("keyboards")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("keyboards").delete().eq("id", id);
    if (error) throw error;
    return { message: "Keyboard deleted successfully" };
  },
};
