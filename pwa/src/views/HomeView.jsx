import React, { useState, useEffect } from "react";
import { Search, Sparkles, ChefHat, RefreshCw, X } from "lucide-react";
import CategoryFilter from "../components/CategoryFilter";
import RecipeCard from "../components/RecipeCard";
import { fetchRecipes, fetchCategories } from "../services/api";

export default function HomeView({
  onSelectRecipe,
  onNavigate,
  favorites = [],
  onToggleFavorite,
  onShowToast,
}) {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load categories once
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Gagal memuat kategori:", err);
      });
  }, []);

  // Fetch recipes whenever category or search changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchRecipes({
      search: debouncedSearch,
      categoryId: selectedCategory,
    })
      .then((data) => {
        if (isMounted) {
          setRecipes(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoading(false);
          onShowToast({
            type: "error",
            message: "Gagal memuat resep. Pastikan server API berjalan.",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, debouncedSearch, onShowToast]);

  const isFavorite = (id) => favorites.some((f) => String(f.id) === String(id));

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 md:pb-16 w-full">
      {/* Hero Welcome Banner - Clean, Balanced & Proportionate */}
      <section className="bg-gradient-to-br from-cookly-greenLight/70 via-cream-100 to-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200/90 shadow-soft relative overflow-hidden w-full transition-all">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
          <div className="max-w-2xl space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-cookly-greenDark text-xs sm:text-sm font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-cookly-amber" />
              <span>Inspirasi Menu Setiap Hari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-cookly-brown leading-tight tracking-tight">
              Mau masak apa hari ini, Chef?
            </h2>
            <p className="text-sm sm:text-base text-cookly-brownLight leading-relaxed font-medium">
              Temukan resep pilihan mulai dari masakan nusantara, western, diet sehat, hingga hidangan penutup favorit keluarga.
            </p>
          </div>

          {/* Balanced & Sleek Search Bar Input */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cookly-brownLight">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama resep, bumbu, masakan..."
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-white rounded-2xl text-sm sm:text-base font-bold text-cookly-brown placeholder:text-cookly-brownLight/60 border-2 border-cream-300 focus:outline-none focus:border-cookly-green focus:ring-4 focus:ring-cookly-green/15 shadow-soft hover:shadow-md transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-cookly-brownLight hover:text-cookly-brown transition"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Background Glow Blob */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-cookly-green/15 blur-3xl pointer-events-none"></div>
      </section>

      {/* Category Filter Section - Compact & Proportionate */}
      <section id="section-kategori" className="space-y-3.5 sm:space-y-4 w-full scroll-mt-24 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-cookly-brown tracking-tight">
              Kategori Pilihan
            </h3>
            <p className="text-xs sm:text-sm text-cookly-brownLight font-medium">
              Pilih rumpun masakan favorit untuk menyaring resep masakan
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory("")}
              className="text-xs sm:text-sm font-black text-cookly-green hover:underline flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-cookly-greenLight/70 transition"
            >
              <span>✕</span>
              <span>Tampilkan Semua Resep</span>
            </button>
          )}
        </div>

        <CategoryFilter
          categories={categories}
          selectedId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id)}
        />
      </section>

      {/* Recipes Catalog Feed */}
      <section className="space-y-4 sm:space-y-5 w-full pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-2.5">
          <h3 className="text-xl sm:text-2xl font-black text-cookly-brown">
            {selectedCategory
              ? `Resep ${categories.find((c) => String(c.id) === String(selectedCategory))?.name || ""}`
              : debouncedSearch
              ? `Hasil Pencarian "${debouncedSearch}"`
              : "Semua Resep Masakan"}
          </h3>
          <span className="text-xs sm:text-sm font-bold text-cookly-brownLight">
            {recipes.length} resep ditemukan
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-5 border border-cream-200 shadow-soft animate-pulse space-y-4"
              >
                <div className="aspect-[4/3] bg-cream-200 rounded-2xl w-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-cream-200 rounded-md w-3/4"></div>
                  <div className="h-4 bg-cream-100 rounded-md w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 shadow-soft space-y-5 max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-cream-100 text-cookly-brownLight flex items-center justify-center mx-auto">
              <ChefHat className="w-10 h-10 text-cookly-green" />
            </div>
            <div>
              <h4 className="font-black text-cookly-brown text-xl sm:text-2xl">
                Belum ada resep yang cocok
              </h4>
              <p className="text-sm sm:text-base text-cookly-brownLight mt-2 leading-relaxed">
                {debouncedSearch
                  ? `Tidak ada resep dengan kata kunci "${debouncedSearch}". Coba gunakan kata kunci lainnya.`
                  : "Belum ada resep dalam kategori ini. Jadilah yang pertama membuatnya!"}
              </p>
            </div>
            <button
              onClick={() => onNavigate("add")}
              className="inline-flex items-center gap-2 bg-cookly-green text-white text-sm sm:text-base font-black px-6 py-3.5 rounded-2xl shadow-soft hover:bg-cookly-greenDark transition"
            >
              + Tambah Resep Sekarang
            </button>
          </div>
        )}

        {/* Recipe Grid - 4 Columns on Desktop with Generous Sizing */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => onSelectRecipe(recipe.id)}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
