"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { RadioGroupProps } from '@/constants/ui';

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  error,
  helperText,
  className,
  orientation = 'vertical'
}: RadioGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className={cn(
        'space-y-2',
        orientation === 'horizontal' && 'flex flex-wrap gap-4'
      )}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={option.value}
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              className={cn(
                'h-4 w-4 border border-border bg-background text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-danger focus-visible:ring-danger'
              )}
            />
            <label
              htmlFor={option.value}
              className={cn(
                'text-sm font-medium leading-none text-text-primary',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                option.disabled && 'cursor-not-allowed opacity-70'
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-text-secondary">{helperText}</p>
      )}
    </div>
  );
}
