"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FAQS } from '@/constants/landing';

const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-background">
      <Container>
        <div className="text-center mb-16">
          <h2 
            style={robotoCondensed}
            className="text-4xl lg:text-5xl text-primary mb-4"
          >
            Câu hỏi thường gặp
          </h2>
          <p 
            style={robotoCondensed}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Những câu hỏi phổ biến về nền tảng Web2.5 Freelancer
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <Card key={index} variant="outlined" className="overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between h-auto"
                >
                  <span className="font-medium text-text-primary">
                    {faq.question}
                  </span>
                  <span className={`text-text-primary transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </Button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-border-light">
                      <p className="text-text-primary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
