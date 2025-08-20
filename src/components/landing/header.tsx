"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { NAVIGATION } from '@/constants/landing';

// const dancingScript = {
//   fontFamily: "'Dancing Script', cursive",
//   fontWeight: 700,
// };
const robotoCondensed = {
    fontFamily: "'Roboto Condensed', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
  };
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/images/landing/logo_full.png" 
                alt="Web2.5 Freelancer Logo" 
                className="h-8 object-contain"
              />
              <span 
                style={robotoCondensed}
                className="text-xl text-primary"
              >
                Web2.5 Freelancer
              </span>
            </Link>

           <nav className="hidden md:flex items-center gap-8">
             {NAVIGATION.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link
                   key={item.name}
                   href={item.href}
                   className={`transition-colors font-medium relative ${
                     isActive 
                       ? 'text-primary' 
                       : 'text-text-primary hover:text-primary'
                   }`}
                 >
                   {item.name}
                   {isActive && (
                     <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                   )}
                 </Link>
               );
             })}
           </nav>

          <div className="hidden md:flex items-center gap-4">
      
            <Button variant="outline" size="sm">
              Đăng nhập ví
            </Button>
        
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle mobile menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
                     <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
                {NAVIGATION.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                                             className={`transition-colors font-medium flex items-center ${
                         isActive 
                           ? 'text-primary' 
                           : 'text-text-primary hover:text-primary'
                       }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                      {isActive && (
                                                 <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </Link>
                  );
                })}
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" size="sm" className="justify-start">
                  Đăng nhập ví
                </Button>
           
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
