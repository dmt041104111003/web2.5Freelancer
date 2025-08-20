"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import ProposalCard from '@/components/dao/ProposalCard';
import DaoFilters from '@/components/dao/DaoFilters';
import { MOCK_PROPOSALS, CATEGORIES, Proposal } from '@/constants/dao';



const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export default function DaoPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const filteredProposals = MOCK_PROPOSALS.filter(proposal => {
    const matchesCategory = selectedCategory === 'all' || 
                          proposal.category.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         proposal.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang bỏ phiếu';
      case 'pending': return 'Chờ bắt đầu';
      case 'completed': return 'Đã kết thúc';
      default: return status;
    }
  };

  const calculateProgress = (proposal: Proposal) => {
    return (proposal.totalVotes / proposal.quorum) * 100;
  };

  const calculateYesPercentage = (proposal: Proposal) => {
    if (proposal.totalVotes === 0) return 0;
    return (proposal.yesVotes / proposal.totalVotes) * 100;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-4 leading-tight">
              <span 
                style={robotoCondensed}
                className=" text-primary block"
              >
                DAO
              </span>
   
            </h1>
            <p 
              style={robotoCondensed}
              className="text-xl lg:text-2xl text-text-secondary max-w-2xl"
            >
              Tham gia quản trị nền tảng và đưa ra quyết định quan trọng
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card variant="outlined" className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">1,250</div>
              <div className="text-text-secondary">Tổng số votes</div>
            </Card>
            <Card variant="outlined" className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">3</div>
              <div className="text-text-secondary">Proposals đang active</div>
            </Card>
            <Card variant="outlined" className="p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-2">85%</div>
              <div className="text-text-secondary">Tỷ lệ tham gia</div>
            </Card>
            <Card variant="outlined" className="p-6 text-center">
              <div className="text-2xl font-bold text-secondary mb-2">15</div>
              <div className="text-text-secondary">Proposals đã hoàn thành</div>
            </Card>
          </div>

          <DaoFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            categories={CATEGORIES}
          />

          <div className="space-y-6">
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                calculateProgress={calculateProgress}
                calculateYesPercentage={calculateYesPercentage}
              />
            ))}
          </div>

          {filteredProposals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                Không có proposals nào phù hợp với bộ lọc của bạn
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
