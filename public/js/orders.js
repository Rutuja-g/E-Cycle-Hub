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
      // Add default status to existing orders
      orders.forEach((order) => {
        if (!order.status) {
          order.status = "pending";
        }
      });
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

  function cancelOrder(orderId) {
    const orders = getOrders();
    const orderIndex = orders.findIndex((o) => o.id == orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = "cancelled";
      saveOrders(orders);
      renderOrders(); // Re-render to update the UI
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

  // Function to format order ID for display
  function formatOrderId(id) {
    return `Order #E${String(id).padStart(3, "0")}`;
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
      orderDiv.className = "order-card";

      // Use stored status or determine based on order date (simulate different statuses)
      let statusClass, statusText;
      if (order.status) {
        switch (order.status) {
          case "pending":
            statusClass = "pending";
            statusText = "Processing";
            break;
          case "confirmed":
            statusClass = "confirmed";
            statusText = "Confirmed";
            break;
          case "delivered":
            statusClass = "delivered";
            statusText = "Delivered";
            break;
          case "cancelled":
            statusClass = "cancelled";
            statusText = "Cancelled";
            break;
          default:
            statusClass = "confirmed";
            statusText = "Confirmed";
        }
      } else {
        const orderDate = new Date(order.date);
        const now = new Date();
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

        statusClass = "confirmed";
        statusText = "Confirmed";

        if (daysDiff < 1) {
          statusClass = "pending";
          statusText = "Processing";
        } else if (daysDiff > 7 && daysDiff <= 14) {
          statusClass = "delivered";
          statusText = "Delivered";
        } else if (daysDiff > 14) {
          statusClass = "cancelled";
          statusText = "Cancelled";
        }
      }

      orderDiv.innerHTML = `
        <div class="order-header">
          <span>${formatOrderId(order.id)}</span>
          <span class="order-meta">${new Date(
            order.date
          ).toLocaleDateString()}</span>
        </div>
        <div class="order-summary">
          <span><strong>Total:</strong> $${formatPrice(order.total)}</span>
        </div>
        <div class="order-footer">
          <span class="order-status ${statusClass}">${statusText}</span>
          <div class="order-actions">
            <button class="btn btn-primary view-details" data-order-id="${
              order.id
            }">
              <i class="fas fa-eye"></i>
              View Details
            </button>
            <button class="btn btn-secondary track-order" data-order-id="${
              order.id
            }">
              <i class="fas fa-truck"></i>
              Track Order
            </button>
            ${
              order.status === "pending"
                ? `<button class="btn btn-danger cancel-order" data-order-id="${order.id}">
                    <i class="fas fa-times"></i>
                    Cancel Order
                  </button>`
                : ""
            }
          </div>
        </div>
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

    // Add event listeners for track order buttons
    document.querySelectorAll(".track-order").forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id");
        // Save selected order to localStorage and redirect
        localStorage.setItem("selectedOrder", orderId);
        window.location.href = "track-order.html";
      });
    });

    // Add event listeners for cancel order buttons
    document.querySelectorAll(".cancel-order").forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id");
        if (confirm("Are you sure you want to cancel this order?")) {
          cancelOrder(orderId);
        }
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

    // Calculate estimated delivery date (simulate 3-5 days from order date)
    const orderDate = new Date(order.date);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(
      orderDate.getDate() + Math.floor(Math.random() * 3) + 3
    ); // 3-5 days

    // Use stored status or determine based on order date
    let statusClass, statusText;
    if (order.status) {
      switch (order.status) {
        case "pending":
          statusClass = "pending";
          statusText = "Processing";
          break;
        case "confirmed":
          statusClass = "confirmed";
          statusText = "Confirmed";
          break;
        case "delivered":
          statusClass = "delivered";
          statusText = "Delivered";
          break;
        case "cancelled":
          statusClass = "cancelled";
          statusText = "Cancelled";
          break;
        default:
          statusClass = "confirmed";
          statusText = "Confirmed";
      }
    } else {
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

      statusClass = "confirmed";
      statusText = "Confirmed";

      if (daysDiff < 1) {
        statusClass = "pending";
        statusText = "Processing";
      } else if (daysDiff > 7 && daysDiff <= 14) {
        statusClass = "delivered";
        statusText = "Delivered";
      } else if (daysDiff > 14) {
        statusClass = "cancelled";
        statusText = "Cancelled";
      }
    }

    const detailsHTML = `
      <div class="order-summary-modal">
        <div class="order-info">
          <div class="info-row">
            <i class="fas fa-calendar-alt"></i>
            <span><strong>Order Date:</strong> ${new Date(
              order.date
            ).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-truck"></i>
            <span><strong>Estimated Delivery:</strong> ${deliveryDate.toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-info-circle"></i>
            <span><strong>Status:</strong> <span class="order-status ${statusClass}">${statusText}</span></span>
          </div>
        </div>
        <div class="products-list">
          <h3><i class="fas fa-shopping-bag"></i> Products</h3>
          ${order.items
            .map(
              (item) => `
            <div class="product-item">
              <div class="product-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
              </div>
              <div class="product-price">
                <span>$${formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="order-total-modal">
          <div class="total-row">
            <span><strong>Total:</strong></span>
            <span><strong>$${formatPrice(order.total)}</strong></span>
          </div>
        </div>
      </div>
    `;

    // Populate modal
    document.getElementById("modal-title").textContent = `Order ${formatOrderId(
      order.id
    )} Details`;

    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = detailsHTML;

    // Show modal with fade-in animation
    const modal = document.getElementById("order-modal");
    modal.style.display = "flex";
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.9)";
    document.body.style.overflow = "hidden"; // Prevent background scroll

    // Trigger fade-in animation
    setTimeout(() => {
      modal.style.opacity = "1";
      modal.style.transform = "scale(1)";
    }, 10);

    // Add close functionality
    const closeButtons = modal.querySelectorAll(
      ".modal-close, .modal-close-btn"
    );
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", closeModal);
    });

    // Close on backdrop click
    modal.addEventListener("click", closeModal);

    // Prevent closing when clicking inside the modal content
    const innerModal = modal.querySelector(".modal-content");
    innerModal.addEventListener("click", (e) => e.stopPropagation());

    // Close on Escape key
    document.addEventListener("keydown", handleEscape);

    function closeModal() {
      modal.style.display = "none";
      document.body.style.overflow = ""; // Restore scroll
      document.removeEventListener("keydown", handleEscape);
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderOrders();
  });
})();
