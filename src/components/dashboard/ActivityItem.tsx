import React from 'react';
import { ActivityItemProps } from '@/constants/dashboard';

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors">
      <div className="flex-1">
        <p className="text-sm text-text-primary mb-1">
          {activity.message}
        </p>
        <p className="text-xs text-text-muted">
          {activity.timestamp}
        </p>
      </div>
      {activity.amount && (
        <div className="text-sm font-medium text-success">
          +${activity.amount.toLocaleString()}
        </div>
      )}
    </div>
  );
}
