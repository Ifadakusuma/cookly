# Cookly - Aplikasi Katalog & Resep Masakan (Mobile & Web PWA)

Cookly adalah aplikasi katalog dan berbagi resep masakan yang dirancang responsif untuk perangkat mobile maupun desktop menggunakan arsitektur **Progressive Web App (PWA)**. Dibangun untuk keperluan Praktikum Pemrograman Perangkat Bergerak (PPB).

---

## 🚀 Fitur Utama

1. **Splash Screen Interaktif:** Tampilan pembuka animasi lembut dengan logo bulat Cookly.
2. **Beranda & Pencarian:** Pencarian judul resep secara real-time dan katalog resep makanan.
3. **Filter Kategori Dinamis:** Filter cepat untuk kategori makanan (*Indonesia, Western, Diet, Dessert, Vegetarian, Asia*).
4. **Detail Resep Lengkap:**
   - Foto masakan beresolusi tinggi dan kategori.
   - **Checklist Bahan Interaktif:** Bahan masakan dapat dicentang satu per satu saat memasak di dapur.
   - Langkah memasak bernomor yang terstruktur.
5. **Bagikan Resep (Share Link):**
   - Mendukung **Web Share API** bawaan perangkat smartphone.
   - Otomatis fallback salin link ke *clipboard* pada browser desktop dengan notifikasi toast.
6. **Sistem Ulasan & Rating:**
   - Penilaian bintang 1–5 dan komentar ulasan.
   - Perhitungan rata-rata rating (`average_rating`) dan total ulasan otomatis.
7. **Tambah Resep Baru:**
   - Formulir pembuatan resep baru lengkap dengan fitur upload foto ke Supabase Storage.
8. **Daftar Belanja Bahan (Grocery List):**
   - Masukkan seluruh bahan masakan dari detail resep ke daftar belanja secara instan.
   - Checklist coret bahan yang sudah dibeli dengan indikator progres belanja.
   - Tambah item belanja kustom mandiri.
   - **Fitur Bagikan ke WhatsApp:** Kirim daftar bahan belanjaan per menu masakan atau sekaligus semua menu langsung ke chat WhatsApp.
9. **Profil Pengguna & Favorite Section:**
   - Koleksi resep yang ditandai bintang/hati (tersimpan di *LocalStorage*, bisa diakses cepat dan offline).
   - Ubah profil koki (nama, bio singkat, dan upload foto personal).
   - Tab resep yang dibuat di perangkat ini.
   - Tombol instalasi PWA (*Install to Home Screen*).

---

## 🛠️ Tech Stack

* **Frontend (`pwa/`):** React 18 (JavaScript), Vite 6, Tailwind CSS, Lucide React, `vite-plugin-pwa` (Service Worker & Manifest).
* **Backend (`api/`):** Node.js (ES Modules), Express.js v5, Supabase (PostgreSQL & Storage), Multer.

---

## 💻 Cara Menjalankan Proyek

### 1. Menjalankan Backend API
```bash
cd api
npm install
npm run dev
```
*Server API berjalan di `http://localhost:3000`.*

### 2. Menjalankan Frontend PWA
Buka terminal baru:
```bash
cd pwa
npm install
npm run dev
```
*Frontend PWA berjalan di `http://localhost:5173` (otomatis terhubung via proxy ke port 3000).*

---

## 📱 Uji Coba PWA di Smartphone
1. Pastikan smartphone dan komputer berada di jaringan Wi-Fi yang sama.
2. Jalankan frontend dengan mode host: `npm run dev -- --host`.
3. Buka alamat IP komputer (contoh `http://192.168.1.x:5173`) di browser Chrome (Android) atau Safari (iOS).
4. Pilih **"Add to Home Screen"** atau **"Install App"** untuk memasang Cookly seperti aplikasi native.
