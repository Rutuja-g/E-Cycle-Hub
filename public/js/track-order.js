(function () {
  const ORDERS_KEY = "orders";

  // Mock data for testing when no orders exist in localStorage
  const mockOrders = [
    {
      id: 123456,
      date: "2024-01-15T10:30:00Z",
      total: 299.99,
      status: "shipped",
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          price: 149.99,
          quantity: 1,
          image: "./assets/images/headphones.jpg",
        },
        {
          id: 2,
          name: "Portable Charger 10000mAh",
          price: 29.99,
          quantity: 2,
          image: "./assets/images/charger.jpg",
        },
      ],
      deliveryAddress: "123 Main St, City, State 12345",
    },
    {
      id: 789012,
      date: "2024-01-10T14:20:00Z",
      total: 89.99,
      status: "delivered",
      items: [
        {
          id: 3,
          name: "USB-C Cable 6ft",
          price: 12.99,
          quantity: 1,
          image: "./assets/images/cable.jpg",
        },
      ],
      deliveryAddress: "456 Oak Ave, Town, State 67890",
    },
  ];

  function getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      let orders = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(orders)) {
        console.warn("Orders data is not an array, resetting to empty.");
        orders = [];
      }

      // If no orders exist, use mock data for testing
      if (orders.length === 0) {
        console.log("No orders found, using mock data for testing");
        orders = mockOrders;
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
      return mockOrders; // Fallback to mock data
    }
  }

  function renderOrderCards() {
    const orders = getOrders();
    const ordersList = document.getElementById("orders-list");
    const noOrders = document.getElementById("no-orders");

    ordersList.innerHTML = "";

    if (orders.length === 0) {
      noOrders.classList.remove("d-none");
      return;
    }

    noOrders.classList.add("d-none");

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.className = "order-card";

      // Determine status display
      let statusClass, statusText;
      switch (order.status) {
        case "confirmed":
          statusClass = "confirmed";
          statusText = "Confirmed";
          break;
        case "shipped":
          statusClass = "shipped";
          statusText = "Shipped";
          break;
        case "out-for-delivery":
          statusClass = "out-for-delivery";
          statusText = "Out for Delivery";
          break;
        case "delivered":
          statusClass = "delivered";
          statusText = "Delivered";
          break;
        default:
          statusClass = "confirmed";
          statusText = "Confirmed";
      }

      orderCard.innerHTML = `
        <div class="order-header">
          <span>Order #${order.id}</span>
          <span class="order-meta">${new Date(
            order.date
          ).toLocaleDateString()}</span>
        </div>
        <div class="order-summary">
          <span><strong>Total:</strong> $${formatPrice(order.total)}</span>
        </div>
        <div class="order-footer">
          <span class="order-status ${statusClass}">${statusText}</span>
          <button class="btn btn-primary track-progress-btn" data-order-id="${
            order.id
          }">
            <i class="fas fa-eye"></i>
            Track Progress
          </button>
        </div>
      `;

      ordersList.appendChild(orderCard);
    });

    // Add event listeners for track progress buttons
    document.querySelectorAll(".track-progress-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderId = parseInt(this.getAttribute("data-order-id"));
        handleTrackProgress(orderId);
      });
    });
  }

  function handleTrackProgress(orderId) {
    const orders = getOrders();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      alert("Order not found.");
      return;
    }

    // Calculate estimated delivery date
    const orderDate = new Date(order.date);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 5); // Assume 5 days delivery

    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    modalTitle.textContent = `Order #${order.id} Progress`;

    modalBody.innerHTML = `
      <div class="order-progress-modal">
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
            <span><strong>Total:</strong> $${formatPrice(order.total)}</span>
          </div>
        </div>
        <div class="products-summary">
          <h3><i class="fas fa-shopping-bag"></i> Products</h3>
          ${order.items
            .map(
              (item) => `
            <div class="product-summary-item">
              <div class="product-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
              </div>
              <div class="product-price">$${formatPrice(
                item.price * item.quantity
              )}</div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="progress-tracker-modal">
          <h3>Order Status</h3>
          <div class="progress-tracker">
            <div class="progress-steps">
              <div class="step" data-step="confirmed">
                <div class="step-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <span class="step-label">Order Confirmed</span>
              </div>
              <div class="step-connector"></div>
              <div class="step" data-step="shipped">
                <div class="step-icon">
                  <i class="fas fa-truck"></i>
                </div>
                <span class="step-label">Shipped</span>
              </div>
              <div class="step-connector"></div>
              <div class="step" data-step="out-for-delivery">
                <div class="step-icon">
                  <i class="fas fa-shipping-fast"></i>
                </div>
                <span class="step-label">Out for Delivery</span>
              </div>
              <div class="step-connector"></div>
              <div class="step" data-step="delivered">
                <div class="step-icon">
                  <i class="fas fa-box-open"></i>
                </div>
                <span class="step-label">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Update progress tracker
    updateProgressTracker(order.status);

    // Show modal
    const modal = document.getElementById("track-modal");
    modal.classList.remove("d-none");
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.9)";
    document.body.style.overflow = "hidden";

    // Trigger fade-in animation
    setTimeout(() => {
      modal.style.opacity = "1";
      modal.style.transform = "scale(1)";
    }, 10);
  }

  function closeModal() {
    const modal = document.getElementById("track-modal");
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.9)";
    setTimeout(() => {
      modal.classList.add("d-none");
      document.body.style.overflow = "";
    }, 300);
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
    // Check for selected order from localStorage
    const selectedOrderId = localStorage.getItem("selectedOrder");
    if (selectedOrderId) {
      // Remove from localStorage to avoid showing it again on refresh
      localStorage.removeItem("selectedOrder");
      // Find the order and show modal directly
      const orders = getOrders();
      const order = orders.find((o) => String(o.id) === selectedOrderId);
      if (order) {
        handleTrackProgress(parseInt(selectedOrderId));
        return; // Skip rendering order cards
      }
    }

    // If no selected order, render the order cards list
    renderOrderCards();

    // Add modal close functionality
    const modal = document.getElementById("track-modal");
    if (modal) {
      const closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
      }

      // Close on backdrop click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Close on Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("d-none")) {
          closeModal();
        }
      });
    }
  });
})();
