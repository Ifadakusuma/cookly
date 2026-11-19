import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  ChefHat,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { fetchCategories, createRecipe, uploadRecipeImage } from "../services/api";
import { StorageService } from "../services/storage";

export default function AddRecipeView({
  onBack,
  onRecipeCreated,
  onShowToast,
}) {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(String(data[0].id));
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil kategori:", err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype || file.type)) {
      onShowToast({
        type: "error",
        message: "Format foto harus JPG, PNG, atau WebP",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onShowToast({
        type: "error",
        message: "Ukuran foto maksimal 5 MB",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      onShowToast({ type: "error", message: "Judul resep minimal 3 karakter" });
      return;
    }
    if (!categoryId) {
      onShowToast({ type: "error", message: "Pilih kategori makanan" });
      return;
    }
    if (!ingredients.trim()) {
      onShowToast({ type: "error", message: "Tuliskan bahan-bahan masakan" });
      return;
    }
    if (!steps.trim()) {
      onShowToast({ type: "error", message: "Tuliskan langkah-langkah memasak" });
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = null;

      // 1. Upload photo if selected
      if (imageFile) {
        onShowToast({ type: "info", message: "Sedang mengunggah foto resep..." });
        finalImageUrl = await uploadRecipeImage(imageFile);
      }

      // 2. Generate unique client_id for offline sync/idempotency
      const clientId = "rec-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);

      // 3. Create recipe in API
      const newRecipe = await createRecipe({
        title: title.trim(),
        description: description.trim() || null,
        ingredients: ingredients.trim(),
        steps: steps.trim(),
        category_id: parseInt(categoryId),
        image_url: finalImageUrl,
        client_id: clientId,
      });

      // 4. Save to device's "My Recipes"
      StorageService.addMyRecipe(newRecipe);

      onShowToast({
        type: "success",
        message: "Resep berhasil dibuat dan dipublikasikan!",
      });

      if (onRecipeCreated) {
        onRecipeCreated(newRecipe.id);
      }
    } catch (err) {
      onShowToast({
        type: "error",
        message: err.message || "Gagal menyimpan resep",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-24 space-y-8">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white border border-cream-200 text-cookly-brown shadow-soft hover:bg-cream-50 active:scale-95 transition"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6 text-cookly-green" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-cookly-brown">
            Tambah Resep Baru
          </h1>
          <p className="text-sm sm:text-base text-cookly-brownLight font-medium mt-1">
            Bagikan kreasi masakan lezatmu kepada komunitas pecinta kuliner
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-10 space-y-8 lg:space-y-0 items-start">
        {/* Left Column: Image Upload & Basic Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Image Upload Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-4">
            <label className="block text-sm sm:text-base font-black text-cookly-brown uppercase tracking-wide">
              Foto Masakan (Opsional)
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cream-300 hover:border-cookly-green rounded-2xl p-6 text-center cursor-pointer transition bg-cream-50/50 hover:bg-cream-50 relative aspect-[16/10] sm:aspect-[16/9] flex flex-col items-center justify-center overflow-hidden"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview Resep"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-cookly-brownLight">
                  <div className="w-14 h-14 rounded-full bg-cookly-greenLight flex items-center justify-center text-cookly-green">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <span className="font-extrabold text-cookly-green">Klik untuk upload foto</span> atau seret file ke sini
                  </div>
                  <span className="text-xs text-cookly-brownLight/80 font-medium">
                    Format JPG, PNG, atau WebP (Maksimal 5 MB)
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="text-sm font-extrabold text-red-500 hover:underline block text-right pt-1"
              >
                Hapus foto
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-2 uppercase tracking-wide">
                Judul Resep <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Nasi Goreng Spesial Kampung"
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-2 uppercase tracking-wide">
                Kategori Makanan <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40 capitalize"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-2 uppercase tracking-wide">
                Deskripsi Singkat Resep
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan sedikit tentang cita rasa atau keistimewaan resep ini..."
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column: Ingredients & Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ingredients */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-3">
            <label className="block text-xs sm:text-sm font-black text-cookly-brown uppercase tracking-wide">
              Bahan-Bahan Masakan <span className="text-red-500">*</span>
            </label>
            <p className="text-xs sm:text-sm text-cookly-brownLight font-medium mb-2">
              Tuliskan bahan satu per satu per baris (tekan tombol Enter untuk baris baru)
            </p>
            <textarea
              rows={7}
              required
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={`2 piring nasi putih\n2 butir telur ayam\n3 siung bawang merah\n2 sdm kecap manis\nGaram dan merica secukupnya`}
              className="w-full px-5 py-4 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
            ></textarea>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-3">
            <label className="block text-xs sm:text-sm font-black text-cookly-brown uppercase tracking-wide">
              Langkah-Langkah Pembuatan <span className="text-red-500">*</span>
            </label>
            <p className="text-xs sm:text-sm text-cookly-brownLight font-medium mb-2">
              Tuliskan tahapan memasak secara berurutan per baris (tekan tombol Enter untuk langkah berikutnya)
            </p>
            <textarea
              rows={7}
              required
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder={`Panaskan minyak dalam wajan dengan api sedang.\nTumis bawang merah dan bawang putih hingga harum.\nMasukkan telur dan orak-arik hingga matang.\nTambahkan nasi, kecap manis, garam, lalu aduk rata hingga matang merata.`}
              className="w-full px-5 py-4 rounded-2xl border border-cream-300 bg-cream-50/30 text-base leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 rounded-2xl bg-cookly-green hover:bg-cookly-greenDark disabled:opacity-60 text-white font-black text-lg shadow-float transition duration-200 flex items-center justify-center gap-3 active:scale-98"
          >
            <ChefHat className="w-6 h-6" />
            <span>{submitting ? "Menyimpan Resep..." : "Publikasikan Resep Sekarang"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
