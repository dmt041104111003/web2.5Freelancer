"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Container } from '@/components/ui/container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<string>("list");


  useEffect(() => {
    const applyHash = () => {
      const hash = (typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "") || "list";
      if (hash === "list" || hash === "suggestions") {
        setActiveTab(hash);
      } else {
        setActiveTab("list");
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-blue-800 mb-4 leading-tight">
              Event Dispute
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-2xl">
              Public view of dispute events and send your suggestions/comments.
            </p>
          </div>

          <Tabs className="w-full">
            <TabsList 
              className="flex w-full mb-6"
              activeTab={activeTab}
              setActiveTab={(value) => {
                setActiveTab(value);
                if (typeof window !== "undefined") {
                  const newUrl = `${window.location.pathname}#${value}`;
                  window.history.replaceState(null, "", newUrl);
                }
              }}
            >
              <TabsTrigger value="list">
                List
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                Suggestions/Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <Card variant="outlined" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-800">Dispute events are ongoing</h2>
                  <Button variant="outline" size="sm">Refresh</Button>
                </div>
                <div className="text-sm text-gray-700">
                  No data. Connect API/on-chain to display the dispute list.
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-6">
              <Card variant="outlined" className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-blue-800">Suggestions/Comments</h2>
                  <Button variant="outline" size="sm">Add Suggestions</Button>
                </div>
                <div className="text-sm text-gray-700 mb-6">
                  Track your suggestions and the dispute events you have participated in.
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card variant="outlined" className="p-4">
                    <div className="font-bold text-blue-800 mb-1">Suggestions</div>
                    <div className="text-sm text-gray-700">No suggestions.</div>
                  </Card>
                  <Card variant="outlined" className="p-4">
                    <div className="font-bold text-blue-800 mb-1">Dispute Events</div>
                    <div className="text-sm text-gray-700">No dispute events.</div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
}


