"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DisputeItemProps } from '@/constants/escrow';

export const DisputeItem: React.FC<DisputeItemProps> = ({ dispute, resolvingKey, onResolvePoster, onResolveFreelancer }) => {
  const key = `${dispute.jobId}:${dispute.milestoneIndex}`;
  return (
    <Card variant="outlined" className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-blue-800 font-bold">Job #{dispute.jobId} — Cột mốc {dispute.milestoneIndex}</div>
        <div className="text-xs text-gray-600">{dispute.openedAt || ''}</div>
      </div>
      <div className="text-sm text-gray-700 mb-2">Trạng thái: {dispute.status}</div>
      {dispute.reason && <div className="text-sm text-gray-700 mb-3">Lý do: {dispute.reason}</div>}
      {(dispute.posterEvidenceCid || dispute.freelancerEvidenceCid) && (
        <div className="mb-3 text-xs text-gray-700">
          {dispute.posterEvidenceCid && (
            <div>
              Bằng chứng của Poster: <a className="text-blue-700 underline break-all" href={`https://ipfs.io/ipfs/${dispute.posterEvidenceCid.replace(/^enc:/,'')}`} target="_blank" rel="noreferrer">{dispute.posterEvidenceCid}</a>
            </div>
          )}
          {dispute.freelancerEvidenceCid && (
            <div>
              Bằng chứng của Freelancer: <a className="text-blue-700 underline break-all" href={`https://ipfs.io/ipfs/${dispute.freelancerEvidenceCid.replace(/^enc:/,'')}`} target="_blank" rel="noreferrer">{dispute.freelancerEvidenceCid}</a>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="!bg-white !text-black !border-2 !border-black"
          size="sm"
          disabled={dispute.votesCompleted || dispute.hasVoted || resolvingKey === `${dispute.disputeId}:poster`}
          onClick={onResolvePoster}
        >
          {resolvingKey === `${dispute.disputeId}:poster` ? 'Đang bỏ phiếu...' : 'Bỏ phiếu cho Poster'}
        </Button>
        <Button
          variant="outline"
          className="!bg-white !text-black !border-2 !border-black"
          size="sm"
          disabled={dispute.votesCompleted || dispute.hasVoted || resolvingKey === `${dispute.disputeId}:freelancer`}
          onClick={onResolveFreelancer}
        >
          {resolvingKey === `${dispute.disputeId}:freelancer` ? 'Đang bỏ phiếu...' : 'Bỏ phiếu cho Freelancer'}
        </Button>
        {dispute.votesCompleted ? (
          <span className="text-xs text-gray-600">Bỏ phiếu đã đóng</span>
        ) : dispute.hasVoted ? (
          <span className="text-xs text-gray-600">Bạn đã bỏ phiếu</span>
        ) : null}
      </div>
    </Card>
  );
};


