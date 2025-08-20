export interface VerificationStep {
  id: number;
  title: string;
  description: string;
}

export type VerificationStatus = 'idle' | 'processing' | 'success' | 'error';

export interface VerificationProgressProps {
  steps: VerificationStep[];
  currentStep: number;
}

export interface SelfieStepProps {
  onNext: () => void;
  onError: (message: string) => void;
}

export interface IDUploadStepProps {
  onNext: () => void;
}

export interface ChallengeSignStepProps {
  verificationStatus: VerificationStatus;
  progress: number;
  onSignChallenge: () => void;
}

export const VERIFICATION_STEPS: VerificationStep[] = [
  { 
    id: 1, 
    title: 'Selfie Real-time', 
    description: 'Chụp ảnh selfie để xác minh liveness' 
  },
  { 
    id: 2, 
    title: 'Upload CCCD/Hộ chiếu', 
    description: 'Upload ảnh giấy tờ tùy thân' 
  },
  { 
    id: 3, 
    title: 'Ký Challenge', 
    description: 'Ký challenge bằng ví để xác minh quyền sở hữu' 
  },
  { 
    id: 4, 
    title: 'Hoàn thành', 
    description: 'Xác minh DID thành công' 
  }
];

export const VERIFICATION_MESSAGES = {
  CAMERA_ERROR: 'Không thể truy cập camera',
  SUCCESS: 'DID của bạn đã được xác minh và ghi nhận on-chain',
  CHALLENGE_SIGN: 'Vui lòng ký challenge bằng ví của bạn để xác minh quyền sở hữu'
} as const;
