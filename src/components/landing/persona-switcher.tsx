"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PERSONAS } from '@/constants/landing';



const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export function PersonaSwitcher() {
  const [activePersona, setActivePersona] = useState<'poster' | 'freelancer'>('poster');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <section id="features" className="py-20 bg-background-secondary">
      <Container>
        <div className="text-center mb-12">
          <h2 
            style={robotoCondensed}
            className="text-4xl lg:text-5xl text-primary mb-4"
          >
            Who are you?
          </h2>
          <p 
            style={robotoCondensed}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Choose your role to see tailored benefits
          </p>
        </div>
        
         <div className="flex justify-center mb-12">
            <div className="bg-background rounded-xl p-2 flex gap-2 shadow-lg border border-border backdrop-blur-sm">
              <Button
                onClick={() => setActivePersona('poster')}
                variant={activePersona === 'poster' ? 'primary' : 'ghost'}
                size="md"
                className="px-6"
              >
                Client
              </Button>
              <Button
                onClick={() => setActivePersona('freelancer')}
                variant={activePersona === 'freelancer' ? 'primary' : 'ghost'}
                size="md"
                className="px-6"
              >
                Freelancer
              </Button>
           </div>
         </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-xl border border-border backdrop-blur-sm">
          
           <div className="grid md:grid-cols-2 gap-6 mb-8">
             {PERSONAS[activePersona].benefits.map((benefit, index) => (
               <div key={index} className="flex items-start gap-3">
                 <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                   <span className="text-success text-sm">✓</span>
                 </div>
                 <p className="text-text-primary leading-relaxed">
                   {benefit}
                 </p>
               </div>
              ))}
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <Button size="lg" className="px-8">
                {PERSONAS[activePersona].cta}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
