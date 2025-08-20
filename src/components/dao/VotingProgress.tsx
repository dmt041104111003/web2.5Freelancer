import React from 'react';
import { Progress } from '@/components/ui/progress';
import { VotingProgressProps } from '@/constants/dao';

export default function VotingProgress({ 
  totalVotes, 
  quorum, 
  yesVotes, 
  noVotes 
}: VotingProgressProps) {
  const progressPercentage = Math.min((totalVotes / quorum) * 100, 100);
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm text-text-muted mb-2">
          <span>Tiến độ bỏ phiếu</span>
          <span className="font-medium">{totalVotes.toLocaleString()}/{quorum.toLocaleString()} votes</span>
        </div>
        <div className="relative">
          <Progress 
            value={totalVotes} 
            max={quorum}
            size="lg"
            variant="default"
          />
          <div className="absolute top-0 right-0 -mt-6 text-xs text-text-muted">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm text-text-muted mb-3">
          <span>Kết quả hiện tại</span>
          <span className="font-medium">{yesPercentage.toFixed(1)}% Yes</span>
        </div>
        
        <div className="flex h-4 bg-background-secondary rounded-full overflow-hidden">
          <div 
            className="bg-success transition-all duration-500 ease-out"
            style={{ width: `${yesPercentage}%` }}
          />
          <div 
            className="bg-danger transition-all duration-500 ease-out"
            style={{ width: `${noPercentage}%` }}
          />
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-success/10 border border-success/20 rounded-lg p-3 text-center hover:bg-success/15 transition-colors">
            <div className="text-success font-bold text-lg">{yesVotes.toLocaleString()}</div>
            <div className="text-xs text-text-muted font-medium">Yes Votes</div>
            <div className="text-xs text-success font-medium">{yesPercentage.toFixed(1)}%</div>
          </div>
          <div className="flex-1 bg-danger/10 border border-danger/20 rounded-lg p-3 text-center hover:bg-danger/15 transition-colors">
            <div className="text-danger font-bold text-lg">{noVotes.toLocaleString()}</div>
            <div className="text-xs text-text-muted font-medium">No Votes</div>
            <div className="text-xs text-danger font-medium">{noPercentage.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
