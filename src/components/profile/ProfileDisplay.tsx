'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { ProfileDisplayProps, ProfileData } from '@/constants/profile';

export default function ProfileDisplay({ userAddress }: ProfileDisplayProps) {
  const safeParse = (text: string) => { try { return JSON.parse(text); } catch { return text; } };
  const toPlainText = (obj: any) => {
    if (!obj) return '';
    try {
      const entries = Object.entries(obj as Record<string, unknown>);
      return entries.map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`).join('\n');
    } catch {
      return String(obj);
    }
  };
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [didDetails, setDidDetails] = useState<{ hasVerified: boolean; didHash: string; controller: string } | null>(null);
  const [latestEventTime, setLatestEventTime] = useState<number | null>(null);
  const [offchainProfile, setOffchainProfile] = useState<Record<string, unknown> | null>(null);
  const [offchainVerification, setOffchainVerification] = useState<Record<string, unknown> | null>(null);
  const [profileCidBare, setProfileCidBare] = useState<string>('');
  const [verificationCidBare, setVerificationCidBare] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [data, did] = await Promise.all([
          apiClient.getProfileData(userAddress),
          apiClient.getDidDetails(userAddress)
        ]);
        if (data) {
          setProfileData(data);
          const pBare = (data.profile_cid || '').replace('ipfs://','');
          const vBare = (data.verification_cid || '').replace('ipfs://','');
          setProfileCidBare(pBare);
          setVerificationCidBare(vBare);
          if (pBare) {
            try {
              const json = await apiClient.getFromIPFS(pBare);
              if (json) setOffchainProfile(typeof json === 'string' ? safeParse(json) : json);
            } catch {}
          }
          if (vBare) {
            try {
              const jsonV = await apiClient.getFromIPFS(vBare);
              if (jsonV) setOffchainVerification(typeof jsonV === 'string' ? safeParse(jsonV) : jsonV);
            } catch {}
          }
          setDidDetails(did);
        } else {
          setError('Không tìm thấy profile');
        }
      } catch (err) {
        setError('Lỗi khi tải profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userAddress) {
      fetchProfile();
    }
  }, [userAddress]);

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-center text-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-border"></div>
            <span className="ml-2">Đang tải profile...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (error || !profileData) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-center text-red-600">
            <p>{error || 'Không tìm thấy profile'}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 space-y-4 text-foreground">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">DID Hash</label>
            <p 
              className="text-sm font-mono bg-card text-card-foreground border border-border p-2 rounded cursor-pointer hover:bg-accent/40 transition-colors break-all"
              onClick={() => {
                navigator.clipboard.writeText(profileData.did_hash);
                toast.success('DID hash đã được copy!');
              }}
              title="Click để copy DID Hash"
            >
              {profileData.did_hash}
            </p>
          </div>
        </div>

        {offchainProfile && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {'name' in offchainProfile && (
                <div>
                  <label className="text-muted-foreground">Name</label>
                  <p className="font-medium break-words">{String(offchainProfile.name)}</p>
                </div>
              )}
              {'verification_message' in offchainProfile && (
                <div>
                  <label className="text-muted-foreground">Verification Message</label>
                  <p className="font-medium break-words">{String(offchainProfile.verification_message)}</p>
                </div>
              )}
              {'selfie_url' in offchainProfile && (
                <div>
                  <label className="text-muted-foreground">Selfie</label>
                  <img src={offchainProfile.selfie_url as string} alt="selfie" className="rounded border border-border max-h-40 object-cover" />
                </div>
              )}
              {'id_card_front_url' in offchainProfile && (
                <div>
                  <label className="text-muted-foreground">ID Card (Front)</label>
                  <img src={offchainProfile.id_card_front_url as string} alt="id-front" className="rounded border border-border max-h-40 object-cover" />
                </div>
              )}
              {'id_card_back_url' in offchainProfile && (
                <div>
                  <label className="text-muted-foreground">ID Card (Back)</label>
                  <img src={offchainProfile.id_card_back_url as string} alt="id-back" className="rounded border border-border max-h-40 object-cover" />
                </div>
              )}
            </div>
     
          </div>
        )}

        {offchainVerification && (
          <div className="border-t border-border pt-4 space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Verification</div>
            <pre className="whitespace-pre-wrap break-words bg-card border border-border rounded p-3 overflow-auto max-h-80">
              {toPlainText(offchainVerification)}
            </pre>
            {verificationCidBare && (
              <div>
                <span className="text-muted-foreground">CID:</span>{' '}
                <span
                  className="font-mono cursor-pointer hover:underline"
                  onClick={() => { navigator.clipboard.writeText(`ipfs://${verificationCidBare}`); toast.success('Verification CID đã copy'); }}
                  title="Click để copy CID"
                >
                  ipfs://{verificationCidBare}
                </span>
              </div>
            )}
          </div>
        )}
        {didDetails && (
          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">DID Verified:</span>
                <Badge variant={didDetails.hasVerified ? 'default' : 'danger'}>
                  {didDetails.hasVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                </Badge>
              </div>
              <div>
                <label className="text-muted-foreground">Controller</label>
                <p
                  className="font-mono bg-card text-card-foreground border border-border p-2 rounded text-sm break-all cursor-pointer hover:bg-accent/40 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(didDetails.controller || '');
                    toast.success('Controller address đã được copy!');
                  }}
                  title="Click để copy Controller"
                >
                  {didDetails.controller || '—'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-muted-foreground">DID Hash (resolver)</label>
                <p
                  className="font-mono bg-card text-card-foreground border border-border p-2 rounded text-sm break-all"
                >
                  {didDetails.didHash}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3 text-foreground">Thông tin hồ sơ</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-muted-foreground">Ngày tạo</label>
              <p className="font-medium">
                {new Date(Number(profileData.created_at) * 1000).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <label className="text-muted-foreground">Verification CID</label>
              <p 
                className="font-mono bg-card text-card-foreground border border-border p-2 rounded text-sm break-all cursor-pointer hover:bg-accent/40 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(profileData.verification_cid);
                  toast.success('Verification CID đã được copy!');
                }}
                title="Click để copy IPFS CID"
              >
                {profileData.verification_cid}
              </p>
            </div>

            {latestEventTime && (
              <div>
                <label className="text-muted-foreground">Thời điểm đăng ký</label>
                <p className="font-medium">
                  {new Date(latestEventTime * 1000).toLocaleString('vi-VN')}
                </p>
              </div>
            )}
          </div>
          {offchainProfile && (
            <div className="mt-4 text-sm">
              <pre className="whitespace-pre-wrap break-words bg-card border border-border rounded p-3 overflow-auto max-h-80">
                {toPlainText(offchainProfile)}
              </pre>
              {profileCidBare && (
                <div className="mt-2">
                  <span className="text-muted-foreground">CID:</span>{' '}
                  <span
                    className="font-mono cursor-pointer hover:underline"
                    onClick={() => { navigator.clipboard.writeText(`ipfs://${profileCidBare}`); toast.success('Profile CID đã copy'); }}
                    title="Click để copy CID"
                  >
                    ipfs://{profileCidBare}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
