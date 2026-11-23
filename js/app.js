/**
 * ============================================================================
 * FRONTEND CONTROLLER - KELOMPOK TANI MEKAR JAYA (KTMJ)
 * ============================================================================
 * - Memuat data langsung dari `js/data.js` (`window.KT_MEKAR_JAYA_DATA`)
 * - Merender Slide Foto Kegiatan Berukuran Besar (Horizontal Carousel)
 * - Merender Pemutar & Daftar Putar 5 Video Dokumentasi Google Drive
 * - Merender Daftar 29 Anggota Resmi sesuai SK Kepala Desa 2026–2029
 * - Mengelola Lightbox Modal, Filter Galeri, Navigasi Mobile & Accordion
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuPanel = document.getElementById("mobile-menu-panel");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");

  if (mobileMenuBtn && mobileMenuPanel) {
    mobileMenuBtn.addEventListener("click", function () {
      const isHidden = mobileMenuPanel.classList.contains("hidden");
      if (isHidden) {
        mobileMenuPanel.classList.remove("hidden");
        if (mobileMenuIcon) mobileMenuIcon.textContent = "close";
      } else {
        mobileMenuPanel.classList.add("hidden");
        if (mobileMenuIcon) mobileMenuIcon.textContent = "menu";
      }
    });

    mobileMenuPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenuPanel.classList.add("hidden");
        if (mobileMenuIcon) mobileMenuIcon.textContent = "menu";
      });
    });
  }

  // 2. Load Site Data langsung dari js/data.js
  const siteData = window.KT_MEKAR_JAYA_DATA || window.KT_MEKAR_JAYA_DEFAULT_DATA || {};

  // 3. Apply Dynamic Text & Contacts to DOM without breaking HTML typography
  function applyDynamicContent(data) {
    const m = data.meta || {};
    const h = data.hero || {};
    const p = data.profile || {};
    const c = data.contacts || {};

    const setText = function (id, val) {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    };

    setText("nav-group-name", m.shortName || m.groupName);
    setText(
      "ticker-sk-label",
      "SK Kades No. " + (m.skNumber || "/KPTS/SM-MHU/I/2026") + " • Periode " + (m.period || "2026–2029")
    );

    // Format Hero Title dengan highlight warna hijau pada bagian kedua kalimat
    const heroTitleEl = document.getElementById("hero-title-display");
    if (heroTitleEl && h.title) {
      const parts = h.title.split(",");
      if (parts.length > 1) {
        const firstPart = parts[0];
        const restPart = parts.slice(1).join(",");
        heroTitleEl.innerHTML =
          firstPart + ', <span class="text-primary">' + restPart.trim() + "</span>";
      } else {
        heroTitleEl.textContent = h.title;
      }
    }

    setText("hero-desc-display", h.description);
    setText("hero-sk-badge", "SK Kepala Desa No. " + (m.skNumber || "/KPTS/SM-MHU/I/2026"));

    setText("profile-sk-display", m.skNumber);
    setText("profile-date-display", m.establishedDate);
    setText("profile-period-display", m.period);
    setText("profile-p1-display", p.paragraph1);
    setText("profile-p2-display", p.paragraph2);

    // Contacts
    setText("contact-address-display", c.address);
    setText("contact-phone-text", c.phoneDisplay);
    setText("contact-person-text", c.contactPersonName);

    const waNumber = (c.whatsappNumber || "6281256705184").replace(/[^0-9]/g, "");
    const waUrl =
      "https://wa.me/" +
      waNumber +
      "?text=" +
      encodeURIComponent(
        "Halo " +
          (c.contactPersonName || "Pengurus") +
          " Kelompok Tani Mekar Jaya (KTMJ Desa Sumber Makmur), saya ingin bertanya mengenai..."
      );

    const contactWaBtn = document.getElementById("contact-wa-btn");
    if (contactWaBtn) contactWaBtn.href = waUrl;

    const footerWaLink = document.getElementById("footer-wa-link");
    if (footerWaLink) {
      footerWaLink.href = waUrl;
      footerWaLink.textContent =
        (c.phoneDisplay || "+62 812-5670-5184") +
        (c.contactPersonName ? " (" + c.contactPersonName + ")" : "");
    }

    const emailAddr = c.email || "ktmekarjaya26@gmail.com";
    const emailLink = document.getElementById("contact-email-link");
    const emailBtn = document.getElementById("contact-email-btn");
    const footerEmailLink = document.getElementById("footer-email-link");
    if (emailLink) {
      emailLink.href = "mailto:" + emailAddr;
      emailLink.textContent = emailAddr;
    }
    if (emailBtn) emailBtn.href = "mailto:" + emailAddr;
    if (footerEmailLink) {
      footerEmailLink.href = "mailto:" + emailAddr;
      footerEmailLink.textContent = emailAddr;
    }

    const igHandle = (c.instagramHandle || "ktmekarjaya_sumbermakmur").replace(/^@/, "");
    const igUrl = "https://www.instagram.com/" + igHandle;
    const igLink = document.getElementById("contact-ig-link");
    const igBtn = document.getElementById("contact-ig-btn");
    const footerIgLink = document.getElementById("footer-ig-link");
    if (igLink) {
      igLink.href = igUrl;
      igLink.textContent = "@" + igHandle;
    }
    if (igBtn) {
      igBtn.href = igUrl;
      igBtn.innerHTML =
        '<span class="material-symbols-outlined text-[18px]">open_in_new</span><span>@' +
        igHandle +
        "</span>";
    }
    if (footerIgLink) {
      footerIgLink.href = igUrl;
      footerIgLink.textContent = "@" + igHandle;
    }
  }

  // 4. Render 29 Members Grid (SK 2026-2029) dengan nomor urut rapi 01-29
  function renderMembersGrid(data) {
    const container = document.getElementById("members-grid-container");
    if (!container) return;
    const members = (data.organization && data.organization.members) || [];
    container.innerHTML = "";

    members.forEach(function (m, index) {
      const displayNo = String(index + 1).padStart(2, "0");
      const div = document.createElement("div");
      div.className =
        "bg-white p-3 rounded-xl border border-outline-variant/40 flex items-center gap-3 shadow-sm";
      div.innerHTML =
        '<span class="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center shrink-0">' +
        displayNo +
        "</span>" +
        '<div class="min-w-0">' +
        '  <p class="text-sm text-on-surface font-bold truncate leading-snug">' +
        m.name +
        "</p>" +
        '  <p class="text-[11px] font-medium text-on-surface-variant">' +
        (m.role || "Anggota KTMJ") +
        "</p>" +
        "</div>";
      container.appendChild(div);
    });
  }

  // Members Accordion Toggle
  const toggleMembersBtn = document.getElementById("toggle-members-btn");
  const membersPanel = document.getElementById("members-list-panel");
  const membersIcon = document.getElementById("members-accordion-icon");
  if (toggleMembersBtn && membersPanel && membersIcon) {
    toggleMembersBtn.addEventListener("click", function () {
      const isHidden = membersPanel.classList.contains("hidden");
      if (isHidden) {
        membersPanel.classList.remove("hidden");
        membersIcon.classList.add("rotate-180");
        toggleMembersBtn.setAttribute("aria-expanded", "true");
      } else {
        membersPanel.classList.add("hidden");
        membersIcon.classList.remove("rotate-180");
        toggleMembersBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 5. Render Horizontal Gallery Carousel & Dots (Clean Uncluttered Card Layout)
  const scrollContainer = document.getElementById("gallery-scroll-container");
  const dotsContainer = document.getElementById("gallery-dots");
  const prevBtn = document.getElementById("gallery-prev-btn");
  const nextBtn = document.getElementById("gallery-next-btn");
  const ambientBg = document.getElementById("gallery-ambient-bg");
  const filterButtons = document.querySelectorAll("[data-gallery-filter]");
  const galleryCountLabel = document.getElementById("gallery-count-label");

  let galleryCards = [];
  let dotButtons = [];
  let hasDragged = false;

  function renderGalleryCarousel(items) {
    if (!scrollContainer || !dotsContainer) return;
    scrollContainer.innerHTML = "";
    dotsContainer.innerHTML = "";

    items.forEach(function (item, idx) {
      const isDummy = Boolean(item.isDummy);
      const borderClass = isDummy
        ? "border-2 border-dashed border-secondary/60"
        : "border border-outline-variant/50";
      const badgeClass = isDummy
        ? "bg-secondary-container text-on-secondary-fixed"
        : "bg-primary text-white";
      const metaIcon = isDummy ? "imagesmode" : "photo_camera";
      const metaLabel =
        (item.date || "Dokumentasi") + " • " + (item.location || "Desa Sumber Makmur");

      const article = document.createElement("article");
      article.setAttribute("data-gallery-card", "");
      article.setAttribute("data-tags", item.tags || "asli cabai");
      article.setAttribute("data-bg-src", item.image || "");
      article.className =
        "snap-center shrink-0 w-[86vw] sm:w-[520px] lg:w-[660px] bg-white rounded-2xl " +
        borderClass +
        " overflow-hidden flex flex-col group shadow-md hover:shadow-xl transition-all duration-300";

      article.innerHTML =
        // Area Gambar Bersih & Besar
        '<div class="relative w-full h-[220px] sm:h-[340px] lg:h-[400px] bg-on-surface overflow-hidden">' +
        '  <img loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="' +
        (item.title || "").replace(/"/g, "&quot;") +
        '" src="' +
        item.image +
        '" />' +
        '  <div data-card-badge class="absolute top-3.5 left-3.5 ' +
        badgeClass +
        ' text-xs font-bold px-3 py-1.5 rounded-lg shadow">' +
        (item.badgeText || "0" + (idx + 1) + " • Dokumentasi") +
        "  </div>" +
        '  <button type="button" data-open-lightbox class="absolute top-3.5 right-3.5 bg-white/95 hover:bg-white text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg shadow inline-flex items-center gap-1 transition-transform hover:scale-105">' +
        '    <span class="material-symbols-outlined text-[15px]">fullscreen</span><span>Perbesar</span>' +
        "  </button>" +
        "</div>" +
        // Area Teks & Metadata Rapi di Bawah Gambar
        '<div class="p-6 flex flex-col flex-grow justify-between bg-white">' +
        "  <div>" +
        '    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">' +
        '      <div data-card-meta class="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">' +
        '        <span class="material-symbols-outlined text-[15px] text-primary">' +
        metaIcon +
        "</span>" +
        "        <span>" +
        metaLabel +
        "</span>" +
        "      </div>" +
        '      <span class="px-2.5 py-0.5 rounded-md bg-surface-container text-primary text-[11px] font-bold">' +
        (item.metricBadge || "KTMJ") +
        "      </span>" +
        "    </div>" +
        '    <h3 class="text-lg sm:text-xl text-on-surface font-extrabold leading-snug group-hover:text-primary transition-colors">' +
        item.title +
        "    </h3>" +
        '    <p class="text-sm text-on-surface-variant mt-2 leading-relaxed">' +
        item.description +
        "    </p>" +
        "  </div>" +
        '  <div class="pt-3.5 mt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs">' +
        '    <span class="text-primary font-bold uppercase tracking-wider">' +
        (item.commodityLabel || "Kegiatan Kelompok") +
        "</span>" +
        '    <span class="text-on-surface-variant font-mono font-semibold">' +
        (item.docCode || "Dok. KTMJ") +
        "</span>" +
        "  </div>" +
        "</div>";

      article.addEventListener("click", function (e) {
        if (hasDragged) {
          hasDragged = false;
          e.preventDefault();
          return;
        }
        openLightbox(article);
      });

      scrollContainer.appendChild(article);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("data-slide-to", String(idx));
      dot.setAttribute("aria-label", "Slide " + (idx + 1));
      dot.className =
        idx === 0
          ? "w-8 h-2.5 rounded-full bg-primary transition-all"
          : "w-2.5 h-2.5 rounded-full bg-primary/30 hover:bg-primary/60 transition-all";
      dot.addEventListener("click", function () {
        scrollToCardIndex(idx);
      });
      dotsContainer.appendChild(dot);
    });

    galleryCards = Array.from(scrollContainer.querySelectorAll("[data-gallery-card]"));
    dotButtons = Array.from(dotsContainer.querySelectorAll("[data-slide-to]"));
    updateActiveSlideState();
  }

  function getVisibleCards() {
    return galleryCards.filter(function (card) {
      return !card.classList.contains("hidden");
    });
  }

  function updateActiveSlideState() {
    if (!scrollContainer) return;
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const containerCenter = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    visibleCards.forEach(function (card, idx) {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    const activeCard = visibleCards[closestIndex];
    if (activeCard && ambientBg) {
      const bgSrc = activeCard.getAttribute("data-bg-src");
      if (bgSrc && ambientBg.getAttribute("src") !== bgSrc) {
        ambientBg.setAttribute("src", bgSrc);
      }
    }

    dotButtons.forEach(function (dot, idx) {
      if (idx >= visibleCards.length) {
        dot.classList.add("hidden");
      } else {
        dot.classList.remove("hidden");
        if (idx === closestIndex) {
          dot.className = "w-8 h-2.5 rounded-full bg-primary transition-all";
        } else {
          dot.className = "w-2.5 h-2.5 rounded-full bg-primary/30 hover:bg-primary/60 transition-all";
        }
      }
    });

    if (galleryCountLabel) {
      galleryCountLabel.textContent = "Foto " + (closestIndex + 1) + " / " + visibleCards.length;
    }
  }

  function getCurrentSlideIndex() {
    if (!scrollContainer) return 0;
    const visibleCards = getVisibleCards();
    const containerCenter = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    visibleCards.forEach(function (card, idx) {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });
    return closestIndex;
  }

  function scrollToCardIndex(targetIndex) {
    if (!scrollContainer) return;
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const clampedIndex =
      ((targetIndex % visibleCards.length) + visibleCards.length) % visibleCards.length;
    const targetCard = visibleCards[clampedIndex];
    if (!targetCard) return;

    const targetLeft =
      targetCard.offsetLeft - (scrollContainer.clientWidth - targetCard.offsetWidth) / 2;
    scrollContainer.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth"
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      scrollToCardIndex(getCurrentSlideIndex() - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      scrollToCardIndex(getCurrentSlideIndex() + 1);
    });
  }

  if (scrollContainer) {
    let scrollTimer = null;
    scrollContainer.addEventListener("scroll", function () {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateActiveSlideState, 60);
    });
  }

  // Drag-to-Scroll dengan Mouse
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  if (scrollContainer) {
    scrollContainer.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      isPointerDown = true;
      hasDragged = false;
      startX = e.pageX - scrollContainer.offsetLeft;
      startScrollLeft = scrollContainer.scrollLeft;
      scrollContainer.classList.add("is-dragging");
    });

    window.addEventListener("mouseup", function () {
      if (!isPointerDown) return;
      isPointerDown = false;
      scrollContainer.classList.remove("is-dragging");
    });

    scrollContainer.addEventListener("mousemove", function (e) {
      if (!isPointerDown) return;
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 8) {
        hasDragged = true;
        e.preventDefault();
        scrollContainer.scrollLeft = startScrollLeft - walk;
      }
    });
  }

  // Filter Buttons
  if (filterButtons.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filterValue = btn.getAttribute("data-gallery-filter");

        filterButtons.forEach(function (b) {
          b.className =
            "px-3.5 py-2 rounded-xl border border-outline-variant/60 bg-white text-on-surface hover:border-primary text-xs font-semibold shadow-sm transition-colors";
        });
        btn.className =
          "px-3.5 py-2 rounded-xl border border-primary bg-primary text-white text-xs font-bold shadow-sm transition-colors";

        galleryCards.forEach(function (card) {
          const tags = (card.getAttribute("data-tags") || "").toLowerCase();
          if (filterValue === "all" || tags.includes(filterValue.toLowerCase())) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });

        if (scrollContainer) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        }
        setTimeout(updateActiveSlideState, 120);
      });
    });
  }

  // 6. Lightbox Modal
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDesc = document.getElementById("lightbox-desc");
  const lightboxMeta = document.getElementById("lightbox-meta");
  const lightboxBadge = document.getElementById("lightbox-badge");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxBackdrop = document.getElementById("lightbox-backdrop");

  function openLightbox(card) {
    if (!lightboxModal) return;
    const imgEl = card.querySelector("img");
    const titleEl = card.querySelector("h3");
    const descEl = card.querySelector("p");
    const metaEl = card.querySelector("[data-card-meta]");
    const badgeEl = card.querySelector("[data-card-badge]");

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || "";
    }
    if (lightboxTitle && titleEl) {
      lightboxTitle.textContent = titleEl.textContent.trim();
    }
    if (lightboxDesc && descEl) {
      lightboxDesc.textContent = descEl.textContent.trim();
    }
    if (lightboxMeta && metaEl) {
      lightboxMeta.textContent = metaEl.textContent.replace(/\s+/g, " ").trim();
    }
    if (lightboxBadge && badgeEl) {
      lightboxBadge.textContent = badgeEl.textContent.trim();
    }

    lightboxModal.classList.remove("hidden");
    lightboxModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add("hidden");
    lightboxModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  // 7. Render Native HTML5 Video Playlist & Mobile Fullscreen Controller
  function renderVideoPlaylist(videos) {
    const playlistEl = document.getElementById("video-playlist-container");
    const videoEl = document.getElementById("main-video-player");
    const fullscreenBtn = document.getElementById("btn-video-fullscreen");
    const badgeEl = document.getElementById("active-video-badge");
    const titleEl = document.getElementById("active-video-title");
    const locationEl = document.getElementById("active-video-location");
    const descEl = document.getElementById("active-video-desc");
    const videoSectionEl = document.getElementById("video-kegiatan");

    if (!playlistEl || !Array.isArray(videos) || videos.length === 0) return;

    let activeIdx = 0;

    // Tombol Fullscreen khusus (Mendukung Android Chrome, iOS Safari, & Desktop)
    if (fullscreenBtn && videoEl) {
      fullscreenBtn.addEventListener("click", function () {
        videoEl.play().catch(function () {});
        if (videoEl.requestFullscreen) {
          videoEl.requestFullscreen();
        } else if (videoEl.webkitEnterFullscreen) {
          // Khusus iOS Safari iPhone
          videoEl.webkitEnterFullscreen();
        } else if (videoEl.webkitRequestFullscreen) {
          videoEl.webkitRequestFullscreen();
        } else if (videoEl.msRequestFullscreen) {
          videoEl.msRequestFullscreen();
        }
      });
    }

    function selectVideo(idx, autoPlay) {
      const v = videos[idx];
      if (!v) return;
      activeIdx = idx;

      if (videoEl) {
        const targetSrc = v.videoUrl || "";
        if (v.thumbnail) {
          videoEl.setAttribute("poster", v.thumbnail);
        }
        if (videoEl.getAttribute("src") !== targetSrc) {
          videoEl.pause();
          videoEl.setAttribute("src", targetSrc);
          videoEl.load();
        }
        if (autoPlay) {
          videoEl.play().catch(function () {});
          if (window.innerWidth < 1024 && videoSectionEl) {
            videoSectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }

      if (badgeEl) badgeEl.textContent = v.badge || "Video " + (idx + 1);
      if (titleEl) titleEl.textContent = v.title || "";
      if (locationEl) {
        locationEl.innerHTML =
          '<span class="material-symbols-outlined text-[15px] text-primary">location_on</span>' +
          (v.location || "Desa Sumber Makmur");
      }
      if (descEl) descEl.textContent = v.description || "";
      if (ambientBg && v.thumbnail) {
        ambientBg.setAttribute("src", v.thumbnail);
      }

      // Update active card styles in playlist
      Array.from(playlistEl.children).forEach(function (card, cIdx) {
        const indicator = card.querySelector("[data-play-indicator]");
        if (cIdx === activeIdx) {
          card.className =
            "group cursor-pointer bg-white rounded-2xl border-2 border-primary p-2.5 sm:p-3 flex items-center gap-3 shadow-md transition-all";
          if (indicator) {
            indicator.className =
              "px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider shrink-0";
            indicator.textContent = "Sedang Aktif";
          }
        } else {
          card.className =
            "group cursor-pointer bg-white/95 hover:bg-white rounded-2xl border border-outline-variant/50 hover:border-primary/60 p-2.5 sm:p-3 flex items-center gap-3 shadow-sm transition-all";
          if (indicator) {
            indicator.className =
              "px-2 py-0.5 rounded bg-surface-container text-primary text-[10px] font-bold uppercase tracking-wider shrink-0";
            indicator.textContent = "Putar";
          }
        }
      });
    }

    playlistEl.innerHTML = "";
    videos.forEach(function (v, idx) {
      const item = document.createElement("div");
      item.innerHTML =
        '<div class="relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden bg-on-surface shrink-0 border border-outline-variant/30">' +
        '  <img loading="lazy" decoding="async" src="' +
        (v.thumbnail || "assets/images/pengecekan-sensor-lahan-jeruk.jpg") +
        '" alt="' +
        (v.title || "").replace(/"/g, "&quot;") +
        '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />' +
        '  <div class="absolute inset-0 bg-black/30 flex items-center justify-center">' +
        '    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-primary flex items-center justify-center shadow">' +
        '      <span class="material-symbols-outlined text-[18px] sm:text-[20px]">play_arrow</span>' +
        "    </span>" +
        "  </div>" +
        "</div>" +
        '<div class="min-w-0 flex-grow">' +
        '  <div class="flex items-center justify-between gap-1.5 mb-1">' +
        '    <span class="text-[11px] font-bold text-secondary truncate">' +
        (v.badge || "Video 0" + (idx + 1)) +
        "</span>" +
        '    <span data-play-indicator></span>' +
        "  </div>" +
        '  <h5 class="text-xs sm:text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">' +
        v.title +
        "  </h5>" +
        "</div>";

      item.addEventListener("click", function () {
        selectVideo(idx, true);
      });
      playlistEl.appendChild(item);
    });

    selectVideo(0, false);
  }

  // Initial Render Execution
  applyDynamicContent(siteData);
  renderMembersGrid(siteData);
  renderGalleryCarousel(siteData.gallery || []);
  renderVideoPlaylist(siteData.videos || []);
});
