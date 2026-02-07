import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Product } from '../../types/interfaces';
import { EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import './SellerDashboard.css';

const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    activeProducts: 0,
  });

  const { user, logout } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent(EventType.VIEW_SELLER_DASHBOARD);
    loadProducts();
  }, []);

  const loadProducts = () => {
    if (!user) return;
    
    const myProducts = dataService.getProductsBySeller(user.id);
    setProducts(myProducts);

    setStats({
      totalProducts: myProducts.length,
      totalStock: myProducts.reduce((sum, p) => sum + p.stock, 0),
      activeProducts: myProducts.filter(p => p.status === 'active').length,
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

  return (
    <div className="seller-dashboard">
      <header className="seller-header">
        <div className="header-content">
          <h1>📦 Seller Dashboard</h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Seller</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
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
        </div>

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
      </div>
    </div>
  );
};

export default SellerDashboard;
