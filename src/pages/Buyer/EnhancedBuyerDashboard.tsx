import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { useWishlist } from '../../hooks/useWishlist';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Product, SortOption, ViewMode } from '../../types/interfaces';
import { ProductCategory, EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import Rating from '../../components/Rating/Rating';
import { ProductCardSkeleton } from '../../components/Skeleton/Skeleton';
import Dropdown from '../../components/Dropdown/Dropdown';
import ProductComparison from '../../components/ProductComparison/ProductComparison';
import './EnhancedBuyerDashboard.css';

const EnhancedBuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cartCount, setCartCount] = useState(0);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const PRODUCTS_PER_PAGE = 12;

  const { user, logout } = useAuth();
  const { trackEvent } = useEvents();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent(EventType.BROWSE_PRODUCTS);
    loadProducts();
    updateCartCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const allProducts = dataService.getAllProducts();
      setProducts(allProducts);
      setIsLoading(false);
    }, 800);
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, selectedCategory, debouncedSearch, priceRange, minRating, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(0, displayedCount);
  }, [filteredAndSortedProducts, displayedCount]);

  const hasMore = displayedCount < filteredAndSortedProducts.length;

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setDisplayedCount(prev => prev + PRODUCTS_PER_PAGE);
    }
  };

  const { sentinelRef, isLoadingMore } = useInfiniteScroll(loadMore, hasMore);

  const handleProductClick = (productId: string) => {
    trackEvent(EventType.VIEW_PRODUCT_DETAILS, { productId });
    dataService.incrementProductViews(productId);
    navigate(`/buyer/product/${productId}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    toggleWishlist(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      if (isInWishlist(productId)) {
        toast.info(`Removed "${product.name}" from wishlist`);
      } else {
        toast.success(`Added "${product.name}" to wishlist`);
      }
    }
  };

  const handleViewCart = () => {
    navigate('/buyer/cart');
  };

  const handleViewWishlist = () => {
    navigate('/buyer/wishlist');
  };

  const handleLogout = () => {
    trackEvent(EventType.LOGOUT);
    logout();
    navigate('/');
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    const cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
      toast.success(`Added another ${product.name} to cart`);
    } else {
      cart.push({ product, quantity: 1 });
      toast.success(`${product.name} added to cart`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    trackEvent(EventType.ADD_TO_CART, { productId: product.id, quantity: 1 });
  };

  const handleViewProfile = () => {
    toast.info('Profile page coming soon!');
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 1000 });
    setMinRating(0);
    setSearchTerm('');
    setDisplayedCount(PRODUCTS_PER_PAGE);
  };

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(PRODUCTS_PER_PAGE);
  }, [selectedCategory, debouncedSearch, priceRange, minRating, sortBy]);

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (comparisonMode) {
      setCompareProducts([]);
    }
  };

  const handleCompareSelect = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    const isSelected = compareProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      setCompareProducts(compareProducts.filter(p => p.id !== product.id));
    } else {
      if (compareProducts.length >= 4) {
        toast.warning('You can compare up to 4 products at a time');
        return;
      }
      setCompareProducts([...compareProducts, product]);
    }
  };

  const handleShowComparison = () => {
    if (compareProducts.length < 2) {
      toast.warning('Please select at least 2 products to compare');
      return;
    }
    setShowComparison(true);
    trackEvent(EventType.BROWSE_PRODUCTS, { action: 'compare_products', count: compareProducts.length });
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
  };

  return (
    <div className="enhanced-buyer-dashboard">
      <header className="buyer-header-enhanced">
        <div className="header-content">
          <h1>🛍️ E-Commerce Store</h1>
          <div className="header-actions">
            <button onClick={handleViewWishlist} className="header-action-btn wishlist-btn">
              <span className="btn-icon">❤️</span>
              <span className="btn-text">Wishlist</span>
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </button>
            <button onClick={handleViewCart} className="header-action-btn cart-btn">
              <span className="btn-icon">🛒</span>
              <span className="btn-text">Cart</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            <Dropdown
              align="right"
              trigger={
                <div className="user-dropdown-trigger">
                  <div className="user-avatar">{user?.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info-dropdown">
                    <span className="user-name-dropdown">{user?.name}</span>
                    <span className="user-role-dropdown">Buyer</span>
                  </div>
                  <span className="dropdown-arrow">▼</span>
                </div>
              }
              items={[
                {
                  label: 'View Profile',
                  icon: '👤',
                  onClick: handleViewProfile,
                },
                {
                  label: 'My Orders',
                  icon: '📦',
                  onClick: () => navigate('/buyer/orders'),
                },
                {
                  label: 'Settings',
                  icon: '⚙️',
                  onClick: () => toast.info('Settings page coming soon!'),
                },
                {
                  label: 'Logout',
                  icon: '🚪',
                  onClick: handleLogout,
                  danger: true,
                },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="buyer-content-enhanced">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
          </div>

          {/* Search */}
          <div className="filter-section">
            <label className="filter-label">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-filter"
            />
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <div className="category-filters-vertical">
              <button
                className={`category-btn-vertical ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </button>
              {Object.values(ProductCategory).map(category => (
                <button
                  key={category}
                  className={`category-btn-vertical ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                placeholder="Min"
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                placeholder="Max"
                className="price-input"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <label className="filter-label">Minimum Rating</label>
            <div className="rating-filters">
              {[0, 3, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  className={`rating-filter-btn ${minRating === rating ? 'active' : ''}`}
                  onClick={() => setMinRating(rating)}
                >
                  {rating === 0 ? 'All' : `${rating}+ ★`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="main-content-enhanced">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="toolbar-left">
              <span className="results-count">
                Showing {displayedProducts.length} of {filteredAndSortedProducts.length} Products
              </span>
              <button
                className={`compare-mode-btn ${comparisonMode ? 'active' : ''}`}
                onClick={toggleComparisonMode}
              >
                {comparisonMode ? '✕ Exit Compare' : '📊 Compare Products'}
              </button>
            </div>
            <div className="toolbar-right">
              <div className="view-mode-toggle">
                <button
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  ▦
                </button>
                <button
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  ☰
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className={`products-${viewMode}`}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="no-products-enhanced">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="clear-filters-large-btn">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`products-${viewMode}`}>
                {displayedProducts.map(product => {
                const isSelectedForComparison = compareProducts.some(p => p.id === product.id);
                
                return (
                  <div
                    key={product.id}
                    className={`product-card-${viewMode} ${isSelectedForComparison ? 'selected-for-comparison' : ''}`}
                    onClick={() => !comparisonMode && handleProductClick(product.id)}
                  >
                    {comparisonMode && (
                      <div className="comparison-checkbox" onClick={(e) => handleCompareSelect(e, product)}>
                        <input
                          type="checkbox"
                          checked={isSelectedForComparison}
                          readOnly
                        />
                        <span>Compare</span>
                      </div>
                    )}
                    
                    <button
                      className={`wishlist-icon ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => handleWishlistToggle(e, product.id)}
                    >
                      {isInWishlist(product.id) ? '❤️' : '🤍'}
                    </button>
                    
                    <div className="product-image-container">
                      <img src={product.images[0]} alt={product.name} />
                      {product.discount && (
                        <span className="discount-badge">-{product.discount}%</span>
                      )}
                      <div className="product-badge-cat">{product.category}</div>
                    </div>
                    
                    <div className="product-info-enhanced">
                      <h3 className="product-name-enhanced">{product.name}</h3>
                      <p className="product-brand-enhanced">{product.brand}</p>
                      
                      <div className="product-rating-section">
                        <Rating value={product.rating} size="small" />
                        <span className="review-count">({product.reviewCount})</span>
                      </div>
                      
                      {viewMode === 'list' && (
                        <p className="product-description-enhanced">
                          {product.description.substring(0, 150)}...
                        </p>
                      )}
                      
                      <div className="product-footer-enhanced">
                        <div className="price-section">
                          <span className="product-price-enhanced">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <span className={`stock-badge-enhanced ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      {!comparisonMode && (
                        <button
                          className="add-to-cart-btn-card"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock === 0}
                        >
                          <span className="btn-icon-cart">🛒</span>
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>

              {/* Infinite Scroll Sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="scroll-sentinel">
                  {isLoadingMore && (
                    <div className="loading-more">
                      <div className="spinner"></div>
                      <span>Loading more products...</span>
                    </div>
                  )}
                </div>
              )}

              {/* End of Results */}
              {!hasMore && displayedProducts.length > 0 && (
                <div className="end-of-results">
                  <span>🎉 You've seen all products!</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Compare Button */}
      {comparisonMode && compareProducts.length > 0 && (
        <div className="floating-compare-bar">
          <span className="compare-count">{compareProducts.length} products selected</span>
          <button className="compare-now-btn" onClick={handleShowComparison}>
            Compare Now
          </button>
          <button className="clear-comparison-btn" onClick={() => setCompareProducts([])}>
            Clear
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <ProductComparison products={compareProducts} onClose={handleCloseComparison} />
      )}
    </div>
  );
};

export default EnhancedBuyerDashboard;
