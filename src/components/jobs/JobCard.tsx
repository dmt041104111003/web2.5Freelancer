import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobCardProps } from '@/constants/jobs';

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card variant="elevated" className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {job.title}
              </h3>
              <p className="text-text-secondary mb-3 line-clamp-2">
                {job.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                {job.escrow && (
                  <Badge variant="success" size="sm">
                    Escrow
                  </Badge>
                )}
                {job.verified && (
                  <Badge variant="primary" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((skill, index) => (
              <Badge key={index} variant="default" size="sm">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-text-muted">
            <span>Budget: {job.budget}</span>
            <span>Duration: {job.duration}</span>
            <span>Posted: {job.postedDate}</span>
            <span>By: {job.postedBy}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <Button size="lg" className="w-full lg:w-auto">
            Apply now
          </Button>
          <Button variant="outline" size="sm" className="w-full lg:w-auto">
            View details
          </Button>
        </div>
      </div>
    </Card>
  );
}
