import React from "react";
import { Home, Compass, Plus, ShoppingBag, User } from "lucide-react";

export default function BottomNav({ currentView, onNavigate, groceryCount = 0 }) {
  const navItems = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "explore", label: "Kategori", icon: Compass },
    { id: "add", label: "Tambah", icon: Plus, isSpecial: true },
    { id: "grocery", label: "Belanja", icon: ShoppingBag, badge: groceryCount },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-cream-200 px-3 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-nav">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center -mt-5 focus:outline-none group"
                aria-label="Tambah Resep"
              >
                <div className="w-12 h-12 rounded-full bg-cookly-green text-white flex items-center justify-center shadow-float group-hover:scale-105 active:scale-95 transition duration-200">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-cookly-brown mt-1">Tambah</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all focus:outline-none relative ${
                isActive ? "text-cookly-green" : "text-cookly-brownLight hover:text-cookly-brown"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-cookly-green text-white text-[9px] font-black px-1 rounded-full min-w-[14px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-semibold ${isActive ? "text-cookly-green font-bold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
