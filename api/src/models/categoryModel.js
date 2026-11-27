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
    // 1. Lepaskan resep dari kategori ini (set category_id ke null) agar resep tidak hilang
    const { error: nullifyError } = await supabase
      .from("recipes")
      .update({ category_id: null })
      .eq("category_id", id);

    // Jika kolom category_id memiliki constraint NOT NULL di database,
    // alihkan resep ke kategori lain yang masih ada
    if (nullifyError) {
      const { data: fallbackCategory } = await supabase
        .from("categories")
        .select("id")
        .neq("id", id)
        .order("id")
        .limit(1)
        .maybeSingle();

      if (fallbackCategory) {
        await supabase
          .from("recipes")
          .update({ category_id: fallbackCategory.id })
          .eq("category_id", id);
      }
    }

    // 2. Hapus kategori dari database
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return { success: true, id: parseInt(id) };
  },
};