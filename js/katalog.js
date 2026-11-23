/**
 * ============================================================================
 * KATALOG PRODUK & KERANJANG BELANJA - KELOMPOK TANI MEKAR JAYA (KTMJ)
 * ============================================================================
 * - Merender katalog produk dari `products` di `js/data.js`
 * - Keranjang belanja tersimpan di perangkat pengunjung (localStorage)
 * - Checkout mengirim rincian pesanan ke WhatsApp Pak Pur (+62 812-5670-5184)
 *   Pembayaran & transaksi selanjutnya dilakukan langsung di WhatsApp.
 */

(function () {
  "use strict";

  const CART_KEY = "ktmj_cart_v1";
  const BUYER_KEY = "ktmj_buyer_v1";

  const data = window.KT_MEKAR_JAYA_DATA || window.KT_MEKAR_JAYA_DEFAULT_DATA || {};
  const products = Array.isArray(data.products) ? data.products : [];
  const shop = Object.assign(
    {
      whatsappNumber: "6281256705184",
      whatsappDisplay: "+62 812-5670-5184",
      contactName: "Pak Pur"
    },
    data.shop || {}
  );

  const productMap = {};
  products.forEach(function (p) {
    productMap[p.id] = p;
  });

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  const $ = function (id) {
    return document.getElementById(id);
  };

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function rupiah(n) {
    return "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
  }

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage penuh / mode privat — abaikan */
    }
  }

  const STOCK_LABEL = {
    tersedia: { text: "Tersedia", cls: "bg-white/90 text-primary border-primary/20" },
    terbatas: { text: "Stok Terbatas", cls: "bg-secondary-fixed/95 text-on-secondary-container border-secondary/30" },
    habis: { text: "Stok Habis", cls: "bg-error-container text-on-error-container border-error/20" }
  };

  // --------------------------------------------------------------------------
  // Cart State
  // --------------------------------------------------------------------------
  let cart = readStore(CART_KEY, {});
  // Bersihkan item yang sudah tidak ada / habis
  Object.keys(cart).forEach(function (id) {
    const p = productMap[id];
    if (!p || p.stock === "habis" || !(cart[id] > 0)) delete cart[id];
  });

  function saveCart() {
    writeStore(CART_KEY, cart);
  }

  function getQty(id) {
    return cart[id] || 0;
  }

  function setQty(id, qty) {
    const p = productMap[id];
    if (!p) return;
    qty = Math.max(0, Math.min(99, Math.round(qty)));
    if (qty === 0) delete cart[id];
    else cart[id] = qty;
    saveCart();
    renderAll();
  }

  function cartSummary() {
    let count = 0;
    let total = 0;
    Object.keys(cart).forEach(function (id) {
      const p = productMap[id];
      if (!p) return;
      count += cart[id];
      total += cart[id] * (Number(p.price) || 0);
    });
    return { count: count, total: total };
  }

  // --------------------------------------------------------------------------
  // Catalog Rendering
  // --------------------------------------------------------------------------
  let activeCategory = "Semua";

  function renderFilters() {
    const wrap = $("katalog-filters");
    if (!wrap) return;
    const cats = ["Semua"];
    products.forEach(function (p) {
      if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    if (cats.length <= 2) {
      wrap.classList.add("hidden");
      return;
    }
    wrap.innerHTML = cats
      .map(function (c) {
        const active = c === activeCategory;
        return (
          '<button type="button" role="tab" aria-selected="' + active + '" data-cat="' + escapeHtml(c) + '" class="px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors ' +
          (active
            ? "bg-primary text-white border-primary shadow-sm"
            : "bg-white text-on-surface-variant border-outline-variant/70 hover:border-primary hover:text-primary") +
          '">' + escapeHtml(c) + "</button>"
        );
      })
      .join("");
  }

  function productControls(p) {
    if (p.stock === "habis") {
      return '<button type="button" disabled class="w-full inline-flex items-center justify-center gap-1.5 bg-surface-container text-outline text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl cursor-not-allowed">Stok Habis</button>';
    }
    const qty = getQty(p.id);
    if (qty > 0) {
      return (
        '<div class="flex items-center justify-between gap-1 bg-primary/10 border border-primary/25 rounded-xl p-1">' +
        '<button type="button" data-action="dec" data-id="' + escapeHtml(p.id) + '" aria-label="Kurangi ' + escapeHtml(p.name) + '" class="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white text-primary shadow-sm hover:bg-surface-container-low"><span class="material-symbols-outlined text-[20px]">remove</span></button>' +
        '<span class="text-sm font-extrabold text-primary tabular-nums" aria-live="polite">' + qty + "</span>" +
        '<button type="button" data-action="inc" data-id="' + escapeHtml(p.id) + '" aria-label="Tambah ' + escapeHtml(p.name) + '" class="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-primary-container"><span class="material-symbols-outlined text-[20px]">add</span></button>' +
        "</div>"
      );
    }
    return (
      '<button type="button" data-action="add" data-id="' + escapeHtml(p.id) + '" class="w-full inline-flex items-center justify-center gap-1.5 bg-primary text-white text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm">' +
      '<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span><span>Keranjang</span></button>'
    );
  }

  function renderCatalog() {
    const grid = $("katalog-grid");
    if (!grid) return;

    const list = products.filter(function (p) {
      return activeCategory === "Semua" || p.category === activeCategory;
    });

    grid.innerHTML = list
      .map(function (p) {
        const stock = STOCK_LABEL[p.stock] || STOCK_LABEL.tersedia;
        return (
          '<article class="group flex flex-col bg-white rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden">' +
          '<div class="relative aspect-square bg-surface-container-low overflow-hidden">' +
          '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" decoding="async" data-product-img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />' +
          (p.badge
            ? '<span class="absolute top-2 left-2 bg-secondary-container text-on-secondary-fixed text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow">' + escapeHtml(p.badge) + "</span>"
            : "") +
          '<span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-sm ' + stock.cls + '">' + stock.text + "</span>" +
          "</div>" +
          '<div class="flex flex-col flex-1 p-3 sm:p-3.5">' +
          '<span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">' + escapeHtml(p.category || "") + "</span>" +
          '<h3 class="text-sm sm:text-base font-extrabold text-on-surface leading-snug mt-0.5">' + escapeHtml(p.name) + "</h3>" +
          '<p class="hidden sm:block text-xs text-on-surface-variant leading-relaxed mt-1 line-clamp-3">' + escapeHtml(p.description || "") + "</p>" +
          '<div class="mt-auto pt-2.5">' +
          '<div class="flex items-baseline flex-wrap gap-x-1 mb-2.5">' +
          '<span class="text-base sm:text-lg font-extrabold text-primary">' + rupiah(p.price) + "</span>" +
          '<span class="text-[11px] sm:text-xs font-semibold text-on-surface-variant">/ ' + escapeHtml(p.unit || "") + "</span>" +
          "</div>" +
          productControls(p) +
          "</div></div></article>"
        );
      })
      .join("");

    // Fallback jika foto produk belum tersedia
    grid.querySelectorAll("img[data-product-img]").forEach(function (img) {
      img.addEventListener(
        "error",
        function () {
          const ph = document.createElement("div");
          ph.className = "w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary/10 to-primary/5 text-primary";
          ph.innerHTML = '<span class="material-symbols-outlined text-[44px]">eco</span><span class="text-[11px] font-bold text-on-surface-variant">Foto segera hadir</span>';
          img.replaceWith(ph);
        },
        { once: true }
      );
    });
  }

  // --------------------------------------------------------------------------
  // Cart Drawer Rendering
  // --------------------------------------------------------------------------
  function renderCart() {
    const ids = Object.keys(cart).filter(function (id) {
      return productMap[id];
    });
    const sum = cartSummary();
    const isEmpty = ids.length === 0;

    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = sum.count;
    });

    const fab = $("cart-fab");
    const drawerOpen = $("cart-drawer") && !$("cart-drawer").classList.contains("hidden");
    if (fab) {
      fab.classList.toggle("hidden", isEmpty || drawerOpen);
      fab.classList.toggle("inline-flex", !isEmpty && !drawerOpen);
    }
    if ($("cart-fab-total")) $("cart-fab-total").textContent = rupiah(sum.total);

    if ($("cart-empty")) $("cart-empty").classList.toggle("hidden", !isEmpty);
    if ($("cart-form")) $("cart-form").classList.toggle("hidden", isEmpty);
    if ($("cart-footer")) $("cart-footer").classList.toggle("hidden", isEmpty);
    if ($("cart-total")) $("cart-total").textContent = rupiah(sum.total);
    if ($("cart-total-qty")) $("cart-total-qty").textContent = sum.count;

    const listEl = $("cart-items");
    if (!listEl) return;
    listEl.innerHTML = ids
      .map(function (id) {
        const p = productMap[id];
        const qty = cart[id];
        return (
          '<li class="flex gap-3 py-3.5">' +
          '<div class="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 shrink-0 flex items-center justify-center">' +
          '<img src="' + escapeHtml(p.image) + '" alt="" class="w-full h-full object-cover" onerror="this.outerHTML=\'<span class=&quot;material-symbols-outlined text-primary text-[28px]&quot;>eco</span>\'" />' +
          "</div>" +
          '<div class="flex-1 min-w-0">' +
          '<div class="flex items-start justify-between gap-2">' +
          '<div class="min-w-0"><p class="text-sm font-bold text-on-surface leading-snug">' + escapeHtml(p.name) + "</p>" +
          '<p class="text-xs text-on-surface-variant">' + rupiah(p.price) + " / " + escapeHtml(p.unit || "") + "</p></div>" +
          '<button type="button" data-action="remove" data-id="' + escapeHtml(id) + '" aria-label="Hapus ' + escapeHtml(p.name) + '" class="w-8 h-8 inline-flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/60 transition-colors shrink-0"><span class="material-symbols-outlined text-[19px]">delete</span></button>' +
          "</div>" +
          '<div class="flex items-center justify-between gap-2 mt-2">' +
          '<div class="inline-flex items-center gap-1 bg-surface-container-low border border-outline-variant/50 rounded-lg p-0.5">' +
          '<button type="button" data-action="dec" data-id="' + escapeHtml(id) + '" aria-label="Kurangi" class="w-8 h-8 inline-flex items-center justify-center rounded-md bg-white text-primary shadow-sm"><span class="material-symbols-outlined text-[18px]">remove</span></button>' +
          '<span class="min-w-[28px] text-center text-sm font-extrabold text-on-surface tabular-nums">' + qty + "</span>" +
          '<button type="button" data-action="inc" data-id="' + escapeHtml(id) + '" aria-label="Tambah" class="w-8 h-8 inline-flex items-center justify-center rounded-md bg-primary text-white shadow-sm"><span class="material-symbols-outlined text-[18px]">add</span></button>' +
          "</div>" +
          '<span class="text-sm font-extrabold text-primary">' + rupiah(qty * (Number(p.price) || 0)) + "</span>" +
          "</div></div></li>"
        );
      })
      .join("");
  }

  function renderAll() {
    renderFilters();
    renderCatalog();
    renderCart();
  }

  // --------------------------------------------------------------------------
  // Drawer Open / Close
  // --------------------------------------------------------------------------
  function openCart() {
    const drawer = $("cart-drawer");
    if (!drawer) return;
    drawer.classList.remove("hidden");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      $("cart-backdrop").classList.remove("opacity-0");
      $("cart-panel").classList.remove("translate-x-full");
    });
    renderCart();
  }

  function closeCart() {
    const drawer = $("cart-drawer");
    if (!drawer || drawer.classList.contains("hidden")) return;
    $("cart-backdrop").classList.add("opacity-0");
    $("cart-panel").classList.add("translate-x-full");
    setTimeout(function () {
      drawer.classList.add("hidden");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      renderCart();
    }, 280);
  }

  // --------------------------------------------------------------------------
  // Toast
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(text) {
    const toast = $("cart-toast");
    if (!toast) return;
    $("cart-toast-text").textContent = text;
    toast.classList.remove("opacity-0", "translate-y-3");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.add("opacity-0", "translate-y-3");
    }, 1800);
  }

  // --------------------------------------------------------------------------
  // Buyer Form & WhatsApp Checkout
  // --------------------------------------------------------------------------
  function getDelivery() {
    const checked = document.querySelector('#cart-form input[name="delivery"]:checked');
    return checked ? checked.value : "Diantar ke alamat";
  }

  function syncAddressVisibility() {
    const wrap = $("cart-address-wrap");
    if (wrap) wrap.classList.toggle("hidden", getDelivery().indexOf("Diantar") !== 0);
  }

  function restoreBuyer() {
    const b = readStore(BUYER_KEY, {});
    if (b.name && $("cart-name")) $("cart-name").value = b.name;
    if (b.address && $("cart-address")) $("cart-address").value = b.address;
    if (b.delivery) {
      const radio = document.querySelector('#cart-form input[name="delivery"][value="' + b.delivery + '"]');
      if (radio) radio.checked = true;
    }
    syncAddressVisibility();
  }

  function showFormError(msg, focusEl) {
    const err = $("cart-form-error");
    if (err) {
      err.textContent = msg;
      err.classList.remove("hidden");
    }
    if (focusEl) {
      focusEl.focus();
      focusEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function checkout() {
    const ids = Object.keys(cart).filter(function (id) {
      return productMap[id];
    });
    if (!ids.length) return;

    const nameEl = $("cart-name");
    const addrEl = $("cart-address");
    const noteEl = $("cart-note");
    const name = (nameEl.value || "").trim();
    const delivery = getDelivery();
    const isDelivery = delivery.indexOf("Diantar") === 0;
    const address = (addrEl.value || "").trim();
    const note = (noteEl.value || "").trim();

    if (!name) return showFormError("Mohon isi nama lengkap Anda.", nameEl);
    if (isDelivery && !address) return showFormError("Mohon isi alamat pengiriman.", addrEl);
    $("cart-form-error").classList.add("hidden");

    writeStore(BUYER_KEY, { name: name, address: address, delivery: delivery });

    const sum = cartSummary();
    const lines = [];
    lines.push("Halo " + shop.contactName + ", saya ingin memesan hasil tani *Kelompok Tani Mekar Jaya* melalui website:");
    lines.push("");
    lines.push("*Daftar Pesanan:*");
    ids.forEach(function (id, i) {
      const p = productMap[id];
      const qty = cart[id];
      lines.push(
        i + 1 + ". " + p.name + " — " + qty + " × " + p.unit + " @ " + rupiah(p.price) + " = " + rupiah(qty * (Number(p.price) || 0))
      );
    });
    lines.push("");
    lines.push("*Estimasi Total:* " + rupiah(sum.total) + " (belum termasuk ongkir)");
    lines.push("");
    lines.push("*Data Pemesan:*");
    lines.push("Nama: " + name);
    lines.push("Pengambilan: " + delivery);
    if (isDelivery) lines.push("Alamat: " + address);
    if (note) lines.push("Catatan: " + note);
    lines.push("");
    lines.push("Mohon konfirmasi ketersediaan stok, total akhir, dan cara pembayarannya. Terima kasih 🙏");

    const waNumber = String(shop.whatsappNumber).replace(/[^0-9]/g, "");
    const url = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(lines.join("\n"));

    const win = window.open(url, "_blank");
    if (win) {
      try {
        win.opener = null;
      } catch (e) {
        /* abaikan */
      }
    } else {
      window.location.href = url;
    }
  }

  // --------------------------------------------------------------------------
  // Event Binding
  // --------------------------------------------------------------------------
  function handleAction(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const p = productMap[id];
    if (!p) return;
    const action = btn.getAttribute("data-action");
    const step = Number(p.step) || 1;

    if (action === "add") {
      setQty(id, getQty(id) + step);
      showToast(p.name + " ditambahkan ke keranjang");
    } else if (action === "inc") {
      setQty(id, getQty(id) + step);
    } else if (action === "dec") {
      setQty(id, getQty(id) - step);
    } else if (action === "remove") {
      setQty(id, 0);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!$("katalog-grid")) return;

    if (shop.priceNote && $("katalog-price-note")) {
      const span = $("katalog-price-note").querySelector("span:last-child");
      if (span) span.textContent = shop.priceNote;
    }

    renderAll();
    restoreBuyer();

    $("katalog-grid").addEventListener("click", handleAction);
    $("cart-items").addEventListener("click", handleAction);

    $("katalog-filters").addEventListener("click", function (e) {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      activeCategory = b.getAttribute("data-cat");
      renderFilters();
      renderCatalog();
    });

    document.querySelectorAll("[data-cart-open]").forEach(function (el) {
      el.addEventListener("click", openCart);
    });
    document.querySelectorAll("[data-cart-close]").forEach(function (el) {
      el.addEventListener("click", closeCart);
    });
    $("cart-close").addEventListener("click", closeCart);
    $("cart-backdrop").addEventListener("click", closeCart);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCart();
    });

    document.querySelectorAll('#cart-form input[name="delivery"]').forEach(function (r) {
      r.addEventListener("change", syncAddressVisibility);
    });

    $("cart-checkout").addEventListener("click", checkout);
    $("cart-clear").addEventListener("click", function () {
      if (window.confirm("Kosongkan semua isi keranjang?")) {
        cart = {};
        saveCart();
        renderAll();
      }
    });

    // Sinkronisasi antar tab
    window.addEventListener("storage", function (e) {
      if (e.key === CART_KEY) {
        cart = readStore(CART_KEY, {});
        renderAll();
      }
    });
  });
})();
