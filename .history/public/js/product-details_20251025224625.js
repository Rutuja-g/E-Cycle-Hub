/*
  product-details.js
  - Loads product by ID from URL query param
  - Populates image, name, price, description
  - "Add to Cart" button adds to localStorage 'ecycle_cart'
*/

(function () {
  const STORAGE_KEY = "ecycle_products";

  // Use shared utils
  const { getCart, saveCart, showToast } = Utils;

  // Load products from localStorage or fetch from JSON
  async function loadProducts() {
    try {
      // Try localStorage first
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error loading products:", error);
      // Fallback to empty array
      return [];
    }
  }

  async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    if (!productId) {
      console.warn("No product ID provided in URL.");
      document.querySelector(".product-details").innerHTML =
        "<p>Product not found. Please check the URL.</p>";
      return;
    }

    const products = await loadProducts();
    if (!Array.isArray(products) || products.length === 0) {
      console.error("No products available.");
      document.querySelector(".product-details").innerHTML =
        "<p>Products data is unavailable. Please try again later.</p>";
      return;
    }

    const product = products.find((p) => String(p.id) === String(productId));
    if (!product) {
      console.warn("Product with ID", productId, "not found.");
      document.querySelector(".product-details").innerHTML =
        "<p>Product not found.</p>";
      return;
    }

    // Validate product data
    if (!product.name || !product.price || !product.description) {
      console.error("Incomplete product data for ID", productId, product);
      document.querySelector(".product-details").innerHTML =
        "<p>Product data is incomplete. Please contact support.</p>";
      return;
    }

    // Populate the page
    const imgEl = document.getElementById("productImage");
    if (imgEl) {
      imgEl.src = product.image || "img/placeholder.png";
      imgEl.alt = product.name || "Product Image";
    }
    const nameEl = document.getElementById("productName");
    if (nameEl) nameEl.textContent = product.name;
    const priceEl = document.getElementById("productPrice");
    if (priceEl)
      priceEl.textContent = `$${Number(product.price).toLocaleString()}`;
    const descEl = document.getElementById("productDescription");
    if (descEl) descEl.textContent = product.description;

    // Add to cart functionality
    document
      .getElementById("addToCartButton")
      .addEventListener("click", function () {
        const cart = getCart();
        const existingIndex = cart.findIndex(
          (item) => String(item.id) === String(product.id)
        );
        if (existingIndex >= 0) {
          cart[existingIndex].quantity =
            (cart[existingIndex].quantity || 1) + 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }
        saveCart(cart);
        showToast("Added to cart!");
        window.location.href = "cart.html";
      });
  }

  document.addEventListener("DOMContentLoaded", loadProductDetails);
})();
