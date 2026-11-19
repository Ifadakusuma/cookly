import React from "react";
import { Star, Heart } from "lucide-react";

export default function RecipeCard({
  recipe,
  onClick,
  isFavorite = false,
  onToggleFavorite,
}) {
  const rating = Number(recipe.average_rating || 0).toFixed(1);
  const reviewCount = recipe.review_count || 0;
  const categoryName = recipe.category?.name || "Kuliner";

  // Default fallback image if none provided
  const imageUrl =
    recipe.image_url ||
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden border border-cream-200/90 shadow-soft hover:shadow-float transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
        <img
          src={imageUrl}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Category Pill Tag */}
        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-cookly-greenDark text-xs sm:text-sm font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm capitalize">
          {categoryName}
        </span>

        {/* Favorite Love Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
          className="absolute top-3.5 right-3.5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition duration-200"
          aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite
                ? "fill-red-500 text-red-500"
                : "text-cookly-brownLight hover:text-red-500"
              }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-black text-cookly-brown text-lg sm:text-xl md:text-2xl leading-snug line-clamp-1 group-hover:text-cookly-greenDark transition">
            {recipe.title}
          </h3>
          <p className="text-sm sm:text-base text-cookly-brownLight mt-2 line-clamp-2 leading-relaxed">
            {recipe.description || "Resep masakan lezat dan mudah dipraktikkan di rumah."}
          </p>
        </div>

        {/* Rating and Reviews Footer */}
        <div className="mt-5 pt-4 border-t border-cream-100 flex items-center justify-between text-sm font-bold text-cookly-brownLight">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-cookly-amber font-black text-sm sm:text-base">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-cookly-amber text-cookly-amber" />
              <span>{rating > 0 ? rating : "Baru"}</span>
            </div>
            {reviewCount > 0 && (
              <span className="text-xs sm:text-sm text-cookly-brownLight font-medium">
                ({reviewCount} ulasan)
              </span>
            )}
          </div>

          <span className="text-xs sm:text-sm text-cookly-green font-extrabold group-hover:underline">
            Lihat Resep →
          </span>
        </div>
      </div>
    </div>
  );
}
