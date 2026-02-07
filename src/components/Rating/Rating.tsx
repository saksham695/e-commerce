import React from 'react';
import './Rating.css';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'medium',
  readonly = true,
  onChange,
  showValue = false,
}) => {
  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`rating rating-${size}`}>
      <div className="stars">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(value);
          
          return (
            <span
              key={index}
              className={`star ${isFilled ? 'filled' : 'empty'} ${!readonly ? 'interactive' : ''}`}
              onClick={() => handleClick(starValue)}
            >
              {isFilled ? '★' : '☆'}
            </span>
          );
        })}
      </div>
      {showValue && <span className="rating-value">({value.toFixed(1)})</span>}
    </div>
  );
};

export default Rating;
