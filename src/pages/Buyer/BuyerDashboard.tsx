import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Product } from '../../types/interfaces';
import { ProductCategory, EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import './BuyerDashboard.css';

const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState(0);

  const { user, logout } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent(EventType.BROWSE_PRODUCTS);
    loadProducts();
    updateCartCount();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const loadProducts = () => {
    const allProducts = dataService.getAllProducts();
    setProducts(allProducts);
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId: string) => {
    trackEvent(EventType.VIEW_PRODUCT_DETAILS, { productId });
    navigate(`/buyer/product/${productId}`);
  };

  const handleViewCart = () => {
    navigate('/buyer/cart');
  };

  const handleLogout = () => {
    trackEvent(EventType.LOGOUT);
    logout();
    navigate('/');
  };

  return (
    <div className="buyer-dashboard">
      <header className="buyer-header">
        <div className="header-content">
          <h1>🛍️ E-Commerce Store</h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Buyer</span>
            </div>
            <button onClick={handleViewCart} className="cart-button">
              🛒 Cart ({cartCount})
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="buyer-content">
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            <button
              className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Products
            </button>
            {Object.values(ProductCategory).map(category => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="product-image">
                  <img src={product.images[0]} alt={product.name} />
                  <div className="product-badge">{product.category}</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-description">
                    {product.description.substring(0, 80)}...
                  </p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <span className="product-stock">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
