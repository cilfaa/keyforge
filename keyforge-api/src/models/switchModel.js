import { supabase } from "../config/supabaseClient.js";

export const SwitchModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("switches")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("switches")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("switches")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("switches")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("switches").delete().eq("id", id);
    if (error) throw error;
    return { message: "Switch deleted successfully" };
  },
};
