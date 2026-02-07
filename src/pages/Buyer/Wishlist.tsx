import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../hooks/useToast';
import { Product } from '../../types/interfaces';
import { dataService } from '../../services/dataService';
import Rating from '../../components/Rating/Rating';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const { wishlist, removeFromWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlistProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist]);

  const loadWishlistProducts = () => {
    const products = wishlist
      .map(id => dataService.getProductById(id))
      .filter((p): p is Product => p !== null);
    setWishlistProducts(products);
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.info(`Removed "${productName}" from wishlist`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/buyer/product/${productId}`);
  };

  return (
    <div className="wishlist-container">
      <button onClick={() => navigate('/buyer')} className="back-button">
        ← Back to Products
      </button>

      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlistProducts.length} items</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>Add products you love to keep track of them!</p>
          <button onClick={() => navigate('/buyer')} className="browse-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistProducts.map(product => (
            <div key={product.id} className="wishlist-card">
              <button
                className="remove-wishlist-btn"
                onClick={() => handleRemove(product.id, product.name)}
              >
                ✕
              </button>

              <div
                className="wishlist-product-image"
                onClick={() => handleProductClick(product.id)}
              >
                <img src={product.images[0]} alt={product.name} />
              </div>

              <div className="wishlist-product-info">
                <h3
                  className="wishlist-product-name"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </h3>
                <p className="wishlist-product-brand">{product.brand}</p>

                <div className="wishlist-rating">
                  <Rating value={product.rating} size="small" />
                  <span className="wishlist-review-count">({product.reviewCount})</span>
                </div>

                <div className="wishlist-product-footer">
                  <span className="wishlist-price">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="view-product-btn"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
