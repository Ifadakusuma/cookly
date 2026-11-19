import { supabase } from "../config/supabaseClient.js";

export const ReviewModel = {
  async getByRecipe(recipeId) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getByClientId(clientId) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("reviews")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("reviews")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};