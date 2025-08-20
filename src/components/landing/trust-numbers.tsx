"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/container';
import { TRUST_STATS } from '@/constants/landing';
import CountUp from 'react-countup';



const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export function TrustNumbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background-secondary">
      <Container>
        <div className="text-center mb-12">
          <h2 
            style={robotoCondensed}
            className="text-4xl lg:text-5xl text-primary mb-4"
          >
            Số liệu đáng tin cậy
          </h2>
          <p 
            style={robotoCondensed}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Những con số minh bạch được lưu trữ trên blockchain
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {TRUST_STATS.map((stat, index) => (
            <div key={index} className="text-center">
              
              <div className="text-4xl lg:text-5xl font-bold text-text-primary mb-2">
                {isVisible ? (
                  <CountUp
                    end={parseInt(stat.value.replace(/[^0-9]/g, ''))}
                    duration={2.5}
                    delay={index * 0.2}
                    suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
                  />
                ) : (
                  '0'
                )}
              </div>
              <div className="text-lg text-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://explorer.aptoslabs.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Xem trên Block Explorer
          </a>
        </div>
      </Container>
    </section>
  );
}
