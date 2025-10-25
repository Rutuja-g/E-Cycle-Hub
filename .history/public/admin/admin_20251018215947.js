// Admin panel JavaScript for managing bicycles

// Load products from localStorage or initialize with default data
function loadProducts() {
  const storedProducts = localStorage.getItem("products");
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
    localStorage.setItem("products", JSON.stringify(initialProducts));
    return initialProducts;
  }
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
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
function displayProducts() {
  const products = loadProducts();
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.category}</td>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;"></td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
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

// Initialize the admin panel
document.addEventListener("DOMContentLoaded", function () {
  displayProducts();

  document.getElementById("productForm").addEventListener("submit", addProduct);
});
