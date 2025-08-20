import React from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '@/constants/ui';

export function Card({ 
  children, 
  className,
  variant = 'default',
  padding = 'md',
  hover = false
}: CardProps) {
  const variants = {
    default: 'glass-card border border-border',
    elevated: 'glass-card shadow-lg hover:shadow-xl border border-border',
    outlined: 'glass-card border border-border'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      'rounded-xl transition-all duration-300',
      variants[variant],
      paddings[padding],
      hover && 'hover:scale-105',
      className
    )}>
      {children}
    </div>
  );
}
