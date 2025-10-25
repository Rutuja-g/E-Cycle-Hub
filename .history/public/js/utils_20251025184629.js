/*
  utils.js
  - Shared utility functions for cart management, formatting, UI helpers, and common utilities
*/

(function () {
  const CART_STORAGE_KEY = "ecycle_cart";

  // Debounce helper function
  function debounce(func, delay = 180) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Simple escaping helpers
  function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "<",
        ">": ">",
        '"': '"',
        "'": "&#39;",
      }[m];
    });
  }
  function escapeAttr(s = "") {
    return String(s).replace(/"/g, '"');
  }

  // Retrieve cart from localStorage with error handling
  function getCart() {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const cart = storedCart ? JSON.parse(storedCart) : [];
      if (!Array.isArray(cart)) {
        console.warn(
          "Invalid cart data in localStorage, resetting to empty array."
        );
        return [];
      }
      return cart;
    } catch (error) {
      console.error("Error retrieving cart from localStorage:", error);
      return [];
    }
  }

  // Save cart to localStorage with error handling
  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }

  // Format price with two decimal places
  function formatPrice(amount = 0) {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Create DOM element helper
  function createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  // Find item index in cart by ID
  function findItemIndex(cart, itemId) {
    return cart.findIndex((item) => String(item.id) === String(itemId));
  }

  // Update total price display
  function updateTotal() {
    const cart = getCart();
    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
      0
    );
    const totalEl = document.getElementById("total-price");
    if (totalEl) {
      totalEl.textContent = formatPrice(total);
    }
  }

  // Show toast notification
  function showToast(message, duration = 2000) {
    let notification = document.getElementById("notify");
    if (!notification) {
      notification = createElement("div", "notification");
      notification.id = "notify";
      document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, duration);
  }

  // Expose functions globally
  window.Utils = {
    debounce,
    escapeHtml,
    escapeAttr,
    getCart,
    saveCart,
    formatPrice,
    createElement,
    findItemIndex,
    updateTotal,
    showToast,
  };
})();
