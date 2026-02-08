/**
 * Dynamic Filter System Types
 * Allows admins to create custom filters for buyers
 */

export enum FilterType {
  DROPDOWN = 'DROPDOWN', // Single select dropdown
  MULTI_SELECT = 'MULTI_SELECT', // Multiple checkboxes
  RANGE = 'RANGE', // Min/Max range (for numbers)
  RATING = 'RATING', // Star rating filter
  BOOLEAN = 'BOOLEAN', // Yes/No toggle
}

export enum FilterDataSource {
  PRODUCT_CATEGORY = 'PRODUCT_CATEGORY', // Categories from products
  PRODUCT_BRAND = 'PRODUCT_BRAND', // Brands from products
  CUSTOM = 'CUSTOM', // Custom values defined by admin
  PRODUCT_FIELD = 'PRODUCT_FIELD', // Any product field (price, stock, etc.)
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface DynamicFilter {
  id: string;
  name: string;
  type: FilterType;
  dataSource: FilterDataSource;
  productField?: string; // Field name in Product interface to filter on
  options?: FilterOption[]; // For DROPDOWN, MULTI_SELECT (if CUSTOM)
  min?: number; // For RANGE
  max?: number; // For RANGE
  step?: number; // For RANGE
  defaultValue?: any;
  isActive: boolean;
  order: number; // Display order in filters sidebar
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterConfiguration {
  filters: DynamicFilter[];
  lastUpdated: Date;
}
