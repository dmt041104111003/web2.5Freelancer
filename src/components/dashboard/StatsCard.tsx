import React from 'react';
import { Card } from '@/components/ui/card';
import { StatsCardProps } from '@/constants/dashboard';

export default function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {description && (
            <p className="text-xs text-text-muted mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
