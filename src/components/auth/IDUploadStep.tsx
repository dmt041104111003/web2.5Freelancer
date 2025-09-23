'use client';

import { useState, useEffect } from 'react';
import { Button, FileUploadInput } from '@/components/ui';
import { IDUploadStepProps } from '@/constants/auth';
import { Upload, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

export default function IDUploadStep({ 
  onNext, 
  onUploadIdCard, 
  isApiLoading = false, 
  idCardData 
}: IDUploadStepProps) {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [uploadedFront, setUploadedFront] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0); 

  useEffect(() => {
    if (idCardData) {
      setUploadError(null);
    }
  }, [idCardData]);

  const resetUpload = () => {
    setFrontImage(null);
    setBackImage(null);
    setUploadedFront(false);
    setUploadError(null);
    setInputKey(prev => prev + 1); 
  };

  const handleFrontImageUpload = async (file: File) => {
      setFrontImage(file);
      setUploadError(null); 
      
      if (onUploadIdCard) {
        try {
          await onUploadIdCard(file);
          setUploadedFront(true);
        } catch (error) {
          console.error('Upload front image error:', error);
          setUploadError('Upload failed. Please try again with a different image.');
          setUploadedFront(false);
          setTimeout(() => {
            resetUpload();
          }, 2000); 
        }
      }
  };

  const handleBackImageUpload = (file: File) => { setBackImage(file); };

  const handleContinue = () => {
    if (uploadedFront && backImage) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Front Image of CCCD/ID Card</label>
          <div className="relative">
            <FileUploadInput label="Choose Image" accept="image/*" onFile={handleFrontImageUpload} />
            {isApiLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            {uploadedFront && !isApiLoading && !uploadError && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            )}
          </div>
          
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Upload failed</p>
                  <p className="text-xs text-red-600">{uploadError}</p>
                </div>
              </div>
              <Button 
                onClick={resetUpload} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Try again
              </Button>
            </div>
          )}
          
          {idCardData && !uploadError && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Readable Information:</h4>
              <div className="space-y-1 text-xs text-blue-800">
                <p><span className="font-medium">CCCD:</span> {idCardData.cccd || 'Cannot read'}</p>
                <p><span className="font-medium">Name:</span> {idCardData.name || 'Cannot read'}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium">Back Image of CCCD/Hộ chiếu</label>
          <FileUploadInput label="Chọn ảnh" accept="image/*" onFile={handleBackImageUpload} />
          {backImage && !uploadError && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">✓ Selected back image</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleContinue}
          disabled={!uploadedFront || !backImage || isApiLoading || uploadError !== null}
          className="min-w-[120px]"
        >
          {isApiLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Continue
            </>
          )}
        </Button>
      </div>
    </div>

  );
}
