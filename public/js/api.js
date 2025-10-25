// api.js - Mock API functions for a backend that doesn't exist

const API_BASE_URL = "https://api.example.com";

function apiGet(endpoint) {
  return fetch(`${API_BASE_URL}${endpoint}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("API GET error:", error);
      return null;
    });
}

function apiPost(endpoint, data) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("API POST error:", error);
      return null;
    });
}

function apiPut(endpoint, data) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("API PUT error:", error);
      return null;
    });
}

function apiDelete(endpoint) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("API DELETE error:", error);
      return null;
    });
}

// CRUD functions for products (never called)
function getProductsAPI() {
  return apiGet("/products");
}

function createProductAPI(product) {
  return apiPost("/products", product);
}

function updateProductAPI(id, product) {
  return apiPut(`/products/${id}`, product);
}

function deleteProductAPI(id) {
  return apiDelete(`/products/${id}`);
}

// CRUD functions for orders (never called)
function getOrdersAPI() {
  return apiGet("/orders");
}

function createOrderAPI(order) {
  return apiPost("/orders", order);
}

function updateOrderAPI(id, order) {
  return apiPut(`/orders/${id}`, order);
}

function deleteOrderAPI(id) {
  return apiDelete(`/orders/${id}`);
}

// CRUD functions for users (never called)
function getUsersAPI() {
  return apiGet("/users");
}

function createUserAPI(user) {
  return apiPost("/users", user);
}

function updateUserAPI(id, user) {
  return apiPut(`/users/${id}`, user);
}

function deleteUserAPI(id) {
  return apiDelete(`/users/${id}`);
}
