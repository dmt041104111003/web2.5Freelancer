"use client";

import { useEffect, useState } from "react";

type ProfileRow = {
  id: string;
  address: string;
  role: string;
  isVerifiedDid: boolean;
  didHash: string | null;
  profileCid: string | null;
  avatarCid: string | null;
  cvCid: string | null;
  verificationCid: string | null;
  headline: string | null;
  updatedAt: string;
  createdAt: string;
};

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/profiles?limit=50${onlyVerified ? '&verified=true' : ''}`, { cache: 'no-store' });
        const data = await res.json();
        setProfiles(data.profiles || []);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [onlyVerified]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Profile management</h1>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} />
          Show only verified
        </label>
      </div>
      {loading ? (
        <div className="text-muted-foreground">Loading profiles...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-4">Address</th>
                <th className="py-2 pr-4">Verified</th>
                <th className="py-2 pr-4">Headline</th>
                <th className="py-2 pr-4">Profile CID</th>
                <th className="py-2 pr-4">Avatar CID</th>
                <th className="py-2 pr-4">CV CID</th>
                <th className="py-2 pr-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono">{p.address}</td>
                  <td className="py-2 pr-4">{p.isVerifiedDid ? 'Yes' : 'No'}</td>
                  <td className="py-2 pr-4 truncate max-w-[240px]">{p.headline || ''}</td>
                  <td className="py-2 pr-4 font-mono truncate max-w-[180px]">{p.profileCid || ''}</td>
                  <td className="py-2 pr-4 font-mono truncate max-w-[180px]">{p.avatarCid || ''}</td>
                  <td className="py-2 pr-4 font-mono truncate max-w-[180px]">{p.cvCid || ''}</td>
                  <td className="py-2 pr-4">{new Date(p.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


