/**
 * ============================================================================
 * DATA SERVICE LAYER (HYBRID SUPABASE + LOCALSTORAGE FALLBACK)
 * ============================================================================
 * Mengelola pembacaan & penyimpanan data website KT Mekar Jaya (KTMJ):
 * - Jika Supabase sudah dikonfigurasi (`SUPABASE_URL` & `SUPABASE_ANON_KEY`),
 *   data akan disinkronkan langsung ke tabel Supabase (`site_settings`,
 *   `gallery_posts`, `organization_members`) dan Supabase Storage.
 * - Jika Supabase belum dikonfigurasi, sistem otomatis menggunakan `localStorage`
 *   sehingga Portal Admin tetap berfungsi 100% secara instan.
 */

(function () {
  const STORAGE_KEY = "ktmj_site_data_v2";
  let supabaseClient = null;

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function initSupabaseClient() {
    const cfg = window.SUPABASE_CONFIG || {};
    const url = (localStorage.getItem("ktmj_supabase_url") || cfg.url || "").trim();
    const key = (localStorage.getItem("ktmj_supabase_anon_key") || cfg.anonKey || "").trim();

    if (url && key && window.supabase && typeof window.supabase.createClient === "function") {
      try {
        supabaseClient = window.supabase.createClient(url, key);
        return supabaseClient;
      } catch (err) {
        console.warn("Gagal menginisialisasi Supabase client:", err);
        supabaseClient = null;
      }
    }
    return null;
  }

  function isSupabaseConfigured() {
    const cfg = window.SUPABASE_CONFIG || {};
    const url = (localStorage.getItem("ktmj_supabase_url") || cfg.url || "").trim();
    const key = (localStorage.getItem("ktmj_supabase_anon_key") || cfg.anonKey || "").trim();
    return Boolean(url && key);
  }

  function getLocalData() {
    const defaults = deepClone(window.KT_MEKAR_JAYA_DEFAULT_DATA || {});
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        meta: Object.assign({}, defaults.meta, parsed.meta || {}),
        ticker: Object.assign({}, defaults.ticker, parsed.ticker || {}),
        hero: Object.assign({}, defaults.hero, parsed.hero || {}),
        profile: Object.assign({}, defaults.profile, parsed.profile || {}),
        commodities: Array.isArray(parsed.commodities) ? parsed.commodities : defaults.commodities,
        organization: Object.assign({}, defaults.organization, parsed.organization || {}),
        programs: Array.isArray(parsed.programs) ? parsed.programs : defaults.programs,
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : defaults.gallery,
        videos: Array.isArray(parsed.videos) ? parsed.videos : defaults.videos,
        contacts: Object.assign({}, defaults.contacts, parsed.contacts || {})
      };
    } catch (e) {
      console.warn("Gagal membaca localStorage, menggunakan default data SK:", e);
      return defaults;
    }
  }

  function saveLocalData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.KT_MEKAR_JAYA_DATA = data;
  }

  async function loadSiteData() {
    const localData = getLocalData();
    const client = initSupabaseClient();

    if (!client) {
      window.KT_MEKAR_JAYA_DATA = localData;
      return { data: localData, source: "local" };
    }

    try {
      // 1. Ambil site_settings (id = 1)
      const { data: settingsRow, error: settingsErr } = await client
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      // 2. Ambil gallery_posts diurutkan berdasarkan sort_order
      const { data: galleryRows, error: galleryErr } = await client
        .from("gallery_posts")
        .select("*")
        .order("sort_order", { ascending: true });

      // 3. Ambil video_posts diurutkan berdasarkan sort_order
      const { data: videoRows } = await client
        .from("video_posts")
        .select("*")
        .order("sort_order", { ascending: true });

      if (settingsErr && galleryErr) {
        throw new Error(settingsErr.message || galleryErr.message);
      }

      const merged = deepClone(localData);

      if (settingsRow && settingsRow.payload) {
        const p = settingsRow.payload;
        if (p.meta) merged.meta = Object.assign({}, merged.meta, p.meta);
        if (p.ticker) merged.ticker = Object.assign({}, merged.ticker, p.ticker);
        if (p.hero) merged.hero = Object.assign({}, merged.hero, p.hero);
        if (p.profile) merged.profile = Object.assign({}, merged.profile, p.profile);
        if (p.contacts) merged.contacts = Object.assign({}, merged.contacts, p.contacts);
        if (p.organization) merged.organization = Object.assign({}, merged.organization, p.organization);
      }

      if (Array.isArray(galleryRows) && galleryRows.length > 0) {
        merged.gallery = galleryRows.map(function (row) {
          return {
            id: row.post_id || String(row.id),
            title: row.title,
            category: row.category || "Kegiatan",
            tags: row.tags || "asli cabai",
            badgeText: row.badge_text || "Dokumentasi",
            badgeStyle: row.badge_style || "bg-primary text-on-primary",
            metricBadge: row.metric_badge || "KTMJ",
            date: row.date_label || "Dokumentasi Lapangan",
            location: row.location || "Desa Sumber Makmur",
            image: row.image_url,
            isDummy: Boolean(row.is_dummy),
            commodityLabel: row.commodity_label || "Kegiatan Kelompok",
            docCode: row.doc_code || "Dok. KTMJ",
            description: row.description || ""
          };
        });
      }

      if (Array.isArray(videoRows) && videoRows.length > 0) {
        merged.videos = videoRows.map(function (row) {
          return {
            id: row.video_id || String(row.id),
            driveId: row.drive_id,
            driveUrl: row.drive_url,
            embedUrl: row.embed_url,
            thumbnail: row.thumbnail_url,
            badge: row.badge,
            title: row.title,
            location: row.location || "Desa Sumber Makmur",
            description: row.description || ""
          };
        });
      }

      saveLocalData(merged);
      return { data: merged, source: "supabase" };
    } catch (err) {
      console.warn("Fallback ke data lokal (Supabase belum siap/tabel belum dibuat):", err);
      window.KT_MEKAR_JAYA_DATA = localData;
      return { data: localData, source: "local", error: err.message };
    }
  }

  async function saveSiteData(updatedData) {
    saveLocalData(updatedData);
    const client = initSupabaseClient();

    if (!client) {
      return { ok: true, mode: "local" };
    }

    try {
      // Simpan ke tabel site_settings
      const settingsPayload = {
        meta: updatedData.meta,
        ticker: updatedData.ticker,
        hero: updatedData.hero,
        profile: updatedData.profile,
        contacts: updatedData.contacts,
        organization: updatedData.organization
      };

      const { error: upsertSettingsErr } = await client
        .from("site_settings")
        .upsert(
          {
            id: 1,
            group_name: updatedData.meta.groupName,
            email: updatedData.contacts.email,
            instagram: updatedData.contacts.instagramHandle,
            phone: updatedData.contacts.phoneDisplay,
            contact_person: updatedData.contacts.contactPersonName,
            payload: settingsPayload,
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        );

      if (upsertSettingsErr) throw upsertSettingsErr;

      // Sinkronisasi gallery_posts: hapus yang tidak ada & upsert yang baru
      const galleryItems = updatedData.gallery || [];
      const { error: deleteErr } = await client
        .from("gallery_posts")
        .delete()
        .neq("post_id", "__none__");

      if (!deleteErr && galleryItems.length > 0) {
        const rows = galleryItems.map(function (item, idx) {
          return {
            post_id: item.id || "dok-" + (idx + 1),
            sort_order: idx + 1,
            title: item.title,
            category: item.category || "Kegiatan",
            tags: item.tags || "asli cabai",
            badge_text: item.badgeText || "Dokumentasi",
            badge_style: item.badgeStyle || "bg-primary text-on-primary",
            metric_badge: item.metricBadge || "KTMJ",
            date_label: item.date || "Dokumentasi Lapangan",
            location: item.location || "Desa Sumber Makmur",
            image_url: item.image,
            is_dummy: Boolean(item.isDummy),
            commodity_label: item.commodityLabel || "Kegiatan Kelompok",
            doc_code: item.docCode || "Dok. KTMJ",
            description: item.description || ""
          };
        });
        const { error: insertGalleryErr } = await client.from("gallery_posts").insert(rows);
        if (insertGalleryErr) throw insertGalleryErr;
      }

      return { ok: true, mode: "supabase" };
    } catch (err) {
      console.error("Gagal menyinkronkan ke Supabase, perubahan tetap aman di penyimpanan lokal:", err);
      return { ok: true, mode: "local_fallback", error: err.message };
    }
  }

  /**
   * Upload gambar kegiatan:
   * - Jika Supabase aktif & bucket tersedia, unggah ke Supabase Storage.
   * - Jika tidak, kompres menggunakan Canvas menjadi Data URL agar langsung tersimpan & tampil.
   */
  async function uploadActivityImage(file) {
    const client = initSupabaseClient();
    const bucket = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.storageBucket) || "gallery-images";

    if (client && file) {
      try {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const fileName = "kegiatan-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7) + "." + ext;
        const { error: uploadErr } = await client.storage.from(bucket).upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });
        if (!uploadErr) {
          const { data: pub } = client.storage.from(bucket).getPublicUrl(fileName);
          if (pub && pub.publicUrl) {
            return { url: pub.publicUrl, storage: "supabase" };
          }
        }
      } catch (err) {
        console.warn("Supabase Storage upload gagal, menggunakan kompresi gambar lokal:", err);
      }
    }

    // Kompresi gambar ke Data URL menggunakan Canvas (maks lebar 1280px)
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        const img = new Image();
        img.onload = function () {
          const maxWidth = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          resolve({ url: dataUrl, storage: "local_base64" });
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function resetToDefaultData() {
    localStorage.removeItem(STORAGE_KEY);
    const defaults = deepClone(window.KT_MEKAR_JAYA_DEFAULT_DATA || {});
    window.KT_MEKAR_JAYA_DATA = defaults;
    return defaults;
  }

  window.KTMJDataService = {
    isSupabaseConfigured: isSupabaseConfigured,
    initSupabaseClient: initSupabaseClient,
    getLocalData: getLocalData,
    loadSiteData: loadSiteData,
    saveSiteData: saveSiteData,
    uploadActivityImage: uploadActivityImage,
    resetToDefaultData: resetToDefaultData
  };
})();
