"use client";
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HOW_IT_WORKS_STEPS } from '@/constants/landing';


const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export function HowItWorks() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <Container>
        <div className="text-center mb-16">
          <h2 
            style={robotoCondensed}
            className="text-4xl lg:text-5xl text-primary mb-4"
          >
            How it works
          </h2>
          <p 
            style={robotoCondensed}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            A simple 4-step process to start safe and transparent freelancing
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={step.id} className="relative group">
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/20 transform -translate-y-1/2 z-0"></div>
              )}
              
              <Card variant="elevated" hover className="relative">
                <div className="absolute -top-3 -left-3">
                  <Badge variant="live" size="sm" className="w-8 h-8 flex items-center justify-center">
                    {step.id}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="lg:hidden mt-8">
          <div className="flex justify-center">
            <div className="space-y-4">
              {HOW_IT_WORKS_STEPS.slice(0, -1).map((_, index) => (
                <div key={index} className="w-0.5 h-8 bg-primary/20 mx-auto"></div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
