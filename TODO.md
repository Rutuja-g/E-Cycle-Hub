# TODO: Fix Orders Page and Modal

## Tasks

- [ ] Update HTML: Change `.orders-container` to `.orders-wrap` in public/orders.html
- [ ] Update CSS: Add `.orders-wrap` for single-column layout in public/css/main.css
- [ ] Update CSS: Rename and update `.order-item` to `.order-card` with uniform white background, flex layout
- [ ] Update CSS: Add `.order-header`, `.order-meta`, `.order-summary` for content alignment
- [ ] Update CSS: Update `.order-actions` for side-by-side buttons with mobile stack
- [ ] Update CSS: Update modal styles for centering, z-index, backdrop
- [ ] Update CSS: Add `.order-total` for high contrast
- [ ] Update CSS: Add responsive adjustments
- [ ] Update JS: Add `formatOrderId()` function in src/js/orders.js
- [ ] Update JS: Update `renderOrders()` to use `.order-card`, remove alt class, new structure, format IDs
- [ ] Update JS: Update `viewOrderDetails()` to format ID in title, ensure centering, add accessibility
- [ ] Update JS: Move modal to `document.body` to avoid clipping
- [ ] Test in browser: Cards uniform, modal centered, buttons aligned, no stray details
- [ ] Commit with message: "Fix: restore orders page layout, center modal, button alignment, readable totals, friendly order IDs"
