import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { EventType, UserRole } from '../../types/enums';
import { User, Event } from '../../types/interfaces';
import { dataService } from '../../services/dataService';
import { useToast } from '../../hooks/useToast';
import Dropdown from '../../components/Dropdown/Dropdown';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalSellers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [buyers, setBuyers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sellers' | 'buyers'>('dashboard');

  const { user, logout } = useAuth();
  const { events, trackEvent } = useEvents();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    trackEvent(EventType.VIEW_ADMIN_DASHBOARD);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const loadData = () => {
    const allSellers = dataService.getUsersByRole(UserRole.SELLER_USER);
    const allBuyers = dataService.getUsersByRole(UserRole.BUYER_USER);
    const allProducts = dataService.getAllProducts();
    const allOrders = dataService.getAllOrders();

    setSellers(allSellers);
    setBuyers(allBuyers);

    setMetrics({
      totalSellers: allSellers.length,
      totalBuyers: allBuyers.length,
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      totalEvents: events.length,
    });

    // Get ALL events sorted by timestamp (newest first)
    const allEvents = [...events].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setRecentEvents(allEvents);
  };

  const handleViewJourney = (userId: string) => {
    trackEvent(EventType.VIEW_USER_JOURNEY, { userId });
    navigate(`/admin/journey/${userId}`);
  };

  const handleLogout = () => {
    trackEvent(EventType.LOGOUT);
    logout();
    navigate('/');
  };

  const handleViewProfile = () => {
    toast.info('Profile page coming soon!');
  };

  const handleViewReports = () => {
    toast.info('Reports page coming soon!');
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (eventType: EventType) => {
    const icons: Record<string, string> = {
      [EventType.LOGIN]: '🔐',
      [EventType.LOGOUT]: '🚪',
      [EventType.BROWSE_PRODUCTS]: '👀',
      [EventType.VIEW_PRODUCT_DETAILS]: '🔍',
      [EventType.ADD_TO_CART]: '🛒',
      [EventType.REMOVE_FROM_CART]: '❌',
      [EventType.PROCEED_TO_CHECKOUT]: '💳',
      [EventType.COMPLETE_PURCHASE]: '✅',
      [EventType.CREATE_PRODUCT]: '➕',
      [EventType.EDIT_PRODUCT]: '✏️',
      [EventType.DELETE_PRODUCT]: '🗑️',
      [EventType.VIEW_ADMIN_DASHBOARD]: '📊',
      [EventType.VIEW_USER_JOURNEY]: '🗺️',
    };
    return icons[eventType] || '📌';
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>🎯 Admin Dashboard</h1>
          <div className="header-actions">
            <Dropdown
              align="right"
              trigger={
                <div className="user-dropdown-trigger-admin">
                  <div className="user-avatar-admin">{user?.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info-dropdown-admin">
                    <span className="user-name-dropdown-admin">{user?.name}</span>
                    <span className="user-role-dropdown-admin">Administrator</span>
                  </div>
                  <span className="dropdown-arrow-admin">▼</span>
                </div>
              }
              items={[
                { label: 'View Profile', icon: '👤', onClick: handleViewProfile },
                { label: 'User Management', icon: '👥', onClick: () => toast.info('User management coming soon!') },
                { label: 'Reports', icon: '📈', onClick: handleViewReports },
                { label: 'Settings', icon: '⚙️', onClick: () => toast.info('Settings page coming soon!') },
                { label: 'Logout', icon: '🚪', onClick: handleLogout, danger: true },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dashboard');
              trackEvent(EventType.VIEW_METRICS);
            }}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'sellers' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('sellers');
              trackEvent(EventType.VIEW_SELLERS_LIST);
            }}
          >
            📦 Sellers ({metrics.totalSellers})
          </button>
          <button
            className={`tab-button ${activeTab === 'buyers' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('buyers');
              trackEvent(EventType.VIEW_BUYERS_LIST);
            }}
          >
            🛍️ Buyers ({metrics.totalBuyers})
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📦</div>
                <div className="metric-info">
                  <div className="metric-value">{metrics.totalSellers}</div>
                  <div className="metric-label">Total Sellers</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">🛍️</div>
                <div className="metric-info">
                  <div className="metric-value">{metrics.totalBuyers}</div>
                  <div className="metric-label">Total Buyers</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">📦</div>
                <div className="metric-info">
                  <div className="metric-value">{metrics.totalProducts}</div>
                  <div className="metric-label">Total Products</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-info">
                  <div className="metric-value">{metrics.totalOrders}</div>
                  <div className="metric-label">Total Orders</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-info">
                  <div className="metric-value">{metrics.totalEvents}</div>
                  <div className="metric-label">Total Events</div>
                </div>
              </div>
            </div>

            <div className="events-section">
              <h2>Recent Activity</h2>
              {recentEvents.length === 0 ? (
                <div className="no-events">No events recorded yet</div>
              ) : (
                <div className="events-list">
                  {recentEvents.map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-icon">{getEventIcon(event.eventType)}</div>
                      <div className="event-details">
                        <div className="event-title">
                          <strong>{event.userName}</strong>
                          <span className="event-type-badge">{event.userRole}</span>
                        </div>
                        <div className="event-description">
                          {event.eventType.replace(/_/g, ' ').toLowerCase()}
                        </div>
                        <div className="event-timestamp">
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'sellers' && (
          <div className="users-section">
            <h2>All Sellers</h2>
            {sellers.length === 0 ? (
              <div className="no-users">No sellers registered yet</div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Products</th>
                      <th>Events</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map(seller => {
                      const sellerProducts = dataService.getProductsBySeller(seller.id);
                      const sellerEvents = events.filter(e => e.userId === seller.id);
                      return (
                        <tr key={seller.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">{seller.name[0].toUpperCase()}</div>
                              <span>{seller.name}</span>
                            </div>
                          </td>
                          <td>{seller.email}</td>
                          <td>{sellerProducts.length}</td>
                          <td>{sellerEvents.length}</td>
                          <td>{new Date(seller.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleViewJourney(seller.id)}
                              className="journey-btn"
                            >
                              View Journey
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'buyers' && (
          <div className="users-section">
            <h2>All Buyers</h2>
            {buyers.length === 0 ? (
              <div className="no-users">No buyers registered yet</div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Orders</th>
                      <th>Events</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyers.map(buyer => {
                      const buyerOrders = dataService.getOrdersByBuyer(buyer.id);
                      const buyerEvents = events.filter(e => e.userId === buyer.id);
                      return (
                        <tr key={buyer.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">{buyer.name[0].toUpperCase()}</div>
                              <span>{buyer.name}</span>
                            </div>
                          </td>
                          <td>{buyer.email}</td>
                          <td>{buyerOrders.length}</td>
                          <td>{buyerEvents.length}</td>
                          <td>{new Date(buyer.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleViewJourney(buyer.id)}
                              className="journey-btn"
                            >
                              View Journey
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
