"use client";

import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

export function Tabs({ children, defaultValue, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab, 
            setActiveTab 
          } as any);
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}

export function TabsList({ children, activeTab, setActiveTab, className = '' }: TabsListProps) {
  return (
    <div className={`flex border-b-2 border-blue-800 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab, 
            setActiveTab 
          } as any);
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}

export function TabsTrigger({ value, children, activeTab, setActiveTab, className = '' }: TabsTriggerProps) {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab?.(value)}
      className={`px-6 py-3 font-bold border-b-2 ${
        isActive 
          ? 'text-blue-800 border-blue-800 bg-white' 
          : 'text-gray-700 border-transparent hover:text-blue-800'
      } ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  className?: string;
}

export function TabsContent({ value, children, activeTab, className = '' }: TabsContentProps) {
  if (activeTab !== value) return null;

  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
