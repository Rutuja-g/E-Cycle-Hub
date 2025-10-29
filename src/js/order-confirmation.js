(function () {
  const ORDERS_STORAGE_KEY = "orders";
  const CURRENT_USER_STORAGE_KEY = "ecycle_current_user";

  // Get current user
  function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Get orders from localStorage
  function getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse orders:", e);
      return [];
    }
  }

  // Format price
  function formatPrice(amount = 0) {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Format order ID
  function formatOrderId(id) {
    return `Order #E${String(id).padStart(3, "0")}`;
  }

  // Get the latest order for the current user
  function getLatestOrder() {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return null;
    }

    const orders = getOrders().filter(
      (order) => order.userEmail === user.email
    );
    if (orders.length === 0) {
      window.location.href = "shop.html";
      return null;
    }

    // Return the most recent order
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  // Render order details
  function renderOrderDetails(order) {
    // Update order info
    document.getElementById("order-id").textContent = formatOrderId(order.id);
    document.getElementById("order-date").textContent = new Date(
      order.date
    ).toLocaleDateString();
    document.getElementById("payment-method").textContent =
      order.payment === "cod" ? "Cash on Delivery" : "Credit/Debit Card";
    document.getElementById("total-amount").textContent = `$${formatPrice(
      order.total
    )}`;

    // Render products
    const productsContainer = document.getElementById("ordered-products");
    productsContainer.innerHTML = `
      <h3>Ordered Products</h3>
      <div class="products-list">
        ${order.items
          .map(
            (item) => `
          <div class="product-item">
            <div class="product-image">
              <img src="${item.image || "assets/images/logo.jpg"}" alt="${
              item.name
            }" />
            </div>
            <div class="product-info">
              <h4>${item.name}</h4>
              <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="product-price">
              $${formatPrice(item.price * item.quantity)}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Initialize page
  function init() {
    const order = getLatestOrder();
    if (!order) return;

    renderOrderDetails(order);

    // Add button event listeners
    document.querySelector(".track-order-btn").addEventListener("click", () => {
      const orderId = formatOrderId(order.id).replace("Order #", "");
      window.location.href = `track-order.html?orderId=${orderId}`;
    });

    document
      .querySelector(".continue-shopping-btn")
      .addEventListener("click", () => {
        window.location.href = "shop.html";
      });
  }

  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", init);
})();
