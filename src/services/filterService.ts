import { DynamicFilter, FilterConfiguration, FilterType, FilterDataSource } from '../types/filterTypes';
import { v4 as uuidv4 } from 'uuid';
import { ProductCategory } from '../types/enums';

/**
 * Filter Service - Manages dynamic filters
 */

class FilterService {
  private storageKey = 'filter_configuration';

  constructor() {
    this.initializeDefaultFilters();
  }

  private initializeDefaultFilters() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultFilters: DynamicFilter[] = [
        {
          id: uuidv4(),
          name: 'Category',
          type: FilterType.DROPDOWN,
          dataSource: FilterDataSource.PRODUCT_CATEGORY,
          productField: 'category',
          isActive: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Price Range',
          type: FilterType.RANGE,
          dataSource: FilterDataSource.PRODUCT_FIELD,
          productField: 'price',
          min: 0,
          max: 1000,
          step: 10,
          defaultValue: { min: 0, max: 1000 },
          isActive: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Minimum Rating',
          type: FilterType.RATING,
          dataSource: FilterDataSource.PRODUCT_FIELD,
          productField: 'rating',
          min: 0,
          max: 5,
          step: 0.5,
          defaultValue: 0,
          isActive: true,
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Brand',
          type: FilterType.MULTI_SELECT,
          dataSource: FilterDataSource.PRODUCT_BRAND,
          productField: 'brand',
          isActive: true,
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const config: FilterConfiguration = {
        filters: defaultFilters,
        lastUpdated: new Date(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(config));
    }
  }

  getFilterConfiguration(): FilterConfiguration {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      this.initializeDefaultFilters();
      return this.getFilterConfiguration();
    }
    return JSON.parse(data);
  }

  getActiveFilters(): DynamicFilter[] {
    const config = this.getFilterConfiguration();
    return config.filters
      .filter(f => f.isActive)
      .sort((a, b) => a.order - b.order);
  }

  addFilter(filter: Omit<DynamicFilter, 'id' | 'createdAt' | 'updatedAt'>): DynamicFilter {
    const config = this.getFilterConfiguration();
    const newFilter: DynamicFilter = {
      ...filter,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    config.filters.push(newFilter);
    config.lastUpdated = new Date();
    localStorage.setItem(this.storageKey, JSON.stringify(config));
    return newFilter;
  }

  updateFilter(filterId: string, updates: Partial<DynamicFilter>): void {
    const config = this.getFilterConfiguration();
    const index = config.filters.findIndex(f => f.id === filterId);
    
    if (index !== -1) {
      config.filters[index] = {
        ...config.filters[index],
        ...updates,
        updatedAt: new Date(),
      };
      config.lastUpdated = new Date();
      localStorage.setItem(this.storageKey, JSON.stringify(config));
    }
  }

  deleteFilter(filterId: string): void {
    const config = this.getFilterConfiguration();
    config.filters = config.filters.filter(f => f.id !== filterId);
    config.lastUpdated = new Date();
    localStorage.setItem(this.storageKey, JSON.stringify(config));
  }

  toggleFilterStatus(filterId: string): void {
    const config = this.getFilterConfiguration();
    const filter = config.filters.find(f => f.id === filterId);
    
    if (filter) {
      filter.isActive = !filter.isActive;
      filter.updatedAt = new Date();
      config.lastUpdated = new Date();
      localStorage.setItem(this.storageKey, JSON.stringify(config));
    }
  }

  reorderFilters(filterIds: string[]): void {
    const config = this.getFilterConfiguration();
    
    filterIds.forEach((id, index) => {
      const filter = config.filters.find(f => f.id === id);
      if (filter) {
        filter.order = index + 1;
        filter.updatedAt = new Date();
      }
    });

    config.lastUpdated = new Date();
    localStorage.setItem(this.storageKey, JSON.stringify(config));
  }

  // Get dynamic options for filters based on data source
  getFilterOptions(filter: DynamicFilter, products: any[]): any[] {
    switch (filter.dataSource) {
      case FilterDataSource.PRODUCT_CATEGORY:
        return Object.values(ProductCategory).map(cat => ({ label: cat, value: cat }));
      
      case FilterDataSource.PRODUCT_BRAND:
        const brands = Array.from(new Set(products.map(p => p.brand)));
        return brands.map(brand => ({ label: brand, value: brand }));
      
      case FilterDataSource.CUSTOM:
        return filter.options || [];
      
      default:
        return [];
    }
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
    this.initializeDefaultFilters();
  }
}

export const filterService = new FilterService();
