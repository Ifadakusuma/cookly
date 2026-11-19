import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  Pencil,
  Trash2,
  Upload,
  X,
  ChefHat,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import {
  fetchRecipeById,
  fetchReviews,
  createReview,
  updateRecipe,
  deleteRecipe,
  fetchCategories,
  uploadRecipeImage,
} from "../services/api";
import { StorageService } from "../services/storage";

export default function RecipeDetailView({
  recipeId,
  onBack,
  isFavorite = false,
  onToggleFavorite,
  onShowToast,
}) {
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Checklist for ingredients while cooking
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [commentInput, setCommentInput] = useState("");

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editTitle, setEditTitle] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editSteps, setEditSteps] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const editFileInputRef = useRef(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchRecipeById(recipeId), fetchReviews(recipeId)])
      .then(([recData, revData]) => {
        setRecipe(recData);
        setReviews(revData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        onShowToast({
          type: "error",
          message: "Gagal memuat resep: " + err.message,
        });
      });
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [recipeId]);

  useEffect(() => {
    document.title = "Cookly";
  }, [recipe]);

  // Open Edit Modal & Populate Form
  const openEditModal = async () => {
    if (!recipe) return;
    setEditTitle(recipe.title || "");
    setEditCategoryId(String(recipe.category_id || ""));
    setEditDescription(recipe.description || "");
    setEditIngredients(recipe.ingredients || "");
    setEditSteps(recipe.steps || "");
    setEditImagePreview(recipe.image_url || "");
    setEditImageFile(null);

    // Fetch categories if not yet loaded
    if (categories.length === 0) {
      try {
        const catData = await fetchCategories();
        setCategories(catData);
      } catch (e) {
        console.error(e);
      }
    }
    setShowEditModal(true);
  };

  const handleEditImageChange = (e) => {
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

    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  // Submit Edit Recipe
  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    if (editTitle.trim().length < 3) {
      onShowToast({ type: "error", message: "Judul resep minimal 3 karakter." });
      return;
    }
    if (!editIngredients.trim()) {
      onShowToast({ type: "error", message: "Bahan-bahan wajib diisi." });
      return;
    }
    if (!editSteps.trim()) {
      onShowToast({ type: "error", message: "Langkah memasak wajib diisi." });
      return;
    }

    setIsUpdating(true);
    try {
      let finalImageUrl = editImagePreview;

      // Upload new image if user selected a new file
      if (editImageFile) {
        onShowToast({ type: "info", message: "Sedang mengunggah foto baru..." });
        finalImageUrl = await uploadRecipeImage(editImageFile);
      }

      const payload = {
        title: editTitle.trim(),
        category_id: parseInt(editCategoryId),
        description: editDescription.trim() || null,
        ingredients: editIngredients.trim(),
        steps: editSteps.trim(),
        image_url: finalImageUrl || null,
      };

      const updated = await updateRecipe(recipeId, payload);
      setRecipe(updated);
      setShowEditModal(false);
      onShowToast({
        type: "success",
        message: `Resep "${updated.title}" berhasil diperbarui!`,
      });
    } catch (err) {
      onShowToast({
        type: "error",
        message: err.message || "Gagal memperbarui resep.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Recipe
  const handleDeleteRecipe = async () => {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipeId);
      StorageService.removeRecipeLocally(recipeId);
      setShowDeleteModal(false);
      onShowToast({
        type: "success",
        message: `Resep "${recipe.title}" berhasil dihapus.`,
      });
      onBack(); // navigate back to Home
    } catch (err) {
      onShowToast({
        type: "error",
        message: err.message || "Gagal menghapus resep.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper copy to clipboard that works 100% on all browsers and environments
  const copyToClipboard = async (text) => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (e) {
      console.warn("navigator.clipboard failed, trying fallback textarea", e);
    }

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand("copy");
        textArea.remove();
      } catch (err) {
        console.error("execCommand fallback failed", err);
      }
    }

    return copied;
  };

  // Share functionality: Always copies to clipboard for instant Ctrl+V / Paste, + Mobile Share Sheet
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${recipe?.id || recipeId}`;

    // 1. Selalu salin ke clipboard terlebih dahulu agar BISA LANGSUNG DIPASTE
    const copied = await copyToClipboard(shareUrl);

    // 2. Jika di perangkat HP/Mobile yang mendukung Web Share API, buka dialog share HP
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 768);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title || "Resep Lezat di Cookly",
          text: `Yuk coba resep "${recipe?.title || ""}" di Cookly!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Jika batal share di HP, link tetap ada di clipboard
      }
    }

    // 3. Tampilkan notifikasi konfirmasi bahwa link sudah ada di clipboard
    if (copied) {
      onShowToast({
        type: "success",
        message: "Tautan resep berhasil disalin!",
      });
    } else {
      onShowToast({
        type: "info",
        message: "Tautan: " + shareUrl,
      });
    }
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleAddToGrocery = () => {
    if (!recipe) return;
    const addedCount = StorageService.addGroceriesFromRecipe(
      recipe.title,
      recipe.id,
      recipe.ingredients
    );
    if (addedCount > 0) {
      onShowToast({
        type: "success",
        message: `${addedCount} bahan berhasil dimasukkan ke Daftar Belanja!`,
      });
    } else {
      onShowToast({
        type: "info",
        message: "Semua bahan resep ini sudah ada di Daftar Belanja.",
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      onShowToast({ type: "error", message: "Masukkan nama kamu terlebih dahulu." });
      return;
    }

    setSubmittingReview(true);
    try {
      const clientId = "rev-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      await createReview(recipeId, {
        reviewer_name: reviewerName.trim(),
        rating: ratingInput,
        comment: commentInput.trim() || null,
        client_id: clientId,
      });

      onShowToast({ type: "success", message: "Ulasan berhasil dikirim. Terima kasih!" });
      setReviewerName("");
      setCommentInput("");
      setRatingInput(5);
      setShowReviewForm(false);
      loadData(); // reload reviews & updated rating
    } catch (err) {
      onShowToast({ type: "error", message: err.message });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 space-y-8 animate-pulse">
        <div className="h-12 bg-cream-200 rounded-2xl w-40"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 aspect-[16/9] bg-cream-200 rounded-3xl"></div>
          <div className="lg:col-span-7 space-y-5">
            <div className="h-10 bg-cream-200 rounded-xl w-3/4"></div>
            <div className="h-5 bg-cream-100 rounded-xl w-full"></div>
            <div className="h-48 bg-cream-100 rounded-3xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-24">
        <p className="text-cookly-brown text-xl font-bold">Resep tidak ditemukan.</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-3 bg-cookly-green text-white rounded-2xl text-base font-extrabold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split("\n").filter(Boolean)
    : [];

  const stepsList = recipe.steps
    ? recipe.steps.split("\n").filter(Boolean)
    : [];

  const ratingAvg = Number(recipe.average_rating || 0).toFixed(1);

  return (
    <article className="w-full pb-24 space-y-8">
      {/* Top Header Controls: Kembali, Edit Resep, Hapus Resep, Share & Favorite */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border border-cream-200 text-cookly-brown text-base font-black shadow-soft hover:bg-cream-50 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-cookly-green" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Edit Recipe Button */}
          <button
            onClick={openEditModal}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-cream-200 text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-50 text-sm sm:text-base font-black shadow-soft transition active:scale-95"
            title="Edit Resep"
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-cookly-green" />
            <span className="hidden sm:inline">Edit Resep</span>
          </button>

          {/* Delete Recipe Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-cream-200 text-red-500 hover:bg-red-50 text-sm sm:text-base font-black shadow-soft transition active:scale-95"
            title="Hapus Resep"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="hidden sm:inline">Hapus</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-2xl bg-white border border-cream-200 text-cookly-brown flex items-center justify-center shadow-soft hover:bg-cream-50 active:scale-95 transition"
            aria-label="Bagikan Resep"
            title="Bagikan Resep"
          >
            <Share2 className="w-5 h-5 text-cookly-green" />
          </button>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => onToggleFavorite(recipe)}
            className="w-12 h-12 rounded-2xl bg-white border border-cream-200 flex items-center justify-center shadow-soft hover:bg-cream-50 active:scale-95 transition"
            aria-label="Favorit"
          >
            <Heart
              className={`w-5 h-5 transition ${isFavorite ? "fill-red-500 text-red-500" : "text-cookly-brownLight"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Responsive Two-Column Grid on Desktop */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 space-y-8 lg:space-y-0 items-start">
        {/* Left Column (Desktop Sticky): Hero Media Card & Title / Description */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Hero Media Card */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-float bg-cream-200">
            <img
              src={
                recipe.image_url ||
                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80"
              }
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cookly-brown/60 via-transparent to-transparent"></div>
            <span className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md text-cookly-greenDark text-xs sm:text-sm font-black uppercase px-4 py-2 rounded-full shadow-md capitalize">
              {recipe.category?.name || "Kategori Umum"}
            </span>
          </div>

          {/* Title & Metadata */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-cookly-brown leading-tight">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-base sm:text-lg text-cookly-brownLight mt-3 leading-relaxed">
                  {recipe.description}
                </p>
              )}
            </div>

            {/* Rating summary bar */}
            <div className="flex flex-wrap items-center gap-5 pt-5 border-t border-cream-100 text-base font-bold">
              <div className="flex items-center gap-2 bg-cookly-greenLight/60 text-cookly-greenDark px-4 py-2 rounded-2xl">
                <Star className="w-5 h-5 fill-cookly-amber text-cookly-amber" />
                <span className="font-black text-lg">{ratingAvg > 0 ? ratingAvg : "0.0"}</span>
                <span className="text-xs sm:text-sm text-cookly-brownLight font-medium">
                  ({reviews.length} ulasan)
                </span>
              </div>

              <div className="flex items-center gap-2 text-cookly-brownLight text-sm font-semibold">
                <Clock className="w-5 h-5 text-cookly-green" />
                <span>Kategori: {recipe.category?.name || "Umum"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ingredients Checklist, Steps, and Reviews */}
        <div className="lg:col-span-7 space-y-8">
          {/* Bahan-Bahan Masakan (Interactive Checklist) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-cookly-brown">
                    Bahan-Bahan
                  </h2>
                  <span className="bg-cookly-greenLight text-cookly-greenDark text-xs sm:text-sm font-black px-3 py-1 rounded-full">
                    {ingredientsList.length} Bahan
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-cookly-brownLight italic">
                  Centang bahan yang sudah siap
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToGrocery}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cookly-greenLight hover:bg-cookly-green text-cookly-greenDark hover:text-white font-black text-xs sm:text-sm transition active:scale-95 shadow-xs flex-shrink-0 self-start sm:self-auto"
                title="Masukkan semua bahan ke Daftar Belanja"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>+ Masukkan ke Daftar Belanja</span>
              </button>
            </div>

            <ul className="divide-y divide-cream-100">
              {ingredientsList.map((item, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className="py-4 flex items-start gap-4 cursor-pointer group select-none"
                  >
                    <div
                      className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center mt-0.5 transition duration-150 ${isChecked
                        ? "bg-cookly-green border-cookly-green text-white"
                        : "border-cream-300 group-hover:border-cookly-green"
                        }`}
                    >
                      {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-base sm:text-lg leading-relaxed font-medium ${isChecked
                        ? "line-through text-cookly-brownLight/50"
                        : "text-cookly-brown group-hover:text-cookly-greenDark"
                        }`}
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Langkah-Langkah Memasak */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 shadow-soft space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-cookly-brown">
                Langkah Pembuatan
              </h2>
              <span className="bg-cookly-greenLight text-cookly-greenDark text-xs sm:text-sm font-black px-3 py-1 rounded-full">
                {stepsList.length} Langkah
              </span>
            </div>

            <div className="space-y-6">
              {stepsList.map((step, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-cookly-greenLight text-cookly-greenDark font-black text-base sm:text-lg flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-base sm:text-lg text-cookly-brown leading-relaxed pt-1.5 flex-1 font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews & Ratings Section */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-cookly-brown">
                  Ulasan Pengguna
                </h2>
                <p className="text-sm sm:text-base text-cookly-brownLight mt-1 font-medium">
                  Bagikan pengalamanmu memasak resep ini
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center gap-2 bg-cookly-green hover:bg-cookly-greenDark text-white text-sm sm:text-base font-black px-5 py-3 rounded-2xl shadow-sm transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{showReviewForm ? "Batal" : "Beri Ulasan"}</span>
              </button>
            </div>

            {/* Add Review Form Dropdown */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-cream-50 p-6 sm:p-8 rounded-3xl border border-cream-200 space-y-5 animate-in fade-in duration-200"
              >
                <h3 className="text-base sm:text-lg font-black text-cookly-brown flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cookly-amber" />
                  Tulis Ulasan & Rating
                </h3>

                {/* Star Selector */}
                <div>
                  <label className="block text-xs sm:text-sm font-black text-cookly-brownLight mb-2 uppercase tracking-wide">
                    Rating Bintang
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="p-1 hover:scale-110 transition focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${star <= ratingInput
                            ? "fill-cookly-amber text-cookly-amber"
                            : "text-cream-300"
                            }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm sm:text-base font-black ml-3 text-cookly-brown">
                      {ratingInput} dari 5 bintang
                    </span>
                  </div>
                </div>

                {/* Name input */}
                <div>
                  <label className="block text-xs sm:text-sm font-black text-cookly-brownLight mb-1.5 uppercase tracking-wide">
                    Nama Kamu
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3.5 rounded-2xl border border-cream-300 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
                  />
                </div>

                {/* Comment input */}
                <div>
                  <label className="block text-xs sm:text-sm font-black text-cookly-brownLight mb-1.5 uppercase tracking-wide">
                    Komentar Resep (Opsional)
                  </label>
                  <textarea
                    rows={4}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Bagikan tips atau bagaimana rasa masakannya..."
                    className="w-full px-4 py-3.5 rounded-2xl border border-cream-300 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-cookly-green hover:bg-cookly-greenDark disabled:opacity-50 text-white font-black py-4 rounded-2xl text-base shadow-sm transition"
                >
                  <Send className="w-5 h-5" />
                  <span>{submittingReview ? "Mengirim..." : "Kirim Ulasan Sekarang"}</span>
                </button>
              </form>
            )}

            {/* Existing Reviews List */}
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-cookly-brownLight text-sm sm:text-base font-medium">
                Belum ada ulasan untuk resep ini. Jadilah yang pertama memberikan ulasan!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-2xl bg-cream-50 border border-cream-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base sm:text-lg text-cookly-brown">
                        {rev.reviewer_name}
                      </span>
                      <div className="flex items-center gap-1.5 text-cookly-amber text-sm font-black">
                        <Star className="w-4 h-4 fill-cookly-amber text-cookly-amber" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-sm sm:text-base text-cookly-brownLight leading-relaxed font-medium">
                        {rev.comment}
                      </p>
                    )}
                    <span className="text-xs text-cookly-brownLight/70 block pt-1">
                      {new Date(rev.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================= MODAL HAPUS RESEP (DELETE CONFIRMATION) ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cookly-brown/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-float text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-cookly-brown">
                Hapus Resep Ini?
              </h3>
              <p className="text-sm sm:text-base text-cookly-brownLight leading-relaxed font-medium">
                Apakah kamu yakin ingin menghapus resep{" "}
                <strong className="text-cookly-brown font-extrabold">
                  "{recipe.title}"
                </strong>
                ? Resep yang dihapus tidak dapat dipulihkan kembali.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-cookly-brown font-black text-base transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteRecipe}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-black text-base shadow-soft transition"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Resep"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT RESEP ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-cookly-brown/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-cream-200 shadow-float my-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-cream-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-cookly-brown flex items-center gap-2.5">
                  <Pencil className="w-6 h-6 text-cookly-green" />
                  <span>Edit Resep Masakan</span>
                </h3>
                <p className="text-xs sm:text-sm text-cookly-brownLight font-medium mt-1">
                  Perbarui informasi, bahan, atau langkah pembuatan resep
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200 text-cookly-brown flex items-center justify-center transition"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Scrollable Body Form */}
            <form onSubmit={handleUpdateRecipe} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-black text-cookly-brown uppercase tracking-wide">
                  Foto Masakan
                </label>
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="border-2 border-dashed border-cream-300 hover:border-cookly-green rounded-2xl p-4 text-center cursor-pointer transition bg-cream-50/50 hover:bg-cream-50 relative aspect-[16/9] max-h-56 flex flex-col items-center justify-center overflow-hidden"
                >
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="Preview Resep"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-cookly-brownLight">
                      <Upload className="w-8 h-8 text-cookly-green" />
                      <span className="text-sm font-bold text-cookly-green">
                        Klik untuk mengganti foto
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleEditImageChange}
                  className="hidden"
                />
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-1.5 uppercase tracking-wide">
                    Judul Resep <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-1.5 uppercase tracking-wide">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40 capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-1.5 uppercase tracking-wide">
                  Deskripsi Resep
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
                ></textarea>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-1 uppercase tracking-wide">
                  Bahan-Bahan Masakan <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-cookly-brownLight mb-2">
                  Tuliskan satu bahan per baris
                </p>
                <textarea
                  rows={5}
                  required
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-cream-300 bg-cream-50/30 text-base font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
                ></textarea>
              </div>

              {/* Steps */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-cookly-brown mb-1 uppercase tracking-wide">
                  Langkah-Langkah Pembuatan <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-cookly-brownLight mb-2">
                  Tuliskan satu langkah memasak per baris
                </p>
                <textarea
                  rows={5}
                  required
                  value={editSteps}
                  onChange={(e) => setEditSteps(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-cream-300 bg-cream-50/30 text-base leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-cookly-green/40"
                ></textarea>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="px-6 py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-cookly-brown font-black text-base transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-7 py-3 rounded-2xl bg-cookly-green hover:bg-cookly-greenDark disabled:opacity-50 text-white font-black text-base shadow-soft transition"
                >
                  {isUpdating ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
