'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { DIDVerificationLayoutProps } from '@/constants/did-verification';

const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};

export default function DIDVerificationLayout({ 
  children, 
  title = "Identity verification (DID)",
  subtitle = "Verify your identity to join the Marketplace2vn platform"
}: DIDVerificationLayoutProps) {
  const { account, connectWallet, isConnecting } = useWallet();

  if (!account) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Button>
            </Link>
          </div>

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
                <Link href="/">
                  <Button variant="outline">
                    Back to home
                  </Button>
                </Link>
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
        <div className="mb-6">
            <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
                Back to home
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 style={robotoCondensed} className="text-3xl font-bold mb-2">{title}</h1>
          <p style={robotoCondensed} className="text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-2 text-sm text-blue-600">
            Connected wallet: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
