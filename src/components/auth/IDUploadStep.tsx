'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IDUploadStepProps } from '@/constants/did-verification';


export default function IDUploadStep({ onNext }: IDUploadStepProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ảnh mặt trước CCCD/Hộ chiếu</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Ảnh mặt sau CCCD/Hộ chiếu</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={onNext}>
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
