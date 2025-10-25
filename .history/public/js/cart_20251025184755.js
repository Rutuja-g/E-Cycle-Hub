// Cart management module for displaying and modifying cart items

(function () {
  const CART_STORAGE_KEY = "ecycle_cart";

  // Use shared utils

  // Render empty cart message
  function renderEmptyCart(container) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    document.getElementById("total-price").textContent = Utils.formatPrice(0);
    document.getElementById("checkout-button").disabled = true;
  }

  // Render cart items
  function renderCart() {
    const container = document.getElementById("cart-items");
    const cart = getCart();
    container.innerHTML = "";
    if (!cart.length) {
      renderEmptyCart(container);
      return;
    }

    // Add Continue Shopping button
    const continueShoppingBtn = createElement("a", "btn btn-secondary");
    continueShoppingBtn.href = "shop.html";
    continueShoppingBtn.textContent = "Continue Shopping";
    continueShoppingBtn.style.marginBottom = "1rem";
    continueShoppingBtn.style.display = "inline-block";
    container.appendChild(continueShoppingBtn);

    cart.forEach((item) => {
      const itemRow = createElement("div", "cart-item");
      itemRow.dataset.id = item.id;

      const itemImage = createElement("img");
      itemImage.src = item.image || "img/placeholder.png";
      itemImage.alt = item.name || "Bike";

      const itemMeta = createElement("div", "item-meta");
      const itemTitle = createElement("h4");
      itemTitle.textContent = item.name || "Unnamed";
      const itemSubtext = createElement("p");
      itemSubtext.innerHTML = `$${formatPrice(
        item.price
      )} <span style="color:var(--muted)">× ${item.quantity}</span>`;
      itemMeta.appendChild(itemTitle);
      itemMeta.appendChild(itemSubtext);

      const quantityControls = createElement("div", "qty-controls");
      const decreaseBtn = createElement("button");
      decreaseBtn.type = "button";
      decreaseBtn.innerText = "−";
      decreaseBtn.title = "Decrease quantity";
      decreaseBtn.dataset.action = "decrease";
      const quantityDisplay = createElement("span");
      quantityDisplay.textContent = item.quantity;
      quantityDisplay.style.minWidth = "28px";
      quantityDisplay.style.textAlign = "center";
      const increaseBtn = createElement("button");
      increaseBtn.type = "button";
      increaseBtn.innerText = "+";
      increaseBtn.title = "Increase quantity";
      increaseBtn.dataset.action = "increase";

      const removeBtn = createElement("button", "remove-btn");
      removeBtn.type = "button";
      removeBtn.innerText = "Remove";
      removeBtn.dataset.action = "remove";

      quantityControls.appendChild(decreaseBtn);
      quantityControls.appendChild(quantityDisplay);
      quantityControls.appendChild(increaseBtn);

      itemRow.appendChild(itemImage);
      itemRow.appendChild(itemMeta);
      itemRow.appendChild(quantityControls);
      itemRow.appendChild(removeBtn);

      container.appendChild(itemRow);
    });

    updateTotal();
    document.getElementById("checkout-button").disabled = false;
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
    document.getElementById("total-price").textContent = formatPrice(total);
  }

  // Set up event listeners for cart interactions
  function setupEventListeners() {
    const container = document.getElementById("cart-items");

    container.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button) return;
      const action = button.dataset.action;
      const itemRow = button.closest(".cart-item");
      if (!itemRow) return;
      const itemId = itemRow.dataset.id;
      let cart = getCart();
      const itemIndex = findItemIndex(cart, itemId);
      if (itemIndex === -1) return;

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

      saveCart(cart);
      renderCart();
    });

    // Checkout button handler
    const checkoutBtn = document.getElementById("checkout-button");
    const clearBtn = document.getElementById("clear-button");

    checkoutBtn.addEventListener("click", function () {
      const cart = getCart();
      if (!cart.length) return;

      // Check login status
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        alert("Please log in to continue checkout.");
        localStorage.setItem("redirectAfterLogin", "cart.html");
        window.location.href = "login.html";
        return;
      }

      window.location.href = "checkout.html";
    });

    clearBtn.addEventListener("click", function () {
      localStorage.removeItem(CART_STORAGE_KEY);
      renderCart();
      const notification = document.getElementById("notify");
      notification.textContent = "Cart cleared";
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, 2000);
    });
  }

  // Initialize cart functionality
  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    setupEventListeners();
  });
})();
