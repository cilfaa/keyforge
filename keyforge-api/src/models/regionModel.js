import { supabase } from "../config/supabaseClient.js";

export const RegionModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("regions")
      .select("id, name, province, characteristic, description")
      .order("name");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("regions")
      .select("id, name, province, characteristic, description")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};
