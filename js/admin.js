/**
 * ============================================================================
 * LOGIKA PORTAL ADMIN - KELOMPOK TANI MEKAR JAYA (KTMJ)
 * ============================================================================
 * Mengelola CRUD Postingan Kegiatan, Kontak, Profil SK, serta Sinkronisasi Supabase.
 */

document.addEventListener("DOMContentLoaded", async function () {
  let siteData = window.KTMJDataService.getLocalData();

  // 1. Login Gate
  const loginGate = document.getElementById("admin-login-gate");
  const loginForm = document.getElementById("admin-login-form");
  const pinInput = document.getElementById("admin-pin-input");
  const loginErrorMsg = document.getElementById("login-error-msg");

  if (sessionStorage.getItem("ktmj_admin_unlocked") === "true" && loginGate) {
    loginGate.classList.add("hidden");
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const expectedPin =
        localStorage.getItem("ktmj_admin_pin") ||
        (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.defaultAdminPin) ||
        "mekarjaya2026";
      if ((pinInput.value || "").trim() === expectedPin) {
        sessionStorage.setItem("ktmj_admin_unlocked", "true");
        loginGate.classList.add("hidden");
        loginErrorMsg.classList.add("hidden");
      } else {
        loginErrorMsg.classList.remove("hidden");
      }
    });
  }

  // 2. Toast Helper
  const toastEl = document.getElementById("admin-toast");
  const toastTextEl = document.getElementById("admin-toast-text");
  let toastTimeout = null;

  function showToast(message) {
    if (!toastEl || !toastTextEl) return;
    toastTextEl.textContent = message;
    toastEl.classList.remove("hidden");
    toastEl.classList.add("flex");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toastEl.classList.add("hidden");
      toastEl.classList.remove("flex");
    }, 3200);
  }

  // 3. Tab Navigation
  const tabButtons = document.querySelectorAll("[data-admin-tab]");
  const panels = {
    kegiatan: document.getElementById("panel-kegiatan"),
    kontak: document.getElementById("panel-kontak"),
    profil: document.getElementById("panel-profil")
  };

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = btn.getAttribute("data-admin-tab");

      tabButtons.forEach(function (b) {
        b.className =
          "px-4 py-2.5 rounded-xl bg-white border border-outline-variant/50 text-on-surface hover:border-primary text-sm font-semibold inline-flex items-center gap-2 transition-colors";
      });
      btn.className =
        "px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-sm inline-flex items-center gap-2 transition-colors";

      Object.keys(panels).forEach(function (key) {
        if (panels[key]) {
          if (key === target) {
            panels[key].classList.remove("hidden");
          } else {
            panels[key].classList.add("hidden");
          }
        }
      });
    });
  });

  // 4. Load Data (Local / Supabase)
  const dbStatusPill = document.getElementById("db-status-pill");
  const loadResult = await window.KTMJDataService.loadSiteData();
  siteData = loadResult.data;

  function refreshDbStatusBadge() {
    if (!dbStatusPill) return;
    if (window.KTMJDataService.isSupabaseConfigured()) {
      dbStatusPill.textContent = "Terhubung ke Supabase Cloud";
      dbStatusPill.className =
        "px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-green-100 text-primary border border-primary/30";
    } else {
      dbStatusPill.textContent = "Mode Penyimpanan Lokal (Siap Supabase)";
      dbStatusPill.className =
        "px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-surface-container text-primary border border-primary/20";
    }
  }
  refreshDbStatusBadge();

  // 5. Populate Forms (Kontak & Profil)
  function populateForms() {
    // Kontak
    const c = siteData.contacts || {};
    document.getElementById("contact-phone-display").value = c.phoneDisplay || "";
    document.getElementById("contact-wa-number").value = c.whatsappNumber || "";
    document.getElementById("contact-person-name").value = c.contactPersonName || "";
    document.getElementById("contact-email").value = c.email || "";
    document.getElementById("contact-ig-handle").value = c.instagramHandle || "";
    document.getElementById("contact-hours").value = c.operationalHours || "";
    document.getElementById("contact-address").value = c.address || "";

    // Profil & SK
    const m = siteData.meta || {};
    const h = siteData.hero || {};
    const p = siteData.profile || {};
    document.getElementById("meta-group-name").value = m.groupName || "";
    document.getElementById("meta-sk-number").value = m.skNumber || "";
    document.getElementById("meta-established-date").value = m.establishedDate || "";
    document.getElementById("meta-period").value = m.period || "";
    document.getElementById("hero-title").value = h.title || "";
    document.getElementById("hero-description").value = h.description || "";
    document.getElementById("profile-p1").value = p.paragraph1 || "";
    document.getElementById("profile-p2").value = p.paragraph2 || "";
  }

  function collectFormChanges() {
    siteData.contacts.phoneDisplay = document.getElementById("contact-phone-display").value.trim();
    siteData.contacts.whatsappNumber = document
      .getElementById("contact-wa-number")
      .value.replace(/[^0-9]/g, "");
    siteData.contacts.contactPersonName = document
      .getElementById("contact-person-name")
      .value.trim();
    siteData.contacts.email = document.getElementById("contact-email").value.trim();
    const igHandle = document
      .getElementById("contact-ig-handle")
      .value.trim()
      .replace(/^@/, "");
    siteData.contacts.instagramHandle = igHandle;
    siteData.contacts.instagramUrl = "https://www.instagram.com/" + igHandle;
    siteData.contacts.operationalHours = document.getElementById("contact-hours").value.trim();
    siteData.contacts.address = document.getElementById("contact-address").value.trim();

    siteData.meta.groupName = document.getElementById("meta-group-name").value.trim();
    siteData.meta.skNumber = document.getElementById("meta-sk-number").value.trim();
    siteData.meta.establishedDate = document.getElementById("meta-established-date").value.trim();
    siteData.meta.period = document.getElementById("meta-period").value.trim();
    siteData.hero.title = document.getElementById("hero-title").value.trim();
    siteData.hero.description = document.getElementById("hero-description").value.trim();
    siteData.profile.paragraph1 = document.getElementById("profile-p1").value.trim();
    siteData.profile.paragraph2 = document.getElementById("profile-p2").value.trim();
  }

  // 6. Render Gallery Posts List
  const galleryListEl = document.getElementById("admin-gallery-list");
  const tabGalleryCount = document.getElementById("tab-gallery-count");

  function renderAdminGallery() {
    const items = siteData.gallery || [];
    if (tabGalleryCount) tabGalleryCount.textContent = String(items.length);
    if (!galleryListEl) return;

    galleryListEl.innerHTML = "";

    items.forEach(function (item, idx) {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm flex flex-col sm:flex-row";

      const isDummyBadge = item.isDummy
        ? '<span class="px-2 py-0.5 rounded bg-secondary-container text-on-surface text-[11px] font-bold">Dummy / Sementara</span>'
        : '<span class="px-2 py-0.5 rounded bg-primary text-white text-[11px] font-bold">Foto Asli</span>';

      card.innerHTML =
        '<div class="sm:w-48 h-44 sm:h-auto bg-surface-container shrink-0 relative">' +
        '  <img src="' +
        item.image +
        '" alt="" class="w-full h-full object-cover" />' +
        '  <div class="absolute top-2 left-2">' +
        isDummyBadge +
        "</div>" +
        "</div>" +
        '<div class="p-4 flex flex-col justify-between flex-grow gap-3">' +
        "  <div>" +
        '    <div class="flex items-center justify-between gap-2 text-xs text-on-surface-variant">' +
        '      <span class="font-bold text-primary">' +
        (item.badgeText || "Slide #" + (idx + 1)) +
        "</span>" +
        '      <span class="font-mono">' +
        (item.docCode || "") +
        "</span>" +
        "    </div>" +
        '    <h4 class="font-bold text-base text-on-surface mt-1">' +
        item.title +
        "</h4>" +
        '    <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">' +
        item.description +
        "</p>" +
        "  </div>" +
        '  <div class="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-2">' +
        '    <div class="flex items-center gap-1">' +
        '      <button type="button" data-move-up="' +
        idx +
        '" class="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs" title="Geser ke Atas/Kiri">' +
        '        <span class="material-symbols-outlined text-[16px]">arrow_upward</span>' +
        "      </button>" +
        '      <button type="button" data-move-down="' +
        idx +
        '" class="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs" title="Geser ke Bawah/Kanan">' +
        '        <span class="material-symbols-outlined text-[16px]">arrow_downward</span>' +
        "      </button>" +
        "    </div>" +
        '    <div class="flex items-center gap-2">' +
        '      <button type="button" data-edit-post="' +
        idx +
        '" class="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors inline-flex items-center gap-1">' +
        '        <span class="material-symbols-outlined text-[15px]">edit</span> Edit' +
        "      </button>" +
        '      <button type="button" data-delete-post="' +
        idx +
        '" class="px-3 py-1.5 rounded-lg border border-error/30 text-error font-bold text-xs hover:bg-error hover:text-white transition-colors inline-flex items-center gap-1">' +
        '        <span class="material-symbols-outlined text-[15px]">delete</span> Hapus' +
        "      </button>" +
        "    </div>" +
        "  </div>" +
        "</div>";

      galleryListEl.appendChild(card);
    });

    // Attach handlers
    galleryListEl.querySelectorAll("[data-edit-post]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-edit-post"), 10);
        openPostEditor(idx);
      });
    });

    galleryListEl.querySelectorAll("[data-delete-post]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const idx = parseInt(btn.getAttribute("data-delete-post"), 10);
        const item = siteData.gallery[idx];
        if (!item) return;
        if (confirm('Hapus postingan kegiatan "' + item.title + '"?')) {
          siteData.gallery.splice(idx, 1);
          renderAdminGallery();
          await window.KTMJDataService.saveSiteData(siteData);
          showToast("Postingan kegiatan berhasil dihapus!");
        }
      });
    });

    galleryListEl.querySelectorAll("[data-move-up]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const idx = parseInt(btn.getAttribute("data-move-up"), 10);
        if (idx <= 0) return;
        const temp = siteData.gallery[idx - 1];
        siteData.gallery[idx - 1] = siteData.gallery[idx];
        siteData.gallery[idx] = temp;
        renderAdminGallery();
        await window.KTMJDataService.saveSiteData(siteData);
        showToast("Urutan slide diperbarui!");
      });
    });

    galleryListEl.querySelectorAll("[data-move-down]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const idx = parseInt(btn.getAttribute("data-move-down"), 10);
        if (idx >= siteData.gallery.length - 1) return;
        const temp = siteData.gallery[idx + 1];
        siteData.gallery[idx + 1] = siteData.gallery[idx];
        siteData.gallery[idx] = temp;
        renderAdminGallery();
        await window.KTMJDataService.saveSiteData(siteData);
        showToast("Urutan slide diperbarui!");
      });
    });
  }

  // 7. Post Editor Modal / Form Logic
  const editorCard = document.getElementById("post-editor-card");
  const editorTitle = document.getElementById("post-editor-title");
  const editorForm = document.getElementById("post-editor-form");
  const editIndexInput = document.getElementById("post-edit-index");
  const fileInput = document.getElementById("post-file-input");
  const uploadStatusText = document.getElementById("upload-status-text");

  function openPostEditor(idx) {
    if (!editorCard) return;
    editorCard.classList.remove("hidden");

    if (typeof idx === "number" && idx >= 0 && siteData.gallery[idx]) {
      const item = siteData.gallery[idx];
      editorTitle.innerHTML =
        '<span class="material-symbols-outlined">edit_square</span> Edit Postingan Kegiatan';
      editIndexInput.value = String(idx);
      document.getElementById("post-title").value = item.title || "";
      document.getElementById("post-badge").value = item.badgeText || "";
      document.getElementById("post-metric").value = item.metricBadge || "";
      document.getElementById("post-location").value = item.location || "";
      document.getElementById("post-type-select").value = item.tags || "asli cabai pascapanen";
      document.getElementById("post-commodity-label").value = item.commodityLabel || "";
      document.getElementById("post-doc-code").value = item.docCode || "";
      document.getElementById("post-image-url").value = item.image || "";
      document.getElementById("post-description").value = item.description || "";
    } else {
      const nextNum = String((siteData.gallery || []).length + 1).padStart(2, "0");
      editorTitle.innerHTML =
        '<span class="material-symbols-outlined">add_photo_alternate</span> Tambah Postingan Kegiatan Baru';
      editIndexInput.value = "-1";
      document.getElementById("post-title").value = "";
      document.getElementById("post-badge").value = nextNum + " • Kegiatan Kelompok";
      document.getElementById("post-metric").value = "KTMJ Sumber Makmur";
      document.getElementById("post-location").value =
        "Desa Sumber Makmur, Kec. Mentaya Hilir Utara";
      document.getElementById("post-type-select").value = "asli cabai pascapanen";
      document.getElementById("post-commodity-label").value = "Kegiatan Hortikultura";
      document.getElementById("post-doc-code").value = "Dok. KTMJ/KG-" + nextNum;
      document.getElementById("post-image-url").value = "";
      document.getElementById("post-description").value = "";
    }

    editorCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.getElementById("btn-add-post").addEventListener("click", function () {
    openPostEditor(-1);
  });

  document.getElementById("btn-close-editor").addEventListener("click", function () {
    editorCard.classList.add("hidden");
  });

  document.getElementById("btn-cancel-post").addEventListener("click", function () {
    editorCard.classList.add("hidden");
  });

  // Quick Asset Image Buttons
  document.querySelectorAll("[data-quick-img]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.getElementById("post-image-url").value = btn.getAttribute("data-quick-img");
    });
  });

  // File Upload Handler
  if (fileInput) {
    fileInput.addEventListener("change", async function () {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (uploadStatusText) {
        uploadStatusText.textContent = "Memproses / mengunggah foto...";
      }
      try {
        const res = await window.KTMJDataService.uploadActivityImage(file);
        document.getElementById("post-image-url").value = res.url;
        if (uploadStatusText) {
          uploadStatusText.textContent =
            res.storage === "supabase"
              ? "Berhasil diunggah ke Supabase Storage!"
              : "Foto siap digunakan (tersimpan terkompresi)!";
        }
      } catch (err) {
        if (uploadStatusText) {
          uploadStatusText.textContent = "Gagal memproses foto: " + err.message;
        }
      }
    });
  }

  // Save Post Form
  if (editorForm) {
    editorForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const idx = parseInt(editIndexInput.value, 10);
      const selectedTags = document.getElementById("post-type-select").value;
      const isDummy = selectedTags.includes("dummy");

      const postObj = {
        id: idx >= 0 && siteData.gallery[idx] ? siteData.gallery[idx].id : "dok-" + Date.now(),
        title: document.getElementById("post-title").value.trim(),
        category: isDummy ? "Placeholder" : "Kegiatan",
        tags: selectedTags,
        badgeText: document.getElementById("post-badge").value.trim() || "Dokumentasi",
        badgeStyle: isDummy
          ? "bg-secondary-container text-on-secondary-fixed"
          : "bg-primary text-on-primary",
        metricBadge: document.getElementById("post-metric").value.trim() || "KTMJ",
        date: isDummy ? "Ilustrasi Sementara" : "Foto Dokumentasi Asli",
        location:
          document.getElementById("post-location").value.trim() || "Desa Sumber Makmur",
        image: document.getElementById("post-image-url").value.trim(),
        isDummy: isDummy,
        commodityLabel:
          document.getElementById("post-commodity-label").value.trim() || "Komoditas Utama",
        docCode: document.getElementById("post-doc-code").value.trim() || "Dok. KTMJ",
        description: document.getElementById("post-description").value.trim()
      };

      if (idx >= 0 && siteData.gallery[idx]) {
        siteData.gallery[idx] = postObj;
      } else {
        siteData.gallery.unshift(postObj);
      }

      editorCard.classList.add("hidden");
      renderAdminGallery();
      const saveRes = await window.KTMJDataService.saveSiteData(siteData);
      showToast(
        saveRes.mode === "supabase"
          ? "Postingan tersimpan & disinkronkan ke Supabase!"
          : "Postingan berhasil disimpan! Buka website untuk melihat hasilnya."
      );
    });
  }

  // 8. Save All Button
  document.getElementById("save-all-top-btn").addEventListener("click", async function () {
    collectFormChanges();
    const res = await window.KTMJDataService.saveSiteData(siteData);
    showToast(
      res.mode === "supabase"
        ? "Seluruh perubahan disimpan ke Supabase & Lokal!"
        : "Seluruh perubahan berhasil disimpan!"
    );
  });

  // Initial Render
  populateForms();
  renderAdminGallery();
});
