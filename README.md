# Website Profil Resmi — Kelompok Tani Mekar Jaya (KTMJ)

Website Landing Page resmi **Kelompok Tani "Mekar Jaya" (KTMJ / KTMekarJaya)**, **Desa Sumber Makmur, Kecamatan Mentaya Hilir Utara, Kabupaten Kotawaringin Timur, Kalimantan Tengah** berdasarkan **SK Kepala Desa Sumber Makmur Nomor `/KPTS/SM-MHU/I/2026` (19 Januari 2026)**.

---

## Struktur File Proyek

```text
Website Poktan/
├── index.html                 # Halaman Utama Landing Page KT Mekar Jaya
├── vercel.json                # Konfigurasi Caching & Routing untuk Deployment Vercel
├── package.json               # Konfigurasi Project & Script Local Server
├── DESIGN.md                  # Dokumentasi Design System (Mekar Jaya Agrisystem)
├── js/
│   ├── data.js                # Data Resmi SK 2026-2029, 7 Foto Asli, 5 Video GDrive & Kontak
│   └── app.js                 # Controller Frontend (Carousel Besar, Video Playlist, Lightbox & Filter)
└── assets/
    └── images/                # Logo Resmi, Logo Mitra/Kampus, Foto Dokumentasi & Thumbnail Video
```

---

## Cara Deploy ke GitHub & Vercel

1. Push repositori Git proyek ini ke akun GitHub Anda:
   ```bash
   git remote add origin https://github.com/USERNAME/NAMA_REPO.git
   git push -u origin main
   ```
2. Buka dashboard [https://vercel.com](https://vercel.com), klik **Add New → Project**, lalu pilih repositori GitHub tersebut.
3. Klik **Deploy** — setiap kali ada perubahan yang di-*push* ke GitHub, Vercel akan otomatis memperbarui website secara *live*.
