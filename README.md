# E-Cycle Hub

## Overview

E-Cycle Hub is a fully responsive frontend-only e-commerce web application for selling electric bicycles. The app uses client-side storage and mock API endpoints, designed to be integrated with a real backend in the future. It features a product catalog, shopping cart, user authentication, checkout process, and an admin panel for managing products, orders, and analytics.

## Features

- **Product Browsing**: Search, filter, and sort electric bicycles
- **Shopping Cart**: Persistent cart storage using localStorage
- **User Authentication**: Login/signup with session management
- **Checkout Process**: Form validation and order confirmation
- **Admin Panel**: Manage products, orders, and view analytics with Chart.js
- **Responsive Design**: Mobile-first design for all devices
- **Order Tracking**: View and track orders
- **Contact Form**: User inquiries and support

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: localStorage for data persistence
- **Charts**: Chart.js for admin analytics
- **Development Server**: live-server for local development
- **Build Tool**: None (static files)

## Project Structure

```
E-Cycle-Hub/
├── .github/
│   └── copilot-instructions.md  # AI agent instructions
├── public/
│   ├── index.html               # Home page
│   ├── products.html            # Product catalog
│   ├── product.html             # Individual product details
│   ├── cart.html                # Shopping cart
│   ├── checkout.html            # Checkout process
│   ├── orders.html              # User orders
│   ├── track-order.html         # Order tracking
│   ├── login.html               # User login
│   ├── signup.html              # User registration
│   ├── contact.html             # Contact form
│   ├── about.html               # About page
│   ├── shop.html                # Shop page
│   ├── order-confirmation.html  # Order confirmation
│   ├── admin/
│   │   ├── admin.html           # Admin dashboard
│   │   ├── admin.js             # Admin functionality
│   │   └── components.js        # Admin components
│   ├── assets/
│   │   ├── images/              # Product and UI images
│   │   ├── data/                # Static data files
│   │   └── fonts/               # Custom fonts
│   ├── components/
│   │   ├── header.html          # Site header
│   │   └── footer.html          # Site footer
│   ├── css/
│   │   ├── main.css             # Main styles
│   │   ├── reset.css            # CSS reset
│   │   ├── variables.css        # CSS variables
│   │   ├── auth.css             # Authentication styles
│   │   └── main_backup.css      # Backup styles
│   └── js/
│       ├── main.js              # Main application logic
│       ├── store.js             # Data storage utilities
│       ├── api.js               # Mock API layer
│       ├── auth.js              # Authentication
│       ├── cart.js              # Cart management
│       ├── checkout.js          # Checkout logic
│       ├── orders.js            # Orders management
│       ├── track-order.js       # Order tracking
│       ├── product-details.js   # Product details
│       ├── contact.js           # Contact form
│       ├── components.js        # Component utilities
│       ├── admin.js             # Admin panel
│       └── utils.js             # Utility functions
├── .gitignore                   # Git ignore rules
├── package.json                 # Project metadata and scripts
├── package-lock.json            # Dependency lock file
├── README.md                    # This file
└── TODO.md                      # Task list
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/e-cycle-hub.git
   cd e-cycle-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Local Development

Start the development server:

```bash
npm start
```

This will start live-server and open the app at `http://localhost:3000` (or similar port).

Alternatively, using Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/public/index.html` in your browser.

### Building

Currently, no build process is defined. The app consists of static files ready for deployment.

## Development Workflow

- **State Management**: Data persistence via `store.js` using localStorage
- **API Layer**: Mock APIs in `api.js` for future backend integration
- **Components**: Shared components in `public/components/` with JS in `public/js/`
- **Adding Pages**: Create HTML in `public/` and matching JS in `public/js/`
- **Styles**: Add to `public/css/main.css` following existing patterns

## Live Demo

View the live demo at [https://ecycle-hub.netlify.app](https://ecycle-hub.netlify.app)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Improvements

- Backend API integration
- Payment gateway implementation
- User reviews and ratings
- Email notifications
- Advanced search and filtering
- Inventory management
- Multi-language support
