import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { ProductCategory, ProductStatus, EventType } from '../../types/enums';
import { Product } from '../../types/interfaces';
import { dataService } from '../../services/dataService';
import './ProductForm.css';

const ProductForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ProductCategory.ELECTRONICS,
    price: '',
    stock: '',
    images: ['', ''],
    brand: '',
    weight: '',
    dimensions: '',
    warranty: '',
    returnPolicy: '',
    status: ProductStatus.ACTIVE,
    specifications: {} as Record<string, string>,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { trackEvent } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && productId) {
      const product = dataService.getProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock.toString(),
          images: product.images.length >= 2 ? product.images : [...product.images, ''],
          brand: product.brand,
          weight: product.weight || '',
          dimensions: product.dimensions || '',
          warranty: product.warranty || '',
          returnPolicy: product.returnPolicy || '',
          status: product.status,
          specifications: product.specifications as Record<string, string>,
        });
      }
    } else {
      // Set initial specifications for create mode
      setFormData(prev => ({
        ...prev,
        specifications: {
          Material: '',
          Color: '',
          Size: '',
        },
      }));
    }
  }, [isEditMode, productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSpecChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const addSpecField = () => {
    const newKey = `Spec ${Object.keys(formData.specifications).length + 1}`;
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [newKey]: '' },
    }));
  };

  const removeSpecField = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    const stock = parseInt(formData.stock);
    if (!formData.stock || isNaN(stock) || stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    const validImages = formData.images.filter(img => img.trim() !== '');
    if (validImages.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) return;

    setIsSubmitting(true);

    try {
      const validImages = formData.images.filter(img => img.trim() !== '');
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: validImages,
        brand: formData.brand.trim(),
        weight: formData.weight.trim() || undefined,
        dimensions: formData.dimensions.trim() || undefined,
        warranty: formData.warranty.trim() || undefined,
        returnPolicy: formData.returnPolicy.trim() || undefined,
        status: formData.status,
        specifications: formData.specifications,
        sellerId: user.id,
        sellerName: user.name,
        rating: 0,
        reviewCount: 0,
        views: 0,
      };

      if (isEditMode && productId) {
        dataService.updateProduct(productId, productData);
        trackEvent(EventType.EDIT_PRODUCT, { productId });
        alert('Product updated successfully!');
      } else {
        dataService.createProduct(productData);
        trackEvent(EventType.CREATE_PRODUCT);
        alert('Product created successfully!');
      }

      navigate('/seller');
    } catch (error) {
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <button onClick={() => navigate('/seller')} className="back-button">
        ← Back to Dashboard
      </button>

      <div className="product-form-card">
        <h1>{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
        <p className="form-subtitle">
          Fill in all the details to {isEditMode ? 'update' : 'create'} your product
        </p>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand *</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className={errors.brand ? 'error' : ''}
                />
                {errors.brand && <span className="error-text">{errors.brand}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product in detail"
                rows={4}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {Object.values(ProductCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {Object.values(ProductStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="form-section">
            <h2>Pricing & Stock</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="form-section">
            <h2>Product Images *</h2>
            {errors.images && <span className="error-text">{errors.images}</span>}
            
            {formData.images.map((image, index) => (
              <div key={index} className="image-input-row">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  className="image-input"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="remove-btn-small"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button type="button" onClick={addImageField} className="add-field-btn">
              + Add Image
            </button>
          </div>

          {/* Specifications */}
          <div className="form-section">
            <h2>Specifications</h2>
            
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="spec-input-row">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    const val = formData.specifications[key];
                    const newSpecs = { ...formData.specifications };
                    delete newSpecs[key];
                    newSpecs[newKey] = val;
                    setFormData(prev => ({
                      ...prev,
                      specifications: newSpecs,
                    }));
                  }}
                  placeholder="Specification name"
                  className="spec-key-input"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleSpecChange(key, e.target.value)}
                  placeholder="Specification value"
                  className="spec-value-input"
                />
                <button
                  type="button"
                  onClick={() => removeSpecField(key)}
                  className="remove-btn-small"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button type="button" onClick={addSpecField} className="add-field-btn">
              + Add Specification
            </button>
          </div>

          {/* Additional Details */}
          <div className="form-section">
            <h2>Additional Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 500g"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensions">Dimensions</label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="e.g., 20x15x10 cm"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="warranty">Warranty</label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="e.g., 1 Year"
                />
              </div>

              <div className="form-group">
                <label htmlFor="returnPolicy">Return Policy</label>
                <input
                  type="text"
                  id="returnPolicy"
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleChange}
                  placeholder="e.g., 30 days return"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/seller')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
