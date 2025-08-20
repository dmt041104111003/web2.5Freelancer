import React from 'react';
import { cn } from '@/lib/utils';
import { ContainerProps } from '@/constants/ui';

export function Container({ 
  children, 
  className,
  size = 'lg',
  padding = 'md'
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl', 
    lg: 'max-w-7xl',
    xl: 'max-w-screen-xl',
    full: 'max-w-none'
  };

  const paddings = {
    none: '',
    sm: 'px-4',
    md: 'px-4 lg:px-8',
    lg: 'px-6 lg:px-12'
  };

  return (
    <div className={cn(
      'mx-auto',
      sizes[size],
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
}
