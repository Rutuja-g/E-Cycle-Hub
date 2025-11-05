(function () {
  const ORDERS_KEY = "orders";

  function getCurrentUser() {
    const user = localStorage.getItem("ecycle_current_user");
    return user ? JSON.parse(user) : null;
  }

  function getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      let orders = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(orders)) {
        console.warn("Orders data is not an array, resetting to empty.");
        orders = [];
      }

      // Add default status to existing orders
      orders.forEach((order) => {
        if (!order.status) {
          order.status = "confirmed";
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

  function formatOrderId(id) {
    return `Order #ECY${String(id).padStart(6, "0")}`;
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
      return "confirmed";
    } else if (daysDiff >= 1 && daysDiff < 3) {
      return "shipped";
    } else if (daysDiff >= 3 && daysDiff < 5) {
      return "out-for-delivery";
    } else {
      return "delivered";
    }
  }

  function calculateEstimatedDelivery(orderDate, status) {
    const date = new Date(orderDate);
    const deliveryDays =
      status === "delivered" ? 0 : status === "out-for-delivery" ? 1 : 5;
    date.setDate(date.getDate() + deliveryDays);
    return date.toLocaleDateString();
  }

  function updateProgressTracker(status) {
    const steps = document.querySelectorAll(".progress-steps .step");
    const connectors = document.querySelectorAll(".step-connector");

    const statusOrder = [
      "confirmed",
      "shipped",
      "out-for-delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(status);

    steps.forEach((step, index) => {
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

  function renderProductsList(items) {
    const productsList = document.getElementById("products-list");
    productsList.innerHTML = "";

    if (!items || items.length === 0) {
      productsList.innerHTML = "<p>No products found in this order.</p>";
      return;
    }

    items.forEach((item) => {
      const productItem = document.createElement("div");
      productItem.className = "product-item";

      productItem.innerHTML = `
        <div class="product-image">
          <img src="${item.image || "./assets/images/placeholder.jpg"}" alt="${
        item.name
      }" onerror="this.src='./assets/images/placeholder.jpg'">
        </div>
        <div class="product-info">
          <h4>${item.name}</h4>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="product-price">$${formatPrice(
          item.price * item.quantity
        )}</div>
      `;

      productsList.appendChild(productItem);
    });
  }

  function displayOrderDetails(order) {
    const status = getOrderStatus(order);

    // Update order header
    document.getElementById("display-order-id").textContent = formatOrderId(
      order.id
    );
    document.getElementById(
      "display-order-date"
    ).textContent = `Ordered on: ${new Date(order.date).toLocaleDateString()}`;
    document.getElementById(
      "display-total-amount"
    ).textContent = `$${formatPrice(order.total)}`;

    // Render products
    renderProductsList(order.items);

    // Update estimated delivery
    const estimatedDelivery = calculateEstimatedDelivery(order.date, status);
    document.getElementById("estimated-delivery").textContent =
      estimatedDelivery;

    // Update progress tracker
    updateProgressTracker(status);

    // Show order details with fade-in animation
    const orderDetails = document.getElementById("order-details");
    orderDetails.classList.remove("d-none");
    orderDetails.style.animation = "fadeIn 0.5s ease-out";

    // Hide error message
    document.getElementById("error-message").classList.add("d-none");
  }

  function showError() {
    document.getElementById("order-details").classList.add("d-none");
    document.getElementById("error-message").classList.remove("d-none");
  }

  function validateOrderId(orderId) {
    // Remove any prefix and clean up
    const cleanId = orderId.replace(/^#?ECY?0*/, "");
    return /^\d{6,}$/.test(cleanId) ? cleanId : null;
  }

  function handleTrackOrder(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const rawOrderId = formData.get("orderId").trim();
    const errorElement = document.getElementById("order-id-error");

    // Validate input
    if (!rawOrderId) {
      errorElement.textContent = "Please enter an Order ID";
      errorElement.classList.remove("d-none");
      return;
    }

    const orderId = validateOrderId(rawOrderId);
    if (!orderId) {
      errorElement.textContent =
        "Please enter a valid Order ID (e.g., ECY123456)";
      errorElement.classList.remove("d-none");
      return;
    }

    // Hide error
    errorElement.classList.add("d-none");

    // Find order
    const orders = getOrders();
    const order = orders.find((o) => String(o.id) === orderId);

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

    const orderId = validateOrderId(orderIdParam);
    if (!orderId) return;

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

  document.addEventListener("DOMContentLoaded", function () {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Check for selected order from localStorage (from orders.html)
    const selectedOrderId = localStorage.getItem("selectedOrder");
    if (selectedOrderId) {
      localStorage.removeItem("selectedOrder");
      const orders = getOrders();
      const order = orders.find(
        (o) => String(o.id) === selectedOrderId && o.userEmail === user.email
      );
      if (order) {
        displayOrderDetails(order);
        return;
      }
    }

    // Check for orderId from URL (from order-confirmation.html)
    const orderIdParam = getUrlParameter("orderId");
    if (orderIdParam) {
      const orderId = validateOrderId(orderIdParam);
      if (orderId) {
        const orders = getOrders();
        const order = orders.find(
          (o) => String(o.id) === orderId && o.userEmail === user.email
        );
        if (order) {
          displayOrderDetails(order);
          return;
        }
      }
    }

    // If no specific order to track, show no-orders message
    document.getElementById("no-orders").classList.remove("d-none");
  });
})();
