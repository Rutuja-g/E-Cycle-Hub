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

  function renderOrderSummary() {
    const cart = getCart();
    const orderItems = document.getElementById("order-items");
    const totalPrice = document.getElementById("total-price");

    orderItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      orderItems.innerHTML = "<p>Your cart is empty.</p>";
      totalPrice.textContent = "0.00";
      return;
    }

    cart.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "order-item";
      itemDiv.innerHTML = `
        <p>${item.name} (x${item.quantity})</p>
        <p>$${formatPrice(item.price * item.quantity)}</p>
      `;
      orderItems.appendChild(itemDiv);
      total += item.price * item.quantity;
    });

    totalPrice.textContent = formatPrice(total);
  }

  function validateForm() {
    let isValid = true;
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const payment = document.getElementById("payment").value;

    // Clear previous errors
    document.querySelectorAll(".error").forEach((el) => {
      el.textContent = "";
      el.style.opacity = "0";
    });

    if (!name) {
      document.getElementById("nameError").textContent =
        "Full name is required.";
      document.getElementById("nameError").style.opacity = "1";
      isValid = false;
    }

    if (!address) {
      document.getElementById("addressError").textContent =
        "Shipping address is required.";
      document.getElementById("addressError").style.opacity = "1";
      isValid = false;
    }

    if (!phone) {
      document.getElementById("phoneError").textContent =
        "Phone number is required.";
      document.getElementById("phoneError").style.opacity = "1";
      isValid = false;
    }

    if (!payment) {
      document.getElementById("paymentError").textContent =
        "Please select a payment mode.";
      document.getElementById("paymentError").style.opacity = "1";
      isValid = false;
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Get current user
    const user = JSON.parse(localStorage.getItem("ecycle_current_user"));
    if (!user) {
      alert("Please log in to place an order.");
      window.location.href = "login.html";
      return;
    }

    // Get cart items
    const cart = getCart();

    // Create order object
    const order = {
      id: Date.now(), // Simple ID based on timestamp
      userEmail: user.email,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      payment: document.getElementById("payment").value,
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    saveCart([]);

    // Show success message
    document.getElementById("checkout-form").style.display = "none";
    document.querySelector(".order-summary").style.display = "none";
    document.getElementById("success-message").style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderOrderSummary();

    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", handleFormSubmit);
  });
})();
