"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import StatsCard from '@/components/dashboard/StatsCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import { MOCK_STATS, MOCK_PROJECTS, MOCK_RECENT_ACTIVITIES } from '@/constants/dashboard';


const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export default function DashboardPage() {

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang thực hiện';
      case 'pending': return 'Chờ xử lý';
      default: return status;
    }
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
                Dashboard
              </span>
            </h1>
            <p 
              style={robotoCondensed}
              className="text-xl lg:text-2xl text-text-secondary max-w-2xl"
            >
              Quản lý dự án và theo dõi thu nhập của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Tổng thu nhập" 
              value={`$${MOCK_STATS.totalEarnings.toLocaleString()}`} 
            />
            <StatsCard 
              title="Dự án đang thực hiện" 
              value={MOCK_STATS.activeProjects} 
            />
            <StatsCard 
              title="Tỷ lệ hoàn thành" 
              value={`${MOCK_STATS.completionRate}%`} 
            />
            <StatsCard 
              title="Thanh toán chờ" 
              value={`$${MOCK_STATS.pendingPayments.toLocaleString()}`} 
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card variant="outlined" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Dự án đang thực hiện</h2>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
              
              <div className="space-y-4">
                {MOCK_PROJECTS.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                  />
                ))}
              </div>
            </Card>

            <Card variant="outlined" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Hoạt động gần đây</h2>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
              
              <div className="space-y-4">
                {MOCK_RECENT_ACTIVITIES.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <Card variant="outlined" className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Thao tác nhanh</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <span className="text-sm">Tạo dự án mới</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <span className="text-sm">Rút tiền</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <span className="text-sm">Xem báo cáo</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <span className="text-sm">Cài đặt</span>
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
