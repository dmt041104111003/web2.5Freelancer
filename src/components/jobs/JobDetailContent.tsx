"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CONTRACT_ADDRESS } from '@/constants/contracts';

export const JobDetailContent: React.FC = () => {
  const params = useParams();
  const jobId = params.id;
  
  const [jobDetails, setJobDetails] = useState<Record<string, unknown> | null>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get job from table first to get CID
        const jobRes = await fetch(`/api/job?job_id=${jobId}`);
        if (!jobRes.ok) {
          throw new Error('Job not found');
        }
        
        const jobResData = await jobRes.json();
        const cid = jobResData.job?.cid;
        
        if (!cid) {
          throw new Error('Job CID not found');
        }
        
        // Store job data (including apply_deadline)
        setJobData(jobResData.job);
        
        // Fetch IPFS data using CID directly
        const res = await fetch(`/api/ipfs/get?cid=${encodeURIComponent(cid)}`);
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch job details from IPFS');
        }
        
        if (data.data) {
          setJobDetails(data.data);
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);


  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 text-lg">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          ← Back to Jobs
        </Button>
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Job #{String(jobId)}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - IPFS Data */}
        <div className="lg:col-span-2">
          <Card variant="outlined" className="p-8">
            {jobDetails ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">
                    {String(jobDetails.title || 'Untitled Job')}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {String(jobDetails.description || 'No description provided')}
                  </p>
                </div>
                {(jobDetails as any).requirements && (
                  <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Requirements</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {Array.isArray((jobDetails as any).requirements)
                        ? (jobDetails as any).requirements.join(', ')
                        : String((jobDetails as any).requirements)}
                    </p>
                  </div>
                )}
                {(jobDetails as any).budget && (
                  <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Budget</h3>
                    <p className="text-gray-700">{String((jobDetails as any).budget)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Job details not available</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar - Blockchain Data */}
        <div>
          <Card variant="outlined" className="p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Thông tin Job</h3>
            <div className="space-y-4">
              {jobData?.total_escrow && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Tổng giá trị</div>
                  <div className="text-sm font-bold text-gray-900">
                    {(Number(jobData.total_escrow) / 100_000_000).toFixed(2)} APT
                  </div>
                </div>
              )}
              {jobData?.milestones && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Số cột mốc</div>
                  <div className="text-sm font-bold text-gray-900">
                    {Array.isArray(jobData.milestones) ? jobData.milestones.length : 0}
                  </div>
                </div>
              )}
              {jobData?.state && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Trạng thái</div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-bold border-2 ${
                      (typeof jobData.state === 'string' && jobData.state === 'Posted') ? 'bg-green-100 text-green-800 border-green-300' :
                      (typeof jobData.state === 'string' && jobData.state === 'InProgress') ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      (typeof jobData.state === 'string' && jobData.state === 'Completed') ? 'bg-gray-100 text-gray-800 border-gray-300' :
                      (typeof jobData.state === 'string' && jobData.state === 'Disputed') ? 'bg-red-100 text-red-800 border-red-300' :
                      'bg-gray-100 text-gray-800 border-gray-300'
                    }`}>
                      {(typeof jobData.state === 'string' && jobData.state === 'Posted') ? 'Open' :
                       (typeof jobData.state === 'string' && jobData.state === 'InProgress') ? 'In Progress' :
                       (typeof jobData.state === 'string' && jobData.state === 'Completed') ? 'Completed' :
                       (typeof jobData.state === 'string' && jobData.state === 'Disputed') ? 'Disputed' :
                       (typeof jobData.state === 'string' ? jobData.state : 'Active')}
                    </span>
                  </div>
                </div>
              )}
              {jobData?.poster && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Người đăng</div>
                  <div className="text-xs font-mono text-gray-700 break-all">
                    {jobData.poster}
                  </div>
                </div>
              )}
              {jobData?.freelancer && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Freelancer</div>
                  <div className="text-xs font-mono text-gray-700 break-all">
                    {typeof jobData.freelancer === 'string' 
                      ? jobData.freelancer
                      : (jobData.freelancer?.vec && jobData.freelancer.vec[0]) || 'Chưa có'}
                  </div>
                </div>
              )}
              {jobData?.apply_deadline && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Hạn đăng ký</div>
                  <div className={`text-sm font-bold ${
                    Number(jobData.apply_deadline) * 1000 < Date.now() ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {(() => {
                      const deadline = Number(jobData.apply_deadline);
                      const date = new Date(deadline * 1000);
                      const isExpired = deadline * 1000 < Date.now();
                      return (
                        <>
                          {date.toLocaleString('vi-VN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {isExpired && ' (Hết hạn)'}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
