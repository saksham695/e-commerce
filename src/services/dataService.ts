import { Product, User, Order, CartItem, ProductReview, SellerAnalytics } from '../types/interfaces';
import { ProductCategory, ProductStatus, UserRole, OrderStatus } from '../types/enums';
import { v4 as uuidv4 } from 'uuid';

/**
 * Data Service - Manages all application data
 * In production, this would be replaced with actual API calls
 */

class DataService {
  private storageKeys = {
    products: 'products',
    users: 'users',
    orders: 'orders',
    reviews: 'reviews',
  };

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    if (!localStorage.getItem(this.storageKeys.products)) {
      const mockProducts = this.generateMockProducts();
      localStorage.setItem(this.storageKeys.products, JSON.stringify(mockProducts));
    }

    if (!localStorage.getItem(this.storageKeys.users)) {
      const mockUsers = this.generateMockUsers();
      localStorage.setItem(this.storageKeys.users, JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem(this.storageKeys.orders)) {
      localStorage.setItem(this.storageKeys.orders, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.storageKeys.reviews)) {
      localStorage.setItem(this.storageKeys.reviews, JSON.stringify([]));
    }
  }

  private generateMockProducts(): Product[] {
    const products: Product[] = [];

    // SELLER 1: TechGadgets Pro (Electronics & Tech Focus)
    const seller1Products: Array<{ name: string; category: ProductCategory; price: number; brand: string; specs: Record<string, string> }> = [
      { name: 'Wireless Bluetooth Headphones', category: ProductCategory.ELECTRONICS, price: 89.99, brand: 'AudioTech', specs: { 'Battery Life': '30 hours', 'Bluetooth': '5.0', 'Noise Cancelling': 'Yes' } },
      { name: 'Smart Watch Series 5', category: ProductCategory.ELECTRONICS, price: 299.99, brand: 'TechTime', specs: { 'Display': 'AMOLED', 'Water Resistance': 'IP68', 'Battery': '48 hours' } },
      { name: 'Wireless Gaming Mouse', category: ProductCategory.ELECTRONICS, price: 79.99, brand: 'GamePro', specs: { 'DPI': '16000', 'Battery': '70 hours', 'Buttons': '8' } },
      { name: '4K Webcam', category: ProductCategory.ELECTRONICS, price: 149.99, brand: 'StreamTech', specs: { 'Resolution': '4K', 'Frame Rate': '60fps', 'Microphone': 'Built-in' } },
      { name: 'Mechanical Keyboard RGB', category: ProductCategory.ELECTRONICS, price: 129.99, brand: 'KeyMaster', specs: { 'Switch Type': 'Cherry MX', 'RGB': 'Yes', 'Wireless': 'Yes' } },
      { name: 'USB-C Hub 7-in-1', category: ProductCategory.ELECTRONICS, price: 49.99, brand: 'ConnectHub', specs: { 'Ports': '7', 'Power Delivery': '100W', 'Data Speed': '5Gbps' } },
      { name: 'Portable SSD 1TB', category: ProductCategory.ELECTRONICS, price: 159.99, brand: 'StoragePlus', specs: { 'Capacity': '1TB', 'Speed': '1000MB/s', 'Interface': 'USB 3.2' } },
      { name: 'Wireless Earbuds Pro', category: ProductCategory.ELECTRONICS, price: 179.99, brand: 'AudioTech', specs: { 'ANC': 'Yes', 'Battery': '8 hours', 'Charging Case': '32 hours' } },
      { name: 'LED Monitor 27 inch', category: ProductCategory.ELECTRONICS, price: 349.99, brand: 'ViewPro', specs: { 'Size': '27 inch', 'Resolution': '2K', 'Refresh Rate': '144Hz' } },
      { name: 'Laptop Stand Adjustable', category: ProductCategory.ELECTRONICS, price: 39.99, brand: 'ErgoPro', specs: { 'Material': 'Aluminum', 'Angles': '6', 'Weight Capacity': '10kg' } },
      { name: 'Phone Gimbal Stabilizer', category: ProductCategory.ELECTRONICS, price: 119.99, brand: 'SmoothShot', specs: { 'Battery': '12 hours', 'Load': '300g', 'Axis': '3-axis' } },
      { name: 'Smart LED Bulb (4 pack)', category: ProductCategory.ELECTRONICS, price: 54.99, brand: 'SmartLight', specs: { 'Brightness': '800 lumens', 'WiFi': 'Yes', 'Colors': '16 million' } },
      { name: 'Tablet 10.5 inch', category: ProductCategory.ELECTRONICS, price: 279.99, brand: 'TabletPro', specs: { 'Display': '10.5 inch', 'Storage': '128GB', 'RAM': '6GB' } },
      { name: 'Power Bank 20000mAh', category: ProductCategory.ELECTRONICS, price: 44.99, brand: 'ChargeFast', specs: { 'Capacity': '20000mAh', 'Fast Charge': 'Yes', 'Ports': '3' } },
      { name: 'Wireless Charging Pad', category: ProductCategory.ELECTRONICS, price: 29.99, brand: 'ChargePro', specs: { 'Power': '15W', 'Compatibility': 'Universal', 'LED': 'Yes' } },
      { name: 'Bluetooth Speaker', category: ProductCategory.ELECTRONICS, price: 69.99, brand: 'SoundWave', specs: { 'Battery': '12 hours', 'Waterproof': 'IPX7', 'Power': '20W' } },
      { name: 'Action Camera 4K', category: ProductCategory.ELECTRONICS, price: 199.99, brand: 'AdventureCam', specs: { 'Resolution': '4K', 'Waterproof': '10m', 'Screen': 'Touch' } },
      { name: 'Ring Light 18 inch', category: ProductCategory.ELECTRONICS, price: 79.99, brand: 'StudioLight', specs: { 'Diameter': '18 inch', 'Brightness': 'Dimmable', 'Stand': 'Included' } },
      { name: 'Gaming Headset RGB', category: ProductCategory.ELECTRONICS, price: 99.99, brand: 'GameSound', specs: { 'Surround': '7.1', 'Microphone': 'Detachable', 'RGB': 'Yes' } },
      { name: 'Smart Doorbell Camera', category: ProductCategory.ELECTRONICS, price: 129.99, brand: 'SecureHome', specs: { 'Resolution': '1080p', 'Night Vision': 'Yes', 'WiFi': 'Yes' } },
      { name: 'Fitness Tracker Band', category: ProductCategory.ELECTRONICS, price: 59.99, brand: 'FitTrack', specs: { 'Heart Rate': 'Yes', 'Waterproof': 'Yes', 'Battery': '7 days' } },
      { name: 'Mini Projector', category: ProductCategory.ELECTRONICS, price: 199.99, brand: 'ProjectPro', specs: { 'Resolution': '1080p', 'Brightness': '200 ANSI', 'Screen': '120 inch' } },
      { name: 'Cable Management Kit', category: ProductCategory.ELECTRONICS, price: 24.99, brand: 'OrganizePro', specs: { 'Pieces': '20', 'Material': 'Silicone', 'Adhesive': 'Yes' } },
      { name: 'Laptop Sleeve 15 inch', category: ProductCategory.ELECTRONICS, price: 34.99, brand: 'ProtectTech', specs: { 'Size': '15 inch', 'Material': 'Neoprene', 'Pockets': '2' } },
    ];

    // SELLER 2: StyleHub Fashion (Fashion, Home & Lifestyle Focus)
    const seller2Products: Array<{ name: string; category: ProductCategory; price: number; brand: string; specs: Record<string, string> }> = [
      { name: 'Premium Cotton T-Shirt', category: ProductCategory.CLOTHING, price: 24.99, brand: 'StyleHub', specs: { 'Material': '100% Cotton', 'Fit': 'Regular', 'Care': 'Machine Wash' } },
      { name: 'Designer Jeans', category: ProductCategory.CLOTHING, price: 79.99, brand: 'DenimPro', specs: { 'Fit': 'Slim', 'Stretch': 'Yes', 'Rise': 'Mid' } },
      { name: 'Casual Sneakers', category: ProductCategory.CLOTHING, price: 89.99, brand: 'FootStyle', specs: { 'Material': 'Canvas', 'Sole': 'Rubber', 'Closure': 'Lace' } },
      { name: 'Leather Jacket', category: ProductCategory.CLOTHING, price: 199.99, brand: 'LeatherLux', specs: { 'Material': 'Genuine Leather', 'Lining': 'Polyester', 'Pockets': '4' } },
      { name: 'Winter Hoodie', category: ProductCategory.CLOTHING, price: 49.99, brand: 'CozyWear', specs: { 'Material': 'Cotton Blend', 'Hood': 'Adjustable', 'Pockets': 'Kangaroo' } },
      { name: 'Formal Shirt', category: ProductCategory.CLOTHING, price: 39.99, brand: 'FormalFit', specs: { 'Material': 'Cotton', 'Collar': 'Spread', 'Fit': 'Slim' } },
      { name: 'Sports Shorts', category: ProductCategory.CLOTHING, price: 29.99, brand: 'ActiveWear', specs: { 'Material': 'Polyester', 'Length': 'Above Knee', 'Pockets': '2' } },
      { name: 'Sunglasses UV400', category: ProductCategory.CLOTHING, price: 59.99, brand: 'ShadeStyle', specs: { 'UV Protection': '400', 'Frame': 'Metal', 'Lens': 'Polarized' } },
      { name: 'Organic Green Tea (50 bags)', category: ProductCategory.FOOD, price: 12.99, brand: 'HealthyLeaf', specs: { 'Quantity': '50 bags', 'Type': 'Green Tea', 'Organic': 'Yes' } },
      { name: 'Artisan Coffee Beans 1kg', category: ProductCategory.FOOD, price: 24.99, brand: 'BrewMaster', specs: { 'Weight': '1kg', 'Roast': 'Medium', 'Origin': 'Ethiopia' } },
      { name: 'Protein Powder 2kg', category: ProductCategory.FOOD, price: 49.99, brand: 'FitNutrition', specs: { 'Weight': '2kg', 'Protein': '25g per serving', 'Flavor': 'Chocolate' } },
      { name: 'LED Desk Lamp', category: ProductCategory.HOME, price: 45.99, brand: 'BrightHome', specs: { 'Brightness': 'Adjustable', 'Color Temp': '3000K-6000K', 'Power': '12W' } },
      { name: 'Ceramic Dinner Set', category: ProductCategory.HOME, price: 89.99, brand: 'HomeElegance', specs: { 'Pieces': '16', 'Material': 'Ceramic', 'Dishwasher Safe': 'Yes' } },
      { name: 'Bed Sheet Set Queen', category: ProductCategory.HOME, price: 54.99, brand: 'ComfortSleep', specs: { 'Size': 'Queen', 'Thread Count': '400', 'Material': 'Cotton' } },
      { name: 'Wall Art Canvas 3-piece', category: ProductCategory.HOME, price: 79.99, brand: 'ArtDecor', specs: { 'Size': '24x16 inch', 'Material': 'Canvas', 'Frame': 'Included' } },
      { name: 'Aromatherapy Diffuser', category: ProductCategory.HOME, price: 39.99, brand: 'ZenHome', specs: { 'Capacity': '300ml', 'Runtime': '10 hours', 'LED': '7 colors' } },
      { name: 'Yoga Mat Premium', category: ProductCategory.SPORTS, price: 29.99, brand: 'FitLife', specs: { 'Thickness': '6mm', 'Material': 'TPE', 'Non-slip': 'Yes' } },
      { name: 'Dumbbell Set 20kg', category: ProductCategory.SPORTS, price: 99.99, brand: 'PowerFit', specs: { 'Weight': '20kg', 'Adjustable': 'Yes', 'Material': 'Cast Iron' } },
      { name: 'Running Shoes', category: ProductCategory.SPORTS, price: 119.99, brand: 'RunFast', specs: { 'Type': 'Road Running', 'Cushion': 'High', 'Weight': '250g' } },
      { name: 'Fiction Bestseller Collection', category: ProductCategory.BOOKS, price: 34.99, brand: 'BookWorld', specs: { 'Books': '3', 'Genre': 'Fiction', 'Language': 'English' } },
      { name: 'Cookbook Healthy Living', category: ProductCategory.BOOKS, price: 29.99, brand: 'HealthyBooks', specs: { 'Pages': '300', 'Recipes': '150', 'Hardcover': 'Yes' } },
      { name: 'Building Blocks Set', category: ProductCategory.TOYS, price: 49.99, brand: 'PlayFun', specs: { 'Pieces': '500', 'Age': '6+', 'Material': 'ABS Plastic' } },
      { name: 'Remote Control Car', category: ProductCategory.TOYS, price: 69.99, brand: 'SpeedRacer', specs: { 'Scale': '1:16', 'Speed': '25 km/h', 'Battery': 'Rechargeable' } },
      { name: 'Skincare Kit 5-piece', category: ProductCategory.BEAUTY, price: 64.99, brand: 'GlowBeauty', specs: { 'Pieces': '5', 'Skin Type': 'All', 'Natural': 'Yes' } },
      { name: 'Hair Dryer Professional', category: ProductCategory.BEAUTY, price: 89.99, brand: 'SalonPro', specs: { 'Power': '2000W', 'Heat Settings': '3', 'Cool Shot': 'Yes' } },
      { name: 'Perfume Luxury 100ml', category: ProductCategory.BEAUTY, price: 149.99, brand: 'FragranceLux', specs: { 'Volume': '100ml', 'Type': 'Eau de Parfum', 'Notes': 'Floral' } },
    ];

    // Add Seller 1 Products (TechGadgets Pro)
    seller1Products.forEach((template, index) => {
      products.push({
        id: uuidv4(),
        sellerId: 'seller-1',
        sellerName: 'TechGadgets Pro',
        name: template.name,
        description: `High-quality ${template.name.toLowerCase()} with excellent features and durability. Perfect for tech enthusiasts and everyday use.`,
        category: template.category,
        price: template.price,
        originalPrice: template.price * 1.2,
        discount: Math.floor(Math.random() * 20) + 5,
        stock: Math.floor(Math.random() * 50) + 10,
        images: [
          `https://placehold.co/400x300/0ea5e9/white?text=${encodeURIComponent(template.name)}`,
          `https://placehold.co/400x300/38bdf8/white?text=${encodeURIComponent(template.name)}+2`,
        ],
        specifications: template.specs,
        brand: template.brand,
        weight: `${Math.floor(Math.random() * 1000) + 100}g`,
        dimensions: `${Math.floor(Math.random() * 20) + 10}x${Math.floor(Math.random() * 15) + 10}x${Math.floor(Math.random() * 10) + 5} cm`,
        warranty: ['6 Months', '1 Year', '2 Years'][Math.floor(Math.random() * 3)],
        returnPolicy: '30 days return',
        status: ProductStatus.ACTIVE,
        rating: Math.random() * 1.5 + 3.5,
        reviewCount: Math.floor(Math.random() * 80) + 10,
        views: Math.floor(Math.random() * 2000) + 200,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    });

    // Add Seller 2 Products (StyleHub Fashion)
    seller2Products.forEach((template, index) => {
      products.push({
        id: uuidv4(),
        sellerId: 'seller-2',
        sellerName: 'StyleHub Fashion',
        name: template.name,
        description: `Premium ${template.name.toLowerCase()} crafted with care. Stylish, comfortable, and perfect for modern lifestyle.`,
        category: template.category,
        price: template.price,
        originalPrice: template.price * 1.15,
        discount: Math.floor(Math.random() * 15) + 5,
        stock: Math.floor(Math.random() * 80) + 15,
        images: [
          `https://placehold.co/400x300/10b981/white?text=${encodeURIComponent(template.name)}`,
          `https://placehold.co/400x300/34d399/white?text=${encodeURIComponent(template.name)}+2`,
        ],
        specifications: template.specs,
        brand: template.brand,
        weight: `${Math.floor(Math.random() * 800) + 200}g`,
        dimensions: `${Math.floor(Math.random() * 25) + 15}x${Math.floor(Math.random() * 20) + 10}x${Math.floor(Math.random() * 8) + 3} cm`,
        warranty: ['No Warranty', '6 Months', '1 Year'][Math.floor(Math.random() * 3)],
        returnPolicy: '30 days return',
        status: ProductStatus.ACTIVE,
        rating: Math.random() * 1.5 + 3.5,
        reviewCount: Math.floor(Math.random() * 60) + 5,
        views: Math.floor(Math.random() * 1500) + 150,
        createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    });

    return products;
  }

  private generateMockUsers(): User[] {
    return [
      {
        id: 'admin-1',
        email: 'admin@ecommerce.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'seller-1',
        email: 'seller@example.com',
        name: 'TechGadgets Pro',
        role: UserRole.SELLER_USER,
        createdAt: new Date('2024-02-01'),
      },
      {
        id: 'seller-2',
        email: 'seller2@example.com',
        name: 'StyleHub Fashion',
        role: UserRole.SELLER_USER,
        createdAt: new Date('2024-02-15'),
      },
      {
        id: 'buyer-1',
        email: 'buyer@example.com',
        name: 'John Doe',
        role: UserRole.BUYER_USER,
        createdAt: new Date('2024-03-01'),
      },
    ];
  }

  // Product Methods
  getAllProducts(): Product[] {
    const products = localStorage.getItem(this.storageKeys.products);
    if (!products) return [];
    return JSON.parse(products).map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  }

  getProductById(id: string): Product | null {
    const products = this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  getProductsBySeller(sellerId: string): Product[] {
    return this.getAllProducts().filter(p => p.sellerId === sellerId);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getAllProducts();
    const newProduct: Product = {
      ...productData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    products.push(newProduct);
    localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date(),
    };
    localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getAllProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    if (filteredProducts.length === products.length) return false;
    
    localStorage.setItem(this.storageKeys.products, JSON.stringify(filteredProducts));
    return true;
  }

  // User Methods
  getAllUsers(): User[] {
    const users = localStorage.getItem(this.storageKeys.users);
    if (!users) return [];
    return JSON.parse(users).map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }));
  }

  getUsersByRole(role: UserRole): User[] {
    return this.getAllUsers().filter(u => u.role === role);
  }

  // Order Methods
  getAllOrders(): Order[] {
    const orders = localStorage.getItem(this.storageKeys.orders);
    if (!orders) return [];
    return JSON.parse(orders).map((o: any) => ({
      ...o,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt),
    }));
  }

  createOrder(buyerId: string, buyerName: string, items: CartItem[], shippingAddress: string): Order {
    const orders = this.getAllOrders();
    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: uuidv4(),
      buyerId,
      buyerName,
      items,
      totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(newOrder);
    localStorage.setItem(this.storageKeys.orders, JSON.stringify(orders));
    return newOrder;
  }

  getOrdersByBuyer(buyerId: string): Order[] {
    return this.getAllOrders().filter(o => o.buyerId === buyerId);
  }

  // Review Methods
  getAllReviews(): ProductReview[] {
    const reviews = localStorage.getItem(this.storageKeys.reviews);
    if (!reviews) return [];
    return JSON.parse(reviews).map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  }

  getProductReviews(productId: string): ProductReview[] {
    return this.getAllReviews().filter(r => r.productId === productId);
  }

  createReview(review: Omit<ProductReview, 'id' | 'createdAt'>): ProductReview {
    const reviews = this.getAllReviews();
    const newReview: ProductReview = {
      ...review,
      id: uuidv4(),
      createdAt: new Date(),
    };
    reviews.push(newReview);
    localStorage.setItem(this.storageKeys.reviews, JSON.stringify(reviews));

    // Update product rating
    this.updateProductRating(review.productId);
    return newReview;
  }

  private updateProductRating(productId: string) {
    const reviews = this.getProductReviews(productId);
    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    this.updateProduct(productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });
  }

  // Analytics Methods
  getSellerAnalytics(sellerId: string): SellerAnalytics {
    const products = this.getProductsBySeller(sellerId);
    const allOrders = this.getAllOrders();
    
    // Calculate sales and revenue
    let totalSales = 0;
    let totalRevenue = 0;
    const recentOrders: Order[] = [];
    
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.sellerId === sellerId) {
          totalSales += item.quantity;
          totalRevenue += item.product.price * item.quantity;
          if (!recentOrders.find(o => o.id === order.id)) {
            recentOrders.push(order);
          }
        }
      });
    });

    // Calculate average rating
    const totalRating = products.reduce((sum, p) => sum + p.rating, 0);
    const averageRating = products.length > 0 ? totalRating / products.length : 0;
    const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);

    // Top selling products
    const topSellingProducts = [...products]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Sales by category
    const salesByCategory: Record<string, number> = {};
    products.forEach(product => {
      salesByCategory[product.category] = (salesByCategory[product.category] || 0) + 1;
    });

    // Monthly revenue (mock data for last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyRevenue = monthNames.map(month => ({
      month,
      revenue: Math.random() * 10000 + 5000,
    }));

    return {
      totalProducts: products.length,
      totalSales,
      totalRevenue,
      averageRating,
      totalReviews,
      topSellingProducts,
      recentOrders: recentOrders.slice(0, 10),
      salesByCategory,
      monthlyRevenue,
    };
  }

  incrementProductViews(productId: string) {
    const product = this.getProductById(productId);
    if (product) {
      this.updateProduct(productId, { views: (product.views || 0) + 1 });
    }
  }
}

export const dataService = new DataService();
