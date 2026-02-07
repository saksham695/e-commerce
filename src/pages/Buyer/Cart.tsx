import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { CartItem } from '../../types/interfaces';
import { EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import './Cart.css';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const { user } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, newQuantity)) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    trackEvent(EventType.REMOVE_FROM_CART, { productId });
    const updatedCart = cartItems.filter(item => item.product.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    trackEvent(EventType.PROCEED_TO_CHECKOUT);
    setShowCheckout(true);
  };

  const handleCompletePurchase = () => {
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    if (!user) return;

    // Create order
    dataService.createOrder(user.id, user.name, cartItems, shippingAddress);
    
    trackEvent(EventType.COMPLETE_PURCHASE, {
      totalAmount: getTotalPrice(),
      itemCount: cartItems.length,
    });

    // Clear cart
    localStorage.removeItem('cart');
    setCartItems([]);
    setShowCheckout(false);
    
    alert('Order placed successfully! Thank you for your purchase.');
    navigate('/buyer');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (showCheckout) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <button onClick={() => setShowCheckout(false)} className="back-button">
            ← Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label htmlFor="shipping">Shipping Address *</label>
              <textarea
                id="shipping"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your complete shipping address"
                rows={4}
                className="shipping-textarea"
              />
            </div>

            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.product.id} className="checkout-item">
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.product.name}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <span>Total Amount:</span>
              <span className="total-amount">${getTotalPrice().toFixed(2)}</span>
            </div>

            <button onClick={handleCompletePurchase} className="complete-purchase-btn">
              Complete Purchase
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button onClick={() => navigate('/buyer')} className="back-button">
          ← Continue Shopping
        </button>
        <h1>Shopping Cart ({getTotalItems()} items)</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate('/buyer')} className="browse-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.product.id} className="cart-item">
                <img src={item.product.images[0]} alt={item.product.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-brand">{item.product.brand}</p>
                  <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls-cart">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <button onClick={() => removeItem(item.product.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total:</span>
              <span className="total-price">${getTotalPrice().toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>

            <button onClick={() => navigate('/buyer')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
