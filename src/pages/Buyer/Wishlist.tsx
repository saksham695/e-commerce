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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
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

  const handleShareWishlist = () => {
    if (wishlist.length === 0) {
      toast.warning('Your wishlist is empty! Add some products first.');
      return;
    }

    const encodedWishlist = btoa(JSON.stringify(wishlist));
    const link = `${window.location.origin}/buyer/wishlist?shared=${encodedWishlist}`;
    setShareLink(link);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success('Wishlist link copied to clipboard!');
      setShowShareModal(false);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  // Check if viewing a shared wishlist
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('shared');
    
    if (sharedData) {
      try {
        const decodedWishlist = JSON.parse(atob(sharedData));
        const sharedProducts = decodedWishlist
          .map((id: string) => dataService.getProductById(id))
          .filter((p): p is Product => p !== null);
        setWishlistProducts(sharedProducts);
        toast.info('Viewing a shared wishlist');
      } catch (e) {
        toast.error('Invalid wishlist link');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wishlist-container">
      <button onClick={() => navigate('/buyer')} className="back-button">
        ← Back to Products
      </button>

      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>{wishlistProducts.length} items</p>
        </div>
        {wishlistProducts.length > 0 && (
          <button onClick={handleShareWishlist} className="share-wishlist-btn">
            🔗 Share Wishlist
          </button>
        )}
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h2>Share Your Wishlist</h2>
              <button onClick={() => setShowShareModal(false)} className="close-modal-btn">
                ✕
              </button>
            </div>
            <div className="share-modal-body">
              <p>Copy this link to share your wishlist with friends and family:</p>
              <div className="share-link-container">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="share-link-input"
                />
                <button onClick={handleCopyLink} className="copy-link-btn">
                  📋 Copy
                </button>
              </div>
              <div className="share-info">
                <p>✨ Anyone with this link can view your wishlist</p>
                <p>🔒 They won't be able to modify it</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
