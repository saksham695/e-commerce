import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
}) => {
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '200px'),
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton skeleton-${variant}`}
      style={style}
    />
  ));

  return <>{skeletons}</>;
};

export default Skeleton;

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card skeleton-card">
      <Skeleton variant="rectangular" height="220px" />
      <div style={{ padding: '18px' }}>
        <Skeleton variant="text" width="80%" height="20px" />
        <Skeleton variant="text" width="40%" height="16px" />
        <div style={{ marginTop: '10px' }}>
          <Skeleton variant="text" count={2} height="14px" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <Skeleton variant="text" width="30%" height="24px" />
          <Skeleton variant="text" width="40%" height="20px" />
        </div>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="skeleton-row">
      <td><Skeleton height="20px" /></td>
      <td><Skeleton height="20px" /></td>
      <td><Skeleton height="20px" /></td>
      <td><Skeleton height="20px" /></td>
    </tr>
  );
};
