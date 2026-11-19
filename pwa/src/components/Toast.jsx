import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const typeConfig = {
    success: {
      title: "Berhasil!",
      icon: <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-cookly-green stroke-[2.5]" />,
      badgeBg: "bg-cookly-greenLight",
      titleColor: "text-cookly-greenDark",
    },
    error: {
      title: "Gagal",
      icon: <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 stroke-[2.5]" />,
      badgeBg: "bg-red-50",
      titleColor: "text-red-500",
    },
    info: {
      title: "Pemberitahuan",
      icon: <Info className="w-6 h-6 sm:w-7 sm:h-7 text-cookly-amber stroke-[2.5]" />,
      badgeBg: "bg-amber-50",
      titleColor: "text-cookly-amber",
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div className="fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto min-w-[340px] sm:min-w-[440px] max-w-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-2xl border-2 border-cream-200 text-cookly-brown px-5 py-4 sm:px-6 sm:py-4.5 rounded-3xl shadow-float flex items-center gap-4 sm:gap-5">
        {/* Large Rounded Icon Container */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.badgeBg}`}>
          {config.icon}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-2">
          <p className={`text-xs sm:text-sm font-black uppercase tracking-wider ${config.titleColor}`}>
            {config.title}
          </p>
          <p className="text-sm sm:text-base md:text-lg font-black text-cookly-brown mt-0.5 leading-snug">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-100 hover:bg-cream-200 text-cookly-brownLight hover:text-cookly-brown flex items-center justify-center transition flex-shrink-0 active:scale-95"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
