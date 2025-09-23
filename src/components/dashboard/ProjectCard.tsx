import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { ProjectCardProps } from '@/constants/dashboard';

export default function ProjectCard({ project, getStatusColor, getStatusText }: ProjectCardProps) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-text-primary mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {project.client} • ${project.budget.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={getStatusColor(project.status) as 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'live'} size="sm">
            {getStatusText(project.status)}
          </Badge>
          {project.escrow && (
            <Badge variant="success" size="sm">
              Escrow
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <AnimatedProgress 
          value={project.progress} 
          showLabel={true}
          size="md"
          variant={project.progress === 100 ? 'success' : 'default'}
          animated={true}
          duration={800}
        />
        <div className="flex justify-between text-sm text-text-muted">
          <span>Due Date</span>
          <span>{project.dueDate}</span>
        </div>
      </div>
    </div>
  );
}
