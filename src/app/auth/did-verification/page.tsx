'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { VERIFICATION_STEPS, VerificationStatus } from '@/constants/did-verification';
import VerificationProgress from '@/components/auth/VerificationProgress';
import SelfieStep from '@/components/auth/SelfieStep';
import IDUploadStep from '@/components/auth/IDUploadStep';
import ChallengeSignStep from '@/components/auth/ChallengeSignStep';
import SuccessStep from '@/components/auth/SuccessStep';

export default function DIDVerificationPage() {
  const [step, setStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const signChallenge = async () => {
    setVerificationStatus('processing');
    setProgress(0);
    
    // Simulate verification process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerificationStatus('success');
          setStep(4);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Xác minh Danh tính (DID)</h1>
          <p className="text-muted-foreground">
            Xác minh danh tính của bạn để tham gia nền tảng Web2.5 Freelancer
          </p>
        </div>

        {/* Progress Steps */}
        <VerificationProgress steps={VERIFICATION_STEPS} currentStep={step} />

        {/* Step Content */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{VERIFICATION_STEPS[step - 1]?.title}</h2>
          </div>
          <div>
            {step === 1 && (
              <SelfieStep onNext={handleNextStep} onError={handleError} />
            )}

            {step === 2 && (
              <IDUploadStep onNext={handleNextStep} />
            )}

            {step === 3 && (
              <ChallengeSignStep 
                verificationStatus={verificationStatus}
                progress={progress}
                onSignChallenge={signChallenge}
              />
            )}

            {step === 4 && <SuccessStep />}

            {errorMessage && (
              <Alert variant="danger">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              </Alert>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
