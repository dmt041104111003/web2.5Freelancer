"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

export const ReputationContent: React.FC = () => {
  const { account } = useWallet();
  const [checkAddress, setCheckAddress] = useState('');
  const [checkedAddress, setCheckedAddress] = useState<string | null>(null);
  const [checkedUT, setCheckedUT] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState('');

  const handleCheckAddress = async () => {
    const address = checkAddress.trim() || account;
    if (!address) {
      setCheckError('Vui lòng nhập địa chỉ hoặc kết nối ví');
      return;
    }
    
    setChecking(true);
    setCheckError('');
    try {
      const res = await fetch(`/api/reputation?address=${encodeURIComponent(address)}`);
      if (!res.ok) throw new Error('Không thể lấy danh tiếng');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Không thể lấy danh tiếng');
      
      setCheckedAddress(address);
      setCheckedUT(data.ut || 0);
    } catch (e: any) {
      setCheckError(e?.message || 'Không thể kiểm tra danh tiếng');
      setCheckedAddress(null);
      setCheckedUT(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Điểm Danh Tiếng</h1>
        <p className="text-lg text-gray-700">Kiểm tra điểm UT cho bất kỳ địa chỉ nào.</p>
      </div>

      <Card variant="outlined" className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ ví {account && <span className="text-gray-500 font-normal">(để trống để kiểm tra địa chỉ của bạn)</span>}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={checkAddress}
                onChange={(e) => setCheckAddress(e.target.value)}
                placeholder={account || "0x..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCheckAddress()}
              />
              <Button onClick={handleCheckAddress} disabled={checking} variant="primary">
                {checking ? 'Đang kiểm tra...' : 'Kiểm tra'}
              </Button>
            </div>
            {checkError && <p className="mt-2 text-sm text-red-600">{checkError}</p>}
          </div>

          {checkedAddress && checkedUT !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600 mb-1">Địa chỉ:</div>
              <div className="text-sm font-mono text-gray-800 mb-3 break-all">{checkedAddress}</div>
              <div className="text-sm text-gray-600 mb-1">Điểm UT:</div>
              <div className="text-2xl font-bold text-blue-800">{checkedUT}</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
