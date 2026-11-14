import { supabase } from "../config/supabaseClient.js";

const COLUMNS = "id, name, province, characteristic, description";

export const RegionModel = {
  async getAll() {
    const { data, error } = await supabase.from("regions").select(COLUMNS).order("province");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from("regions").select(COLUMNS).eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
};
