"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

import { useWallet } from '@/contexts/WalletContext';
import { Wallet } from 'lucide-react';
import { aptosView } from '@/lib/aptos';
import { DID, CV, ZKP } from '@/constants/contracts';
import { Buffer } from 'buffer';


export default function DashboardPage() {
  const { account, connectWallet, isConnecting } = useWallet();

  const [didResolved, setDidResolved] = useState<string>("")
  const [cvSummary, setCvSummary] = useState<string>("")
  const [cvRole, setCvRole] = useState<string>("")

  const [proofType, setProofType] = useState<number>(1)
  const [resultLog, setResultLog] = useState<string>("")

  // Fields for create_cv
  const [cvTitle, setCvTitle] = useState<string>("")
  const [cvSumIn, setCvSumIn] = useState<string>("")
  const [cvRoleIn, setCvRoleIn] = useState<string>("")
  const cvCommitHex = '0x'
  const cvProofHex = '0x'

  const DEFAULT_TABLE_ID = 'auto_table_type_1'
  const zkpTableCommit = '0x'
  const zkpTableSize = 0
  const [zkpVkHash, setZkpVkHash] = useState<string>('0x')

  const [checkHas, setCheckHas] = useState<string>('')
  const [checkVerify, setCheckVerify] = useState<string>('')
  const [checkEligibility, setCheckEligibility] = useState<string>('')
  const [checkCvDoc, setCheckCvDoc] = useState<string>('')
  const [checkRole, setCheckRole] = useState<string>('')
  
  // Thêm state cho các tính năng mới
  const [checkHasCv, setCheckHasCv] = useState<string>('')
  const [checkCvCommitment, setCheckCvCommitment] = useState<string>('')
  const [updateResult, setUpdateResult] = useState<string>('')
  const [burnResult, setBurnResult] = useState<string>('')
  
  // State cho ZKP features
  const [verifyZkpResult, setVerifyZkpResult] = useState<string>('')
  const [lookupTableResult, setLookupTableResult] = useState<string>('')
  const [tableTypeResult, setTableTypeResult] = useState<string>('')
  const [claimDataResult, setClaimDataResult] = useState<string>('')

  useEffect(() => {}, []);

  const signEntry = async (functionId: string, args: unknown[]) => {
    if (!(window as any).aptos) throw new Error('Aptos wallet not available');
    const tx = { type: 'entry_function_payload', function: functionId, type_arguments: [], arguments: args };
    const res = await (window as any).aptos.signAndSubmitTransaction(tx);
    return res?.hash as string;
  }

  const refreshProfile = async () => {
    try {
      if (!account) return
      const acc = await (window as any).aptos?.account?.()
      const pub = acc?.publicKey || ""
      if (!pub) return
      const dids = await aptosView<string[]>({ function: DID.GET_DID_BY_PUBLIC_KEY, arguments: [pub] })
      const did = dids?.[0] || ""
      setDidResolved(did)
      if (did) {
        const cv = await aptosView<any[]>({ function: CV.GET_CV, arguments: [did] })
        const doc = cv?.[0]
        setCvSummary(doc?.summary || "")
        const role = await aptosView<string[]>({ function: CV.GET_CV_ROLE, arguments: [did] })
        setCvRole(role?.[0] || "")
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => { if (account) { refreshProfile() } }, [account])

  const generateProofServer = async () => {
    const res = await fetch('/api/zkp/fullprove', { method: 'POST' });
    const j = await res.json();
    if (!res.ok) throw new Error(j?.error || 'fullprove failed');
    if (j?.verification_key_hash_sha256) setZkpVkHash(j.verification_key_hash_sha256);
  }

  const createCv = async () => {
    const did = didResolved
    if (!did) throw new Error('Thiếu DID, hãy bấm Lấy DID')
    await signEntry(CV.CREATE_CV, [did, cvTitle, cvSumIn, cvRoleIn, cvCommitHex, cvProofHex])
  }

  const addZkpProof = async (didForProof: string) => {
    const empty19 = Array(19).fill('0x')
    return signEntry(ZKP.ADD_ZKP_PROOF, [
      didForProof,
      ...empty19,
      zkpTableCommit,
      zkpTableSize,
      proofType,
      zkpVkHash,
    ])
  }

  // Thêm các functions mới
  const updateCv = async () => {
    const did = didResolved
    if (!did) throw new Error('Thiếu DID')
    await signEntry(CV.UPDATE_CV, [did, cvTitle, cvSumIn, cvRoleIn, cvCommitHex, cvProofHex])
  }

  const burnCv = async () => {
    const did = didResolved
    if (!did) throw new Error('Thiếu DID')
    await signEntry(CV.BURN_CV, [did])
  }

  const doAll = async () => {
    try {
      setResultLog('🔄 Đang tạo bằng chứng ZKP...')
      await generateProofServer()
      setResultLog('📝 Đang tạo CV trên blockchain...')
      const did = didResolved
      if (!did) throw new Error('Thiếu DID')
      await signEntry(CV.CREATE_CV, [did, cvTitle, cvSumIn, cvRoleIn, cvCommitHex, cvProofHex])
      setResultLog('🔗 Đang gắn bằng chứng vào CV...')
      await addZkpProof(did)
      setResultLog('✅ Hoàn tất! CV đã được tạo và gắn bằng chứng thành công!')
    } catch (e: any) {
      setResultLog(`❌ Lỗi: ${e?.message || 'thất bại'}`)
    }
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 pt-20">
          <Container>
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                  Connect wallet to access Profile
                </h1>
                <p className="text-xl text-text-secondary mb-8">
                  You need to connect Petra wallet to manage your profile
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Wallet className="w-5 h-5" />
                  {isConnecting ? 'Connecting...' : 'Connect Petra Wallet'}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Or{' '}
                  <Link href="/" className="text-primary hover:underline">
                    go back to home
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <Container>
          <div className="space-y-6">
              <Card variant="outlined" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">📝 Nhập thông tin CV</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 border rounded">
                  <div className="text-sm font-medium mb-2">Thông tin hồ sơ</div>
                  <div className="text-xs text-muted-foreground mb-2">DID sẽ tự lấy từ ví Petra đã kết nối.</div>
                  <div className="text-xs text-muted-foreground mb-2">DID: {didResolved || '-'}</div>
                  <label className="text-xs mb-1 block">Chức danh</label>
                  <input className="border rounded px-3 py-2 w-full mb-2" value={cvTitle} onChange={(e) => setCvTitle(e.target.value)} placeholder="Nhập chức danh" />
                  <label className="text-xs mb-1 block">Tóm tắt</label>
                  <input className="border rounded px-3 py-2 w-full mb-2" value={cvSumIn} onChange={(e) => setCvSumIn(e.target.value)} placeholder="Nhập tóm tắt" />
                  <label className="text-xs mb-1 block">Role type</label>
                  <input className="border rounded px-3 py-2 w-full mb-2" value={cvRoleIn} onChange={(e) => setCvRoleIn(e.target.value)} placeholder="Nhập loại vai trò" />
                </div>
                <div className="p-3 border rounded">
                  <div className="text-sm font-medium mb-2">Loại bằng chứng</div>
                  <select className="border rounded px-3 py-2 w-full mb-2" value={proofType} onChange={(e) => setProofType(Number(e.target.value))} title="Chọn loại bằng chứng">
                    <option value={1}>Bằng cấp học vấn</option>
                    <option value={4}>Kỹ năng chuyên môn</option>
                  </select>
                  <div className="text-xs text-muted-foreground">Server sẽ tự sinh proof và hash VK.</div>
                </div>
                  </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Button size="sm" onClick={doAll}>Tạo CV + Proof + Gắn bằng chứng (1 nút)</Button>
                  <Button size="sm" onClick={async () => {
                    try {
                      setResultLog('🔄 Đang tạo bằng chứng ZKP...')
                      await generateProofServer()
                      setResultLog('🔗 Đang gắn bằng chứng vào CV...')
                      const did = didResolved
                      if (!did) throw new Error('Thiếu DID')
                      await addZkpProof(did)
                      setResultLog('✅ Gắn bằng chứng thành công!')
                    } catch (e: any) {
                      setResultLog(`❌ Lỗi: ${e?.message || 'thất bại'}`)
                    }
                  }}>Chỉ gắn Proof</Button>
                  <Button size="sm" onClick={async () => {
                    try {
                      setUpdateResult('Đang cập nhật...')
                      await updateCv()
                      setUpdateResult('✅ Cập nhật CV thành công!')
                    } catch (e: any) {
                      setUpdateResult(`❌ Lỗi: ${e?.message || 'thất bại'}`)
                    }
                  }}>Cập nhật CV</Button>
                  <Button size="sm" onClick={async () => {
                    try {
                      setBurnResult('Đang xóa CV...')
                      await burnCv()
                      setBurnResult('✅ Xóa CV thành công!')
                    } catch (e: any) {
                      setBurnResult(`❌ Lỗi: ${e?.message || 'thất bại'}`)
                    }
                  }}>Xóa CV</Button>
                      </div>
                <div className="text-xs text-muted-foreground mt-2 break-words">{resultLog || ''}</div>
                <div className="text-xs text-muted-foreground mt-1 break-words">{updateResult || ''}</div>
                <div className="text-xs text-muted-foreground mt-1 break-words">{burnResult || ''}</div>
                  </div>
                </Card>

                <Card variant="outlined" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">🔍 Kiểm tra và xác thực</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">🔍 Kiểm tra có bằng chứng</div>
                  <select className="border rounded px-3 py-2 w-full" value={proofType} onChange={(e) => setProofType(Number(e.target.value))} title="Chọn loại bằng chứng">
                    <option value={1}>Bằng cấp học vấn</option>
                    <option value={4}>Kỹ năng chuyên môn</option>
                  </select>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckHas('Đang kiểm tra...')
                    try {
                      const r = await aptosView<boolean[]>({ function: ZKP.HAS_ZKP_PROOF, arguments: [did, proofType] })
                      setCheckHas(String(r?.[0]))
                    } catch (e: any) { setCheckHas(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Kiểm tra</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {checkHas || 'Chưa kiểm tra'}
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">✅ Xác thực CV với bằng chứng</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckVerify('Đang xác thực...')
                    try {
                      const r = await aptosView<boolean[]>({ function: CV.VERIFY_CV_WITH_ZKP, arguments: [did, proofType, DEFAULT_TABLE_ID] })
                      setCheckVerify(String(r?.[0]))
                    } catch (e: any) { setCheckVerify(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Xác thực</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {checkVerify || 'Chưa kiểm tra'}
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">🎯 Kiểm tra đủ điều kiện</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckEligibility('Đang kiểm tra...')
                    try {
                      const r = await aptosView<boolean[]>({ function: CV.CHECK_ELIGIBILITY_SIMPLE, arguments: [did, 'education_proof', 'skill_proof'] })
                      setCheckEligibility(String(r?.[0]))
                    } catch (e: any) { setCheckEligibility(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Kiểm tra</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {checkEligibility || 'Chưa kiểm tra'}
                  </div>
                      </div>
                    </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">📄 Lấy thông tin CV</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckCvDoc('Đang tải...')
                    try {
                      const r = await aptosView<any[]>({ function: CV.GET_CV, arguments: [did] })
                      setCheckCvDoc(JSON.stringify(r?.[0] || null))
                    } catch (e: any) { setCheckCvDoc(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Lấy thông tin</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong>
                    <pre className="text-xs whitespace-pre-wrap break-all mt-1">{checkCvDoc || 'Chưa kiểm tra'}</pre>
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">👤 Lấy loại vai trò</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckRole('Đang tải...')
                    try {
                      const r = await aptosView<string[]>({ function: CV.GET_CV_ROLE, arguments: [did] })
                      setCheckRole(String(r?.[0] || ''))
                    } catch (e: any) { setCheckRole(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Lấy vai trò</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {checkRole || 'Chưa kiểm tra'}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">❓ Kiểm tra có CV</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckHasCv('Đang kiểm tra...')
                    try {
                      const r = await aptosView<boolean[]>({ function: CV.HAS_CV, arguments: [did] })
                      setCheckHasCv(String(r?.[0]))
                    } catch (e: any) { setCheckHasCv(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Kiểm tra</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {checkHasCv || 'Chưa kiểm tra'}
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">🔐 Lấy CV Commitment</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setCheckCvCommitment('Đang tải...')
                    try {
                      const r = await aptosView<string[]>({ function: CV.GET_CV_COMMITMENT, arguments: [did] })
                      setCheckCvCommitment(String(r?.[0] || ''))
                    } catch (e: any) { setCheckCvCommitment(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Lấy Commitment</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {checkCvCommitment || 'Chưa kiểm tra'}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">🔍 Xác thực ZKP Proof</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setVerifyZkpResult('Đang xác thực...')
                    try {
                      const r = await aptosView<boolean[]>({ function: ZKP.VERIFY_ZKP_PROOF, arguments: [did, proofType] })
                      setVerifyZkpResult(String(r?.[0]))
                    } catch (e: any) { setVerifyZkpResult(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Xác thực ZKP</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {verifyZkpResult || 'Chưa kiểm tra'}
                  </div>
                    </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">📊 Lấy Lookup Table</div>
                  <Button size="sm" onClick={async () => {
                    setLookupTableResult('Đang tải...')
                    try {
                      const r = await aptosView<any[]>({ function: ZKP.GET_LOOKUP_TABLE, arguments: [DEFAULT_TABLE_ID] })
                      setLookupTableResult(JSON.stringify(r?.[0] || null))
                    } catch (e: any) { setLookupTableResult(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Lấy Table</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong>
                    <pre className="text-xs whitespace-pre-wrap break-all mt-1">{lookupTableResult || 'Chưa kiểm tra'}</pre>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">🏷️ Lấy Table Type</div>
                  <Button size="sm" onClick={async () => {
                    setTableTypeResult('Đang tải...')
                    try {
                      const r = await aptosView<string[]>({ function: ZKP.GET_TABLE_TYPE, arguments: [DEFAULT_TABLE_ID] })
                      setTableTypeResult(String(r?.[0] || ''))
                    } catch (e: any) { setTableTypeResult(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Lấy Type</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {tableTypeResult || 'Chưa kiểm tra'}
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-700">📋 Xác thực Claim Data</div>
                  <Button size="sm" onClick={async () => {
                    const did = didResolved
                    if (!did) return
                    setClaimDataResult('Đang xác thực...')
                    try {
                      const claimDataHex = '0x' + Buffer.from('test_claim_data').toString('hex')
                      const r = await aptosView<boolean[]>({ 
                        function: ZKP.VERIFY_CLAIM_DATA, 
                        arguments: [did, 'education_proof', claimDataHex] 
                      })
                      setClaimDataResult(String(r?.[0]))
                    } catch (e: any) { setClaimDataResult(`❌ Lỗi: ${e?.message || 'thất bại'}`) }
                  }}>Xác thực Claim</Button>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Kết quả:</strong> {claimDataResult || 'Chưa kiểm tra'}
                  </div>
                </div>
              </div>
                </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

