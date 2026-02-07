import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Order } from '../../types/interfaces';
import { EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import './Orders.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent(EventType.VIEW_CART); // Reusing cart event for orders view
    loadOrders();
  }, []);

  const loadOrders = () => {
    if (!user) return;
    
    const userOrders = dataService.getOrdersByBuyer(user.id);
    setOrders(userOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading-orders">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header-section">
          <button onClick={() => navigate('/buyer')} className="back-to-shop-btn">
            ← Back to Shop
          </button>
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">View and track all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button onClick={() => navigate('/buyer')} className="start-shopping-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-header-left">
                    <span className="order-id">Order #{order.id.slice(0, 8)}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-header-right">
                    <span className={`order-status ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => {
                    const product = dataService.getProductById(item.productId);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="order-item">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="order-item-image"
                        />
                        <div className="order-item-details">
                          <h4 className="order-item-name">{product.name}</h4>
                          <p className="order-item-brand">{product.brand}</p>
                          <p className="order-item-quantity">Qty: {item.quantity}</p>
                        </div>
                        <div className="order-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-card-footer">
                  <div className="order-total">
                    <span className="order-total-label">Total:</span>
                    <span className="order-total-amount">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  {order.status === 'processing' && (
                    <button className="track-order-btn">Track Order</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
