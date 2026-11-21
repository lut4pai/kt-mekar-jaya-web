-- ============================================================================
-- SUPABASE SQL SCHEMA & SEED DATA - KELOMPOK TANI MEKAR JAYA (KTMJ)
-- Desa Sumber Makmur, Kec. Mentaya Hilir Utara, Kab. Kotawaringin Timur
-- SK Kepala Desa Nomor: /KPTS/SM-MHU/I/2026 (Tanggal 19 Januari 2026)
-- ============================================================================
-- Cara Pakai:
-- Salin seluruh isi file ini dan jalankan (Run) di menu "SQL Editor" pada
-- dashboard project Supabase Anda (https://supabase.com/dashboard).
-- ============================================================================

-- 1. TABEL PENGATURAN PROFIL & KONTAK WEBSITE (site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  group_name TEXT NOT NULL DEFAULT 'Kelompok Tani Mekar Jaya',
  sk_number TEXT NOT NULL DEFAULT '/KPTS/SM-MHU/I/2026',
  email TEXT NOT NULL DEFAULT 'ktmekarjaya26@gmail.com',
  instagram TEXT NOT NULL DEFAULT 'ktmekarjaya_sumbermakmur',
  phone TEXT NOT NULL DEFAULT '+62 812-5670-5184',
  contact_person TEXT NOT NULL DEFAULT 'Pak Pur - Anggota',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL POSTINGAN KEGIATAN / GALERI FOTO DOKUMENTASI (gallery_posts)
CREATE TABLE IF NOT EXISTS public.gallery_posts (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Kegiatan',
  tags TEXT NOT NULL DEFAULT 'asli cabai',
  badge_text TEXT NOT NULL DEFAULT 'Dokumentasi',
  badge_style TEXT NOT NULL DEFAULT 'bg-primary text-on-primary',
  metric_badge TEXT NOT NULL DEFAULT 'KTMJ',
  date_label TEXT NOT NULL DEFAULT 'Foto Dokumentasi Asli',
  location TEXT NOT NULL DEFAULT 'Desa Sumber Makmur',
  image_url TEXT NOT NULL,
  is_dummy BOOLEAN NOT NULL DEFAULT FALSE,
  commodity_label TEXT NOT NULL DEFAULT 'Komoditas Utama',
  doc_code TEXT NOT NULL DEFAULT 'Dok. KTMJ',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL VIDEO DOKUMENTASI GOOGLE DRIVE (video_posts)
CREATE TABLE IF NOT EXISTS public.video_posts (
  id BIGSERIAL PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  drive_id TEXT NOT NULL,
  drive_url TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Desa Sumber Makmur',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL STRUKTUR PENGURUS & ANGGOTA SESUAI SK 2026-2029 (organization_members)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id BIGSERIAL PRIMARY KEY,
  member_no INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  member_type TEXT NOT NULL CHECK (member_type IN ('pengurus', 'anggota')),
  period TEXT NOT NULL DEFAULT '2026-2029',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AKTIFKAN ROW LEVEL SECURITY (RLS) & POLICIES UNTUK AKSES WEB / PORTAL ADMIN
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read gallery_posts" ON public.gallery_posts;
CREATE POLICY "Public read gallery_posts" ON public.gallery_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write gallery_posts" ON public.gallery_posts;
CREATE POLICY "Admin write gallery_posts" ON public.gallery_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read video_posts" ON public.video_posts;
CREATE POLICY "Public read video_posts" ON public.video_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write video_posts" ON public.video_posts;
CREATE POLICY "Admin write video_posts" ON public.video_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read organization_members" ON public.organization_members;
CREATE POLICY "Public read organization_members" ON public.organization_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write organization_members" ON public.organization_members;
CREATE POLICY "Admin write organization_members" ON public.organization_members FOR ALL USING (true) WITH CHECK (true);

-- 6. STORAGE BUCKET UNTUK UPLOAD FOTO KEGIATAN
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public View Gallery Images" ON storage.objects;
CREATE POLICY "Public View Gallery Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

DROP POLICY IF EXISTS "Public Upload Gallery Images" ON storage.objects;
CREATE POLICY "Public Upload Gallery Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery-images');

-- 7. SEED DATA AWAL 7 FOTO KEGIATAN ASLI (gallery_posts)
DELETE FROM public.gallery_posts;
INSERT INTO public.gallery_posts (
  post_id, sort_order, title, category, tags, badge_text, badge_style, metric_badge,
  date_label, location, image_url, is_dummy, commodity_label, doc_code, description
)
VALUES
  (
    'dok-01', 1, 'Pengukuran pH & Kesuburan Tanah di Kebun Jeruk', 'Teknologi Lahan', 'asli jeruk penyuluhan',
    '01 • Uji Sensor Tanah & Kebun Jeruk', 'bg-primary text-on-primary', 'Soil Tester Digital',
    'Foto Dokumentasi Asli', 'Kebun Jeruk Sumber Makmur, Mentaya Hilir Utara',
    'assets/images/pengecekan-sensor-lahan-jeruk.jpg', false, 'Komoditas Jeruk & Lahan', 'Dok. KTMJ/JR-01',
    'Pemeriksaan langsung tingkat keasaman (pH) dan kelembaban tanah di area kebun jeruk menggunakan alat sensor tanah digital bersama petani KT Mekar Jaya dan tim Mahasiswa Berdampak UNDA 2026.'
  ),
  (
    'dok-02', 2, 'Simulasi Pascapanen, Sealer Kemasan & Pemasaran Digital', 'Pascapanen & Digital', 'asli cabai alsintan pascapanen',
    '02 • Simulasi Hulu-Hilir & Digital', 'bg-primary text-on-primary', 'Pemasaran Digital',
    'Foto Dokumentasi Asli', 'Posko Tani Mekar Jaya, Sumber Makmur',
    'assets/images/simulasi-pascapanen-pemasaran-digital.jpg', false, 'Inovasi Pascapanen', 'Dok. KTMJ/DG-02',
    'Pelatihan terpadu penanganan pascapanen cabai mulai dari sortasi, pengoperasian mesin pengemas (impulse sealer), timbangan digital, hingga papan simulasi alur pemasaran digital kelompok tani.'
  ),
  (
    'dok-03', 3, 'Praktik Penimbangan Digital & Sortasi Cabai Rawit', 'Pascapanen', 'asli cabai pascapanen',
    '03 • Penimbangan Presisi Cabai', 'bg-primary text-on-primary', 'Timbangan Elektronik',
    'Foto Dokumentasi Asli', 'Desa Sumber Makmur, Kec. Mentaya Hilir Utara',
    'assets/images/penimbangan-digital-cabai-rawit.jpg', false, 'Komoditas Cabai Utama', 'Dok. KTMJ/CB-03',
    'Penimbangan hasil panen cabai rawit merah segar di atas timbangan duduk elektronik setelah melalui proses pemilahan mutu dari tampah ke dalam keranjang distribusi.'
  ),
  (
    'dok-04', 4, 'Serah Terima Peralatan Tani & Saprodi Hulu-Hilir', 'Alsintan & Logistik', 'asli cabai jeruk alsintan',
    '04 • Penguatan Alsintan & Saprodi', 'bg-on-surface text-on-primary', 'Kolaborasi UNDA 2026',
    'Foto Dokumentasi Asli', 'Posko Tani Mekar Jaya, Sumber Makmur',
    'assets/images/penyerahan-alsintan-saprodi.jpg', false, 'Modernisasi Alat Tani', 'Dok. KTMJ/AL-04',
    'Kebersamaan pengurus, anggota Kelompok Tani Mekar Jaya (KTMJ), dan tim Mahasiswa Berdampak Universitas Darwan Ali dalam serah terima sprayer elektrik, timbangan digital, alat pengemas, benih unggul, serta keranjang panen.'
  ),
  (
    'dok-05', 5, 'Sortasi & Seleksi Mutu (Grading) Cabai Rawit Merah', 'Pascapanen', 'asli cabai pascapanen',
    '05 • Sortasi Mutu Grade A', 'bg-primary text-on-primary', 'Standar Kualitas',
    'Foto Dokumentasi Asli', 'Desa Sumber Makmur, Kec. Mentaya Hilir Utara',
    'assets/images/sortasi-penimbangan-cabai.jpg', false, 'Komoditas Cabai Utama', 'Dok. KTMJ/CB-05',
    'Proses pemilahan (grading) cabai rawit merah segar hasil panen petani anggota KT Mekar Jaya menggunakan tampah bambu dan keranjang berventilasi untuk memisahkan buah kualitas terbaik.'
  ),
  (
    'dok-06', 6, 'Penyuluhan Lapangan & Musyawarah di Area Kebun Jeruk', 'Penyuluhan', 'asli cabai jeruk penyuluhan',
    '06 • Musyawarah & Penyuluhan Kebun', 'bg-secondary text-on-secondary', 'Kebun Hortikultura',
    'Foto Dokumentasi Asli', 'Kebun Jeruk Sumber Makmur',
    'assets/images/musyawarah-penyuluhan-kebun.jpg', false, 'Demokrasi & Edukasi Tani', 'Dok. KTMJ/PY-06',
    'Diskusi tatap muka antara petani anggota KT Mekar Jaya dan tim pendamping langsung di hamparan kebun jeruk membahas manajemen produksi cabai, perawatan jeruk, serta pemasaran digital.'
  ),
  (
    'dok-07', 7, 'Tinjauan Gudang Alsintan (Traktor) & Stok Pupuk Kelompok', 'Alsintan & Logistik', 'asli alsintan',
    '07 • Gudang Alsintan & Pupuk', 'bg-on-surface text-on-primary', 'Traktor & Saprodi',
    'Foto Dokumentasi Asli', 'Gudang Saprodi KT Mekar Jaya',
    'assets/images/video-thumbs/video-5.jpg', false, 'Sarana Produksi Pertanian', 'Dok. KTMJ/GD-07',
    'Peninjauan kesiapan unit traktor tangan (hand tractor) serta ketersediaan stok pupuk karung di gudang penyimpanan Kelompok Tani Mekar Jaya Desa Sumber Makmur.'
  );

-- 8. SEED DATA AWAL 5 VIDEO DOKUMENTASI GOOGLE DRIVE (video_posts)
DELETE FROM public.video_posts;
INSERT INTO public.video_posts (
  video_id, sort_order, drive_id, drive_url, embed_url, thumbnail_url, badge, title, location, description
)
VALUES
  (
    'vid-01', 1, '18-kZm_IuOAAPihQNDkLEl5lnpK0aGLIL',
    'https://drive.google.com/file/d/18-kZm_IuOAAPihQNDkLEl5lnpK0aGLIL/view?usp=sharing',
    'https://drive.google.com/file/d/18-kZm_IuOAAPihQNDkLEl5lnpK0aGLIL/preview',
    'assets/images/video-thumbs/video-1.jpg',
    'Video 01 • Teknologi Lahan',
    'Praktik Pengukuran pH & Kesuburan Tanah Lahan Kebun',
    'Lahan Hortikultura Desa Sumber Makmur',
    'Dokumentasi video pengujian kualitas tanah yang diberi perlakuan kapur pertanian (dolomit) menggunakan alat soil tester digital bersama petani KT Mekar Jaya.'
  ),
  (
    'vid-02', 2, '105qQHufSDCHhm-dIUo8o-0-NC_jnD4yR',
    'https://drive.google.com/file/d/105qQHufSDCHhm-dIUo8o-0-NC_jnD4yR/view?usp=sharing',
    'https://drive.google.com/file/d/105qQHufSDCHhm-dIUo8o-0-NC_jnD4yR/preview',
    'assets/images/video-thumbs/video-2.jpg',
    'Video 02 • Pascapanen Cabai',
    'Seleksi & Pemeriksaan Kualitas Fisik Cabai Rawit Segar',
    'Posko Pascapanen KT Mekar Jaya',
    'Proses pemeriksaan kesegaran, ukuran, dan tingkat kematangan cabai rawit merah hasil panen anggota sebelum masuk tahap penimbangan dan pengemasan.'
  ),
  (
    'vid-03', 3, '1mIXwFWo9Pf9pdDFBbYDcEI0CFm3PiOCT',
    'https://drive.google.com/file/d/1mIXwFWo9Pf9pdDFBbYDcEI0CFm3PiOCT/view?usp=drive_link',
    'https://drive.google.com/file/d/1mIXwFWo9Pf9pdDFBbYDcEI0CFm3PiOCT/preview',
    'assets/images/video-thumbs/video-3.jpg',
    'Video 03 • Administrasi & Sortasi',
    'Kegiatan Sortasi Panen & Pencatatan Pembukuan Tani',
    'Desa Sumber Makmur, Kec. Mentaya Hilir Utara',
    'Aktivitas gotong royong ibu-ibu petani menyortir cabai rawit di tampah sembari dilakukan pencatatan administrasi hasil panen kelompok.'
  ),
  (
    'vid-04', 4, '1b-x7UsPotr8xYDMD14SmqcdlorUlLIh5',
    'https://drive.google.com/file/d/1b-x7UsPotr8xYDMD14SmqcdlorUlLIh5/view?usp=sharing',
    'https://drive.google.com/file/d/1b-x7UsPotr8xYDMD14SmqcdlorUlLIh5/preview',
    'assets/images/video-thumbs/video-4.jpg',
    'Video 04 • Analisis Sampel Tanah',
    'Pembacaan Indikator Digital Alat Ukur Kesuburan Tanah',
    'Kebun Hortikultura Sumber Makmur',
    'Penjelasan teknis pembacaan angka indikator pH dan kelembaban pada layar soil meter digital untuk menentukan dosis pemupukan berimbang.'
  ),
  (
    'vid-05', 5, '11LKES5ShA8-8c1jzv2NdT_k9VLFIm2jt',
    'https://drive.google.com/file/d/11LKES5ShA8-8c1jzv2NdT_k9VLFIm2jt/view?usp=sharing',
    'https://drive.google.com/file/d/11LKES5ShA8-8c1jzv2NdT_k9VLFIm2jt/preview',
    'assets/images/video-thumbs/video-5.jpg',
    'Video 05 • Gudang Alsintan & Saprodi',
    'Peninjauan Gudang Traktor Tangan & Stok Pupuk Poktan',
    'Gudang Saprodi KT Mekar Jaya',
    'Dokumentasi fasilitas gudang penyimpanan mesin traktor roda dua dan cadangan pupuk anggota Kelompok Tani Mekar Jaya.'
  );

-- 9. SEED DATA PENGURUS & ANGGOTA SESUAI SK 2026-2029
DELETE FROM public.organization_members;
INSERT INTO public.organization_members (member_no, full_name, role_title, member_type, period)
VALUES
  (1, 'ROSIDIN', 'Ketua', 'pengurus', '2026-2029'),
  (2, 'MUHLISIN', 'Sekretaris', 'pengurus', '2026-2029'),
  (3, 'SAMSUL HUDA', 'Bendahara', 'pengurus', '2026-2029'),
  (4, 'PURWADI', 'Bidang Peternakan dan Perikanan', 'pengurus', '2026-2029'),
  (5, 'BEJO', 'Bidang Perkebunan Tanaman Pangan dan Hortikultura', 'pengurus', '2026-2029'),
  (6, 'SUKARDI', 'Bidang Humas dan Kerjasama', 'pengurus', '2026-2029'),
  (7, 'HARTATIK', 'Unit Simpan Pinjam', 'pengurus', '2026-2029'),
  (1, 'SUDARNO', 'Anggota', 'anggota', '2026-2029'),
  (2, 'SAKIRUN', 'Anggota', 'anggota', '2026-2029'),
  (3, 'MUSTAKIM', 'Anggota', 'anggota', '2026-2029'),
  (4, 'PAWIRO REJO', 'Anggota', 'anggota', '2026-2029'),
  (5, 'SURIPTO WIDODO', 'Anggota', 'anggota', '2026-2029'),
  (6, 'SARIP', 'Anggota', 'anggota', '2026-2029'),
  (7, 'SUPRIYO', 'Anggota', 'anggota', '2026-2029'),
  (8, 'TULAM SUTANTO', 'Anggota', 'anggota', '2026-2029'),
  (9, 'SUPARMIN', 'Anggota', 'anggota', '2026-2029'),
  (10, 'NASIR', 'Anggota', 'anggota', '2026-2029'),
  (11, 'SUKIDI', 'Anggota', 'anggota', '2026-2029'),
  (12, 'RAJIMAN', 'Anggota', 'anggota', '2026-2029'),
  (13, 'SUDIONO', 'Anggota', 'anggota', '2026-2029'),
  (14, 'FATKHURAHMAN', 'Anggota', 'anggota', '2026-2029'),
  (15, 'SODIK', 'Anggota', 'anggota', '2026-2029'),
  (16, 'SALIM', 'Anggota', 'anggota', '2026-2029'),
  (17, 'SANAJI', 'Anggota', 'anggota', '2026-2029'),
  (18, 'WARDI', 'Anggota', 'anggota', '2026-2029'),
  (19, 'KARSUM', 'Anggota', 'anggota', '2026-2029'),
  (20, 'AGUNG BUDIANTO', 'Anggota', 'anggota', '2026-2029'),
  (21, 'M. SAEPUDIN', 'Anggota', 'anggota', '2026-2029'),
  (22, 'SARGIO', 'Anggota', 'anggota', '2026-2029'),
  (23, 'SATIMAN', 'Anggota', 'anggota', '2026-2029'),
  (25, 'SOLEH', 'Anggota', 'anggota', '2026-2029'),
  (26, 'SAMIRIN', 'Anggota', 'anggota', '2026-2029'),
  (27, 'SUTARNO', 'Anggota', 'anggota', '2026-2029'),
  (28, 'NAITUNG', 'Anggota', 'anggota', '2026-2029'),
  (29, 'SUBARI', 'Anggota', 'anggota', '2026-2029'),
  (30, 'JOKO MUNIR', 'Anggota', 'anggota', '2026-2029');
