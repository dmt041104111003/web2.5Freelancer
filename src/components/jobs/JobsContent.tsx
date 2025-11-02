"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

interface Job {
  id: number;
  cid: string;
  total_amount?: number;
  milestones_count?: number;
  has_freelancer?: boolean;
  state?: string;
}

export const JobsContent: React.FC = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/job?list=true');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || `HTTP ${res.status}: Failed to fetch jobs`);
        }
        
        console.log('[JobsContent] Fetched jobs:', data);
        setJobs(data.jobs || []);
      } catch (err) {
        console.error('[JobsContent] Error fetching jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 text-lg">Loading jobs...</p>
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
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Find a Job</h1>
        <p className="text-lg text-gray-700">On-chain jobs (click to view details from CID)</p>
      </div>

      {jobs.length === 0 ? (
        <Card variant="outlined" className="p-8 text-center">
          <h3 className="text-lg font-bold text-blue-800 mb-2">No jobs found</h3>
          <p className="text-gray-700">Be the first to post a job and start earning!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="cursor-pointer"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <Card 
                variant="outlined"
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">Job #{job.id}</h3>
                    <p className="text-sm text-gray-700">
                      {typeof job.total_amount === 'number' 
                        ? `${(job.total_amount / 100_000_000).toFixed(2)} APT` 
                        : '—'}
                      {typeof job.milestones_count === 'number' 
                        ? ` • ${job.milestones_count} milestones` 
                        : ''}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold border-2 ${
                    (typeof job.state === 'string' && job.state === 'Posted') ? 'bg-green-100 text-green-800 border-green-300' :
                    (typeof job.state === 'string' && job.state === 'InProgress') ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    (typeof job.state === 'string' && job.state === 'Completed') ? 'bg-gray-100 text-gray-800 border-gray-300' :
                    (typeof job.state === 'string' && job.state === 'Disputed') ? 'bg-red-100 text-red-800 border-red-300' :
                    'bg-gray-100 text-gray-800 border-gray-300'
                  }`}>
                    {(typeof job.state === 'string' && job.state === 'Posted') ? 'Open' :
                     (typeof job.state === 'string' && job.state === 'InProgress') ? 'In Progress' :
                     (typeof job.state === 'string' && job.state === 'Completed') ? 'Completed' :
                     (typeof job.state === 'string' && job.state === 'Disputed') ? 'Disputed' :
                     (typeof job.state === 'string' ? job.state : 'Active')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="pt-2 border-t border-gray-400">
                    <p className="text-xs text-gray-600 break-all">CID: {job.cid}</p>
                  </div>
                  {typeof job.has_freelancer === 'boolean' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Worker:</span>
                      <span className={`font-bold ${job.has_freelancer ? 'text-blue-800' : 'text-gray-600'}`}>
                        {job.has_freelancer ? 'Assigned' : 'Open'}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
