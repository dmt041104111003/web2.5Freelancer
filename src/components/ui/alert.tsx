import React from 'react';
import { cn } from '@/lib/utils';
import { AlertProps } from '@/constants/ui';

export function Alert({ 
  children, 
  variant = 'default',
  className 
}: AlertProps) {
  const variants = {
    default: 'bg-background-secondary text-text-secondary border border-border',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20'
  };

  return (
    <div className={cn(
      'rounded-lg border p-4',
      variants[variant],
      className
    )}>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
