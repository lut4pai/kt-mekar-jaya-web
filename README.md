# Website Profil & Portal Admin — Kelompok Tani Mekar Jaya (KTMJ)

Website resmi **Kelompok Tani "Mekar Jaya" (KTMJ / KTMekarJaya)**, **Desa Sumber Makmur, Kecamatan Mentaya Hilir Utara, Kabupaten Kotawaringin Timur, Kalimantan Tengah** berdasarkan **SK Kepala Desa Sumber Makmur Nomor `/KPTS/SM-MHU/I/2026` (19 Januari 2026)**.

---

## Struktur File Proyek

```text
Website Poktan/
├── index.html                 # Halaman Utama Profil Kelompok Tani Mekar Jaya
├── admin.html                 # Portal Admin Pengurus (CRUD Kegiatan, Kontak, Profil & Supabase)
├── vercel.json                # Konfigurasi Routing & Caching untuk Deployment Vercel
├── package.json               # Konfigurasi Project & Script Local Server
├── .env.example               # Template Environment Variables Supabase
├── DESIGN.md                  # Dokumentasi Design System (Mekar Jaya Agrisystem)
├── supabase/
│   └── schema.sql             # Skema Tabel PostgreSQL, Storage Bucket, RLS & Seed Data SK
├── js/
│   ├── data.js                # Data Default Resmi SK 2026-2029, Kontak & 6 Dokumentasi Awal
│   ├── supabase-config.js     # Konfigurasi URL, Anon Key & PIN Admin
│   ├── supabase-client.js     # Hybrid Data Layer (Supabase Cloud + LocalStorage Fallback)
│   ├── app.js                 # Controller Frontend (Carousel Besar, Lightbox, Filter & Render)
│   └── admin.js               # Controller Portal Admin (CRUD Postingan, Upload Foto & Sync)
└── assets/
    └── images/                # Logo Resmi & Foto Dokumentasi Kegiatan Lapangan
```

---

## Cara Menggunakan Portal Admin (`admin.html`)

1. Buka halaman **[admin.html](admin.html)** (atau klik tombol **Portal Admin** di pojok kanan atas website).
2. Masukkan PIN Pengurus Default: **`mekarjaya2026`**.
3. Di dalam Portal Admin tersedia **4 Menu Utama**:
   - **Postingan Kegiatan**: Tambah foto kegiatan baru (bisa *upload* file dari komputer/HP atau via URL), edit judul/deskripsi, urutkan posisi *slide*, atau hapus postingan.
   - **Kontak & Medsos**: Ubah nomor HP/WhatsApp (`+62 812-5670-5184` — Pak Pur - Anggota), email (`ktmekarjaya26@gmail.com`), Instagram (`@ktmekarjaya_sumbermakmur`), dan alamat.
   - **Profil & Info SK**: Ubah nomor SK, tanggal penetapan, masa bakti, teks Hero, dan paragraf profil kelompok.
   - **Database Supabase & Backup**: Hubungkan website ke database **Supabase** secara langsung, unduh *backup* `.json`, atau *reset* ke data awal SK.

---

## Cara Menyambungkan ke Database Supabase

1. Buat project baru di [https://supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase, lalu salin seluruh isi file **[`supabase/schema.sql`](supabase/schema.sql)** dan klik **Run**.
   - Skrip ini otomatis membuat tabel `site_settings`, `gallery_posts`, `organization_members`, *Storage Bucket* `gallery-images`, serta mengisi data awal sesuai SK 2026–2029.
3. Buka menu **Project Settings → API** di Supabase, lalu salin **Project URL** dan **Anon Public Key**.
4. Masukkan **Project URL** dan **Anon Key** tersebut pada:
   - File **[`js/supabase-config.js`](js/supabase-config.js)** (untuk permanen di kode saat di-deploy ke Vercel), **ATAU**
   - Langsung melalui tab **"Database Supabase & Backup"** di **[`admin.html`](admin.html)** lalu klik **Simpan Koneksi & Sinkronkan ke Supabase**.

---

## Cara Deploy ke Vercel

1. Push folder proyek ini ke repositori GitHub / GitLab Anda, atau gunakan Vercel CLI (`npx vercel`).
2. Di dashboard [https://vercel.com](https://vercel.com), klik **Add New Project** dan pilih repositori ini.
3. Framework Preset: **Other** (Static HTML/JS — sudah dikonfigurasi otomatis melalui [`vercel.json`](vercel.json)).
4. Klik **Deploy** — halaman utama akan tampil di `/` dan Portal Admin dapat diakses di `/admin` atau `/admin.html`.
