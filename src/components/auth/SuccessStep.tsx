import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { VERIFICATION_MESSAGES } from '@/constants/did-verification';

export default function SuccessStep() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold">Xác minh thành công!</h3>
      <p className="text-muted-foreground">
        {VERIFICATION_MESSAGES.SUCCESS}
      </p>
      <div className="flex justify-center space-x-4">
        <Button onClick={() => window.location.href = '/dashboard'}>
          Đi đến Dashboard
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/profile'}>
          Tạo Hồ sơ
        </Button>
      </div>
    </div>
  );
}
