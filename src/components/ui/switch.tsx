"use client";

import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function Switch({ 
  checked, 
  onChange, 
  disabled = false, 
  className = '',
  label 
}: SwitchProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked ? "true" : "false"}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center border-2 border-blue-800
          ${checked ? 'bg-blue-800' : 'bg-white'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform border border-gray-400
            ${checked ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-300'}
          `}
        />
      </button>
      {label && (
        <span className={`font-bold ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
          {label}
        </span>
      )}
    </div>
  );
}
