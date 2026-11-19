import { supabase } from "../config/supabaseClient.js";

const BUCKET = "recipe-images";

export const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const UploadModel = {
  async uploadImage(file) {
    const ext = ALLOWED_TYPES[file.mimetype];
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, file.buffer, { contentType: file.mimetype });
    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
    return data.publicUrl;
  },
};