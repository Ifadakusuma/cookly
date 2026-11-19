import React from "react";
import { PlusCircle, Compass, User, Home, ShoppingBag } from "lucide-react";

export default function Navbar({ currentView, onNavigate, groceryCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur-md border-b border-cream-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand with Circular Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group text-left focus:outline-none z-10"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-cookly-green shadow-soft group-hover:scale-105 transition duration-200 bg-white flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Cookly"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-cookly-brown block">
              Cook<span className="text-cookly-green">ly</span>
            </span>
            <span className="hidden sm:block text-[10px] sm:text-xs font-bold text-cookly-brownLight tracking-wider uppercase">
              Resep & Masakan
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation Links (Unified Capsule Dock in True Center) */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-white/95 border border-cream-200 shadow-soft md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
          <button
            onClick={() => onNavigate("home")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              currentView === "home"
                ? "bg-cookly-green text-white shadow-xs"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onNavigate("explore")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              currentView === "explore"
                ? "bg-cookly-green text-white shadow-xs"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Kategori</span>
          </button>

          <button
            onClick={() => onNavigate("grocery")}
            className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              currentView === "grocery"
                ? "bg-cookly-green text-white shadow-xs"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Belanja</span>
            {groceryCount > 0 && (
              <span
                className={`text-[11px] font-black px-1.5 py-0.2 rounded-full transition ${
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
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
              currentView === "profile"
                ? "bg-cookly-green text-white shadow-xs"
                : "text-cookly-brown hover:text-cookly-greenDark hover:bg-cream-100/70"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil</span>
          </button>
        </nav>

        {/* Right Action Button: Add Recipe */}
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={() => onNavigate("add")}
            className="inline-flex items-center gap-2 bg-cookly-green hover:bg-cookly-greenDark text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-soft hover:shadow-float transition duration-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span className="hidden sm:inline">Tambah Resep</span>
            <span className="sm:hidden">Resep</span>
          </button>
        </div>
      </div>
    </header>
  );
}
