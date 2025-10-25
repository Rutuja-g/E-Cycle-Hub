// ...existing code...
/*
  cart.js
  - Reads cart from localStorage (key: 'ecycle_cart')
  - Renders list with quantity controls and remove
  - Updates totals live and persists changes
  - Checkout clears cart and shows success message
*/

(function () {
  const CART_KEY = "ecycle_cart";

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) {
        console.warn("Cart data is not an array, resetting to empty.");
        return [];
      }
      return cart;
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
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

  function formatPrice(n = 0) {
    return Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function elem(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }

  function renderEmpty(container) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    document.getElementById("total-price").textContent = formatPrice(0);
    document.getElementById("checkout-button").disabled = true;
  }

  function renderCart() {
    const container = document.getElementById("cart-items");
    const cart = getCart();
    container.innerHTML = "";
    if (!cart.length) {
      renderEmpty(container);
      return;
    }

    // Add Continue Shopping button at the top
    const continueBtn = elem("a", "btn btn-secondary");
    continueBtn.href = "shop.html";
    continueBtn.textContent = "Continue Shopping";
    continueBtn.style.marginBottom = "1rem";
    continueBtn.style.display = "inline-block";
    container.appendChild(continueBtn);

    cart.forEach((item) => {
      const row = elem("div", "cart-item");
      row.dataset.id = item.id;

      const img = elem("img");
      img.src = item.image || "img/placeholder.png";
      img.alt = item.name || "Bike";

      const meta = elem("div", "item-meta");
      const title = elem("h4");
      title.textContent = item.name || "Unnamed";
      const sub = elem("p");
      sub.innerHTML = `$${formatPrice(
        item.price
      )} <span style="color:var(--muted)">× ${item.quantity}</span>`;
      meta.appendChild(title);
      meta.appendChild(sub);

      const controls = elem("div", "qty-controls");
      const minus = elem("button");
      minus.type = "button";
      minus.innerText = "−";
      minus.title = "Decrease quantity";
      minus.dataset.action = "decrease";
      const qty = elem("span");
      qty.textContent = item.quantity;
      qty.style.minWidth = "28px";
      qty.style.textAlign = "center";
      const plus = elem("button");
      plus.type = "button";
      plus.innerText = "+";
      plus.title = "Increase quantity";
      plus.dataset.action = "increase";

      const remove = elem("button", "remove-btn");
      remove.type = "button";
      remove.innerText = "Remove";
      remove.dataset.action = "remove";

      controls.appendChild(minus);
      controls.appendChild(qty);
      controls.appendChild(plus);

      row.appendChild(img);
      row.appendChild(meta);
      row.appendChild(controls);
      row.appendChild(remove);

      container.appendChild(row);
    });

    updateTotal();
    document.getElementById("checkout-button").disabled = false;
  }

  function findIndex(cart, id) {
    return cart.findIndex((i) => String(i.id) === String(id));
  }

  function updateTotal() {
    const cart = getCart();
    const total = cart.reduce(
      (s, i) => s + Number(i.price) * Number(i.quantity || 1),
      0
    );
    document.getElementById("total-price").textContent = formatPrice(total);
  }

  // Event delegation for cart item actions
  function setupEvents() {
    const container = document.getElementById("cart-items");

    container.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.dataset.action;
      const row = btn.closest(".cart-item");
      if (!row) return;
      const id = row.dataset.id;
      let cart = getCart();
      const idx = findIndex(cart, id);
      if (idx === -1) return;

      if (action === "increase") {
        cart[idx].quantity = (Number(cart[idx].quantity) || 0) + 1;
      } else if (action === "decrease") {
        cart[idx].quantity = (Number(cart[idx].quantity) || 0) - 1;
        if (cart[idx].quantity <= 0) {
          cart.splice(idx, 1);
        }
      } else if (action === "remove") {
        cart.splice(idx, 1);
      } else {
        return;
      }

      saveCart(cart);
      renderCart();
    });

    // Checkout
    const checkoutBtn = document.getElementById("checkout-button");
    const clearBtn = document.getElementById("clear-button");
    const notify = document.getElementById("notify");

    checkoutBtn.addEventListener("click", function () {
      const cart = getCart();
      if (!cart.length) return;

      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        alert("Please log in to continue checkout.");
        // Store current page for redirect after login
        localStorage.setItem("redirectAfterLogin", "cart.html");
        window.location.href = "login.html";
        return;
      }

      // Redirect to checkout page
      window.location.href = "checkout.html";
    });

    clearBtn.addEventListener("click", function () {
      localStorage.removeItem(CART_KEY);
      renderCart();
      const n = document.getElementById("notify");
      n.textContent = "Cart cleared";
      n.style.display = "block";
      setTimeout(() => {
        n.style.display = "none";
      }, 2000);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // initialize helpers from main.js (nav + year) remain in main.js
    renderCart();
    setupEvents();
  });
})();
