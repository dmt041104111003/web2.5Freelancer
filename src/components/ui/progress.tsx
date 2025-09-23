import React from 'react';
import { ProgressProps } from '@/constants/ui';

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  showLabel = false,
  size = 'md',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-text-muted mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-background-secondary rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${variantClasses[variant]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ 
            width: `${percentage}%`,
            transform: 'translateZ(0)' // Force hardware acceleration
          }}
        />
      </div>
    </div>
  );
}
