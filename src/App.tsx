import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider, useEvents } from './contexts/EventContext';
import { UserRole, EventType } from './types/enums';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import ProductDetail from './pages/Buyer/ProductDetail';
import Cart from './pages/Buyer/Cart';
import SellerDashboard from './pages/Seller/SellerDashboard';
import ProductForm from './pages/Seller/ProductForm';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserJourney from './pages/Admin/UserJourney';

import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { trackEvent } = useEvents();

  useEffect(() => {
    if (isAuthenticated && user) {
      trackEvent(EventType.LOGIN);
    }
  }, [isAuthenticated, user]);

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === UserRole.ADMIN ? (
              <Navigate to="/admin" replace />
            ) : user?.role === UserRole.SELLER_USER ? (
              <Navigate to="/seller" replace />
            ) : (
              <Navigate to="/buyer" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* Buyer Routes */}
      <Route
        path="/buyer"
        element={
          <ProtectedRoute allowedRoles={[UserRole.BUYER_USER]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/product/:productId"
        element={
          <ProtectedRoute allowedRoles={[UserRole.BUYER_USER]}>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/cart"
        element={
          <ProtectedRoute allowedRoles={[UserRole.BUYER_USER]}>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={[UserRole.SELLER_USER]}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/create-product"
        element={
          <ProtectedRoute allowedRoles={[UserRole.SELLER_USER]}>
            <ProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/edit-product/:productId"
        element={
          <ProtectedRoute allowedRoles={[UserRole.SELLER_USER]}>
            <ProductForm />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/journey/:userId"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <UserJourney />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
