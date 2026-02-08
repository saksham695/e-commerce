import React from 'react';
import { DynamicFilter, FilterType } from '../../types/filterTypes';
import './DynamicFilterRenderer.css';

interface DynamicFilterRendererProps {
  filter: DynamicFilter;
  value: any;
  onChange: (value: any) => void;
  options?: any[];
}

const DynamicFilterRenderer: React.FC<DynamicFilterRendererProps> = ({
  filter,
  value,
  onChange,
  options = [],
}) => {
  const renderDropdownFilter = () => {
    return (
      <select
        value={value || 'all'}
        onChange={(e) => onChange(e.target.value)}
        className="dynamic-filter-select"
      >
        <option value="all">All {filter.name}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const renderMultiSelectFilter = () => {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <div className="multi-select-options">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.value);
          return (
            <label key={option.value} className="multi-select-label">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, option.value]);
                  } else {
                    onChange(selectedValues.filter((v: any) => v !== option.value));
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const renderRangeFilter = () => {
    const rangeValue = value || { min: filter.min || 0, max: filter.max || 100 };

    return (
      <div className="range-filter">
        <div className="range-inputs">
          <input
            type="number"
            value={rangeValue.min}
            onChange={(e) =>
              onChange({ ...rangeValue, min: Number(e.target.value) })
            }
            placeholder="Min"
            className="range-input"
            min={filter.min}
            max={filter.max}
            step={filter.step || 1}
          />
          <span className="range-separator">-</span>
          <input
            type="number"
            value={rangeValue.max}
            onChange={(e) =>
              onChange({ ...rangeValue, max: Number(e.target.value) })
            }
            placeholder="Max"
            className="range-input"
            min={filter.min}
            max={filter.max}
            step={filter.step || 1}
          />
        </div>
      </div>
    );
  };

  const renderRatingFilter = () => {
    const ratings = [0, 3, 4, 4.5];

    return (
      <div className="rating-filter">
        {ratings.map((rating) => (
          <button
            key={rating}
            className={`rating-filter-btn ${value === rating ? 'active' : ''}`}
            onClick={() => onChange(rating)}
          >
            {rating === 0 ? 'All' : `${rating}+ ★`}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="dynamic-filter-section">
      <label className="dynamic-filter-label">{filter.name}</label>
      {filter.type === FilterType.DROPDOWN && renderDropdownFilter()}
      {filter.type === FilterType.MULTI_SELECT && renderMultiSelectFilter()}
      {filter.type === FilterType.RANGE && renderRangeFilter()}
      {filter.type === FilterType.RATING && renderRatingFilter()}
    </div>
  );
};

export default DynamicFilterRenderer;
