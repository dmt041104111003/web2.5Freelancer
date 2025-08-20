import React from 'react';
import { cn } from '@/lib/utils';
import { CheckboxProps } from '@/constants/ui';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="checkbox"
              className={cn(
                'peer h-4 w-4 shrink-0 rounded border border-border bg-background',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
                error && 'border-danger focus-visible:ring-danger',
                className
              )}
              ref={ref}
              {...props}
            />
            <svg
              className="absolute left-0.5 top-0.5 h-3 w-3 text-primary-foreground opacity-0 peer-data-[state=checked]:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
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

Checkbox.displayName = 'Checkbox';
