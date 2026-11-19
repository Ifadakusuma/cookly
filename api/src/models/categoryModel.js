import { supabase } from "../config/supabaseClient.js";

export const CategoryModel = {
  async getAll() {
    const { data, error } = await supabase.from("categories").select("*").order("id");
    if (error) throw error;
    return data;
  },
};