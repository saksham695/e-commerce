import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { UserRole, EventType } from '../../types/enums';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.BUYER_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      
      // Track login event will be done after user is set
      setTimeout(() => {
        // Navigate based on role
        switch (selectedRole) {
          case UserRole.ADMIN:
            navigate('/admin');
            break;
          case UserRole.SELLER_USER:
            navigate('/seller');
            break;
          case UserRole.BUYER_USER:
            navigate('/buyer');
            break;
        }
      }, 100);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🛍️ E-Commerce Platform</h1>
          <p>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Login As</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              disabled={isLoading}
              className="role-select"
            >
              <option value={UserRole.BUYER_USER}>Buyer</option>
              <option value={UserRole.SELLER_USER}>Seller</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-info">
          <h3>Demo Credentials:</h3>
          <div className="demo-credentials">
            <div className="credential-item">
              <strong>Admin:</strong>
              <span>admin@ecommerce.com</span>
            </div>
            <div className="credential-item">
              <strong>Seller:</strong>
              <span>seller@example.com</span>
            </div>
            <div className="credential-item">
              <strong>Buyer:</strong>
              <span>buyer@example.com</span>
            </div>
            <p className="password-note">Password: any password (6+ characters)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
