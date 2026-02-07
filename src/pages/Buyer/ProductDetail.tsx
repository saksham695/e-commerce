import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { Product, CartItem } from '../../types/interfaces';
import { EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      const prod = dataService.getProductById(productId);
      setProduct(prod);
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    trackEvent(EventType.ADD_TO_CART, { productId: product.id, quantity });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleGoToCart = () => {
    trackEvent(EventType.PROCEED_TO_CHECKOUT);
    navigate('/buyer/cart');
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">Product not found</div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate('/buyer')} className="back-button">
        ← Back to Products
      </button>

      <div className="product-detail-content">
        <div className="product-images-section">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-details-section">
          <div className="product-category-badge">{product.category}</div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-brand-detail">by {product.brand}</p>
          <div className="product-price-detail">${product.price.toFixed(2)}</div>

          <div className="product-stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ {product.stock} items in stock</span>
            ) : (
              <span className="out-of-stock">✗ Out of stock</span>
            )}
          </div>

          <p className="product-description-detail">{product.description}</p>

          <div className="product-specifications">
            <h3>Specifications</h3>
            <div className="specs-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-key">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
              {product.weight && (
                <div className="spec-item">
                  <span className="spec-key">Weight:</span>
                  <span className="spec-value">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="spec-item">
                  <span className="spec-key">Dimensions:</span>
                  <span className="spec-value">{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>

          {product.warranty && (
            <div className="product-policy">
              <strong>Warranty:</strong> {product.warranty}
            </div>
          )}

          {product.returnPolicy && (
            <div className="product-policy">
              <strong>Return Policy:</strong> {product.returnPolicy}
            </div>
          )}

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>

            <button onClick={handleGoToCart} className="go-to-cart-btn">
              View Cart
            </button>
          </div>

          {addedToCart && (
            <div className="success-message">
              ✓ Product added to cart successfully!
            </div>
          )}
        </div>
      </div>

      <div className="seller-info-section">
        <h3>Seller Information</h3>
        <p><strong>Seller:</strong> {product.sellerName}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
