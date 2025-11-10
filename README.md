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

## Future Improvements

- Backend API integration
- Payment gateway implementation
- User reviews and ratings
- Email notifications
- Advanced search and filtering
- Inventory management
- Multi-language support
