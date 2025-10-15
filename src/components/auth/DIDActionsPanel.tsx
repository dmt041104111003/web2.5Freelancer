import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { aptosView } from '@/lib/aptos';
import { DID as DID_CONST } from '@/constants/contracts';
import { useWallet } from '@/contexts/WalletContext';

export default function DIDActionsPanel() {
  const { account } = useWallet();
  const did = account ? `did:aptos:${account}` : '';
  const [output, setOutput] = useState('');
  const [didDoc, setDidDoc] = useState<any | null>(null);
  const [txHash, setTxHash] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [skills, setSkills] = useState('');
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState('');
  const [roleType, setRoleType] = useState<number>(1);
  const DEFAULT_TABLE_ID = 'default_table';

  useEffect(() => {
    if (roleType === 2) { // Poster
      setSkills('');
      setExperience('');
    }
  }, [roleType]);

  const getWalletOrThrow = () => {
    const g: any = globalThis as any;
    const w = g.aptos ?? g?.window?.aptos;
    if (!w) throw new Error('Wallet not found');
    return w;
  };

  const ensureHex0x = (hex: string) => (hex?.startsWith('0x') ? hex : `0x${hex}`);

  const sha256Hex = async (s: string) => {
    const enc = new TextEncoder();
    const data = enc.encode(s);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(hash));
    return '0x' + bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const didTail = (d: string) => {
    const i = d.lastIndexOf(':');
    return i >= 0 ? d.slice(i + 1) : d;
  };

  const handleCheckVerified = async () => {
    try {
      const didCommitHex = await sha256Hex(didTail(did));
      const didPretty = `did:aptos:${didCommitHex}`;
      const tableCommitHex = await sha256Hex(DEFAULT_TABLE_ID);
      const r = await aptosView<boolean[]>({ function: DID_CONST.IS_PROFILE_VERIFIED, arguments: [didPretty, tableCommitHex] });
      const verified = !!r?.[0];
      setOutput(`verified: ${String(verified)}`);
      setDidDoc(null);
      setTxHash('');
    } catch (e: any) {
      setDidDoc(null);
      setTxHash('');
      setOutput(e?.message || 'Kiểm tra verified thất bại');
    }
  };

  const handleCreateProfile = async () => {
    try {
      if (!did) { setOutput('Thiếu DID'); return; }
      if (!fullName.trim() || !age.trim()) { setOutput('Vui lòng nhập đủ: Họ tên, Tuổi'); return; }
      if (!/^\d+$/.test(age.trim())) { setOutput('Tuổi phải là số'); return; }
      let proofHash = '';
      try {
        const res = await fetch('/api/zkp/fullprove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ did, fullName, age, roleType }) });
        const j = await res.json();
        if (res.ok) proofHash = String(j?.t_I_commitment || j?.verification_key_hash_sha256 || '');
      } catch {}
      const didCommitHex = await sha256Hex(didTail(did));
      const didPretty = `did:aptos:${didCommitHex}`;
      const tableCommitHex = await sha256Hex(DEFAULT_TABLE_ID);
      const didCommit = didCommitHex; 
      const profilePayload = JSON.stringify({ fullName, age, skills, about, experience, roleType, proofHash });
      const profileCommit = await sha256Hex(profilePayload);
      const wallet = getWalletOrThrow();
      const payload: any = { type: 'entry_function_payload', function: DID_CONST.CREATE_PROFILE, type_arguments: [], arguments: [didPretty, roleType, didCommit, profileCommit, skills, about, experience, tableCommitHex, proofHash, profileCommit] };
      const tx = await wallet.signAndSubmitTransaction(payload);
      setDidDoc(null);
      const hash = tx?.hash || '';
      setTxHash(hash);
      setOutput(hash ? `Tạo DID+Profile tx: ${hash}` : 'Đã gửi giao dịch');
    } catch (e: any) {
      setDidDoc(null);
      setTxHash('');
      setOutput(e?.message || 'Tạo DID+Profile thất bại');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!did) { setOutput('Thiếu DID'); return; }
      if (!fullName.trim() || !age.trim()) { setOutput('Vui lòng nhập đủ: Họ tên, Tuổi'); return; }
      if (!/^\d+$/.test(age.trim())) { setOutput('Tuổi phải là số'); return; }
      let proofHash = '';
      try {
        const res = await fetch('/api/zkp/fullprove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ did, fullName, age, roleType }) });
        const j = await res.json();
        if (res.ok) proofHash = String(j?.t_I_commitment || j?.verification_key_hash_sha256 || '');
      } catch {}
      const didCommitHex = await sha256Hex(didTail(did));
      const didPretty = `did:aptos:${didCommitHex}`;
      const didCommit = didCommitHex;
      const profilePayload = JSON.stringify({ fullName, age, skills, about, experience, roleType, proofHash });
      const profileCommit = await sha256Hex(profilePayload);
      const tableCommitHex = await sha256Hex(DEFAULT_TABLE_ID);
      const payload: any = { type: 'entry_function_payload', function: DID_CONST.UPDATE_PROFILE, type_arguments: [], arguments: [didPretty, roleType, didCommit, profileCommit, skills, about, experience, tableCommitHex, proofHash, profileCommit] };
      const tx = await (getWalletOrThrow() as any).signAndSubmitTransaction(payload);
      setDidDoc(null);
      const hash = tx?.hash || '';
      setTxHash(hash);
      setOutput(hash ? `Cập nhật Profile tx: ${hash}` : 'Đã gửi giao dịch');
    } catch (e: any) {
      setDidDoc(null);
      setTxHash('');
      setOutput(e?.message || 'Cập nhật Profile thất bại');
    }
  };
  
  const handleBurnDid = async () => {
    try {
      const wallet = getWalletOrThrow();
      const didCommitHex = await sha256Hex(didTail(did));
      const didPretty = `did:aptos:${didCommitHex}`;
      const tableCommitHex = await sha256Hex(DEFAULT_TABLE_ID);
      const profilePayload = JSON.stringify({ fullName, age, skills, about, experience, roleType });
      const profileCommit = await sha256Hex(profilePayload);
      const tICommit = profileCommit;
      const aCommit = profileCommit;
      const payload: any = { type: 'entry_function_payload', function: DID_CONST.BURN_DID, type_arguments: [], arguments: [didPretty, tableCommitHex, tICommit, aCommit] };
      const tx = await wallet.signAndSubmitTransaction(payload);
      setDidDoc(null);
      const hash = tx?.hash || '';
      setTxHash(hash);
      setOutput(hash ? `Hủy DID tx: ${hash}` : 'Đã gửi giao dịch hủy DID');
    } catch (e: any) {
      setDidDoc(null);
      setTxHash('');
      setOutput(e?.message || 'Hủy DID thất bại');
    }
  };

  return (
    <Card variant="outlined" className="p-6 space-y-4 mt-6">
      <div className="text-sm font-medium">Danh tính (DID)</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mt-2">
            <Button size="sm" variant="outline" onClick={handleCreateProfile}>Tạo DID + Hồ sơ</Button>
            <Button size="sm" variant="outline" onClick={handleUpdateProfile}>Cập nhật hồ sơ</Button>
            <Button size="sm" variant="outline" onClick={handleCheckVerified}>Kiểm tra verified</Button>
            <Button size="sm" variant="outline" onClick={handleBurnDid}>Hủy DID</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            
            <div>
              <div className="text-xs mb-1">Họ tên</div>
              <input className="border rounded px-3 py-2 w-full text-xs" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <div className="text-xs mb-1">Tuổi</div>
              <input className="border rounded px-3 py-2 w-full text-xs" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
            </div>
            <div>
              <div className="text-xs mb-1">Vai trò</div>
              <select aria-label="Chọn vai trò" className="border rounded px-3 py-2 w-full text-xs" value={roleType} onChange={(e) => setRoleType(Number(e.target.value))}>
                <option value={1}>Freelancer</option>
                <option value={2}>Poster</option>
              </select>
            </div>
            {roleType !== 2 ? (
              <div className="md:col-span-2">
                <div className="text-xs mb-1">Kỹ năng (skills)</div>
                <input className="border rounded px-3 py-2 w-full text-xs" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Rust, ..." />
              </div>
            ) : null}
            <div className="md:col-span-2">
              <div className="text-xs mb-1">Giới thiệu (about)</div>
              <textarea className="border rounded px-3 py-2 w-full text-xs" rows={3} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Mô tả ngắn về bạn" />
            </div>
            {roleType !== 2 ? (
              <div className="md:col-span-2">
                <div className="text-xs mb-1">Kinh nghiệm (experience)</div>
                <textarea className="border rounded px-3 py-2 w-full text-xs" rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="3 năm Frontend, 1 năm Move..." />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <div className="text-xs mb-1">Kết quả</div>
          <div className="text-xs p-2 border rounded min-h-[120px] whitespace-pre-wrap break-all">{output}</div>
          {txHash ? (
            <div className="text-[10px] text-gray-500 mt-2 break-all">Tx: {txHash}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}



