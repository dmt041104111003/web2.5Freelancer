"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Container } from '@/components/ui/container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, MessageSquareMore } from 'lucide-react';

const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<string>("list");

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-4 leading-tight">
              <span style={robotoCondensed} className=" text-primary block">
                Event Dispute
              </span>
            </h1>
            <p style={robotoCondensed} className="text-xl lg:text-2xl text-text-secondary max-w-2xl">
              Public view of dispute events and send your suggestions/comments.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              if (typeof window !== "undefined") {
                const newUrl = `${window.location.pathname}#${value}`;
                window.history.replaceState(null, "", newUrl);
              }
            }}
            className="w-full"
          >
            <TabsList className="flex w-full mb-6">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <MessageSquareMore className="h-4 w-4" />
                Suggestions/Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <Card variant="outlined" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">Dispute events are ongoing</h2>
                  <Button variant="outline" size="sm">Refresh</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  No data. Connect API/on-chain to display the dispute list.
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-6">
              <Card variant="outlined" className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">Suggestions/Comments</h2>
                  <Button variant="outline" size="sm">Add Suggestions</Button>
                </div>
                <div className="text-sm text-muted-foreground mb-6">
                  Track your suggestions and the dispute events you have participated in.
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card variant="outlined" className="p-4">
                    <div className="font-medium mb-1">Suggestions</div>
                    <div className="text-sm text-muted-foreground">No suggestions.</div>
                  </Card>
                  <Card variant="outlined" className="p-4">
                    <div className="font-medium mb-1">Dispute Events</div>
                    <div className="text-sm text-muted-foreground">No dispute events.</div>
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


