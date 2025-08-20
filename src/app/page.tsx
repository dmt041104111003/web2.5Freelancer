import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { PersonaSwitcher } from '@/components/landing/persona-switcher';
import { TrustNumbers } from '@/components/landing/trust-numbers';
import { FAQ } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <HowItWorks />
        <PersonaSwitcher />
        <TrustNumbers />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
}
