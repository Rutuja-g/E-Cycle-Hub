w(
  // cart.js - Manages cart functionality

  function () {
    const CART_STORAGE_KEY = "ecycle_cart";
    const PRODUCTS_STORAGE_KEY = "products";

    // Use shared utils
    const {
      getCart,
      saveCart,
      formatPrice,
      createElement,
      findItemIndex,
      updateTotal,
      showToast,
    } = Utils;
    b;
    // Render empty cart message
    function renderEmptyCart(container) {
      const emptyDiv = document.getElementById("empty-cart");
      if (emptyDiv) {
        emptyDiv.style.display = "block";
      }
      // Hide cart summary when empty
      const cartSummary = document.querySelector(".cart-summary");
      if (cartSummary) {
        cartSummary.style.display = "none";
      }
      updateTotal();
      const checkoutBtn = document.getElementById("checkout-button");
      if (checkoutBtn) checkoutBtn.disabled = true;
    }

    // Render cart items
    function renderCart() {
      const container = document.getElementById("cart-items");
      if (!container) return;

      const cart = getCart();
      // Clear only cart items, not the empty div
      const emptyDiv = document.getElementById("empty-cart");
      if (emptyDiv) {
        emptyDiv.style.display = "none";
      }
      // Remove existing cart items
      const cartItems = container.querySelectorAll(".cart-item");
      cartItems.forEach((item) => item.remove());

      if (!cart.length) {
        renderEmptyCart(container);
        return;
      }

      cart.forEach((item) => {
        if (!item || !item.id || !item.name || typeof item.price !== "number") {
          console.warn("Invalid cart item:", item);
          return;
        }

        const itemRow = createElement("div", "cart-item");
        itemRow.dataset.id = item.id;

        const itemImage = createElement("img");
        itemImage.src = item.image || "img/placeholder.png";
        itemImage.alt = item.name || "Bike";

        const itemMeta = createElement("div", "item-meta");
        const itemTitle = createElement("h3");
        itemTitle.textContent = item.name;
        const itemPrice = createElement("p", "price");
        itemPrice.textContent = `$${formatPrice(item.price)}`;

        const quantityControls = createElement("div", "quantity-controls");
        const decreaseBtn = createElement("button", "btn-quantity");
        decreaseBtn.dataset.action = "decrease";
        decreaseBtn.textContent = "-";
        const quantitySpan = createElement("span", "quantity");
        quantitySpan.textContent = item.quantity || 1;
        const increaseBtn = createElement("button", "btn-quantity");
        increaseBtn.dataset.action = "increase";
        increaseBtn.textContent = "+";

        quantityControls.appendChild(decreaseBtn);
        quantityControls.appendChild(quantitySpan);
        quantityControls.appendChild(increaseBtn);

        const removeBtn = createElement("button", "btn-remove");
        removeBtn.dataset.action = "remove";
        removeBtn.textContent = "Remove";

        itemMeta.appendChild(itemTitle);
        itemMeta.appendChild(itemPrice);
        itemMeta.appendChild(quantityControls);
        itemMeta.appendChild(removeBtn);

        itemRow.appendChild(itemImage);
        itemRow.appendChild(itemMeta);
        container.appendChild(itemRow);
      });

      // Show cart summary when there are items
      const cartSummary = document.querySelector(".cart-summary");
      if (cartSummary) {
        cartSummary.style.display = "block";
      }

      updateTotal();
      const checkoutBtn = document.getElementById("checkout-button");
      if (checkoutBtn) checkoutBtn.disabled = false;
      updateTotal();
      const checkoutBtn = document.getElementById("checkout-button");
      if (checkoutBtn) checkoutBtn.disabled = false;
      updateTotal();
      const checkoutBtn = document.getElementById("checkout-button");
      if (checkoutBtn) checkoutBtn.disabled = false;
    }

    // Set up event listeners for cart interactions
    function setupEventListeners() {
      const container = document.getElementById("cart-items");
      if (!container) return;

      container.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;
        const action = button.dataset.action;
        const itemRow = button.closest(".cart-item");
        if (!itemRow) return;
        const itemId = itemRow.dataset.id;
        if (!itemId) return;

        let cart = getCart();
        const itemIndex = findItemIndex(cart, itemId);
        if (itemIndex === -1) {
          console.warn("Item not found in cart:", itemId);
          return;
        }

        if (action === "increase") {
          cart[itemIndex].quantity =
            (Number(cart[itemIndex].quantity) || 0) + 1;
        } else if (action === "decrease") {
          cart[itemIndex].quantity =
            (Number(cart[itemIndex].quantity) || 0) - 1;
          if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
          }
        } else if (action === "remove") {
          cart.splice(itemIndex, 1);
        } else {
          return;
        }

        saveCart(cart);
        renderCart();
      });

      // Checkout button handler
      const checkoutBtn = document.getElementById("checkout-button");
      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
          const cart = getCart();
          if (!cart.length) {
            showToast("Your cart is empty!", 3000);
            return;
          }

          // Check login status
          const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
          if (!isLoggedIn) {
            showToast("Please log in to continue checkout.", 3000);
            localStorage.setItem("redirectAfterLogin", "cart.html");
            window.location.href = "login.html";
            return;
          }

          window.location.href = "checkout.html";
        });
      }

      // Clear cart button handler
      const clearBtn = document.getElementById("clear-button");
      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          localStorage.removeItem("ecycle_cart");
          renderCart();
          showToast("Cart cleared!", 2000);
        });
      }
    }

    // Initialize cart functionality
    document.addEventListener("DOMContentLoaded", function () {
      renderCart();
      setupEventListeners();
    });
  }
)();
