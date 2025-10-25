// API functions for product management (CRUD operations)

const API_BASE_URL = "https://api.example.com/products";

// Fetch all products from API
async function fetchProducts() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    return products;
  } catch (error) {
    // Error handled by caller
  }
}

// Fetch single product by ID
async function fetchProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const product = await response.json();
    return product;
  } catch (error) {
    // Error handled by caller
  }
}

// Create new product (admin only)
async function createProduct(productData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const newProduct = await response.json();
    return newProduct;
  } catch (error) {
    // Error handled by caller
  }
}

// Update existing product (admin only)
async function updateProduct(productId, productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    // Error handled by caller
  }
}

// Delete product (admin only)
async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return true;
  } catch (error) {
    // Error handled by caller
  }
}
