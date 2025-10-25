/*
  product-details.js
  - Loads product by ID from URL query param
  - Populates image, name, price, description
  - "Add to Cart" button adds to localStorage 'ecycle_cart'
*/

(function () {
  // Use shared utils
  const { getCart, saveCart, showToast } = Utils;

  function getProducts() {
    try {
      const raw = localStorage.getItem("ecycle_products");
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
      const detailsEl = document.querySelector(".product-details");
      if (detailsEl) {
        detailsEl.innerHTML = "<p>Product not found. Please check the URL.</p>";
      }
      return;
    }

    const products = getProducts();
    if (!Array.isArray(products) || products.length === 0) {
      console.error("No products available.");
      const detailsEl = document.querySelector(".product-details");
      if (detailsEl) {
        detailsEl.innerHTML =
          "<p>Products data is unavailable. Please try again later.</p>";
      }
      return;
    }

    const product = products.find((p) => String(p.id) === String(productId));
    if (!product) {
      console.warn("Product with ID", productId, "not found.");
      const detailsEl = document.querySelector(".product-details");
      if (detailsEl) {
        detailsEl.innerHTML = "<p>Product not found.</p>";
      }
      return;
    }

    // Validate product data
    if (!product.name || !product.price || !product.description) {
      console.error("Incomplete product data for ID", productId, product);
      const detailsEl = document.querySelector(".product-details");
      if (detailsEl) {
        detailsEl.innerHTML =
          "<p>Product data is incomplete. Please contact support.</p>";
      }
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
    if (priceEl) {
      priceEl.textContent = `$${Number(product.price).toLocaleString()}`;
    }
    const descEl = document.getElementById("productDescription");
    if (descEl) descEl.textContent = product.description;

    // Add to cart functionality
    const addToCartBtn = document.getElementById("addToCartButton");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
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
        setTimeout(() => {
          window.location.href = "cart.html";
        }, 1000);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", loadProductDetails);
})();
