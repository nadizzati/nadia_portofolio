(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Header: border on scroll, mobile menu ---------- */
  var header = $(".site-header");
  var onScrollHeader = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  onScrollHeader();

  var menuBtn = $(".menu-btn");
  var nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });

  /* ---------- Portrait fallback if the photo is missing ---------- */
  var portrait = $("#portrait");
  var portraitImg = $("img", portrait);
  function checkPortrait() {
    if (portraitImg.complete && portraitImg.naturalWidth === 0) portrait.classList.add("no-photo");
  }
  portraitImg.addEventListener("error", function () { portrait.classList.add("no-photo"); });
  checkPortrait();

  /* ---------- Journey: progress line and reached nodes ---------- */
  var path = $("#path");
  var stops = $$(".stop", path);
  var ticking = false;
  function updatePath() {
    ticking = false;
    var rect = path.getBoundingClientRect();
    var mid = window.innerHeight * 0.55;
    var progress = (mid - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    path.style.setProperty("--progress", progress.toFixed(4));
    stops.forEach(function (stop) {
      var node = $(".node", stop).getBoundingClientRect();
      stop.classList.toggle("reached", node.top < mid);
    });
  }
  function requestUpdate() { if (!ticking) { ticking = true; window.requestAnimationFrame(updatePath); } }
  window.addEventListener("scroll", function () { onScrollHeader(); requestUpdate(); }, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updatePath();

  /* ---------- Projects: expand, filter, search, tag click ---------- */
  var projList = $("#project-list");
  var rows = $$(".project", projList);
  var catBtns = $$("[data-filter]");
  var searchInput = $("#project-search");
  var countEl = $("#project-count");
  var emptyEl = $("#project-empty");
  var toggleAllBtn = $("#toggle-all");
  var imageMap = window.PROJECT_IMAGES || {};
  var activeCat = "all";

  function setOpen(row, open) {
    row.classList.toggle("open", open);
    $(".project-head", row).setAttribute("aria-expanded", String(open));
  }
  function visibleRows() { return rows.filter(function (r) { return !r.classList.contains("is-hidden"); }); }
  function syncToggleAll() {
    var vis = visibleRows();
    var allOpen = vis.length > 0 && vis.every(function (r) { return r.classList.contains("open"); });
    toggleAllBtn.textContent = allOpen ? "Collapse all" : "Expand all";
    toggleAllBtn.disabled = vis.length === 0;
  }

  rows.forEach(function (row) {
    row.setAttribute("data-text", row.textContent.toLowerCase().replace(/\s+/g, " "));
    var shot = imageMap[row.getAttribute("data-id")];
    if (shot && shot.src) {
      var img = el("img", "project-shot");
      img.src = shot.src; img.alt = shot.alt || ""; img.loading = "lazy"; img.decoding = "async";
      var inner = $(".panel-inner", row);
      inner.insertBefore(img, $(".tags", inner));
    }
    $(".project-head", row).addEventListener("click", function () {
      setOpen(row, !row.classList.contains("open"));
      syncToggleAll();
    });
  });

  function applyFilters() {
    var q = searchInput.value.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (row) {
      var okCat = activeCat === "all" || row.getAttribute("data-cat").split(" ").indexOf(activeCat) !== -1;
      var okText = !q || row.getAttribute("data-text").indexOf(q) !== -1;
      var show = okCat && okText;
      row.classList.toggle("is-hidden", !show);
      if (show) shown++;
    });
    countEl.textContent = (shown === rows.length && !q)
      ? rows.length + " projects"
      : "Showing " + shown + " of " + rows.length + " projects";
    emptyEl.hidden = shown !== 0;
    syncToggleAll();
  }

  catBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeCat = btn.getAttribute("data-filter");
      catBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      applyFilters();
    });
  });
  searchInput.addEventListener("input", applyFilters);

  $$(".tag-btn").forEach(function (tag) {
    tag.addEventListener("click", function () {
      activeCat = "all";
      catBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === "all")); });
      searchInput.value = tag.getAttribute("data-tag");
      applyFilters();
      visibleRows().forEach(function (r) { setOpen(r, true); });
      syncToggleAll();
      projList.scrollIntoView({ block: "start" });
    });
  });

  toggleAllBtn.addEventListener("click", function () {
    var vis = visibleRows();
    var open = !vis.every(function (r) { return r.classList.contains("open"); });
    vis.forEach(function (r) { setOpen(r, open); });
    syncToggleAll();
  });
  $("#project-reset").addEventListener("click", function () {
    searchInput.value = "";
    activeCat = "all";
    catBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === "all")); });
    applyFilters();
    searchInput.focus();
  });

  setOpen(rows[0], true);
  applyFilters();

  /* ---------- Documents ---------- */
  var docs = window.DOCUMENTS || {};
  $$(".doc").forEach(function (a) {
    var url = docs[a.getAttribute("data-doc")];
    if (url) {
      a.setAttribute("href", url);
      if (/^https?:\/\//i.test(url)) {
        /* External link: browsers ignore "download" cross-site, so open it in a new tab instead. */
        a.removeAttribute("download");
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
        var state = $(".doc-state", a);
        state.textContent = state.textContent.replace(/^Download/, "Open");
      } else {
        a.setAttribute("download", url.split("/").pop());
      }
    } else {
      a.removeAttribute("href");
      a.removeAttribute("download");
      a.removeAttribute("target");
      a.setAttribute("aria-disabled", "true");
      $(".doc-state", a).textContent = "Link coming soon";
    }
  });

  /* ---------- Gallery + lightbox ---------- */
  var items = Array.isArray(window.GALLERY) ? window.GALLERY : [];
  var section = $("#moments");
  var momentsNav = $('[data-nav="moments"]');
  if (!items.length) {
    if (momentsNav) momentsNav.remove();
  } else {
    section.hidden = false;
    var list = $("#gallery");
    items.forEach(function (item, i) { list.appendChild(buildThumb(item, i)); });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function buildThumb(item, index) {
    var li = el("li");
    var btn = el("button", "shot");
    btn.type = "button";
    btn.setAttribute("aria-label", "Open " + (item.caption || item.alt || (item.type + " " + (index + 1))));
    if (item.type === "image") {
      var img = el("img");
      img.src = item.src; img.alt = item.alt || item.caption || ""; img.loading = "lazy"; img.decoding = "async";
      btn.appendChild(img);
    } else if (item.type === "video") {
      var v = el("video");
      v.src = item.src + "#t=0.5"; v.preload = "metadata"; v.muted = true; v.playsInline = true; v.setAttribute("aria-hidden", "true");
      btn.appendChild(v); btn.appendChild(el("span", "play"));
    } else if (item.type === "youtube") {
      var yt = el("img");
      yt.src = "https://i.ytimg.com/vi/" + encodeURIComponent(item.id) + "/hqdefault.jpg"; yt.alt = ""; yt.loading = "lazy";
      btn.appendChild(yt); btn.appendChild(el("span", "play"));
    } else {
      btn.appendChild(el("span", "shot-tile", "Watch video")); btn.appendChild(el("span", "play"));
    }
    if (item.caption) btn.appendChild(el("span", "shot-cap", item.caption));
    btn.addEventListener("click", function () { openLightbox(index); });
    li.appendChild(btn);
    return li;
  }

  var lb = $("#lightbox");
  var stage = $("#lb-stage");
  var cap = $("#lb-caption");
  var current = 0;
  var lastFocus = null;

  function render(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    stage.textContent = "";
    var node;
    if (item.type === "image") {
      node = el("img"); node.src = item.src; node.alt = item.alt || item.caption || "";
    } else if (item.type === "video") {
      node = el("video"); node.src = item.src; node.controls = true; node.playsInline = true; node.autoplay = true;
    } else if (item.type === "youtube") {
      node = el("iframe"); node.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(item.id) + "?rel=0";
      node.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen"; node.allowFullscreen = true; node.title = item.caption || "Video";
    } else {
      node = el("iframe"); node.src = "https://drive.google.com/file/d/" + encodeURIComponent(item.id) + "/preview";
      node.allow = "autoplay; fullscreen"; node.allowFullscreen = true; node.title = item.caption || "Video";
    }
    stage.appendChild(node);
    cap.textContent = item.caption || "";
    var single = items.length < 2;
    $("#lb-prev").hidden = single; $("#lb-next").hidden = single;
  }

  function openLightbox(i) {
    lastFocus = document.activeElement;
    render(i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  }
  function closeLightbox() { if (lb.open) lb.close(); }

  lb.addEventListener("close", function () { stage.textContent = ""; if (lastFocus) lastFocus.focus(); });
  $(".lb-close", lb).addEventListener("click", closeLightbox);
  $("#lb-prev").addEventListener("click", function () { render(current - 1); });
  $("#lb-next").addEventListener("click", function () { render(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" && items.length > 1) render(current - 1);
    if (e.key === "ArrowRight" && items.length > 1) render(current + 1);
  });
})();
