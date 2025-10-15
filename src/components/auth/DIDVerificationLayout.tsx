'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import type { ReactNode } from 'react';

type DIDVerificationLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function DIDVerificationLayout({ 
  children, 
  title = "",
  subtitle = ""
}: DIDVerificationLayoutProps) {
  const { account, connectWallet, isConnecting } = useWallet();

  const BackToHome = () => (
    <Link href="/">
      <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Button>
    </Link>
  );

  if (!account) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6"><BackToHome /></div>

          <div className="text-center py-20">
            <div className="space-y-4">
              <Wallet className="w-16 h-16 mx-auto text-gray-400" />
              <h2 className="text-2xl font-bold">Wallet connection required</h2>
              <p className="text-muted-foreground">
                Please connect your Petra wallet to continue DID verification
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={connectWallet} disabled={isConnecting}>
                  {isConnecting ? 'Connecting...' : 'Connect Petra wallet'}
                </Button>
                <BackToHome />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><BackToHome /></div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
          <div className="mt-2 text-sm text-blue-600">Connected wallet: {account.slice(0, 6)}...{account.slice(-4)}</div>
        </div>

        {children}
      </div>
    </div>
  );
}
