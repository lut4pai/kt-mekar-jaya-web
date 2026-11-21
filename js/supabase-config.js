/**
 * ============================================================================
 * KONFIGURASI SUPABASE & PORTAL ADMIN - KT MEKAR JAYA (KTMJ)
 * ============================================================================
 * Cara Menghubungkan ke Supabase:
 * 1. Buat project di https://supabase.com
 * 2. Jalankan file SQL `supabase/schema.sql` pada menu SQL Editor di Supabase
 * 3. Masukkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di bawah ini (atau melalui
 *    menu "Koneksi Supabase" di dalam halaman Portal Admin `/admin.html`).
 */

window.SUPABASE_CONFIG = {
  // Isi dengan Project URL Supabase Anda, contoh: "https://xyzcompany.supabase.co"
  url: localStorage.getItem("ktmj_supabase_url") || "",

  // Isi dengan Anon Public Key Supabase Anda
  anonKey: localStorage.getItem("ktmj_supabase_anon_key") || "",

  // Nama Storage Bucket di Supabase untuk upload foto kegiatan
  storageBucket: "gallery-images",

  // PIN / Kode Akses Default Portal Admin (Dapat diubah di Portal Admin)
  defaultAdminPin: "mekarjaya2026"
};
