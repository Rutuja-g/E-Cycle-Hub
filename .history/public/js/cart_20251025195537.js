// Cart management module for displaying and modifying cart items

(function () {
  // Render empty cart message
  function renderEmptyCart(container) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    Utils.updateTotal();
    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) checkoutBtn.disabled = true;
  }

  // Render cart items
  function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = Utils.getCart();
    container.innerHTML = "";
    if (!cart.length) {
      renderEmptyCart(container);
      return;
    }

    // Add Continue Shopping button
    const continueShoppingBtn = Utils.createElement("a", "btn btn-secondary");
    continueShoppingBtn.href = "shop.html";
    continueShoppingBtn.textContent = "Continue Shopping";
    continueShoppingBtn.style.marginBottom = "1rem";
    continueShoppingBtn.style.display = "inline-block";
    container.appendChild(continueShoppingBtn);

    cart.forEach((item) => {
      if (!item.id || !item.name || !item.price) {
        console.warn("Skipping invalid cart item:", item);
        return;
      }

      const itemRow = Utils.createElement("div", "cart-item");
      itemRow.dataset.id = item.id;

      const itemImage = Utils.createElement("img");
      itemImage.src = item.image || "img/placeholder.png";
      itemImage.alt = item.name || "Bike";

      const itemMeta = Utils.createElement("div", "item-meta");
      const itemTitle = Utils.createElement("h3");
      itemTitle.textContent = item.name;
      const itemPrice = Utils.createElement("p", "price");
      itemPrice.textContent = `$${Utils.formatPrice(item.price)}`;

      itemMeta.appendChild(itemTitle);
      itemMeta.appendChild(itemPrice);

      const quantityControls = Utils.createElement("div", "quantity-controls");
      const decreaseBtn = Utils.createElement("button", "btn-quantity");
      decreaseBtn.dataset.action = "decrease";
      decreaseBtn.textContent = "-";
      const quantitySpan = Utils.createElement("span", "quantity");
      quantitySpan.textContent = item.quantity || 1;
      const increaseBtn = Utils.createElement("button", "btn-quantity");
      increaseBtn.dataset.action = "increase";
      increaseBtn.textContent = "+";

      quantityControls.appendChild(decreaseBtn);
      quantityControls.appendChild(quantitySpan);
      quantityControls.appendChild(increaseBtn);

      const removeBtn = Utils.createElement("button", "btn-remove");
      removeBtn.dataset.action = "remove";
      removeBtn.textContent = "Remove";

      itemRow.appendChild(itemImage);
      itemRow.appendChild(itemMeta);
      itemRow.appendChild(quantityControls);
      itemRow.appendChild(removeBtn);

      container.appendChild(itemRow);
    });

    Utils.updateTotal();
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
      if (!action) return;

      const itemRow = button.closest(".cart-item");
      if (!itemRow) return;
      const itemId = itemRow.dataset.id;
      if (!itemId) return;

      let cart = Utils.getCart();
      const itemIndex = Utils.findItemIndex(cart, itemId);
      if (itemIndex === -1) {
        console.warn("Item not found in cart:", itemId);
        return;
      }

      if (action === "increase") {
        cart[itemIndex].quantity = (Number(cart[itemIndex].quantity) || 0) + 1;
      } else if (action === "decrease") {
        cart[itemIndex].quantity = (Number(cart[itemIndex].quantity) || 0) - 1;
        if (cart[itemIndex].quantity <= 0) {
          cart.splice(itemIndex, 1);
        }
      } else if (action === "remove") {
        cart.splice(itemIndex, 1);
      } else {
        return;
      }

      Utils.saveCart(cart);
      renderCart();
    });

    // Checkout button handler
    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        const cart = Utils.getCart();
        if (!cart.length) {
          Utils.showToast(
            "Your cart is empty. Add some items before checking out."
          );
          return;
        }

        // Check login status
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
          Utils.showToast("Please log in to continue checkout.");
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
        if (confirm("Are you sure you want to clear your cart?")) {
          localStorage.removeItem("ecycle_cart");
          renderCart();
          Utils.showToast("Cart cleared successfully.");
        }
      });
    }
  }

  // Initialize cart functionality
  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    setupEventListeners();
  });
})();
