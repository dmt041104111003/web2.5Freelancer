"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return 'border border-gray-400 bg-white';
      case 'default':
      default:
        return 'border border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`p-6 ${getVariantStyles()} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}
