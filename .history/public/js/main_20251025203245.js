(function () {
  /*
  main.js
  - Loads product data (localStorage -> products.json -> fallback)
  - Renders product cards into .grid--featured or .grid--shop
  - Injects simple search / category / sort controls and updates results instantly
  - Keeps products in localStorage under key 'ecycle_products' so admin UI can reuse them
  */
  const PRODUCTS_STORAGE_KEY = "ecycle_products";
  const DEFAULT_MAX_FEATURED = 6;
  let products = [];
  let filteredProducts = [];

  // Load products from localStorage or fetch from JSON
  async function loadProducts() {
    try {
      // Try localStorage first
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          products = parsed;
          return;
        }
      }

      // Fetch from JSON file
      const response = await fetch("assets/data/products.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Products data is not an array");
      }
      products = data;
      // Save to localStorage
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Error loading products:", error);
      // Fallback to empty array
      products = [];
    }
  }

  // Get unique categories from products
  function getCategories(products) {
    const categories = new Set();
    products.forEach((product) => {
      if (product.category) categories.add(product.category);
    });
    return Array.from(categories).sort();
  }

  // Build search, category, and sort controls
  function buildControls(container) {
    if (!container) return;

    const controls = document.createElement("div");
    controls.className = "controls container";

    // Search input
    const searchDiv = document.createElement("div");
    searchDiv.className = "control-group";
    const searchLabel = document.createElement("label");
    searchLabel.textContent = "Search:";
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "searchInput";
    searchInput.placeholder = "Search for electric bicycles...";
    searchDiv.appendChild(searchLabel);
    searchDiv.appendChild(searchInput);

    // Category select
    const catDiv = document.createElement("div");
    catDiv.className = "control-group";
    const catLabel = document.createElement("label");
    catLabel.textContent = "Category:";
    const catSelect = document.createElement("select");
    catSelect.id = "categorySelect";
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All Categories";
    catSelect.appendChild(allOpt);
    catDiv.appendChild(catLabel);
    catDiv.appendChild(catSelect);

    // Sort select
    const sortDiv = document.createElement("div");
    sortDiv.className = "control-group";
    const sortLabel = document.createElement("label");
    sortLabel.textContent = "Sort by:";
    const sortSelect = document.createElement("select");
    sortSelect.id = "sortSelect";
    const options = [
      { value: "", text: "Default" },
      { value: "price-asc", text: "Price Low to High" },
      { value: "price-desc", text: "Price High to Low" },
      { value: "popularity", text: "Popularity" },
    ];
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      sortSelect.appendChild(option);
    });
    sortDiv.appendChild(sortLabel);
    sortDiv.appendChild(sortSelect);

    controls.appendChild(searchDiv);
    controls.appendChild(catDiv);
    controls.appendChild(sortDiv);

    container.parentNode.insertBefore(controls, container);
  }

  // Render product cards
  function renderProducts(productsToRender, container, limit = Infinity) {
    if (!container) return;

    container.innerHTML = "";
    if (!Array.isArray(productsToRender) || productsToRender.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    const toRender =
      limit === Infinity ? productsToRender : productsToRender.slice(0, limit);
    toRender.forEach((product) => {
      if (!product.name || !product.price) {
        console.warn("Skipping invalid product:", product);
        return;
      }

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image || "img/placeholder.png"}" alt="${
        product.name
      }" loading="lazy">
        <h3>${product.name}</h3>
        <p class="price">$${Utils.formatPrice(product.price)}</p>
        <a href="product.html?id=${
          product.id
        }" class="btn btn-primary">View Details</a>
      `;
      container.appendChild(card);
    });
  }

  // Apply filters and sorting
  function applyFilters(limit) {
    if (!Array.isArray(products)) return;

    const searchInput = document.getElementById("searchInput");
    const catSelect = document.getElementById("categorySelect");
    const sortSelect = document.getElementById("sortSelect");

    let filtered = [...products];

    // Search filter
    if (searchInput && searchInput.value.trim()) {
      const query = searchInput.value.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (catSelect && catSelect.value !== "all") {
      filtered = filtered.filter(
        (product) => product.category === catSelect.value
      );
    }

    // Sort
    if (sortSelect) {
      switch (sortSelect.value) {
        case "price-low":
          filtered.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "price-high":
          filtered.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "name":
        default:
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    filteredProducts = filtered;
    const grid =
      document.querySelector(".grid--featured") ||
      document.querySelector(".grid--shop") ||
      document.querySelector(".product-list");
    if (grid) renderProducts(filteredProducts, grid, limit);
  }

  // Initialize UI: build controls and wire events
  function initUI() {
    const grid =
      document.querySelector(".grid--featured") ||
      document.querySelector(".grid--shop") ||
      document.querySelector(".product-list");
    if (!grid) return;

    const isShop =
      grid.classList.contains("grid--shop") ||
      grid.classList.contains("product-list");
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

    const debouncedApply = Utils.debounce((limit) => applyFilters(limit), 160);

    if (searchInput)
      searchInput.addEventListener("input", () => debouncedApply(limit));
    if (catSelect)
      catSelect.addEventListener("change", () => applyFilters(limit));
    if (sortSelect)
      sortSelect.addEventListener("change", () => applyFilters(limit));

    // initial render
    applyFilters(limit);
  }

  // Active nav link helper
  function setActiveNavLink() {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Mobile nav toggle
  function initMobileNav() {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove("active");
        }
      });
    }
  }

  // Hide navbar on scroll down, show on scroll up (only on index and shop pages)
  function initScrollNavbar() {
    const currentPath = window.location.pathname;
    const isIndexOrShop =
      currentPath.includes("index.html") || currentPath.includes("shop.html");

    if (!isIndexOrShop) return;

    const checkAndInit = () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) {
        // If navbar not loaded yet, wait and try again
        setTimeout(checkAndInit, 100);
        return;
      }

      let lastScrollY = window.scrollY;
      const scrollThreshold = 100; // Minimum scroll distance before hiding

      const handleScroll = Utils.debounce(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY + scrollThreshold) {
          navbar.classList.add("hidden");
        } else if (currentScrollY < lastScrollY - scrollThreshold) {
          navbar.classList.remove("hidden");
        }
        lastScrollY = currentScrollY;
      }, 100);

      window.addEventListener("scroll", handleScroll);
    };

    checkAndInit();
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
    setActiveNavLink();
    initMobileNav();
    initScrollNavbar(); // Initialize scroll-based navbar hiding
    await loadProducts(); // populates products and saves to localStorage if needed
    initUI();
  });
})();
