"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { HERO_DATA } from '@/constants/landing';


const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export function Hero() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20 bg-background">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-text-primary leading-tight">
                <span 
                  style={robotoCondensed}
                  className="text-6xl lg:text-8xl text-primary block"
                >
                  {HERO_DATA.title}
                </span>
              </h1>
              <p 
                style={robotoCondensed}
                className="text-xl lg:text-2xl text-text-secondary max-w-2xl"
              >
                {HERO_DATA.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                {HERO_DATA.primaryCta}
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {HERO_DATA.secondaryCta}
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-text-muted">
              {HERO_DATA.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>{indicator.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="animate-fade-in-right">
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 backdrop-blur-sm border border-border shadow-lg">
                <div className="bg-card rounded-xl p-6 shadow-2xl border border-border">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Verify ID</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg border border-border backdrop-blur-sm">
                        <img 
                          src="/images/landing/logo_full.png" 
                          alt="Identity Verification" 
                          className="h-8 object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">Identity Verification</p>
                          <p className="text-xs text-text-secondary">DID-based authentication</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg border border-border backdrop-blur-sm">
                        <img 
                          src="/images/landing/logo_full.png" 
                          alt="Escrow Vault" 
                          className="h-8 object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">Escrow Vault</p>
                          <p className="text-xs text-text-secondary">Secure payment protection</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse z-10 relative"></div>
                    <span className="absolute inline-flex h-12 w-12 rounded-full bg-accent opacity-75 animate-ping -top-5 -left-5 z-0"></span>
                  </div>
                  <span className="text-sm font-medium text-accent">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}