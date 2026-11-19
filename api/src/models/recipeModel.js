import { supabase } from "../config/supabaseClient.js";

const SELECT = "*, category:categories(id, name), reviews(rating)";

// Hitung rata-rata rating dari relasi reviews
function withRating(recipe) {
  const { reviews = [], ...rest } = recipe;
  const count = reviews.length;
  const avg = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return { ...rest, average_rating: Number(avg.toFixed(1)), review_count: count };
}

export const RecipeModel = {
  async getAll({ search, categoryId } = {}) {
    let query = supabase
      .from("recipes")
      .select(SELECT)
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("title", `%${search}%`);
    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, error } = await query;
    if (error) throw error;
    return data.map(withRating);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("recipes")
      .select(SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? withRating(data) : null;
  },

  async getByClientId(clientId) {
    const { data, error } = await supabase
      .from("recipes")
      .select(SELECT)
      .eq("client_id", clientId)
      .maybeSingle();
    if (error) throw error;
    return data ? withRating(data) : null;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("recipes")
      .insert([payload])
      .select(SELECT)
      .single();
    if (error) throw error;
    return withRating(data);
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("recipes")
      .update(payload)
      .eq("id", id)
      .select(SELECT)
      .maybeSingle();
    if (error) throw error;
    return data ? withRating(data) : null;
  },

  async remove(id) {
    const { data, error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return data; // null jika resep tidak ada
  },
};