import React, { useState, useEffect } from 'react';
import { filterService } from '../../services/filterService';
import { DynamicFilter, FilterType, FilterDataSource, FilterOption } from '../../types/filterTypes';
import { useToast } from '../../hooks/useToast';
import './FilterManagement.css';

const FilterManagement: React.FC = () => {
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFilter, setEditingFilter] = useState<DynamicFilter | null>(null);
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: FilterType.DROPDOWN,
    dataSource: FilterDataSource.PRODUCT_CATEGORY,
    productField: '',
    customOptions: '',
    min: 0,
    max: 100,
    step: 1,
    isActive: true,
    order: 1,
  });

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = () => {
    const config = filterService.getFilterConfiguration();
    setFilters(config.filters);
  };

  const handleCreateFilter = () => {
    setEditingFilter(null);
    setFormData({
      name: '',
      type: FilterType.DROPDOWN,
      dataSource: FilterDataSource.PRODUCT_CATEGORY,
      productField: '',
      customOptions: '',
      min: 0,
      max: 100,
      step: 1,
      isActive: true,
      order: filters.length + 1,
    });
    setShowCreateModal(true);
  };

  const handleEditFilter = (filter: DynamicFilter) => {
    setEditingFilter(filter);
    setFormData({
      name: filter.name,
      type: filter.type,
      dataSource: filter.dataSource,
      productField: filter.productField || '',
      customOptions: filter.options ? filter.options.map(o => `${o.label}:${o.value}`).join('\n') : '',
      min: filter.min || 0,
      max: filter.max || 100,
      step: filter.step || 1,
      isActive: filter.isActive,
      order: filter.order,
    });
    setShowCreateModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.warning('Filter name is required');
      return;
    }

    const filterData: any = {
      name: formData.name,
      type: formData.type,
      dataSource: formData.dataSource,
      productField: formData.productField || undefined,
      isActive: formData.isActive,
      order: formData.order,
    };

    // Add type-specific data
    if (formData.type === FilterType.RANGE) {
      filterData.min = formData.min;
      filterData.max = formData.max;
      filterData.step = formData.step;
      filterData.defaultValue = { min: formData.min, max: formData.max };
    }

    if (formData.type === FilterType.RATING) {
      filterData.min = 0;
      filterData.max = 5;
      filterData.step = 0.5;
      filterData.defaultValue = 0;
    }

    if (formData.dataSource === FilterDataSource.CUSTOM && formData.customOptions) {
      const options: FilterOption[] = formData.customOptions
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [label, value] = line.split(':').map(s => s.trim());
          return { label, value: value || label };
        });
      filterData.options = options;
    }

    if (editingFilter) {
      filterService.updateFilter(editingFilter.id, filterData);
      toast.success('Filter updated successfully');
    } else {
      filterService.addFilter(filterData);
      toast.success('Filter created successfully');
    }

    setShowCreateModal(false);
    loadFilters();
  };

  const handleDeleteFilter = (filterId: string) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      filterService.deleteFilter(filterId);
      toast.success('Filter deleted');
      loadFilters();
    }
  };

  const handleToggleStatus = (filterId: string) => {
    filterService.toggleFilterStatus(filterId);
    toast.info('Filter status updated');
    loadFilters();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all filters to defaults? This will delete all custom filters.')) {
      filterService.resetToDefaults();
      toast.success('Filters reset to defaults');
      loadFilters();
    }
  };

  return (
    <div className="filter-management">
      <div className="filter-management-header">
        <div>
          <h2>Dynamic Filter Management</h2>
          <p>Create and manage filters that buyers will see</p>
        </div>
        <div className="header-actions">
          <button onClick={handleResetDefaults} className="reset-btn">
            🔄 Reset to Defaults
          </button>
          <button onClick={handleCreateFilter} className="create-filter-btn">
            + Create Filter
          </button>
        </div>
      </div>

      <div className="filters-list">
        {filters.length === 0 ? (
          <div className="no-filters">
            <p>No filters configured</p>
            <button onClick={handleCreateFilter}>Create Your First Filter</button>
          </div>
        ) : (
          <div className="filters-grid">
            {filters.map(filter => (
              <div key={filter.id} className={`filter-card ${!filter.isActive ? 'inactive' : ''}`}>
                <div className="filter-card-header">
                  <div className="filter-name">
                    <span className="filter-order">#{filter.order}</span>
                    <h3>{filter.name}</h3>
                  </div>
                  <div className="filter-status">
                    <span className={`status-badge ${filter.isActive ? 'active' : 'inactive'}`}>
                      {filter.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="filter-card-body">
                  <div className="filter-detail">
                    <span className="label">Type:</span>
                    <span className="value">{filter.type}</span>
                  </div>
                  <div className="filter-detail">
                    <span className="label">Data Source:</span>
                    <span className="value">{filter.dataSource}</span>
                  </div>
                  {filter.productField && (
                    <div className="filter-detail">
                      <span className="label">Product Field:</span>
                      <span className="value">{filter.productField}</span>
                    </div>
                  )}
                  {filter.type === FilterType.RANGE && (
                    <div className="filter-detail">
                      <span className="label">Range:</span>
                      <span className="value">{filter.min} - {filter.max}</span>
                    </div>
                  )}
                </div>

                <div className="filter-card-actions">
                  <button onClick={() => handleToggleStatus(filter.id)} className="toggle-btn">
                    {filter.isActive ? '⏸️ Disable' : '▶️ Enable'}
                  </button>
                  <button onClick={() => handleEditFilter(filter)} className="edit-btn-filter">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDeleteFilter(filter.id)} className="delete-btn-filter">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-filter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFilter ? 'Edit Filter' : 'Create New Filter'}</h2>
              <button onClick={() => setShowCreateModal(false)} className="close-btn">✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Filter Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Price Range, Brand, Category"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Filter Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FilterType })}
                  >
                    <option value={FilterType.DROPDOWN}>Dropdown (Single Select)</option>
                    <option value={FilterType.MULTI_SELECT}>Multi-Select (Checkboxes)</option>
                    <option value={FilterType.RANGE}>Range (Min/Max)</option>
                    <option value={FilterType.RATING}>Rating Filter</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Data Source *</label>
                  <select
                    value={formData.dataSource}
                    onChange={(e) => setFormData({ ...formData, dataSource: e.target.value as FilterDataSource })}
                  >
                    <option value={FilterDataSource.PRODUCT_CATEGORY}>Product Categories</option>
                    <option value={FilterDataSource.PRODUCT_BRAND}>Product Brands</option>
                    <option value={FilterDataSource.PRODUCT_FIELD}>Product Field</option>
                    <option value={FilterDataSource.CUSTOM}>Custom Values</option>
                  </select>
                </div>
              </div>

              {(formData.dataSource === FilterDataSource.PRODUCT_FIELD) && (
                <div className="form-group">
                  <label>Product Field Name</label>
                  <input
                    type="text"
                    value={formData.productField}
                    onChange={(e) => setFormData({ ...formData, productField: e.target.value })}
                    placeholder="e.g., price, stock, rating"
                  />
                </div>
              )}

              {formData.type === FilterType.RANGE && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Min Value</label>
                    <input
                      type="number"
                      value={formData.min}
                      onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Value</label>
                    <input
                      type="number"
                      value={formData.max}
                      onChange={(e) => setFormData({ ...formData, max: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Step</label>
                    <input
                      type="number"
                      value={formData.step}
                      onChange={(e) => setFormData({ ...formData, step: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {formData.dataSource === FilterDataSource.CUSTOM && (
                <div className="form-group">
                  <label>Custom Options (one per line, format: Label:Value)</label>
                  <textarea
                    value={formData.customOptions}
                    onChange={(e) => setFormData({ ...formData, customOptions: e.target.value })}
                    placeholder="Premium:premium&#10;Standard:standard&#10;Budget:budget"
                    rows={5}
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span style={{ marginLeft: '8px' }}>Active (visible to buyers)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSubmit} className="submit-btn-filter">
                {editingFilter ? 'Update Filter' : 'Create Filter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterManagement;
