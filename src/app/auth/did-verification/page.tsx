'use client';

import DIDVerificationLayout from '@/components/auth/DIDVerificationLayout';
import DIDActionsPanel from '@/components/auth/DIDActionsPanel';

export default function DIDVerificationPage() {
  return (
    <DIDVerificationLayout>
      <DIDActionsPanel />
    </DIDVerificationLayout>
  );
}
