import React, { useEffect, useState } from 'react';
import { AnimatedProgressProps } from '@/constants/ui';

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className = '', 
  showLabel = false,
  size = 'md',
  variant = 'default',
  animated = true,
  duration = 1000
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-primary to-primary/80',
    success: 'bg-gradient-to-r from-success to-success/80',
    warning: 'bg-gradient-to-r from-warning to-warning/80',
    danger: 'bg-gradient-to-r from-danger to-danger/80'
  };

  useEffect(() => {
    if (animated) {
      const startTime = Date.now();
      const startValue = displayValue;
      const endValue = percentage;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated, duration, displayValue]);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-text-muted mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.round(displayValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-background-secondary rounded-full overflow-hidden ${sizeClasses[size]} shadow-inner`}>
        <div 
          className={`${variantClasses[variant]} h-full rounded-full transition-all duration-500 ease-out relative`}
          style={{ 
            width: `${displayValue}%`,
            transform: 'translateZ(0)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {/* Shimmer effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
            style={{
              animationDuration: '2s',
              animationIterationCount: 'infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
}
