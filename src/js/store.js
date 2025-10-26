// This file manages localStorage interactions for saving and retrieving product data.

const store = {
    saveProducts: function(products) {
        localStorage.setItem('products', JSON.stringify(products));
    },
    getProducts: function() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    },
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    getCart: function() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    clearCart: function() {
        localStorage.removeItem('cart');
    }
};

export default store;