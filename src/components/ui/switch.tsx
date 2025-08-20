"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { SwitchProps } from '@/constants/ui';

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="checkbox"
              className={cn(
                'peer h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-background-secondary',
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'checked:bg-primary checked:border-primary',
                error && 'border-danger focus-visible:ring-danger',
                className
              )}
              ref={ref}
              {...props}
            />
            <div className="pointer-events-none absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform peer-checked:translate-x-5" />
          </div>
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary">
              {label}
            </label>
          )}
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
);

Switch.displayName = 'Switch';
