"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useDisputes } from './useDisputes';
import { DisputeItem } from './DisputeItem';

export const DisputesContent: React.FC = () => {
  const { account } = useWallet();
  const {
    loading,
    errorMsg,
    disputes,
    isReviewer,
    checkingRole,
    refresh,
    resolving,
    resolveToPoster,
    resolveToFreelancer,
  } = useDisputes(account);

  if (checkingRole) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Tranh chấp</h1>
          <p className="text-lg text-gray-700">Đang kiểm tra vai trò reviewer...</p>
        </div>
        <Card variant="outlined" className="p-6 text-center">
          <div className="text-sm text-gray-700">Đang tải...</div>
        </Card>
      </div>
    );
  }

  if (!isReviewer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Tranh chấp</h1>
          <p className="text-lg text-gray-700">Yêu cầu quyền truy cập reviewer.</p>
        </div>
        <Card variant="outlined" className="p-6 text-center">
          <div className="text-sm text-gray-700">Chỉ reviewer mới có thể truy cập tranh chấp. Vui lòng đăng ký làm reviewer trước.</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Tranh chấp</h1>
          <p className="text-lg text-gray-700">Chỉ reviewer được chỉ định mới có thể xem và bỏ phiếu.</p>
        </div>
        <Button variant="outline" className="!bg-white !text-black !border-2 !border-black" onClick={refresh} disabled={loading}>
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>
      {errorMsg && <div className="p-2 bg-red-100 text-red-800 text-sm border border-red-300">{errorMsg}</div>}

      <div className="space-y-3">
        {disputes.length === 0 ? (
          <Card variant="outlined" className="p-6 text-sm text-gray-700">Không có tranh chấp nào để xem xét.</Card>
        ) : (
          disputes.map((d) => (
            <DisputeItem
              key={`${d.jobId}:${d.milestoneIndex}`}
              dispute={d}
              resolvingKey={resolving}
              onResolvePoster={() => resolveToPoster(d.disputeId)}
              onResolveFreelancer={() => resolveToFreelancer(d.disputeId)}
            />
          ))
        )}
      </div>
    </div>
  );
};
