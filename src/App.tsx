import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider, useEvents } from './contexts/EventContext';
import { UserRole, EventType } from './types/enums';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast/Toast';
import Skeleton from './components/Skeleton/Skeleton';

import './App.css';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login/Login'));
const BuyerDashboard = lazy(() => import('./pages/Buyer/EnhancedBuyerDashboard'));
const ProductDetail = lazy(() => import('./pages/Buyer/ProductDetail'));
const Cart = lazy(() => import('./pages/Buyer/Cart'));
const Wishlist = lazy(() => import('./pages/Buyer/Wishlist'));
const SellerDashboard = lazy(() => import('./pages/Seller/SellerDashboard'));
const ProductForm = lazy(() => import('./pages/Seller/ProductForm'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserJourney = lazy(() => import('./pages/Admin/UserJourney'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
    <div className="loading-spinner" />
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { trackEvent } = useEvents();

  useEffect(() => {
    if (isAuthenticated && user) {
      trackEvent(EventType.LOGIN);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
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
          <Route
            path="/buyer/wishlist"
            element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER_USER]}>
                <Wishlist />
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
      </Suspense>
    </>
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
