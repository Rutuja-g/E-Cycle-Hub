// admin.js - Admin panel functionality

(function () {
  const PRODUCTS_STORAGE_KEY = "products";

  // Duplicate utility functions from utils.js (messy)
  function formatPrice(amount = 0) {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  // Load products from localStorage or initialize with default data
function loadProducts() {
  const storedProducts = localStorage.getItem("ecycle_products");
  if (storedProducts) {
    return JSON.parse(storedProducts);
  } else {
    // Load initial products from JSON file (simulated)
    const initialProducts = [
      {
        id: 1,
        name: "EcoRide 3000",
        price: 1200,
        category: "Mountain",
        image: "../assets/images/ecoride3000.jpg",
        description:
          "The EcoRide 3000 is a powerful electric mountain bike designed for off-road adventures. With a robust frame and high-capacity battery, it can tackle any terrain.",
      },
      {
        id: 2,
        name: "City Cruiser",
        price: 900,
        category: "City",
        image: "../assets/images/citycruiser.jpg",
        description:
          "The City Cruiser is perfect for urban commuting. Its lightweight design and smooth ride make it ideal for navigating city streets.",
      },
      {
        id: 3,
        name: "Speedster Pro",
        price: 1500,
        category: "Road",
        image: "../assets/images/speedsterpro.jpg",
        description:
          "The Speedster Pro is built for speed and performance. With advanced aerodynamics and a powerful motor, it's perfect for road racing.",
      },
      {
        id: 4,
        name: "Family E-Bike",
        price: 1100,
        category: "Family",
        image: "../assets/images/familyebike.jpg",
        description:
          "The Family E-Bike is designed for family outings. It features a sturdy frame and ample storage for all your essentials.",
      },
      {
        id: 5,
        name: "Commuter X",
        price: 950,
        category: "Commuter",
        image: "../assets/images/commuterx.jpg",
        description:
          "The Commuter X is an efficient electric bike for daily commuting. It offers a comfortable ride and easy handling.",
      },
    ];
    localStorage.setItem("ecycle_products", JSON.stringify(initialProducts));
    return initialProducts;
  }
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem("ecycle_products", JSON.stringify(products));
}

// Load orders from localStorage
function loadOrders() {
  const storedOrders = localStorage.getItem("orders");
  return storedOrders ? JSON.parse(storedOrders) : [];
}

// Load messages from localStorage
function loadMessages() {
  const storedMessages = localStorage.getItem("contactMessages");
  return storedMessages ? JSON.parse(storedMessages) : [];
}

// Validate form inputs
function validateForm(name, price, category, image) {
  let isValid = true;
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!price || price <= 0) {
    errors.price = "Price must be a positive number";
    isValid = false;
  }

  if (!category) {
    errors.category = "Category is required";
    isValid = false;
  }

  if (!image.trim()) {
    errors.image = "Image URL is required";
    isValid = false;
  } else {
    try {
      new URL(image);
    } catch {
      errors.image = "Invalid URL format";
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Display products in the table
function displayProducts(products = null) {
  const allProducts = loadProducts();
  const filteredProducts = products || allProducts;
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = "";

  filteredProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.category}</td>
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>
                <button class="btn btn-edit" onclick="editProduct(${product.id})">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" onclick="deleteProduct(${product.id})">
                  <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Display orders in the table
function displayOrders(orders = null) {
  const allOrders = loadOrders();
  const filteredOrders = orders || allOrders;
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";

  filteredOrders.forEach((order) => {
    const productsList = order.items
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(", ");
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${productsList}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td class="${
              order.status === "completed"
                ? "status-completed"
                : "status-pending"
            }">${order.status || "pending"}</td>
            <td>
                <button class="btn btn-complete" onclick="completeOrder(${
                  order.id
                })">
                  <i class="fas fa-check"></i> ${
                    order.status === "completed"
                      ? "Mark Pending"
                      : "Mark Completed"
                  }</button>
                <button class="btn btn-delete" onclick="deleteOrder(${
                  order.id
                })">
                  <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Display messages in the table
function displayMessages(messages = null) {
  const allMessages = loadMessages();
  const filteredMessages = messages || allMessages;
  const tbody = document.querySelector("#messagesTable tbody");
  tbody.innerHTML = "";

  filteredMessages.forEach((message) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${message.id}</td>
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.message.substring(0, 50)}${
      message.message.length > 50 ? "..." : ""
    }</td>
            <td>${new Date(message.date).toLocaleDateString()}</td>
            <td class="${
              message.status === "resolved"
                ? "status-resolved"
                : "status-pending"
            }">${message.status || "pending"}</td>
            <td>
                <button class="btn btn-resolve" onclick="resolveMessage(${
                  message.id
                })">
                  <i class="fas fa-check-circle"></i> ${
                    message.status === "resolved" ? "Unresolve" : "Resolve"
                  }</button>
                <button class="btn btn-delete" onclick="deleteMessage(${
                  message.id
                })">
                  <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Add new product
function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const image = document.getElementById("image").value;

  const { isValid, errors } = validateForm(name, price, category, image);

  // Clear previous errors
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

  if (!isValid) {
    for (const [field, error] of Object.entries(errors)) {
      document.getElementById(`${field}Error`).textContent = error;
    }
    return;
  }

  const products = loadProducts();
  const newId = Math.max(...products.map((p) => p.id)) + 1;

  const newProduct = {
    id: newId,
    name,
    price,
    category,
    image,
    description: `${name} is a great ${category.toLowerCase()} bicycle.`,
  };

  products.push(newProduct);
  saveProducts(products);

  displayProducts();
  document.getElementById("productForm").reset();
}

// Edit product
function editProduct(id) {
  const products = loadProducts();
  const product = products.find((p) => p.id === id);

  if (product) {
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("image").value = product.image;

    // Change form to edit mode
    const form = document.getElementById("productForm");
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = "Update Product";
    submitBtn.onclick = (event) => updateProduct(event, id);
  }
}

// Update product
function updateProduct(event, id) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const image = document.getElementById("image").value;

  const { isValid, errors } = validateForm(name, price, category, image);

  // Clear previous errors
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

  if (!isValid) {
    for (const [field, error] of Object.entries(errors)) {
      document.getElementById(`${field}Error`).textContent = error;
    }
    return;
  }

  const products = loadProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index !== -1) {
    products[index] = { ...products[index], name, price, category, image };
    saveProducts(products);

    displayProducts();
    document.getElementById("productForm").reset();

    // Reset form to add mode
    const form = document.getElementById("productForm");
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = "Add Product";
    submitBtn.onclick = addProduct;
  }
}

// Delete product
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    const products = loadProducts();
    const filteredProducts = products.filter((p) => p.id !== id);
    saveProducts(filteredProducts);
    displayProducts();
  }
}

// Complete/uncomplete order
function completeOrder(id) {
  const orders = loadOrders();
  const order = orders.find((o) => o.id == id);
  if (order) {
    order.status = order.status === "completed" ? "pending" : "completed";
    localStorage.setItem("orders", JSON.stringify(orders));
    displayOrders();
  }
}

// Delete order
function deleteOrder(id) {
  if (confirm("Are you sure you want to delete this order?")) {
    const orders = loadOrders();
    const filteredOrders = orders.filter((o) => o.id != id);
    localStorage.setItem("orders", JSON.stringify(filteredOrders));
    displayOrders();
  }
}

// Resolve/unresolve message
function resolveMessage(id) {
  const messages = loadMessages();
  const message = messages.find((m) => m.id == id);
  if (message) {
    message.status = message.status === "resolved" ? "pending" : "resolved";
    localStorage.setItem("contactMessages", JSON.stringify(messages));
    displayMessages();
  }
}

// Delete message
function deleteMessage(id) {
  if (confirm("Are you sure you want to delete this message?")) {
    const messages = loadMessages();
    const filteredMessages = messages.filter((m) => m.id != id);
    localStorage.setItem("contactMessages", JSON.stringify(filteredMessages));
    displayMessages();
  }
}

// Tab functionality
function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach((button) => button.classList.remove("active"));

  // Show selected tab
  document.getElementById(tabName + "-tab").classList.add("active");

  // Add active class to clicked button
  event.target.classList.add("active");
}

// Search functionality
function searchItems(query) {
  const lowerQuery = query.toLowerCase();

  // Search products
  const products = loadProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );
  displayProducts(products);

  // Search orders
  const orders = loadOrders().filter(
    (o) =>
      o.userEmail.toLowerCase().includes(lowerQuery) ||
      o.id.toString().includes(lowerQuery) ||
      o.name.toLowerCase().includes(lowerQuery)
  );
  displayOrders(orders);

  // Search messages
  const messages = loadMessages().filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.email.toLowerCase().includes(lowerQuery) ||
      m.message.toLowerCase().includes(lowerQuery)
  );
  displayMessages(messages);
}

// Analytics functions
function createSalesChart() {
  const orders = loadOrders();
  const salesData = {};

  orders.forEach((order) => {
    const date = new Date(order.date).toLocaleDateString();
    if (!salesData[date]) {
      salesData[date] = 0;
    }
    salesData[date] += order.total;
  });

  const labels = Object.keys(salesData);
  const data = Object.values(salesData);

  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Sales ($)",
          data: data,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Total Sales Over Time",
        },
      },
    },
  });
}

function createCategoriesChart() {
  const orders = loadOrders();
  const categoryData = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = 0;
      }
      categoryData[item.category] += item.quantity;
    });
  });

  const labels = Object.keys(categoryData);
  const data = Object.values(categoryData);

  const ctx = document.getElementById("categoriesChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Categories",
          data: data,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Top Product Categories",
        },
      },
    },
  });
}

// Show add product modal
function showAddProductModal() {
  document.getElementById("modalTitle").textContent = "Add New Product";
  document.getElementById("productForm").reset();
  document.getElementById("productModal").style.display = "block";
  const submitBtn = document.querySelector(
    "#productForm button[type='submit']"
  );
  submitBtn.textContent = "Add Product";
  submitBtn.onclick = addProduct;
}

// Close modal
function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

// Sidebar navigation
function initSidebar() {
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.getAttribute("data-tab");

      // Remove active class from all links
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      // Add active class to clicked link
      this.classList.add("active");

      // Hide all tabs
      const tabs = document.querySelectorAll(".tab-content");
      tabs.forEach((tab) => tab.classList.remove("active"));

      // Show selected tab
      document.getElementById(tabName + "-tab").classList.add("active");

      // Update dashboard stats if dashboard is selected
      if (tabName === "dashboard") {
        updateDashboardStats();
      }
    });
  });
}

// Update dashboard statistics
function updateDashboardStats() {
  const products = loadProducts();
  const orders = loadOrders();
  const messages = loadMessages();

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Update stats
  document.getElementById("total-products").textContent = products.length;
  document.getElementById("total-orders").textContent = orders.length;
  document.getElementById("total-messages").textContent = messages.length;
  document.getElementById(
    "total-revenue"
  ).textContent = `$${totalRevenue.toFixed(2)}`;
}

// Initialize the admin panel
document.addEventListener("DOMContentLoaded", function () {
  // Initialize sidebar navigation
  initSidebar();

  // Display initial data
  displayProducts();
  displayOrders();
  displayMessages();
  updateDashboardStats();

  // Modal functionality
  document.getElementById("productForm").addEventListener("submit", addProduct);

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    searchItems(this.value);
  });

  // Initialize charts
  createSalesChart();
  createCategoriesChart();
});
