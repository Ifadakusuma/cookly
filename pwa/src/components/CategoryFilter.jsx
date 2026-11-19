import React from "react";
import {
  Utensils,
  Soup,
  Pizza,
  Leaf,
  CakeSlice,
  Carrot,
  CookingPot,
  ChefHat,
} from "lucide-react";

// Modern SVG icon mapping for high-taste culinary design (replaces generic AI emojis)
const CATEGORY_ICONS = {
  all: Utensils,
  indonesia: Soup,
  western: Pizza,
  diet: Leaf,
  dessert: CakeSlice,
  vegetarian: Carrot,
  asia: CookingPot,
};

export default function CategoryFilter({ categories = [], selectedId, onSelect }) {
  const allCategories = [
    { id: "", name: "Semua Resep", slug: "all" },
    ...categories.map((c) => ({
      ...c,
      slug: c.name.toLowerCase().trim(),
    })),
  ];

  return (
    <div className="w-full">
      {/* 
        Responsive Category Layout:
        - Mobile: Smooth horizontal swipeable ribbon with thumb-friendly pills.
        - Tablet & Desktop: Structured 7-column culinary grid that fills the width evenly.
      */}
      <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {allCategories.map((item) => {
          const isSelected = String(selectedId) === String(item.id);
          const Icon = CATEGORY_ICONS[item.slug] || ChefHat;

          return (
            <button
              key={item.id || "all"}
              onClick={() => onSelect(item.id)}
              className={`group flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 border text-left flex-shrink-0 active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-cookly-green text-white border-cookly-green shadow-soft scale-[1.02]"
                  : "bg-white text-cookly-brown border-cream-200/90 hover:border-cookly-green/50 hover:bg-cream-50 hover:shadow-xs"
              }`}
            >
              {/* Crisp SVG Icon Badge Container */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-cream-100 text-cookly-greenDark group-hover:bg-cookly-greenLight group-hover:text-cookly-greenDark"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </div>

              {/* Category Name */}
              <div className="leading-tight">
                <span className="font-bold text-xs sm:text-sm capitalize block whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
