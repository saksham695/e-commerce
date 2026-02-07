/**
 * User Roles Enum
 * Defines the three main roles in the e-commerce system
 */
export enum UserRole {
  ADMIN = 'admin',
  SELLER_USER = 'seller_user',
  BUYER_USER = 'buyer_user',
}

/**
 * Event Types for Journey Tracking
 */
export enum EventType {
  // Authentication Events
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  
  // Buyer Events
  BROWSE_PRODUCTS = 'BROWSE_PRODUCTS',
  VIEW_PRODUCT_DETAILS = 'VIEW_PRODUCT_DETAILS',
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  VIEW_CART = 'VIEW_CART',
  VIEW_ORDERS = 'VIEW_ORDERS',
  PROCEED_TO_CHECKOUT = 'PROCEED_TO_CHECKOUT',
  COMPLETE_PURCHASE = 'COMPLETE_PURCHASE',
  
  // Seller Events
  VIEW_SELLER_DASHBOARD = 'VIEW_SELLER_DASHBOARD',
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  EDIT_PRODUCT = 'EDIT_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  VIEW_PRODUCT_LIST = 'VIEW_PRODUCT_LIST',
  
  // Admin Events
  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
  VIEW_SELLERS_LIST = 'VIEW_SELLERS_LIST',
  VIEW_BUYERS_LIST = 'VIEW_BUYERS_LIST',
  VIEW_USER_JOURNEY = 'VIEW_USER_JOURNEY',
  VIEW_METRICS = 'VIEW_METRICS',
}

/**
 * Product Category Enum
 */
export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  CLOTHING = 'Clothing',
  FOOD = 'Food & Beverages',
  HOME = 'Home & Garden',
  BOOKS = 'Books',
  SPORTS = 'Sports & Outdoors',
  TOYS = 'Toys & Games',
  BEAUTY = 'Beauty & Personal Care',
  AUTOMOTIVE = 'Automotive',
  OTHER = 'Other',
}

/**
 * Product Status Enum
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

/**
 * Order Status Enum
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
