import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeProps } from '@/constants/ui';

export function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className 
}: BadgeProps) {
  const variants = {
    default: 'bg-background-secondary text-text-primary border border-border backdrop-blur-sm',
    primary: 'bg-background-secondary text-primary border border-primary/30 backdrop-blur-sm',
    secondary: 'bg-background-secondary text-secondary border border-secondary/30 backdrop-blur-sm',
    success: 'bg-background-secondary text-success border border-success/30 backdrop-blur-sm',
    warning: 'bg-background-secondary text-accent border border-accent/30 backdrop-blur-sm',
    danger: 'bg-background-secondary text-danger border border-danger/30 backdrop-blur-sm',
    live: 'bg-accent/20 text-accent border border-accent/30 backdrop-blur-sm overflow-hidden'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium relative',
      variants[variant],
      sizes[size],
      className
    )}>
      {variant === 'live' ? (
        <>
          <span className="relative z-10">{children}</span>
          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full bg-accent opacity-30 animate-ping"></span>
        </>
      ) : (
        children
      )}
    </span>
  );
}
