import React, { useState } from 'react';
import { Product } from '../../types/interfaces';
import './ProductComparison.css';

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
}

interface ComparisonField {
  label: string;
  getValue: (product: Product) => string | number;
  type: 'text' | 'number' | 'price' | 'rating';
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ products, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'specs'>('overview');

  if (products.length === 0) {
    return null;
  }

  const comparisonFields: ComparisonField[] = [
    { label: 'Price', getValue: (p) => p.price, type: 'price' },
    { label: 'Rating', getValue: (p) => p.rating, type: 'rating' },
    { label: 'Reviews', getValue: (p) => p.reviewCount, type: 'number' },
    { label: 'Stock', getValue: (p) => p.stock, type: 'number' },
    { label: 'Discount', getValue: (p) => p.discount || 0, type: 'number' },
    { label: 'Views', getValue: (p) => p.views, type: 'number' },
    { label: 'Brand', getValue: (p) => p.brand, type: 'text' },
    { label: 'Warranty', getValue: (p) => p.warranty, type: 'text' },
    { label: 'Weight', getValue: (p) => p.weight, type: 'text' },
    { label: 'Return Policy', getValue: (p) => p.returnPolicy, type: 'text' },
  ];

  const getMaxValue = (field: ComparisonField): number => {
    if (field.type === 'text') return 0;
    return Math.max(...products.map((p) => Number(field.getValue(p)) || 0));
  };

  const getBarWidth = (value: number, maxValue: number): number => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  const formatValue = (value: string | number, type: string): string => {
    if (type === 'price') return `$${Number(value).toFixed(2)}`;
    if (type === 'rating') return `${Number(value).toFixed(1)} ⭐`;
    return String(value);
  };

  const getValueColor = (value: number, maxValue: number): string => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 80) return 'var(--accent-500)';
    if (percentage >= 50) return 'var(--secondary-500)';
    return 'var(--neutral-400)';
  };

  const renderHistogram = (field: ComparisonField) => {
    if (field.type === 'text') return null;
    
    const maxValue = getMaxValue(field);
    if (maxValue === 0) return null;

    return (
      <div className="histogram-row">
        <div className="field-label">{field.label}</div>
        <div className="histogram-bars">
          {products.map((product, index) => {
            const value = Number(field.getValue(product)) || 0;
            const width = getBarWidth(value, maxValue);
            const color = getValueColor(value, maxValue);

            return (
              <div key={index} className="histogram-bar-container">
                <div className="histogram-product-name">{product.name}</div>
                <div className="histogram-bar-wrapper">
                  <div
                    className="histogram-bar"
                    style={{
                      width: `${width}%`,
                      backgroundColor: color,
                    }}
                  >
                    <span className="histogram-value">{formatValue(value, field.type)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="comparison-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-header">
          <h2>Product Comparison ({products.length})</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="comparison-tabs">
          <button
            className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${selectedTab === 'specs' ? 'active' : ''}`}
            onClick={() => setSelectedTab('specs')}
          >
            📝 Specifications
          </button>
        </div>

        <div className="comparison-content">
          {selectedTab === 'overview' && (
            <div className="overview-section">
              {/* Product Cards */}
              <div className="products-overview">
                {products.map((product, index) => (
                  <div key={product.id} className="product-card-comparison">
                    <img src={product.images[0]} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="product-brand">{product.brand}</p>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-rating">
                      ⭐ {product.rating.toFixed(1)} ({product.reviewCount})
                    </div>
                  </div>
                ))}
              </div>

              {/* Histograms */}
              <div className="histograms-section">
                <h3>Comparison Charts</h3>
                {comparisonFields
                  .filter((f) => f.type !== 'text')
                  .map((field, index) => (
                    <React.Fragment key={index}>{renderHistogram(field)}</React.Fragment>
                  ))}
              </div>
            </div>
          )}

          {selectedTab === 'specs' && (
            <div className="specs-section">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="field-column">Field</th>
                    {products.map((product) => (
                      <th key={product.id}>{product.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field, index) => (
                    <tr key={index}>
                      <td className="field-column">{field.label}</td>
                      {products.map((product) => (
                        <td key={product.id}>{formatValue(field.getValue(product), field.type)}</td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Specifications */}
                  {Object.keys(products[0]?.specifications || {}).map((specKey) => (
                    <tr key={specKey}>
                      <td className="field-column">{specKey}</td>
                      {products.map((product) => (
                        <td key={product.id}>
                          {product.specifications[specKey] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
