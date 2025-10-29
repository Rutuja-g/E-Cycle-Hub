// Checkout module for processing orders and form validation

(function () {
  const CART_STORAGE_KEY = "ecycle_cart";
  const ORDERS_STORAGE_KEY = "orders";
  const CURRENT_USER_STORAGE_KEY = "ecycle_current_user";

  // Retrieve cart from localStorage
  function getCart() {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const cart = storedCart ? JSON.parse(storedCart) : [];
      if (!Array.isArray(cart)) {
        return [];
      }
      return cart;
    } catch (error) {
      return [];
    }
  }

  // Save cart to localStorage
  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // Error handled silently
    }
  }

  // Format price with two decimal places
  function formatPrice(amount = 0) {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Render order summary from cart items
  function renderOrderSummary() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById("order-items");
    const subtotalPriceElement = document.getElementById("subtotal-price");
    const taxPriceElement = document.getElementById("tax-price");
    const totalPriceElement = document.getElementById("total-price");

    orderItemsContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      subtotalPriceElement.textContent = "0.00";
      taxPriceElement.textContent = "0.00";
      totalPriceElement.textContent = "0.00";
      return;
    }

    cart.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "order-item";
      itemElement.innerHTML = `
        <div class="item-image">
          <img src="${item.image || "assets/images/logo.jpg"}" alt="${
        item.name
      }" />
        </div>
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="item-price">
          $${formatPrice(item.price * item.quantity)}
        </div>
      `;
      orderItemsContainer.appendChild(itemElement);
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.1; // 10% tax placeholder
    const total = subtotal + tax;

    subtotalPriceElement.textContent = formatPrice(subtotal);
    taxPriceElement.textContent = formatPrice(tax);
    totalPriceElement.textContent = formatPrice(total);
  }

  // Validate checkout form fields
  function validateForm() {
    let isFormValid = true;
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const payment = document.getElementById("payment").value;

    // Clear previous error messages
    document.querySelectorAll(".error").forEach((element) => {
      element.textContent = "";
      element.style.opacity = "0";
    });

    if (!name) {
      document.getElementById("nameError").textContent =
        "Full name is required.";
      document.getElementById("nameError").style.opacity = "1";
      isFormValid = false;
    }

    if (!address) {
      document.getElementById("addressError").textContent =
        "Shipping address is required.";
      document.getElementById("addressError").style.opacity = "1";
      isFormValid = false;
    }

    if (!phone) {
      document.getElementById("phoneError").textContent =
        "Phone number is required.";
      document.getElementById("phoneError").style.opacity = "1";
      isFormValid = false;
    }

    if (!payment) {
      document.getElementById("paymentError").textContent =
        "Please select a payment mode.";
      document.getElementById("paymentError").style.opacity = "1";
      isFormValid = false;
    }

    return isFormValid;
  }

  // Handle checkout form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Get current user
    const currentUser = JSON.parse(
      localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    );
    if (!currentUser) {
      alert("Please log in to place an order.");
      window.location.href = "login.html";
      return;
    }

    // Get cart items
    const cart = getCart();

    // Create order object
    const order = {
      id: Date.now(),
      userEmail: currentUser.email,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      payment: document.getElementById("payment").value,
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    // Clear cart
    saveCart([]);

    // Redirect to order confirmation page
    window.location.href = "order-confirmation.html";
  }

  // Initialize checkout functionality
  document.addEventListener("DOMContentLoaded", function () {
    renderOrderSummary();

    const checkoutForm = document.getElementById("checkout-form");
    checkoutForm.addEventListener("submit", handleFormSubmit);
  });
})();
