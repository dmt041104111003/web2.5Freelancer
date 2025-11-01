"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useWallet } from '@/contexts/WalletContext';
import { JobCard } from './projects/JobCard';
import { useJobs, RoleState, JobItem } from './projects/useJobs';

interface RoleProjectsViewProps {
  role: 'poster' | 'freelancer';
  activeRole: 'poster' | 'freelancer' | null;
  posterIdHash: string;
  freelancerIdHash: string;
  loading: boolean;
  jobs: JobItem[];
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  pageSize: number;
  scanAndFetchJobs: () => void;
  errorMsg: string;
  roleState: RoleState;
  acceptingId: string | null;
  stakingJobId: number | null;
  submittingMilestone: string | null;
  approvingMilestone: string | null;
  disputingMilestone: string | null;
  acceptApplicant: (jobId: number, cid: string, applicantIdHash: string) => Promise<void>;
  stakeAndJoin: (jobId: number) => Promise<void>;
  submitMilestone: (jobId: number, milestoneIndex: number) => Promise<void>;
  approveMilestone: (jobId: number, milestoneIndex: number) => Promise<void>;
  disputeMilestone: (jobId: number, milestoneIndex: number) => Promise<void>;
}

const RoleProjectsView: React.FC<RoleProjectsViewProps> = ({
  role,
  activeRole,
  posterIdHash,
  freelancerIdHash,
  loading,
  jobs,
  currentPage,
  setCurrentPage,
  pageSize,
  scanAndFetchJobs,
  errorMsg,
  roleState,
  acceptingId,
  stakingJobId,
  submittingMilestone,
  approvingMilestone,
  disputingMilestone,
  acceptApplicant,
  stakeAndJoin,
  submitMilestone,
  approveMilestone,
  disputeMilestone,
}) => {
  const displayRole = activeRole || role;
  const idHash = displayRole === 'poster' ? posterIdHash : freelancerIdHash;
  
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-gray-700">
          {displayRole === 'poster' ? (
            posterIdHash ? <span>Poster ID Hash: <strong>{posterIdHash}</strong></span> : <span className="text-red-800">Không tìm thấy poster_id_hash trong trình duyệt</span>
          ) : (
            freelancerIdHash ? <span>Freelancer ID Hash: <strong>{freelancerIdHash}</strong></span> : <span className="text-red-800">Không tìm thấy freelancer_id_hash trong trình duyệt</span>
          )}
        </div>
        <Button
          type="button"
          onClick={scanAndFetchJobs}
          variant="outline"
          disabled={loading}
          className="!bg-white !text-black !border-2 !border-black py-2 font-bold hover:!bg-gray-100"
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 text-red-800 border border-red-300 text-sm font-bold rounded">{errorMsg}</div>
      )}

      <div className="space-y-4">
        {jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(({ id, cid, meta, chainInfo }) => (
          <JobCard
            key={id}
            roleState={displayRole as any}
            id={id}
            cid={cid}
            meta={meta}
            chainInfo={chainInfo}
            posterIdHash={posterIdHash}
            freelancerIdHash={freelancerIdHash}
            acceptingId={acceptingId}
            stakingJobId={stakingJobId}
            submittingMilestone={submittingMilestone}
            approvingMilestone={approvingMilestone}
            disputingMilestone={disputingMilestone}
            onAccept={acceptApplicant}
            onStake={stakeAndJoin}
            onSubmit={submitMilestone}
            onApprove={approveMilestone}
            onDispute={disputeMilestone}
          />
        ))}
        {jobs.length > 0 && (
          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
              className="!bg-white !text-black !border-2 !border-black py-2 px-4"
            >
              Trước
            </Button>
            <div className="text-sm text-gray-700">
              Trang {currentPage} / {Math.max(1, Math.ceil(jobs.length / pageSize))}
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={currentPage >= Math.ceil(jobs.length / pageSize)}
              onClick={() => setCurrentPage((prev: number) => Math.min(Math.ceil(jobs.length / pageSize), prev + 1))}
              className="!bg-white !text-black !border-2 !border-black py-2 px-4"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export const ProjectsTab: React.FC = () => {
  const { account } = useWallet();
  const [selectedRole, setSelectedRole] = useState<'poster' | 'freelancer'>('poster');
  const {
    roleState,
    checkingRole,
    loading,
    errorMsg,
    jobs,
    posterIdHash,
    freelancerIdHash,
    currentPage,
    setCurrentPage,
    pageSize,
    scanAndFetchJobs,
    acceptingId,
    stakingJobId,
    submittingMilestone,
    approvingMilestone,
    disputingMilestone,
    acceptApplicant,
    stakeAndJoin,
    submitMilestone,
    approveMilestone,
    disputeMilestone,
  } = useJobs(account);

  // Determine the active role to display
  const activeRole = roleState === 'both' ? selectedRole : (roleState === 'poster' ? 'poster' : roleState === 'freelancer' ? 'freelancer' : null);

  if (checkingRole) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-xl text-gray-700">Đang kiểm tra role...</p>
      </div>
    );
  }

  if (roleState === 'none' || roleState === 'unknown') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Bạn chưa có role Poster hoặc Freelancer
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Bạn cần đăng ký role Poster hoặc Freelancer để xem và quản lý dự án
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/auth/did-verification">
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              Đăng ký Role
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card variant="outlined" className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Dự Án</h2>
          <p className="text-gray-700">Xem và quản lý dự án từ CID on-chain</p>
          {roleState === 'both' ? (
            <div className="p-3 bg-blue-800 text-white border-2 border-blue-800 text-sm font-bold mt-4 rounded">
              Bạn có cả role Poster và Freelancer. Chọn tab để xem dự án theo role.
            </div>
          ) : roleState === 'poster' ? (
            <div className="p-3 bg-blue-800 text-white border-2 border-blue-800 text-sm font-bold mt-4 rounded">
              Bạn đang ở chế độ Poster
            </div>
          ) : (
            <div className="p-3 bg-blue-800 text-white border-2 border-blue-800 text-sm font-bold mt-4 rounded">
              Bạn đang ở chế độ Freelancer
            </div>
          )}
        </div>

        {roleState === 'both' && (
          <div className="mb-6">
            <div className="flex gap-2 border-b border-gray-300">
              <button
                type="button"
                onClick={() => setSelectedRole('poster')}
                className={`flex-1 px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                  selectedRole === 'poster'
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Poster Projects
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('freelancer')}
                className={`flex-1 px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                  selectedRole === 'freelancer'
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Freelancer Projects
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {roleState === 'both' ? (
            selectedRole === 'poster' ? (
              <RoleProjectsView 
                role="poster"
                activeRole={selectedRole}
                posterIdHash={posterIdHash}
                freelancerIdHash={freelancerIdHash}
                loading={loading}
                jobs={jobs}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                scanAndFetchJobs={scanAndFetchJobs}
                errorMsg={errorMsg}
                roleState={roleState}
                acceptingId={acceptingId}
                stakingJobId={stakingJobId}
                submittingMilestone={submittingMilestone}
                approvingMilestone={approvingMilestone}
                disputingMilestone={disputingMilestone}
                acceptApplicant={acceptApplicant}
                stakeAndJoin={stakeAndJoin}
                submitMilestone={submitMilestone}
                approveMilestone={approveMilestone}
                disputeMilestone={disputeMilestone}
              />
            ) : (
              <RoleProjectsView 
                role="freelancer"
                activeRole={selectedRole}
                posterIdHash={posterIdHash}
                freelancerIdHash={freelancerIdHash}
                loading={loading}
                jobs={jobs}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                scanAndFetchJobs={scanAndFetchJobs}
                errorMsg={errorMsg}
                roleState={roleState}
                acceptingId={acceptingId}
                stakingJobId={stakingJobId}
                submittingMilestone={submittingMilestone}
                approvingMilestone={approvingMilestone}
                disputingMilestone={disputingMilestone}
                acceptApplicant={acceptApplicant}
                stakeAndJoin={stakeAndJoin}
                submitMilestone={submitMilestone}
                approveMilestone={approveMilestone}
                disputeMilestone={disputeMilestone}
              />
            )
          ) : (
            <RoleProjectsView 
              role={activeRole || 'poster'}
              activeRole={activeRole}
              posterIdHash={posterIdHash}
              freelancerIdHash={freelancerIdHash}
              loading={loading}
              jobs={jobs}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              scanAndFetchJobs={scanAndFetchJobs}
              errorMsg={errorMsg}
              roleState={roleState}
              acceptingId={acceptingId}
              stakingJobId={stakingJobId}
              submittingMilestone={submittingMilestone}
              approvingMilestone={approvingMilestone}
              disputingMilestone={disputingMilestone}
              acceptApplicant={acceptApplicant}
              stakeAndJoin={stakeAndJoin}
              submitMilestone={submitMilestone}
              approveMilestone={approveMilestone}
              disputeMilestone={disputeMilestone}
            />
          )}
        </div>
      </Card>
    </div>
  );
};


