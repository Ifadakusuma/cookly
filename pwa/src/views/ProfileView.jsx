import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  BookOpen,
  ChefHat,
  Edit3,
  Check,
  Smartphone,
  Camera,
  User,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { StorageService } from "../services/storage";

export default function ProfileView({
  favorites = [],
  onSelectRecipe,
  onToggleFavorite,
  onNavigate,
  onShowToast,
  deferredPrompt,
  onInstallPwa,
}) {
  const [activeTab, setActiveTab] = useState("favorites"); // "favorites" | "my_recipes"
  const [profile, setProfile] = useState(StorageService.getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bioInput, setBioInput] = useState(profile.bio || "");
  const [myRecipes, setMyRecipes] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMyRecipes(StorageService.getMyRecipes());
  }, []);

  const handleStartEdit = () => {
    const rawName = (profile.name || "").trim();
    const parts = rawName.split(/\s+/);
    if (parts.length > 1) {
      setFirstName(parts[0]);
      setLastName(parts.slice(1).join(" "));
    } else {
      setFirstName(rawName);
      setLastName("");
    }
    setBioInput(profile.bio || "");
    setIsEditing(true);
  };

  // Upload custom personal photo directly from file picker
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onShowToast({ type: "error", message: "File harus berupa format gambar (JPG, PNG, atau WebP)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onShowToast({ type: "error", message: "Ukuran foto maksimal 5 MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const updated = { ...profile, avatar: dataUrl };
      StorageService.saveProfile(updated);
      setProfile(updated);
      onShowToast({ type: "success", message: "Foto profil berhasil diperbarui!" });
    };
    reader.readAsDataURL(file);
    // Reset file input so selecting the same file again triggers onChange
    e.target.value = "";
  };

  // Remove custom photo (reset to default silhouette)
  const handleRemovePhoto = () => {
    const updated = { ...profile, avatar: "" };
    StorageService.saveProfile(updated);
    setProfile(updated);
    onShowToast({ type: "info", message: "Foto profil dikembalikan ke default." });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!fullName) {
      onShowToast({ type: "error", message: "Nama koki tidak boleh kosong." });
      return;
    }
    const updated = {
      ...profile,
      name: fullName,
      bio: bioInput.trim(),
    };
    StorageService.saveProfile(updated);
    setProfile(updated);
    setIsEditing(false);
    onShowToast({ type: "success", message: "Profil berhasil disimpan!" });
  };

  const isFavorite = (id) => favorites.some((f) => String(f.id) === String(id));

  return (
    <div className="w-full pb-24 space-y-8">
      {/* Hidden File Input for User's Custom Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* ================= 1. VIEW MODE (TAMPILAN PROFIL BIASA) ================= */}
      {!isEditing ? (
        <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 shadow-soft relative overflow-hidden w-full transition-all">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 md:gap-10">
            {/* Clean Circular Photo Container */}
            <div className="relative group flex-shrink-0">
              <div
                onClick={handleStartEdit}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cookly-green/80 bg-cream-100 shadow-float cursor-pointer relative"
                title="Klik untuk mengubah profil"
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-cookly-brownLight bg-cream-50 group-hover:bg-cream-100 transition">
                    <User className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.5] text-cookly-brownLight group-hover:text-cookly-green transition" />
                  </div>
                )}

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-cookly-brown/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs font-black gap-1.5 backdrop-blur-[2px]">
                  <Pencil className="w-6 h-6" />
                  <span>Ubah Profil</span>
                </div>
              </div>
            </div>

            {/* Information Column (Nama, Bio, Badge, Ubah Profil) */}
            <div className="flex-1 w-full space-y-4 text-center sm:text-left">
              {/* Top Row: Badge & Ubah Profil Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cookly-greenLight text-cookly-greenDark font-black text-xs sm:text-sm tracking-wider uppercase shadow-xs">
                  <ChefHat className="w-4 h-4 text-cookly-green" />
                  <span>Koki Rumahan Cookly</span>
                </div>

                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-cream-300 text-cookly-brown hover:border-cookly-green hover:bg-cream-50 text-sm sm:text-base font-black transition active:scale-95 shadow-xs"
                >
                  <Edit3 className="w-4 h-4 text-cookly-green" />
                  <span>Ubah Profil</span>
                </button>
              </div>

              {/* Name & Bio with Generous Breathing Room */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-cookly-brown tracking-tight leading-tight">
                  {profile.name}
                </h1>
                <p className="text-base sm:text-lg text-cookly-brownLight font-medium mt-2 leading-relaxed max-w-2xl">
                  {profile.bio || "Pecinta masakan rumahan lezat dan sehat."}
                </p>
              </div>

              {/* Stats Counter Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4 border-t border-cream-200">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cream-50 border border-cream-200 text-cookly-brown font-black text-sm sm:text-base">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>{favorites.length} Resep Favorit</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cream-50 border border-cream-200 text-cookly-brown font-black text-sm sm:text-base">
                  <BookOpen className="w-5 h-5 text-cookly-green" />
                  <span>{myRecipes.length} Resep Dibuat</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ================= 2. EDIT MODE (TATA LETAK PERSIS SESUAI REFERENSI, BUKAN POP-UP) ================= */
        <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 shadow-soft w-full transition-all animate-in fade-in duration-200">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 md:gap-10">
              {/* Kolom Kiri: Foto Profil Squircle dengan Floating Pencil Button di Sudut Kanan Bawah */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden bg-cream-100 border-2 border-cream-200 shadow-sm cursor-pointer relative group"
                    title="Klik untuk memilih foto baru"
                  >
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Foto Profil"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-cookly-brownLight bg-cream-50">
                        <User className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Tombol Bulat Putih Ikon Pensil di Sudut Kanan Bawah Foto */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-11 h-11 rounded-full bg-white shadow-float border border-cream-200 text-cookly-brown hover:text-cookly-green flex items-center justify-center transition active:scale-95"
                    title="Ganti Foto"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>

                {profile.avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="mt-3 text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>

              {/* Kolom Kanan: Dua Input Nama Berdampingan & Satu Textarea Bio Luas */}
              <div className="flex-1 w-full space-y-4">
                {/* Baris Atas: First Name (Nama Depan) & Last Name (Nama Belakang) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-cookly-brown mb-1.5 uppercase tracking-wide">
                      Nama Depan
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nama depan kamu..."
                      className="w-full px-4 py-3 rounded-2xl bg-cream-100/70 border border-cream-300 text-sm sm:text-base font-bold text-cookly-brown focus:outline-none focus:border-cookly-green focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-cookly-brown mb-1.5 uppercase tracking-wide">
                      Nama Belakang
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nama belakang (opsional)..."
                      className="w-full px-4 py-3 rounded-2xl bg-cream-100/70 border border-cream-300 text-sm sm:text-base font-bold text-cookly-brown focus:outline-none focus:border-cookly-green focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Baris Bawah: About You (Bio) */}
                <div>
                  <label className="block text-xs font-black text-cookly-brown mb-1.5 uppercase tracking-wide">
                    Tentang Kamu / Bio Singkat
                  </label>
                  <textarea
                    rows={4}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Ceritakan sedikit tentang dirimu, masakan favorit, atau hobi kuliner..."
                    className="w-full px-4 py-3 rounded-2xl bg-cream-100/70 border border-cream-300 text-sm sm:text-base font-medium text-cookly-brown focus:outline-none focus:border-cookly-green focus:bg-white transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Baris Bawah Kanan: Tombol Batal & Simpan Persis di Posisi Kanan Bawah */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-2xl bg-cream-200 hover:bg-cream-300 text-cookly-brown font-bold text-sm sm:text-base transition active:scale-95"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-2xl bg-[#2B2B2B] hover:bg-black text-white font-bold text-sm sm:text-base shadow-soft transition active:scale-95"
              >
                Simpan
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= 3. PWA INSTALL PROMO BOX ================= */}
      {deferredPrompt && (
        <section className="bg-gradient-to-r from-cookly-green to-cookly-greenDark rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-soft">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-black text-lg sm:text-xl flex items-center justify-center sm:justify-start gap-2.5">
              <Smartphone className="w-6 h-6" />
              Pasang Aplikasi Cookly di Layar Utama
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-medium">
              Akses cepat langsung dari layar utama HP atau komputermu tanpa perlu buka browser berulang kali.
            </p>
          </div>
          <button
            onClick={onInstallPwa}
            className="flex-shrink-0 bg-white text-cookly-greenDark font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-float hover:bg-cream-100 transition active:scale-95"
          >
            Pasang Sekarang
          </button>
        </section>
      )}

      {/* ================= 4. SEGMENTED TABS: FAVORIT & RESEP SAYA ================= */}
      <section className="space-y-6">
        <div className="flex p-1.5 bg-white rounded-2xl border border-cream-200 max-w-md mx-auto sm:mx-0 shadow-sm">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-3 text-base sm:text-lg font-black rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "favorites"
                ? "bg-cookly-green text-white shadow-sm"
                : "text-cookly-brownLight hover:text-cookly-brown"
            }`}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Resep Favorit ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("my_recipes")}
            className={`flex-1 py-3 text-base sm:text-lg font-black rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "my_recipes"
                ? "bg-cookly-green text-white shadow-sm"
                : "text-cookly-brownLight hover:text-cookly-brown"
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Resep Saya ({myRecipes.length})</span>
          </button>
        </div>

        {/* Tab 1: Favorit */}
        {activeTab === "favorites" && (
          <div>
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 shadow-soft space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-black text-cookly-brown text-xl sm:text-2xl">
                  Belum ada resep favorit
                </h4>
                <p className="text-sm sm:text-base text-cookly-brownLight max-w-sm mx-auto font-medium">
                  Ketuk ikon hati pada resep mana pun di beranda untuk menyimpannya di sini.
                </p>
                <button
                  onClick={() => onNavigate("home")}
                  className="px-6 py-3 bg-cookly-green text-white text-sm sm:text-base font-black rounded-2xl shadow-soft"
                >
                  Jelajahi Resep Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => onSelectRecipe(recipe.id)}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Resep Saya */}
        {activeTab === "my_recipes" && (
          <div>
            {myRecipes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 shadow-soft space-y-4">
                <div className="w-16 h-16 rounded-full bg-cookly-greenLight text-cookly-green flex items-center justify-center mx-auto">
                  <ChefHat className="w-8 h-8" />
                </div>
                <h4 className="font-black text-cookly-brown text-xl sm:text-2xl">
                  Belum ada resep yang dibuat
                </h4>
                <p className="text-sm sm:text-base text-cookly-brownLight max-w-sm mx-auto font-medium">
                  Tuliskan resep masakan andalanmu dan bagikan kepada orang lain sekarang.
                </p>
                <button
                  onClick={() => onNavigate("add")}
                  className="px-6 py-3 bg-cookly-green text-white text-sm sm:text-base font-black rounded-2xl shadow-soft"
                >
                  + Tambah Resep Baru
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {myRecipes.map((recipe) => (
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
          </div>
        )}
      </section>

      {/* App Footer Info */}
      <footer className="text-center pt-10 border-t border-cream-200 text-sm sm:text-base text-cookly-brownLight space-y-1.5 font-medium">
        <p className="font-black text-cookly-brown text-base sm:text-lg">Cookly v1.0 • PWA Mobile & Web</p>
        <p>Praktikum Pemrograman Perangkat Bergerak (PPB)</p>
      </footer>
    </div>
  );
}
