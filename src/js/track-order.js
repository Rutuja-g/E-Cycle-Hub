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

  function getOrderStatus(order) {
    if (order.status) {
      return order.status;
    }

    // Simulate status based on order date
    const orderDate = new Date(order.date);
    const now = new Date();
    const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
      return "pending";
    } else if (daysDiff >= 1 && daysDiff < 3) {
      return "confirmed";
    } else if (daysDiff >= 3 && daysDiff < 7) {
      return "shipped";
    } else {
      return "delivered";
    }
  }

  function updateProgressTracker(status) {
    const steps = document.querySelectorAll(".progress-steps .step");
    const connectors = document.querySelectorAll(".step-connector");

    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);

    steps.forEach((step, index) => {
      const stepStatus = statusOrder[index];
      const stepIcon = step.querySelector(".step-icon");
      const stepLabel = step.querySelector(".step-label");

      if (index <= currentIndex) {
        step.classList.add("active");
        stepIcon.classList.add("active");
        stepLabel.classList.add("active");
      } else {
        step.classList.remove("active");
        stepIcon.classList.remove("active");
        stepLabel.classList.remove("active");
      }
    });

    connectors.forEach((connector, index) => {
      if (index < currentIndex) {
        connector.classList.add("active");
      } else {
        connector.classList.remove("active");
      }
    });
  }

  function displayOrderDetails(order) {
    const status = getOrderStatus(order);

    document.getElementById("display-order-id").textContent = formatOrderId(
      order.id
    );
    document.getElementById("display-customer-name").textContent =
      order.customerName || "N/A";
    document.getElementById("display-order-date").textContent = new Date(
      order.date
    ).toLocaleDateString();
    document.getElementById(
      "display-total-amount"
    ).textContent = `$${formatPrice(order.total)}`;
    document.getElementById("display-payment-method").textContent =
      order.paymentMethod || "N/A";
    document.getElementById("display-delivery-address").textContent =
      order.deliveryAddress || "N/A";

    updateProgressTracker(status);

    document.getElementById("order-details").classList.remove("d-none");
    document.getElementById("error-message").classList.add("d-none");
  }

  function showError() {
    document.getElementById("order-details").classList.add("d-none");
    document.getElementById("error-message").classList.remove("d-none");
  }

  function handleTrackOrder(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const orderId = formData.get("orderId").replace(/^#?E?0*/, ""); // Remove prefix and leading zeros
    const email = formData.get("email").toLowerCase().trim();

    const orders = getOrders();
    const order = orders.find(
      (o) => String(o.id) === orderId && o.userEmail.toLowerCase() === email
    );

    if (order) {
      displayOrderDetails(order);
    } else {
      showError();
    }
  }

  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function autoTrackOrder() {
    const orderIdParam = getUrlParameter("orderId");
    if (!orderIdParam) return;

    const orderId = orderIdParam.replace(/^#?E?0*/, ""); // Remove prefix and leading zeros
    const orders = getOrders();
    const order = orders.find((o) => String(o.id) === orderId);

    if (order) {
      displayOrderDetails(order);
      // Hide the form since we auto-loaded the order
      document.getElementById("track-order-form").style.display = "none";
    } else {
      showError();
    }
  }

  function showModal() {
    const modal = document.getElementById("cancel-modal");
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);
  }

  function hideModal() {
    const modal = document.getElementById("cancel-modal");
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
  }

  function cancelOrder(orderId) {
    const orders = getOrders();
    const orderIndex = orders.findIndex((o) => String(o.id) === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = "cancelled";
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      // Update UI
      const cancelBtn = document.getElementById("cancel-order-btn");
      cancelBtn.textContent = "Order Cancelled";
      cancelBtn.disabled = true;
      cancelBtn.style.opacity = "0.6";

      // Update progress tracker to show cancelled
      updateProgressTracker("cancelled");

      // Show toast notification
      showToast("Order cancelled successfully");

      hideModal();
    }
  }

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("track-order-form");
    if (form) {
      form.addEventListener("submit", handleTrackOrder);
    }

    // Cancel order button
    const cancelBtn = document.getElementById("cancel-order-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", showModal);
    }

    // Modal buttons
    const confirmCancelBtn = document.getElementById("confirm-cancel");
    const cancelCancelBtn = document.getElementById("cancel-cancel");

    if (confirmCancelBtn) {
      confirmCancelBtn.addEventListener("click", () => {
        const orderId = document
          .getElementById("display-order-id")
          .textContent.replace("Order #", "")
          .replace("E", "");
        cancelOrder(orderId);
      });
    }

    if (cancelCancelBtn) {
      cancelCancelBtn.addEventListener("click", hideModal);
    }

    // Close modal on background click
    const modal = document.getElementById("cancel-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          hideModal();
        }
      });
    }

    // Check for URL parameter and auto-track if present
    autoTrackOrder();
  });
})();
