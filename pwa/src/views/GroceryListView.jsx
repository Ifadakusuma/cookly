import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Check,
  Trash2,
  Share2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { StorageService } from "../services/storage";

export default function GroceryListView({
  onNavigate,
  onShowToast,
}) {
  const [groceries, setGroceries] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setGroceries(StorageService.getGroceries());
  }, []);

  const totalCount = groceries.length;
  const completedCount = groceries.filter((g) => g.completed).length;
  const pendingCount = totalCount - completedCount;

  // Add custom grocery item
  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const created = StorageService.addCustomGrocery(newItemName.trim());
    if (created) {
      setGroceries(StorageService.getGroceries());
      setNewItemName("");
      onShowToast({
        type: "success",
        message: `"${created.name}" ditambahkan ke daftar belanja!`,
      });
    }
  };

  // Toggle single item
  const handleToggle = (id) => {
    const updated = StorageService.toggleGrocery(id);
    setGroceries(updated);
  };

  // Remove single item
  const handleRemove = (id, name) => {
    const updated = StorageService.removeGrocery(id);
    setGroceries(updated);
    onShowToast({
      type: "info",
      message: `"${name}" dihapus dari daftar belanja.`,
    });
  };

  // Remove an entire recipe group
  const handleRemoveGroup = (groupTitle, items) => {
    const current = StorageService.getGroceries();
    const itemIds = new Set(items.map((i) => String(i.id)));
    const updated = current.filter((i) => !itemIds.has(String(i.id)));
    try {
      localStorage.setItem("cookly_groceries_v1", JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal menghapus grup belanja", e);
    }
    setGroceries(updated);
    onShowToast({
      type: "info",
      message: `Semua bahan "${groupTitle}" berhasil dihapus.`,
    });
  };

  // Clear all completed items
  const handleClearCompleted = () => {
    if (completedCount === 0) return;
    const updated = StorageService.clearCompletedGroceries();
    setGroceries(updated);
    onShowToast({
      type: "success",
      message: "Bahan-bahan yang sudah dibeli berhasil dibersihkan!",
    });
  };

  // Clear all items
  const handleClearAll = () => {
    const updated = StorageService.clearAllGroceries();
    setGroceries(updated);
    setShowClearConfirm(false);
    onShowToast({
      type: "info",
      message: "Daftar belanja telah dikosongkan.",
    });
  };

  // Share a SPECIFIC recipe menu / card to WhatsApp
  const handleShareMenuWhatsApp = (groupTitle, items) => {
    if (!items || items.length === 0) return;

    let text = `*🛒 DAFTAR BELANJA: ${groupTitle.toUpperCase()}*\n`;
    text += "---------------------------------\n";

    items.forEach((item) => {
      text += `${item.completed ? "✅ ~" : "⬜ "}${item.name}${item.completed ? "~" : ""}\n`;
    });

    const pending = items.filter((i) => !i.completed).length;
    text += `\n_Total: ${items.length} bahan (${pending} belum dibeli)_\n`;
    text += "_Dibuat dengan Cookly Resep & Masakan_";

    const encoded = encodeURIComponent(text);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, "_blank");

    onShowToast({
      type: "success",
      message: `Membuka WhatsApp untuk bahan "${groupTitle}"!`,
    });
  };

  // Share ALL items across all menus to WhatsApp
  const handleShareAllWhatsApp = () => {
    if (groceries.length === 0) return;

    let text = "*🛒 SEMUA DAFTAR BELANJA BAHAN - COOKLY*\n";
    text += "----------------------------------------\n";

    const groups = {};
    groceries.forEach((item) => {
      const groupName = item.recipe_title || "Lainnya";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(item);
    });

    Object.keys(groups).forEach((groupName) => {
      text += `\n📌 *${groupName}*:\n`;
      groups[groupName].forEach((item) => {
        text += `${item.completed ? "✅ ~" : "⬜ "}${item.name}${item.completed ? "~" : ""}\n`;
      });
    });

    text += "\n_Dibuat dengan Cookly Resep & Masakan_";

    const encoded = encodeURIComponent(text);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, "_blank");

    onShowToast({
      type: "success",
      message: "Membuka WhatsApp untuk membagikan semua daftar belanja!",
    });
  };

  // Group groceries by recipe_title
  const groupedGroceries = groceries.reduce((acc, item) => {
    const group = item.recipe_title || "Belanja Tambahan";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const groupKeys = Object.keys(groupedGroceries);

  return (
    <div className="w-full pb-24 space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 shadow-soft relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cookly-greenLight text-cookly-greenDark font-black text-xs sm:text-sm tracking-wider uppercase shadow-xs">
              <ShoppingBag className="w-4 h-4 text-cookly-green" />
              <span>Smart Grocery List</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-cookly-brown tracking-tight">
              Daftar Belanja Bahan
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-cookly-brownLight font-medium max-w-xl">
              Cek bahan yang perlu dibeli di pasar atau supermarket sebelum mulai memasak.
            </p>
          </div>

          {/* Quick Statistics Counters */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="px-5 py-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-cookly-brown">
                {pendingCount}
              </span>
              <span className="text-xs font-black text-cookly-brownLight uppercase tracking-wider">
                Belum Dibeli
              </span>
            </div>
            <div className="px-5 py-3.5 rounded-2xl bg-cookly-greenLight text-center">
              <span className="block text-2xl sm:text-3xl font-black text-cookly-greenDark">
                {completedCount}
              </span>
              <span className="text-xs font-black text-cookly-greenDark uppercase tracking-wider">
                Sudah Ada
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-8 pt-6 border-t border-cream-200">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-cookly-brown mb-2">
              <span>Progres Belanja</span>
              <span>{Math.round((completedCount / totalCount) * 100)}% Selesai</span>
            </div>
            <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cookly-green transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Add New Custom Item Input */}
      <section className="bg-white rounded-3xl p-4 sm:p-6 border border-cream-200 shadow-soft">
        <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Tambah bahan belanjaan manual (contoh: Minyak Goreng 2 Liter)..."
              className="w-full px-5 py-4 rounded-2xl border-2 border-cream-300 bg-cream-50/40 text-base font-bold text-cookly-brown focus:outline-none focus:border-cookly-green focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={!newItemName.trim()}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-cookly-green hover:bg-cookly-greenDark disabled:opacity-50 text-white font-black text-base flex items-center justify-center gap-2 shadow-soft transition active:scale-95 flex-shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Tambah</span>
          </button>
        </form>
      </section>

      {/* 3. Action Toolbar: Bagikan Semua & Clean up */}
      {totalCount > 0 && (
        <section className="flex flex-wrap items-center justify-between gap-3">
          {groupKeys.length > 1 ? (
            <button
              onClick={handleShareAllWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-black text-xs sm:text-sm shadow-xs transition active:scale-95"
              title="Kirim semua menu daftar belanjaan via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Semua Menu ({groupKeys.length}) ke WhatsApp</span>
            </button>
          ) : (
            <div className="text-xs sm:text-sm font-bold text-cookly-brownLight">
              💡 Ketuk <b>"Bagikan ke WhatsApp"</b> pada kotakkan menu di bawah
            </div>
          )}

          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-cream-300 text-cookly-brown hover:bg-cream-100 text-xs sm:text-sm font-black transition active:scale-95"
              >
                <Check className="w-4 h-4 text-cookly-green" />
                <span>Hapus yang Selesai ({completedCount})</span>
              </button>
            )}

            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-cream-300 text-red-500 hover:bg-red-50 text-xs sm:text-sm font-black transition active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Kosongkan Semua</span>
            </button>
          </div>
        </section>
      )}

      {/* 4. Grocery List: Per Menu / Per Kotakkan */}
      {totalCount === 0 ? (
        <section className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 shadow-soft space-y-4">
          <div className="w-20 h-20 rounded-full bg-cookly-greenLight text-cookly-green flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-cookly-brown">
            Daftar belanjaanmu masih kosong
          </h2>
          <p className="text-sm sm:text-base text-cookly-brownLight max-w-md mx-auto font-medium">
            Buka resep masakan favoritmu lalu klik tombol <b>"+ Masukkan ke Daftar Belanja"</b>, atau tuliskan bahan langsung di atas.
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-cookly-green text-white font-black text-base shadow-soft hover:bg-cookly-greenDark transition active:scale-95"
          >
            <span>Jelajahi Resep Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedGroceries).map(([groupTitle, items]) => (
            <div
              key={groupTitle}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-4 hover:border-cookly-green/40 transition-colors"
            >
              {/* Group Header dengan Tombol WhatsApp Khusus Menu Ini */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-cookly-green"></span>
                  <h3 className="font-black text-xl sm:text-2xl text-cookly-brown">
                    {groupTitle}
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cream-100 text-cookly-brownLight">
                    {items.length} item
                  </span>
                </div>

                {/* Aksi Per Kotakkan Menu */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Tombol Bagikan Menu Ini ke WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleShareMenuWhatsApp(groupTitle, items)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-black shadow-xs hover:shadow-soft transition active:scale-95"
                    title={`Bagikan bahan resep "${groupTitle}" ke WhatsApp`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan ke WhatsApp</span>
                  </button>

                  {/* Tombol Buka Resep (jika berasal dari resep) */}
                  {items[0]?.recipe_id && (
                    <button
                      type="button"
                      onClick={() => onNavigate("detail", items[0].recipe_id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-cookly-brown text-xs sm:text-sm font-black transition active:scale-95"
                      title="Buka Halaman Resep Asli"
                    >
                      <span>Buka Resep</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cookly-green" />
                    </button>
                  )}

                  {/* Tombol Hapus Seluruh Bahan Menu Ini */}
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(groupTitle, items)}
                    className="w-9 h-9 rounded-2xl text-cream-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition border border-cream-200 hover:border-red-200"
                    title={`Hapus semua bahan untuk "${groupTitle}"`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-cream-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`py-3.5 flex items-center justify-between gap-4 group transition ${
                      item.completed ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    {/* Checkbox & Item Name */}
                    <div
                      onClick={() => handleToggle(item.id)}
                      className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                          item.completed
                            ? "bg-cookly-green text-white"
                            : "border-2 border-cream-300 hover:border-cookly-green bg-cream-50"
                        }`}
                      >
                        {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-base sm:text-lg font-bold text-cookly-brown break-words ${
                          item.completed ? "line-through text-cookly-brownLight" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="w-8 h-8 rounded-xl text-cream-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition opacity-60 group-hover:opacity-100 flex-shrink-0"
                      title="Hapus bahan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal: Kosongkan Semua Daftar Belanja */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cookly-brown/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-float text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-cookly-brown">
                Kosongkan Semua Daftar Belanja?
              </h3>
              <p className="text-sm text-cookly-brownLight font-medium">
                Semua {totalCount} bahan dari seluruh menu akan dihapus. Aksi ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-cookly-brown font-black text-base transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-base shadow-soft transition"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
