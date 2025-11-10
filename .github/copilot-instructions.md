# E-Cycle Hub - AI Agent Instructions

## Project Overview
E-Cycle Hub is a frontend-only e-commerce web application for electric bicycles. The app currently uses client-side storage and mock API endpoints, designed to be integrated with a real backend in the future.

## Architecture & Data Flow

### Core Components
- **Frontend Only**: Pure HTML/CSS/JavaScript implementation
- **Storage**: Uses `localStorage` for data persistence (`public/js/store.js`)
- **Mock API Layer**: Structured API interfaces in `public/js/api.js` (currently non-functional)
- **Component Structure**: HTML components in `public/components/` with corresponding JavaScript in `public/js/`

### Key Patterns
1. **State Management**:
   - Data persistence handled through `store.js`
   - Use `store.saveProducts()` and `store.getProducts()` for product data
   - Cart management via `store.saveCart()`, `store.getCart()`, `store.clearCart()`

2. **Component Organization**:
   - Shared components (header, footer) in `public/components/`
   - Page-specific JavaScript in `public/js/` matching HTML filenames
   - Admin functionality separated in `public/admin/`

3. **API Structure**:
   - Mock API endpoints defined in `api.js`
   - Follow RESTful patterns for future backend integration
   - API base URL configured at top of `api.js`

## Development Workflow

### Local Development
1. Start local server: `python -m http.server 8000`
2. Access app at: `http://localhost:8000/public/index.html`

### File Organization
- New pages: Add HTML in `public/` with matching JS in `public/js/`
- Styles: Add to `public/css/main.css` using existing patterns
- Components: Place in `public/components/` with corresponding JS

## Common Tasks

### Adding New Products
1. Update product data in localStorage through admin panel
2. Follow existing product schema with required fields

### Implementing New Features
1. Create HTML file in `public/`
2. Add corresponding JS file in `public/js/`
3. Update navigation in `components/header.html`
4. Add styles to `css/main.css`

## Important Notes
- Backend integration prepared but not implemented
- Use `localStorage` for all data persistence
- Mobile-first responsive design required
- Keep admin features in `public/admin/` directory