import { UserRole, EventType, ProductCategory, ProductStatus, OrderStatus } from './enums';

/**
 * User Interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  avatar?: string;
}

/**
 * Product Review Interface
 */
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/**
 * Product Interface
 */
export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  brand: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  returnPolicy?: string;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product Form Data Interface
 */
export interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  brand: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  returnPolicy?: string;
}

/**
 * Cart Item Interface
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Order Interface
 */
export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Interface for Journey Tracking
 */
export interface Event {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  eventType: EventType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Dashboard Metrics Interface
 */
export interface DashboardMetrics {
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeSellers: number;
  activeBuyers: number;
  recentEvents: Event[];
}

/**
 * Seller Analytics Interface
 */
export interface SellerAnalytics {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  topSellingProducts: Product[];
  recentOrders: Order[];
  salesByCategory: Record<string, number>;
  monthlyRevenue: { month: string; revenue: number }[];
}

/**
 * Filter Options Interface
 */
export interface FilterOptions {
  categories: ProductCategory[];
  priceRange: { min: number; max: number };
  rating: number;
  inStock: boolean;
}

/**
 * Sort Options Type
 */
export type SortOption = 
  | 'newest'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating'
  | 'popular';

/**
 * View Mode Type
 */
export type ViewMode = 'grid' | 'list';

/**
 * User Journey Node for React Flow
 */
export interface JourneyNode {
  id: string;
  type: string;
  data: {
    label: string;
    eventType: EventType;
    timestamp: Date;
    metadata?: Record<string, any>;
  };
  position: { x: number; y: number };
}

/**
 * Authentication Context Interface
 */
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

/**
 * Event Context Interface
 */
export interface EventContextType {
  events: Event[];
  trackEvent: (eventType: EventType, metadata?: Record<string, any>) => void;
  getUserEvents: (userId: string) => Event[];
  clearEvents: () => void;
}
