(function () {
  const ORDERS_KEY = "orders";

  function getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const orders = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(orders)) {
        console.warn("Orders data is not an array, resetting to empty.");
        return [];
      }
      return orders;
    } catch (e) {
      console.error("Failed to parse orders from localStorage:", e);
      return [];
    }
  }

  function saveOrders(orders) {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn("Failed to save orders", e);
    }
  }

  function getCurrentUser() {
    const user = localStorage.getItem("ecycle_current_user");
    return user ? JSON.parse(user) : null;
  }

  function formatPrice(n = 0) {
    return Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function renderOrders() {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const orders = getOrders().filter(
      (order) => order.userEmail === user.email
    );
    const ordersList = document.getElementById("orders-list");
    const noOrders = document.getElementById("no-orders");

    ordersList.innerHTML = "";

    if (orders.length === 0) {
      noOrders.style.display = "block";
      return;
    }

    noOrders.style.display = "none";

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orders.forEach((order) => {
      const orderDiv = document.createElement("div");
      orderDiv.className = "order-item";
      orderDiv.innerHTML = `
        <h3>Order #${order.id}</h3>
        <p><strong>Date:</strong> ${new Date(
          order.date
        ).toLocaleDateString()}</p>
        <p><strong>Items:</strong> ${order.items.length} item${
        order.items.length > 1 ? "s" : ""
      }</p>
        <p><strong>Total:</strong> $${formatPrice(order.total)}</p>
        <p><strong>Status:</strong> <span class="order-status">Confirmed</span></p>
        <button class="btn btn-primary view-details" data-order-id="${
          order.id
        }">View Order Details</button>
      `;
      ordersList.appendChild(orderDiv);
    });

    // Add event listeners for view details buttons
    document.querySelectorAll(".view-details").forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id");
        viewOrderDetails(orderId);
      });
    });
  }

  function viewOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find((o) => o.id == orderId);

    if (!order) {
      alert("Order not found.");
      return;
    }

    let details = `Order #${order.id}\nDate: ${new Date(
      order.date
    ).toLocaleDateString()}\n\nProducts:\n`;

    order.items.forEach((item) => {
      details += `${item.name} (x${item.quantity}) - $${formatPrice(
        item.price * item.quantity
      )}\n`;
    });

    details += `\nTotal: $${formatPrice(order.total)}`;

    alert(details);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderOrders();
  });
})();
