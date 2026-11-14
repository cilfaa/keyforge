import { supabase } from "../config/supabaseClient.js";

const COLUMNS = `
  id, name, category, occasion, philosophy, description, region_id,
  regions ( id, name, province, characteristic )
`;

export const MotifModel = {
  async getAll() {
    const { data, error } = await supabase.from("motifs").select(COLUMNS).order("name");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from("motifs").select(COLUMNS).eq("id", id).single();
    if (error) throw error;
    return data;
  },
};
