import React from "react";
import { PlusCircle, Compass, User, Home, ShoppingBag } from "lucide-react";

export default function Navbar({ currentView, onNavigate, groceryCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur-md border-b border-cream-200">
      <div className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-14 h-20 sm:h-24 flex items-center justify-between">
        {/* Brand with Circular Logo (Enlarged & Polished) */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-4 group text-left focus:outline-none z-10"
        >
          <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 sm:border-4 border-cookly-green shadow-soft group-hover:scale-105 transition duration-200 bg-white flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Cookly"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-cookly-brown block">
              Cook<span className="text-cookly-green">ly</span>
            </span>
            <span className="hidden sm:block text-xs sm:text-sm font-black text-cookly-brownLight tracking-widest uppercase mt-0.5">
              Resep & Masakan
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation Links (Unified Capsule Dock in True Center) */}
        <nav className="hidden md:flex items-center p-1.5 rounded-full bg-white/95 border border-cream-200 shadow-soft md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
          <button
            onClick={() => onNavigate("home")}
            className={`px-5 lg:px-6 py-2.5 rounded-full text-base lg:text-lg font-black transition-all duration-200 flex items-center gap-2.5 ${
              currentView === "home"
                ? "bg-cookly-green text-white shadow-sm"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <Home className="w-5 h-5 lg:w-6 lg:h-6" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onNavigate("explore")}
            className={`px-5 lg:px-6 py-2.5 rounded-full text-base lg:text-lg font-black transition-all duration-200 flex items-center gap-2.5 ${
              currentView === "explore"
                ? "bg-cookly-green text-white shadow-sm"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <Compass className="w-5 h-5 lg:w-6 lg:h-6" />
            <span>Kategori</span>
          </button>

          <button
            onClick={() => onNavigate("grocery")}
            className={`relative px-5 lg:px-6 py-2.5 rounded-full text-base lg:text-lg font-black transition-all duration-200 flex items-center gap-2.5 ${
              currentView === "grocery"
                ? "bg-cookly-green text-white shadow-sm"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
            <span>Belanja</span>
            {groceryCount > 0 && (
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full transition ${
                  currentView === "grocery"
                    ? "bg-white text-cookly-green"
                    : "bg-cookly-green text-white"
                }`}
              >
                {groceryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate("profile")}
            className={`px-5 lg:px-6 py-2.5 rounded-full text-base lg:text-lg font-black transition-all duration-200 flex items-center gap-2.5 ${
              currentView === "profile"
                ? "bg-cookly-green text-white shadow-sm"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <User className="w-5 h-5 lg:w-6 lg:h-6" />
            <span>Profil</span>
          </button>
        </nav>

        {/* Right Action Button: Add Recipe */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onNavigate("add")}
            className="inline-flex items-center gap-2.5 bg-cookly-green hover:bg-cookly-greenDark text-white text-base lg:text-lg font-black px-5 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-soft hover:shadow-float transition duration-200 active:scale-95"
          >
            <PlusCircle className="w-5 h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
            <span className="hidden sm:inline">Tambah Resep</span>
            <span className="sm:hidden">Resep</span>
          </button>
        </div>
      </div>
    </header>
  );
}
