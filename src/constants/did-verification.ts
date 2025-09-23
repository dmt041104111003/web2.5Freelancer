import { IDCardData, FaceVerificationResult, BlockchainData } from './profile';

export type VerificationStatus = 'idle' | 'processing' | 'success' | 'error';

export interface VerificationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

export interface DIDVerificationStepsProps {
  step: number;
  verificationStatus: VerificationStatus;
  progress: number;
  errorMessage: string;
  idCardData: IDCardData | null;
  faceVerificationResult: FaceVerificationResult | null;
  isFaceApiLoading: boolean;
  showEncryptionPreview: boolean;
  transactionHash: string;
  blockchainData: BlockchainData | null;
  account: string;
  onNext: () => void;
  onBack: () => void;
  onError: (message: string) => void;
  onUploadIdCard: (file: File) => Promise<IDCardData>;
  onVerifyWebcam: (file: File) => Promise<FaceVerificationResult>;
  onRegisterProfile: () => void;
  onConfirmBlockchain: () => void;
  onBackToEncryption: () => void;
  onViewProfile: () => void;
}

export interface DIDVerificationLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: 1,
    title: 'Upload CCCD/ID Card',
    description: 'Upload image of CCCD/ID Card',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Real-time Face Verification',
    description: 'Take selfie to verify identity',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Register on Blockchain',
    description: 'Save verification information on blockchain',
    status: 'pending'
  },
  { 
    id: 4,
    title: 'Completed',
    description: 'Verify DID successfully',
    status: 'pending'
  }
];

export const VERIFICATION_MESSAGES = {
  CAMERA_ERROR: 'Cannot access camera',
  SUCCESS: 'DID of yours has been verified and recorded on-chain',
  CHALLENGE_SIGN: 'Please sign challenge with your wallet to verify ownership'
} as const;
