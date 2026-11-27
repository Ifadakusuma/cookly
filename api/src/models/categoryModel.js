import { supabase } from "../config/supabaseClient.js";

export const CategoryModel = {
  async getAll() {
    const { data, error } = await supabase.from("categories").select("*").order("id");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  async create({ name }) {
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, { name }) {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    // Check if any recipe is still using this category
    const { count, error: countError } = await supabase
      .from("recipes")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);
    if (countError) throw countError;

    if (count > 0) {
      throw new Error(`Kategori tidak bisa dihapus karena masih digunakan oleh ${count} resep masakan.`);
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return { success: true, id: parseInt(id) };
  },
};