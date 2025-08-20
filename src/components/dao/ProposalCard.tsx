import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VotingProgress from './VotingProgress';
import { ProposalCardProps } from '@/constants/dao';

export default function ProposalCard({ 
  proposal, 
  getStatusColor, 
  getStatusText, 
}: ProposalCardProps) {
  return (
    <Card variant="elevated" className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {proposal.title}
              </h3>
              <p className="text-text-secondary mb-3">
                {proposal.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={getStatusColor(proposal.status) as 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'live'} size="sm">
                {getStatusText(proposal.status)}
              </Badge>
              <Badge variant="default" size="sm">
                {proposal.category}
              </Badge>
            </div>
          </div>

          {proposal.status === 'active' && (
            <div className="mb-4">
              <VotingProgress
                totalVotes={proposal.totalVotes}
                quorum={proposal.quorum}
                yesVotes={proposal.yesVotes}
                noVotes={proposal.noVotes}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-text-muted">
            <span>By: {proposal.creator}</span>
            <span>End: {proposal.endDate}</span>
            <span>Created: {proposal.createdAt}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          {proposal.status === 'active' && (
            <>
              <Button size="lg" className="w-full lg:w-auto">
                Bỏ phiếu Yes
              </Button>
              <Button variant="outline" size="lg" className="w-full lg:w-auto">
                Bỏ phiếu No
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="w-full lg:w-auto">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
}
