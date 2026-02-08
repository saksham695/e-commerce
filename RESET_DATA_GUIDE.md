# 🔄 Reset Mock Data Guide

## Problem: Seller Dashboard Shows 0 Products

If you're seeing 0 products in the seller dashboard, it's likely because your localStorage has old/inconsistent data.

## Quick Fix - 3 Methods

### **Method 1: Console Command (Recommended)**
1. Open the app in your browser: `http://localhost:3000`
2. Open browser console (F12 or Right-click → Inspect → Console)
3. Type: `resetMockData()`
4. Press Enter
5. ✅ Page will reload with fresh mock data!

### **Method 2: Manual localStorage Clear**
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Reload the page (Ctrl+R or Cmd+R)
5. ✅ Fresh mock data will be generated!

### **Method 3: Browser DevTools**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" → `http://localhost:3000`
4. Right-click → "Clear"
5. Reload the page
6. ✅ Fresh mock data generated!

---

## Verify Mock Data is Loaded

### **Check Seller 1 (TechGadgets Pro)**
1. Login: `seller@example.com` / `password`
2. You should see **24 electronics products**
3. Products include: Headphones, Smart Watch, Gaming Mouse, etc.

### **Check Seller 2 (StyleHub Fashion)**
1. Login: `seller2@example.com` / `password`
2. You should see **24 fashion/lifestyle products**
3. Products include: T-Shirts, Jeans, Yoga Mat, etc.

### **Check Buyer Panel**
1. Login: `buyer@example.com` / `password`
2. You should see **48 total products** (24 from each seller)
3. Use filters to browse by category

---

## Current Mock Data Structure

### **Users**:
```javascript
{
  id: 'seller-1',
  email: 'seller@example.com',
  name: 'TechGadgets Pro',
  role: 'SELLER_USER'
}

{
  id: 'seller-2',
  email: 'seller2@example.com',
  name: 'StyleHub Fashion',
  role: 'SELLER_USER'
}
```

### **Products**:
```javascript
// Seller 1 products
{
  id: 'uuid...',
  sellerId: 'seller-1',  // ← Matches user ID
  sellerName: 'TechGadgets Pro',
  name: 'Wireless Bluetooth Headphones',
  price: 89.99,
  // ... other fields
}

// Seller 2 products
{
  id: 'uuid...',
  sellerId: 'seller-2',  // ← Matches user ID
  sellerName: 'StyleHub Fashion',
  name: 'Premium Cotton T-Shirt',
  price: 24.99,
  // ... other fields
}
```

---

## Troubleshooting

### **Still seeing 0 products after reset?**

1. **Check browser console for errors**
   - Look for any red error messages
   - Take a screenshot if needed

2. **Verify you're logged in as the correct seller**
   - Seller 1: `seller@example.com`
   - Seller 2: `seller2@example.com`

3. **Check localStorage in console**:
   ```javascript
   // Check if products exist
   JSON.parse(localStorage.getItem('products')).length
   // Should return 48
   
   // Check if users exist
   JSON.parse(localStorage.getItem('users')).length
   // Should return 3 (1 admin, 2 sellers, 1 buyer = 4 total)
   
   // Check products for seller-1
   JSON.parse(localStorage.getItem('products'))
     .filter(p => p.sellerId === 'seller-1').length
   // Should return 24
   ```

4. **Force a hard refresh**:
   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### **Products not appearing in buyer panel?**

1. **Clear filters**:
   - Click "Clear All" button in the filters sidebar
   - Make sure no filters are active

2. **Check search box**:
   - Make sure search box is empty
   - Products might be filtered out by search term

3. **Reset data** using Method 1 above

---

## Login Credentials (After Reset)

| Role   | Email                    | Password  | Products |
|--------|--------------------------|-----------|----------|
| Admin  | admin@ecommerce.com      | password  | -        |
| Seller 1 | seller@example.com     | password  | 24       |
| Seller 2 | seller2@example.com    | password  | 24       |
| Buyer  | buyer@example.com        | password  | 48 (all) |

---

## Why This Happens

The mock data is initialized only once when `dataService` is first created. If localStorage already has data (even if it's incomplete or old), it won't regenerate.

**Common scenarios**:
- ❌ Interrupted previous session
- ❌ Code changes to data structure
- ❌ Manual localStorage modifications
- ❌ Old data from testing

**Solution**: Clear localStorage to force regeneration! ✅

---

## Need Help?

If you're still experiencing issues after trying all methods above, please provide:
1. Screenshot of seller dashboard
2. Console output from checking localStorage
3. Any error messages in console
