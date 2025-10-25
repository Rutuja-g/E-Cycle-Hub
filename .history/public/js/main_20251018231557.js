// ...existing code...
/*
  main.js
  - Loads product data (localStorage -> products.json -> fallback)
  - Renders product cards into .grid--featured or .grid--shop
  - Injects simple search / category / sort controls and updates results instantly
  - Keeps products in localStorage under key 'ecycle_products' so admin UI can reuse them
*/

(function () {
  const STORAGE_KEY = "ecycle_products";
  const DEFAULT_MAX_FEATURED = 6;
  let products = [];
  let filtered = [];

  // small debounce helper
  function debounce(fn, wait = 180) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // Load products: priority -> localStorage -> products.json -> fallback
  async function loadProducts() {
    const ls = localStorage.getItem(STORAGE_KEY);
    if (ls) {
      try {
        products = JSON.parse(ls);
        return products;
      } catch (e) {
        console.warn(
          "Failed to parse products from localStorage, ignoring.",
          e
        );
      }
    }

    // try fetch products.json (relative to this script location / same folder as index)
    try {
      const resp = await fetch("assets/data/products.json", {
        cache: "no-store",
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length) {
          products = data;
          saveProducts();
          return products;
        }
      } else {
        console.warn("Failed to fetch products.json: HTTP", resp.status);
      }
    } catch (e) {
      console.error("Error loading products.json:", e);
      // fetch failed — ignore and use fallback
    }

    // fallback mock data
    products = [
      {
        id: 1,
        name: "Urban Commuter",
        price: 1199,
        category: "Commuter",
        image: "img/bike1.jpg",
        description: "Lightweight e-bike optimized for city rides.",
      },
      {
        id: 2,
        name: "Trail Explorer",
        price: 1599,
        category: "Mountain",
        image: "img/bike2.jpg",
        description: "Robust suspension and long-range battery.",
      },
      {
        id: 3,
        name: "Folding City",
        price: 999,
        category: "Folding",
        image: "img/bike3.jpg",
        description: "Compact folding e-bike for easy storage.",
      },
      {
        id: 4,
        name: "Cargo Pro",
        price: 2099,
        category: "Cargo",
        image: "img/bike4.jpg",
        description: "High-capacity cargo e-bike for heavy loads.",
      },
      {
        id: 5,
        name: "Sport Racer",
        price: 1799,
        category: "Road",
        image: "img/bike5.jpg",
        description: "Fast and agile e-bike for sporty rides.",
      },
      {
        id: 6,
        name: "All-Terrain",
        price: 1449,
        category: "Hybrid",
        image: "img/bike6.jpg",
        description: "Versatile e-bike for mixed terrains.",
      },
    ];
    saveProducts();
    return products;
  }

  function saveProducts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn("Unable to save products to localStorage", e);
    }
  }

  // Build controls (search, category, sort) and insert before the grid if grid exists
  function buildControls(gridEl) {
    // avoid duplicating controls
    if (document.getElementById("products-controls")) return null;

    const wrapper = document.createElement("div");
    wrapper.id = "products-controls";
    wrapper.className = "products-controls container";
    wrapper.innerHTML = `
      <div class="controls-inner" style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin:1rem 0;">
        <input id="searchInput" type="search" placeholder="Search bikes by name..." aria-label="Search bikes" style="flex:1;min-width:180px;padding:0.55rem 0.75rem;border-radius:8px;border:1px solid rgba(15,23,42,0.06);">
        <select id="categorySelect" aria-label="Filter by category" style="padding:0.55rem 0.6rem;border-radius:8px;border:1px solid rgba(15,23,42,0.06);">
          <option value="all">All Categories</option>
        </select>
        <select id="sortSelect" aria-label="Sort by" style="padding:0.55rem 0.6rem;border-radius:8px;border:1px solid rgba(15,23,42,0.06);">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>
    `;

    // insert before grid
    gridEl.parentNode.insertBefore(wrapper, gridEl);
    return wrapper;
  }

  // Get unique categories from products
  function getCategories(list) {
    const set = new Set();
    list.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }

  // Render cards into the provided grid element
  function renderProducts(list, gridEl, limit = DEFAULT_MAX_FEATURED) {
    gridEl.innerHTML = "";
    const items = list.slice(0, limit);

    if (!items.length) {
      gridEl.innerHTML =
        '<p style="grid-column:1/-1;color:var(--muted)">No results found.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((p) => {
      const article = document.createElement("article");
      article.className = "card";
      article.innerHTML = `
        <img src="${escapeAttr(
          p.image || "img/placeholder.png"
        )}" alt="${escapeAttr(p.name)}" loading="lazy"/>
        <div class="card-body">
          <div style="min-width:0">
            <h3 class="card-title">${escapeHtml(p.name)}</h3>
            <p class="price">$${Number(p.price).toLocaleString()}</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <a class="btn ghost" href="product.html?id=${encodeURIComponent(
              p.id
            )}" aria-label="View details for ${escapeAttr(
        p.name
      )}">View Details</a>
          </div>
        </div>
      `;
      fragment.appendChild(article);
    });

    gridEl.appendChild(fragment);
  }

  // Simple escaping helpers
  function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }
  function escapeAttr(s = "") {
    return String(s).replace(/"/g, "&quot;");
  }

  // Apply filters based on control values
  function applyFilters(limit = DEFAULT_MAX_FEATURED) {
    const q = (document.getElementById("searchInput")?.value || "")
      .trim()
      .toLowerCase();
    const category = document.getElementById("categorySelect")?.value || "all";
    const sort = document.getElementById("sortSelect")?.value || "featured";

    filtered = products.filter((p) => {
      const matchesSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));
      const matchesCat = category === "all" || p.category === category;
      return matchesSearch && matchesCat;
    });

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // keep original order (maybe featured first)
    }

    const grid =
      document.querySelector(".grid--featured") ||
      document.querySelector(".grid--shop");
    if (grid) renderProducts(filtered, grid, limit);
  }

  // Initialize UI: build controls and wire events
  function initUI() {
    const grid =
      document.querySelector(".grid--featured") ||
      document.querySelector(".grid--shop");
    if (!grid) return;

    const isShop = grid.classList.contains("grid--shop");
    const limit = isShop ? Infinity : DEFAULT_MAX_FEATURED;

    const controls = buildControls(grid);
    // populate categories
    const catSelect = document.getElementById("categorySelect");
    if (catSelect) {
      // clear existing non 'all' options
      const cats = getCategories(products);
      cats.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        catSelect.appendChild(opt);
      });
    }

    // hook events
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    const debouncedApply = debounce((limit) => applyFilters(limit), 160);

    if (searchInput)
      searchInput.addEventListener("input", () => debouncedApply(limit));
    if (catSelect)
      catSelect.addEventListener("change", () => applyFilters(limit));
    if (sortSelect)
      sortSelect.addEventListener("change", () => applyFilters(limit));

    // initial render
    applyFilters(limit);
  }

  // Small UI helpers: nav toggle and footer year (keeps previous behavior)
  function uiHelpers() {
    const navToggle = document.getElementById("navToggle");
    const navList = document.querySelector(".nav-list");
    navToggle &&
      navToggle.addEventListener("click", function () {
        navList.classList.toggle("show");
      });

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // entry point
  document.addEventListener("DOMContentLoaded", async function () {
    uiHelpers();
    await loadProducts(); // populates products and saves to localStorage if needed
    initUI();
  });
})();
