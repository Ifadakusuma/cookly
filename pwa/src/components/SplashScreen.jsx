import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash for 1.8 seconds, then trigger fade out
    const timer = setTimeout(() => {
      setFading(true);
      const exitTimer = setTimeout(() => {
        onFinish();
      }, 500); // 500ms fade transition
      return () => clearTimeout(exitTimer);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-100 transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center text-center px-6 max-w-lg">
        {/* Circular Logo with Soft Glowing Border & Bounce */}
        <div className="relative mb-8">
          <div className="absolute -inset-3 rounded-full bg-cookly-greenLight blur-lg opacity-80 animate-pulse"></div>
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 sm:border-6 border-cookly-green shadow-float bg-white flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Cookly Logo"
              className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-2 justify-center mb-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-cookly-brown">
            Cook<span className="text-cookly-green">ly</span>
          </h1>
          <Sparkles className="w-7 h-7 text-cookly-amber animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl font-bold text-cookly-brownLight mb-10">
          Koleksi & Inspirasi Resep Masakan Favoritmu
        </p>

        {/* Loading Spinner Dot */}
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-cookly-green animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-cookly-green animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-cookly-green animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
