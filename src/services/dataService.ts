import { Product, User, Order, CartItem } from '../types/interfaces';
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
  }

  private generateMockProducts(): Product[] {
    const categories = Object.values(ProductCategory);
    const products: Product[] = [];

    const productTemplates = [
      { name: 'Wireless Bluetooth Headphones', category: ProductCategory.ELECTRONICS, price: 89.99, brand: 'AudioTech' },
      { name: 'Smart Watch Series 5', category: ProductCategory.ELECTRONICS, price: 299.99, brand: 'TechTime' },
      { name: 'Premium Cotton T-Shirt', category: ProductCategory.CLOTHING, price: 24.99, brand: 'StyleCo' },
      { name: 'Designer Jeans', category: ProductCategory.CLOTHING, price: 79.99, brand: 'DenimPro' },
      { name: 'Organic Green Tea Pack', category: ProductCategory.FOOD, price: 12.99, brand: 'HealthyLeaf' },
      { name: 'LED Desk Lamp', category: ProductCategory.HOME, price: 45.99, brand: 'BrightHome' },
      { name: 'Fiction Bestseller Collection', category: ProductCategory.BOOKS, price: 34.99, brand: 'BookWorld' },
      { name: 'Yoga Mat Premium', category: ProductCategory.SPORTS, price: 29.99, brand: 'FitLife' },
      { name: 'Building Blocks Set', category: ProductCategory.TOYS, price: 49.99, brand: 'PlayFun' },
      { name: 'Skincare Kit', category: ProductCategory.BEAUTY, price: 64.99, brand: 'GlowBeauty' },
    ];

    productTemplates.forEach((template, index) => {
      products.push({
        id: uuidv4(),
        sellerId: `seller-${(index % 3) + 1}`,
        sellerName: `Seller ${(index % 3) + 1}`,
        name: template.name,
        description: `High-quality ${template.name.toLowerCase()} with excellent features and durability. Perfect for everyday use.`,
        category: template.category,
        price: template.price,
        stock: Math.floor(Math.random() * 100) + 20,
        images: [
          `https://via.placeholder.com/400x300?text=${encodeURIComponent(template.name)}`,
          `https://via.placeholder.com/400x300?text=${encodeURIComponent(template.name)}+2`,
        ],
        specifications: {
          'Material': 'Premium Quality',
          'Color': 'Multiple Options',
          'Size': 'Standard',
        },
        brand: template.brand,
        weight: '500g',
        dimensions: '20x15x10 cm',
        warranty: '1 Year',
        returnPolicy: '30 days return',
        status: ProductStatus.ACTIVE,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
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
        email: 'seller1@example.com',
        name: 'Seller One',
        role: UserRole.SELLER_USER,
        createdAt: new Date('2024-02-01'),
      },
      {
        id: 'seller-2',
        email: 'seller2@example.com',
        name: 'Seller Two',
        role: UserRole.SELLER_USER,
        createdAt: new Date('2024-02-15'),
      },
      {
        id: 'buyer-1',
        email: 'buyer1@example.com',
        name: 'Buyer One',
        role: UserRole.BUYER_USER,
        createdAt: new Date('2024-03-01'),
      },
      {
        id: 'buyer-2',
        email: 'buyer2@example.com',
        name: 'Buyer Two',
        role: UserRole.BUYER_USER,
        createdAt: new Date('2024-03-10'),
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
}

export const dataService = new DataService();
