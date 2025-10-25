// This file contains functions for fetching and managing product data, including CRUD operations.

const apiUrl = 'https://api.example.com/products'; // Replace with your actual API endpoint

// Fetch all products
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch a single product by ID
async function fetchProductById(productId) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

// Create a new product (for admin use)
async function createProduct(productData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const newProduct = await response.json();
        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
    }
}

// Update an existing product (for admin use)
async function updateProduct(productId, productData) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const updatedProduct = await response.json();
        return updatedProduct;
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// Delete a product (for admin use)
async function deleteProduct(productId) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return true; // Successfully deleted
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}