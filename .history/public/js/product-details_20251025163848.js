/*
  product-details.js
  - Loads product by ID from URL query param
  - Populates image, name, price, description
  - "Add to Cart" button adds to localStorage 'ecycle_cart'
*/

(function () {
  const CART_KEY = "ecycle_cart";
  const STORAGE_KEY = "ecycle_products";

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to save cart", e);
    }
  }

  function getProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    if (!productId) {
      console.warn("No product ID provided in URL.");
      document.querySelector(".product-details").innerHTML =
        "<p>Product not found. Please check the URL.</p>";
      return;
    }

    const products = getProducts();
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
        alert("Added to cart!");
        window.location.href = "cart.html";
      });
  }

  document.addEventListener("DOMContentLoaded", loadProductDetails);
})();
