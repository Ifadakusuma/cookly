import React, { useState } from "react";
import { X, Plus, Pencil, Trash2, Check, AlertCircle, Sparkles, FolderPlus } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "../services/api";

export default function CategoryModal({
  isOpen,
  onClose,
  categories = [],
  onCategoriesChanged,
  onShowToast,
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!isOpen) return null;

  // Handle Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name || name.length < 2) {
      onShowToast({ type: "error", message: "Nama kategori minimal 2 karakter." });
      return;
    }

    setIsSubmitting(true);
    try {
      await createCategory(name);
      onShowToast({ type: "success", message: `Kategori "${name}" berhasil ditambahkan!` });
      setNewCategoryName("");
      if (onCategoriesChanged) await onCategoriesChanged();
    } catch (err) {
      onShowToast({ type: "error", message: err.message || "Gagal menambahkan kategori." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start Edit Mode
  const handleStartEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setDeleteConfirmId(null);
  };

  // Save Edit
  const handleSaveEdit = async (id) => {
    const name = editingName.trim();
    if (!name || name.length < 2) {
      onShowToast({ type: "error", message: "Nama kategori minimal 2 karakter." });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCategory(id, name);
      onShowToast({ type: "success", message: "Kategori berhasil diperbarui!" });
      setEditingId(null);
      setEditingName("");
      if (onCategoriesChanged) await onCategoriesChanged();
    } catch (err) {
      onShowToast({ type: "error", message: err.message || "Gagal memperbarui kategori." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, name) => {
    setIsSubmitting(true);
    try {
      await deleteCategory(id);
      onShowToast({ type: "success", message: `Kategori "${name}" berhasil dihapus!` });
      setDeleteConfirmId(null);
      if (onCategoriesChanged) await onCategoriesChanged();
    } catch (err) {
      onShowToast({ type: "error", message: err.message || "Gagal menghapus kategori." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cookly-brown/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cookly-greenLight flex items-center justify-center text-cookly-green">
              <FolderPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-cookly-brown leading-tight">
                Kelola Kategori Resep
              </h3>
              <p className="text-xs text-cookly-brownLight font-medium">
                Tambah, ubah, atau hapus kategori masakan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cookly-brownLight hover:text-cookly-brown hover:bg-cream-200 transition"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* 1. Form Tambah Kategori Baru */}
          <form onSubmit={handleAddCategory} className="space-y-2">
            <label className="block text-xs font-black text-cookly-brown uppercase tracking-wider">
              Tambah Kategori Baru
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Contoh: Minuman, Camilan, Kue..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50/40 text-xs sm:text-sm font-bold text-cookly-brown focus:outline-none focus:border-cookly-green focus:bg-white transition"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!newCategoryName.trim() || isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-cookly-green hover:bg-cookly-greenDark disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-soft transition active:scale-95 flex-shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah</span>
              </button>
            </div>
          </form>

          {/* 2. Daftar Kategori yang Tersedia */}
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between text-xs font-black text-cookly-brown uppercase tracking-wider">
              <span>Daftar Kategori ({categories.length})</span>
              <span className="text-[10px] text-cookly-brownLight font-normal">
                Klik ikon pensil untuk edit
              </span>
            </div>

            <div className="divide-y divide-cream-100 max-h-64 overflow-y-auto rounded-2xl border border-cream-200 bg-white">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-cream-50/50 transition-colors"
                >
                  {editingId === cat.id ? (
                    /* Inline Edit Mode */
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-cookly-green text-xs font-bold text-cookly-brown focus:outline-none bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg bg-cookly-green text-white hover:bg-cookly-greenDark transition"
                        title="Simpan perubahan"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg bg-cream-200 text-cookly-brown hover:bg-cream-300 transition"
                        title="Batal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cookly-green"></span>
                        <span className="text-xs sm:text-sm font-bold text-cookly-brown">
                          {cat.name}
                        </span>
                      </div>

                      {deleteConfirmId === cat.id ? (
                        /* Delete Confirmation State */
                        <div className="flex items-center gap-1.5 animate-in fade-in">
                          <span className="text-[11px] font-bold text-red-500">Yakin hapus?</span>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            disabled={isSubmitting}
                            className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-black transition"
                          >
                            Ya
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded-lg bg-cream-200 text-cookly-brown text-[11px] font-bold hover:bg-cream-300 transition"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        /* Action Buttons (Edit & Delete) */
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 rounded-lg text-cookly-brownLight hover:text-cookly-green hover:bg-cookly-greenLight/50 transition"
                            title="Edit nama kategori"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(cat.id)}
                            className="p-1.5 rounded-lg text-cookly-brownLight hover:text-red-500 hover:bg-red-50 transition"
                            title="Hapus kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 text-[11px] text-cookly-brownLight flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cookly-amber flex-shrink-0 mt-0.5" />
            <span>
              Kategori yang masih digunakan oleh resep masakan tidak dapat dihapus demi menjaga integritas data resep.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-cream-50/70 border-t border-cream-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cookly-brown hover:bg-cookly-brown/90 text-white text-xs font-bold transition active:scale-95"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
