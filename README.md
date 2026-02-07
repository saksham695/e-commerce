# 🛍️ E-Commerce Platform

A full-featured, production-ready e-commerce platform with role-based access control, built with React, TypeScript, and modern web technologies.

## 🌟 Features

### 🚀 **Modern React Practices**
- **Custom Hooks**: useLocalStorage, useDebounce, useToast, useWishlist, useAsync
- **Lazy Loading**: Code splitting for optimal performance
- **Memoization**: useMemo and useCallback for optimization
- **Toast Notifications**: Beautiful, auto-dismissing notifications
- **Skeleton Loaders**: Smooth loading states
- **TypeScript**: Strict typing throughout

### 🔐 **Role-Based Authentication**
- **Three distinct user roles**: Admin, Seller, and Buyer
- Secure login with role selection
- Protected routes based on user permissions
- Persistent authentication using localStorage

### 👤 **User Panels**

#### **Buyer Panel** 🛒
- **Product Browsing**:
  - Grid/List view toggle
  - Advanced filters (category, price range, ratings)
  - Debounced search (300ms delay)
  - Sort by newest, price, rating, popularity
  - Skeleton loading states
- **Product Features**:
  - Star ratings and review counts
  - Wishlist/Favorites with heart icons
  - Product view tracking
  - Discount badges
  - Stock indicators
- **Shopping Experience**:
  - Add to cart with quantity selection
  - Shopping cart management
  - Checkout with order placement
  - Real-time cart and wishlist counts
  - Toast notifications for actions

#### **Seller Panel** 📦
- Dashboard with product statistics
- Create new products with comprehensive forms
- Edit existing products
- Delete products
- View all seller's products in table format
- Track product status and inventory

#### **Admin Panel** 🎯
- Complete dashboard with system metrics
- View all sellers and buyers
- Track total products, orders, and events
- Recent activity feed
- User journey visualization with React Flow
- Click on any user to view their complete journey

### 📊 **Event Tracking System**
- Tracks all user actions throughout the platform
- Events include:
  - Authentication (login/logout)
  - Product browsing and viewing
  - Cart operations
  - Purchases
  - Product management (CRUD operations)
  - Dashboard visits
- Real-time event logging
- Persistent storage for analytics

### 🗺️ **User Journey Visualization**
- Interactive React Flow diagrams
- Visual representation of user actions over time
- Color-coded events by type
- Detailed event information on click
- Minimap for easy navigation
- Animated flow connections

## 🚀 Tech Stack

- **Frontend**: React 18.2.0 with modern hooks
- **Language**: TypeScript 4.9.5 (Strict mode)
- **Routing**: React Router DOM 6.x with lazy loading
- **Visualization**: React Flow for journey tracking
- **Styling**: CSS3 (Custom, modern gradients)
- **State Management**: React Context API + Custom Hooks
- **Build Tool**: Create React App with code splitting
- **Performance**: Memoization, debouncing, lazy loading
- **UI Components**: Custom reusable components
- **Version Control**: Git

## 📁 Project Structure

```
e-commerce/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx        # Route protection
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Authentication state
│   │   └── EventContext.tsx          # Event tracking
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx    # Admin dashboard
│   │   │   └── UserJourney.tsx       # Journey visualization
│   │   ├── Buyer/
│   │   │   ├── BuyerDashboard.tsx    # Product listing
│   │   │   ├── ProductDetail.tsx     # Product details
│   │   │   └── Cart.tsx              # Shopping cart
│   │   ├── Seller/
│   │   │   ├── SellerDashboard.tsx   # Seller dashboard
│   │   │   └── ProductForm.tsx       # Product CRUD
│   │   └── Login/
│   │       └── Login.tsx             # Login page
│   ├── services/
│   │   └── dataService.ts            # Data management
│   ├── types/
│   │   ├── enums.ts                  # TypeScript enums
│   │   └── interfaces.ts             # TypeScript interfaces
│   ├── App.tsx                       # Main app component
│   └── index.tsx                     # Entry point
├── public/
├── package.json
└── tsconfig.json
```

## 🎯 User Roles & Enums

### UserRole Enum
```typescript
enum UserRole {
  ADMIN = 'admin',
  SELLER_USER = 'seller_user',
  BUYER_USER = 'buyer_user',
}
```

### EventType Enum
```typescript
enum EventType {
  LOGIN, LOGOUT,
  BROWSE_PRODUCTS, VIEW_PRODUCT_DETAILS,
  ADD_TO_CART, REMOVE_FROM_CART,
  PROCEED_TO_CHECKOUT, COMPLETE_PURCHASE,
  CREATE_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT,
  VIEW_ADMIN_DASHBOARD, VIEW_SELLERS_LIST,
  VIEW_BUYERS_LIST, VIEW_USER_JOURNEY, VIEW_METRICS,
  // ... and more
}
```

### ProductCategory Enum
```typescript
enum ProductCategory {
  ELECTRONICS, CLOTHING, FOOD,
  HOME, BOOKS, SPORTS, TOYS,
  BEAUTY, AUTOMOTIVE, OTHER
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/saksham695/e-commerce.git
cd e-commerce
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Available Scripts

```bash
npm start       # Start development server
npm build       # Build for production
npm test        # Run tests
npm eject       # Eject from CRA (one-way operation)
```

## 👥 Demo Credentials

### Login as Admin
- **Email**: admin@ecommerce.com
- **Password**: Any password (6+ characters)
- **Role**: Select "Admin" from dropdown

### Login as Seller
- **Email**: seller@example.com
- **Password**: Any password (6+ characters)
- **Role**: Select "Seller" from dropdown

### Login as Buyer
- **Email**: buyer@example.com
- **Password**: Any password (6+ characters)
- **Role**: Select "Buyer" from dropdown

## 💡 Key Features Explained

### Product Management (Seller)
Sellers can create products with comprehensive details:
- **Basic Info**: Name, description, brand, category
- **Pricing**: Price and stock quantity
- **Media**: Multiple product images (URLs)
- **Specifications**: Custom key-value pairs
- **Additional Details**: Weight, dimensions, warranty, return policy
- **Status**: Active, inactive, or out of stock

### Event Tracking
Every user action is tracked and stored:
- Automatically captures user ID, name, and role
- Timestamps for all events
- Optional metadata for additional context
- Accessible to admin for analytics

### Journey Visualization
Admin can view any user's complete journey:
- Visual flow diagram using React Flow
- Events displayed chronologically
- Color-coded by event type
- Interactive nodes with detailed information
- Minimap for navigation

## 🎨 Design Philosophy

- **Modern UI**: Gradient backgrounds, smooth transitions, card-based layouts
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive**: Clear navigation and user-friendly interfaces
- **Consistent**: Unified design language across all panels
- **Accessible**: Proper contrast, readable fonts, clear CTAs

## 🔒 Security Features

- Role-based access control (RBAC)
- Protected routes preventing unauthorized access
- Input validation on all forms
- Type-safe operations with TypeScript
- Secure state management

## 📊 Data Flow

1. **Authentication**: User logs in → AuthContext stores user → Role-based redirect
2. **Event Tracking**: User action → EventContext captures → localStorage persistence
3. **Data Operations**: Component → dataService → localStorage → Update state
4. **Journey View**: Admin requests → Filter events by user → Generate flow diagram

## ✅ Recently Added Features

- [x] Custom React hooks for reusable logic
- [x] Lazy loading and code splitting
- [x] Toast notification system
- [x] Skeleton loading states
- [x] Wishlist/Favorites system
- [x] Product ratings and reviews infrastructure
- [x] Advanced filters (price, rating, category)
- [x] Multiple sort options
- [x] Grid/List view toggle
- [x] Debounced search optimization
- [x] Sales analytics for sellers
- [x] Breadcrumb navigation

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Order tracking system
- [ ] Recently viewed products
- [ ] Product comparison
- [ ] Export capabilities (CSV/PDF)
- [ ] Multi-language support
- [ ] Real-time notifications

📖 **See [MODERN_FEATURES.md](./MODERN_FEATURES.md) for detailed comparison with Amazon, Shopify, and other e-commerce giants!**

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Saksham Kumar**
- Email: saksham695@gmail.com
- GitHub: [@saksham695](https://github.com/saksham695)

## 🙏 Acknowledgments

- React team for the amazing framework
- React Flow for the visualization library
- Create React App for the build setup

---

**Built with ❤️ using React and TypeScript**
