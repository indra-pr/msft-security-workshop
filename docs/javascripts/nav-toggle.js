/*
 * Collapsible left navigation panel for Material for MkDocs.
 * Adds a header button that hides/shows the primary (left) sidebar so the
 * article can use the reclaimed width. State is remembered via localStorage.
 * The button (and collapse behaviour) applies on desktop widths only.
 */
(function () {
  "use strict";

  var KEY = "nav-collapsed";
  // Double-chevron icon; CSS rotates it 180deg when collapsed.
  var ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">' +
    '<path fill="currentColor" d="M18.41 7.41 17 6l-6 6 6 6 1.41-1.41L13.83 12zM12.41 7.41 11 6l-6 6 6 6 1.41-1.41L7.83 12z"/>' +
    "</svg>";

  function isCollapsed() {
    return localStorage.getItem(KEY) === "1";
  }

  function applyState() {
    document.body.classList.toggle("nav-collapsed", isCollapsed());
    var btn = document.getElementById("nav-collapse-btn");
    if (btn) {
      var collapsed = isCollapsed();
      btn.setAttribute("aria-pressed", collapsed ? "true" : "false");
      btn.title = collapsed ? "Expand navigation panel" : "Collapse navigation panel";
    }
  }

  function ensureButton() {
    if (document.getElementById("nav-collapse-btn")) return;
    var header = document.querySelector(".md-header__inner");
    if (!header) return;

    var btn = document.createElement("button");
    btn.id = "nav-collapse-btn";
    btn.type = "button";
    btn.className = "md-header__button md-icon nav-collapse-btn";
    btn.setAttribute("aria-label", "Toggle navigation panel");
    btn.innerHTML = ICON;
    btn.addEventListener("click", function () {
      localStorage.setItem(KEY, isCollapsed() ? "0" : "1");
      applyState();
    });

    // Place it just before the palette toggle / search in the header.
    var anchor =
      header.querySelector(".md-header__option") ||
      header.querySelector(".md-search") ||
      null;
    header.insertBefore(btn, anchor);
  }

  function init() {
    ensureButton();
    applyState();
  }

  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  // Re-run after Material's instant navigation swaps page content.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  }
})();
