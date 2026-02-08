import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Product } from '../../types/interfaces';
import { EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import { useToast } from '../../hooks/useToast';
import Dropdown from '../../components/Dropdown/Dropdown';
import './SellerDashboard.css';

const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    activeProducts: 0,
    totalViews: 0,
    averageRating: 0,
    totalRevenue: 0,
  });
  const [activeTab, setActiveTab] = useState<'products' | 'analytics'>('products');

  const { user, logout } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    trackEvent(EventType.VIEW_SELLER_DASHBOARD);
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = () => {
    if (!user) return;
    
    const myProducts = dataService.getProductsBySeller(user.id);
    setProducts(myProducts);

    const analytics = dataService.getSellerAnalytics(user.id);

    setStats({
      totalProducts: myProducts.length,
      totalStock: myProducts.reduce((sum, p) => sum + p.stock, 0),
      activeProducts: myProducts.filter(p => p.status === 'active').length,
      totalViews: myProducts.reduce((sum, p) => sum + (p.views || 0), 0),
      averageRating: analytics.averageRating,
      totalRevenue: analytics.totalRevenue,
    });
  };

  const handleCreateProduct = () => {
    trackEvent(EventType.CREATE_PRODUCT);
    navigate('/seller/create-product');
  };

  const handleEditProduct = (productId: string) => {
    trackEvent(EventType.EDIT_PRODUCT, { productId });
    navigate(`/seller/edit-product/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dataService.deleteProduct(productId);
      trackEvent(EventType.DELETE_PRODUCT, { productId });
      loadProducts();
    }
  };

  const handleLogout = () => {
    trackEvent(EventType.LOGOUT);
    logout();
    navigate('/');
  };

  const handleViewProfile = () => {
    toast.info('Profile page coming soon!');
  };

  const handleViewAnalytics = () => {
    setActiveTab('analytics');
  };

  const getTopProducts = () => {
    return [...products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  };

  const getProductsByCategory = () => {
    const categoryMap: Record<string, number> = {};
    products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
  };

  return (
    <div className="seller-dashboard">
      <header className="seller-header">
        <div className="header-content">
          <h1>📦 Seller Dashboard</h1>
          <div className="header-actions">
            <Dropdown
              align="right"
              trigger={
                <div className="user-dropdown-trigger-seller">
                  <div className="user-avatar-seller">{user?.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info-dropdown-seller">
                    <span className="user-name-dropdown-seller">{user?.name}</span>
                    <span className="user-role-dropdown-seller">Seller</span>
                  </div>
                  <span className="dropdown-arrow-seller">▼</span>
                </div>
              }
              items={[
                { label: 'View Profile', icon: '👤', onClick: handleViewProfile },
                { label: 'My Products', icon: '📦', onClick: () => toast.info('You are already on products page!') },
                { label: 'Analytics', icon: '📊', onClick: handleViewAnalytics },
                { label: 'Settings', icon: '⚙️', onClick: () => toast.info('Settings page coming soon!') },
                { label: 'Logout', icon: '🚪', onClick: handleLogout, danger: true },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="seller-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.activeProducts}</div>
              <div className="stat-label">Active Products</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalStock}</div>
              <div className="stat-label">Total Stock</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 My Products
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>My Products</h2>
              <button onClick={handleCreateProduct} className="create-product-btn">
                + Add New Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="no-products-seller">
                <div className="no-products-icon">📦</div>
                <h3>No products yet</h3>
                <p>Start by creating your first product</p>
                <button onClick={handleCreateProduct} className="create-first-btn">
                  Create Product
                </button>
              </div>
            ) : (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Views</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            <img src={product.images[0]} alt={product.name} className="product-thumb" />
                            <div>
                              <div className="product-name-table">{product.name}</div>
                              <div className="product-brand-table">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-badge">{product.category}</span>
                        </td>
                        <td className="price-cell">${product.price.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.stock > 10 ? 'good' : 'low'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="views-cell">
                          <span className="views-badge">👁️ {product.views || 0}</span>
                        </td>
                        <td className="rating-cell">
                          <span className="rating-badge">⭐ {product.rating.toFixed(1)}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${product.status}`}>
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEditProduct(product.id)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Product Performance Analytics</h2>

            {/* Top Products */}
            <div className="analytics-card">
              <h3>🏆 Top 5 Products by Views</h3>
              {getTopProducts().length === 0 ? (
                <p className="no-data">No product data available</p>
              ) : (
                <div className="top-products-list">
                  {getTopProducts().map((product, index) => (
                    <div key={product.id} className="top-product-item">
                      <div className="rank-badge">#{index + 1}</div>
                      <img src={product.images[0]} alt={product.name} className="top-product-img" />
                      <div className="top-product-info">
                        <div className="top-product-name">{product.name}</div>
                        <div className="top-product-stats">
                          <span className="stat-item">👁️ {product.views || 0} views</span>
                          <span className="stat-item">⭐ {product.rating.toFixed(1)}</span>
                          <span className="stat-item">💰 ${product.price}</span>
                        </div>
                      </div>
                      <div className="views-bar">
                        <div
                          className="views-bar-fill"
                          style={{
                            width: `${((product.views || 0) / Math.max(...products.map(p => p.views || 0))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Products by Category */}
            <div className="analytics-card">
              <h3>📊 Products by Category</h3>
              <div className="category-distribution">
                {getProductsByCategory().map(({ category, count }) => (
                  <div key={category} className="category-stat-item">
                    <div className="category-stat-label">{category}</div>
                    <div className="category-stat-bar">
                      <div
                        className="category-stat-fill"
                        style={{
                          width: `${(count / products.length) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="category-stat-count">{count} products</div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Products Analytics Table */}
            <div className="analytics-card">
              <h3>📈 All Products Performance</h3>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Views</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th>Stock</th>
                      <th>Revenue Potential</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...products]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="product-cell">
                              <img src={product.images[0]} alt={product.name} className="product-thumb" />
                              <div>
                                <div className="product-name-table">{product.name}</div>
                                <div className="product-brand-table">{product.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="views-cell">
                            <span className="views-badge-large">👁️ {(product.views || 0).toLocaleString()}</span>
                          </td>
                          <td className="rating-cell">
                            <span className="rating-badge-large">⭐ {product.rating.toFixed(1)}</span>
                          </td>
                          <td className="reviews-cell">{product.reviewCount} reviews</td>
                          <td>
                            <span className={`stock-badge ${product.stock > 10 ? 'good' : 'low'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="price-cell">${(product.price * product.stock).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
