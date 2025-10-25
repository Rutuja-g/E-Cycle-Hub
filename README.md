# E-Cycle Hub

A fully responsive e-commerce platform for electric bicycles, built with vanilla HTML, CSS, and JavaScript. Features product browsing, shopping cart, user authentication, checkout, and an admin panel for management.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with variables, Font Awesome icons, Google Fonts
- **Data Storage**: localStorage (for demo; replace with backend for production)
- **Charts**: Chart.js (for admin analytics)
- **Development Server**: live-server
- **Package Manager**: npm

## Features

- **Product Catalog**: Browse electric bikes with search, filtering, and sorting
- **Shopping Cart**: Add/remove items, quantity adjustments, persistent storage
- **User Authentication**: Login/signup with session management
- **Checkout Process**: Form validation, order summary, payment mode selection
- **Admin Panel**: Manage products, orders, messages; view analytics
- **Responsive Design**: Mobile-first, works on all devices
- **Dynamic Components**: Header/footer loaded via JavaScript

## Project Structure

```
e-cycle-hub/
├── public/                 # Static files served by live-server
│   ├── index.html          # Homepage with featured products
│   ├── shop.html           # Full product catalog
│   ├── product.html        # Individual product details
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout form
│   ├── orders.html         # Order history (user view)
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── about.html          # About page
│   ├── contact.html        # Contact form
│   ├── admin/
│   │   ├── admin.html      # Admin dashboard
│   │   └── admin.js        # Admin logic
│   ├── components/         # Reusable HTML components
│   │   ├── header.html
│   │   └── footer.html
│   ├── assets/
│   │   ├── images/         # Product images, banners
│   │   └── data/
│   │       └── products.json # Initial product data
│   ├── css/
│   │   ├── reset.css       # CSS reset
│   │   ├── variables.css   # CSS custom properties
│   │   ├── main.css        # Main styles
│   │   └── auth.css        # Auth-specific styles
│   └── js/
│       ├── main.js         # Product loading and UI
│       ├── cart.js         # Cart management
│       ├── checkout.js     # Checkout logic
│       ├── auth.js         # Authentication
│       ├── utils.js        # Shared utilities
│       ├── api.js          # Mock API functions (unused)
│       ├── contact.js      # Contact form handling
│       ├── orders.js       # Order history
│       ├── product-details.js # Product page logic
│       └── components.js   # Component loading
├── src/                    # Source files (some duplicates with public/)
│   ├── components/
│   ├── css/
│   └── js/
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── TODO.md                 # Task tracking
```

## Installation and Setup

1. **Clone the Repository**:

   ```
   git clone https://github.com/yourusername/e-cycle-hub.git
   cd e-cycle-hub
   ```

2. **Install Dependencies**:

   ```
   npm install
   ```

3. **Run the Development Server**:
   ```
   npm start
   ```
   Opens at `http://localhost:3000` (or similar).

## Usage

- **Browse Products**: Visit `shop.html` for the full catalog with search/filter/sort.
- **Add to Cart**: Click "View Details" on a product, then "Add to Cart".
- **Checkout**: Requires login; fill form and select payment mode.
- **Admin Access**: Login as `admin@ecyclehub.com` / `admin123` to manage data.
- **Data Persistence**: Uses localStorage; clear browser data to reset.

## Development Notes

- **Data Flow**: Products load from localStorage (cached) or `products.json`. Cart/orders stored in localStorage.
- **Authentication**: Basic localStorage-based; no real security.
- **Admin Features**: Add/edit/delete products, mark orders/messages complete.
- **Error Handling**: Basic fallbacks; no server-side validation.
- **Browser Support**: Modern browsers; test in Chrome/Firefox.

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m 'Add feature'`.
4. Push: `git push origin feature-name`.
5. Open a pull request.

## License

MIT License. See LICENSE file.

## Roadmap

- [ ] Backend API (Node.js/Express)
- [ ] Payment integration (Stripe)
- [ ] User reviews and ratings
- [ ] Email notifications
- [ ] Unit/E2E tests
- [ ] Production deployment
