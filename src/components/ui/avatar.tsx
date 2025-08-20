import React from 'react';
import { cn } from '@/lib/utils';
import { AvatarProps } from '@/constants/ui';

export function Avatar({ 
  src, 
  alt, 
  fallback,
  size = 'md',
  className 
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div className={cn(
      'rounded-full bg-background-secondary flex items-center justify-center',
      sizes[size],
      textSizes[size],
      'font-medium text-text-secondary',
      className
    )}>
      {fallback ? (
        fallback.charAt(0).toUpperCase()
      ) : (
        <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    </div>
  );
}
