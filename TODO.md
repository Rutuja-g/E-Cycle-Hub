# TODO: Fix Paths for Netlify Deployment

## 1. Convert Relative Paths to Absolute in HTML Files

- [ ] public/index.html: Change CSS/JS links to absolute (e.g., "css/main.css" → "/css/main.css")
- [ ] public/shop.html: Same as above
- [ ] public/product.html: Same as above
- [ ] public/about.html: Same as above
- [ ] public/cart.html: Same as above
- [ ] public/checkout.html: Same as above
- [ ] public/contact.html: Same as above
- [ ] public/login.html: Same as above
- [ ] public/signup.html: Same as above
- [ ] public/orders.html: Same as above
- [ ] public/order-confirmation.html: Same as above
- [ ] public/products.html: Same as above
- [ ] public/track-order.html: Same as above
- [ ] public/admin/admin.html: Same as above
- [ ] public/components/header.html: Change img src and href to absolute
- [ ] public/admin/components/header.html: Same as above

## 2. Fix Relative Paths in JS Files

- [ ] src/js/main.js: Change image paths to absolute (e.g., "assets/images/logo.jpg" → "/assets/images/logo.jpg")
- [ ] src/js/product-details.js: Same as above

## 3. Add \_redirects File

- [ ] Create public/\_redirects with content: /\* /index.html 200

## 4. Verify Script Tags

- [ ] Ensure all script tags are at bottom or in DOMContentLoaded (already checked, seems good)

## 5. Check Case Mismatches

- [ ] Verify file names match references (seems consistent from search)
