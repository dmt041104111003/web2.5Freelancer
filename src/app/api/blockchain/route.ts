import { NextRequest, NextResponse } from 'next/server';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const PROFILE_MODULE = process.env.NEXT_PUBLIC_PROFILE_MODULE as string;
const DID_MODULE = process.env.NEXT_PUBLIC_DID_MODULE as string;
const APTOS_REST_URL = process.env.NEXT_PUBLIC_APTOS_REST_URL as string;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userAddress = searchParams.get('userAddress');

    if (!action || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'checkProfileExists':
        const exists = await checkProfileExists(userAddress);
        return NextResponse.json({ exists });

      case 'getProfileData':
        const profileData = await getProfileData(userAddress);
        return NextResponse.json({ profileData });

      case 'getDidDetails':
        const didDetails = await getDidDetails(userAddress);
        return NextResponse.json({ didDetails });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Blockchain API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'registerDidOnChain':
        return NextResponse.json({ 
          error: 'registerDidOnChain must be called from client-side with wallet',
          txHash: null 
        }, { status: 400 });

      case 'registerProfileOnBlockchain':
        return NextResponse.json({ 
          error: 'registerProfileOnBlockchain must be called from client-side with wallet',
          txHash: null 
        }, { status: 400 });

      case 'updateProfileAssets':
        return NextResponse.json({ 
          error: 'updateProfileAssets must be called from client-side with wallet',
          txHash: null 
        }, { status: 400 });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Blockchain API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function checkProfileExists(userAddress: string): Promise<boolean> {
  try {
    const response = await fetch(`${APTOS_REST_URL}/v1/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::has_profile`,
        type_arguments: [],
        arguments: [userAddress]
      })
    });
    if (!response.ok) return false;
    const data = await response.json() as unknown[];
    return data[0] as boolean;
  } catch (error) {
    console.error('Error checking profile existence:', error);
    return false;
  }
}

async function getProfileData(userAddress: string) {
  try {
    const response = await fetch(`${APTOS_REST_URL}/v1/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::get_profile_by_address`,
        type_arguments: [],
        arguments: [userAddress]
      })
    });
    if (!response.ok) return null;
    const data = await response.json() as unknown[];
    const raw = data[0] as Record<string, unknown>;
    if (!raw) return null;
    
    return {
      did_hash: raw.did_hash as string,
      verification_cid: (raw.verification_cid as string) || '',
      profile_cid: (raw.profile_cid as string) || '',
      cv_cid: (raw.cv_cid as string) || '',
      avatar_cid: (raw.avatar_cid as string) || '',
      trust_score: Number(raw.trust_score),
      created_at: Number(raw.created_at)
    };
  } catch (error) {
    console.error('Error getting profile data:', error);
    return null;
  }
}

async function getDidDetails(userAddress: string) {
  try {
    const profileRes = await fetch(`${APTOS_REST_URL}/v1/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::get_profile_by_address`,
        type_arguments: [],
        arguments: [userAddress]
      })
    });
    if (!profileRes.ok) return { hasVerified: false, didHash: '0x', controller: '' };
    const profileJson = await profileRes.json() as unknown[];
    const didHash = (profileJson?.[0] as Record<string, unknown>)?.did_hash as string | undefined;
    if (!didHash) return { hasVerified: false, didHash: '0x', controller: '' };

    const ctrlRes = await fetch(`${APTOS_REST_URL}/v1/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: `${CONTRACT_ADDRESS}::${DID_MODULE}::resolve_controller_by_hash`,
        type_arguments: [],
        arguments: [didHash]
      })
    });
    const controller = ctrlRes.ok ? ((await ctrlRes.json() as unknown[])[0] as string) : '';
    const hasVerified = !!controller && controller.toLowerCase() === userAddress.toLowerCase();
    return { hasVerified, didHash, controller };
  } catch (e) {
    console.error('Error getting DID details:', e);
    return { hasVerified: false, didHash: '0x', controller: '' };
  }
}

async function registerDidOnChain(): Promise<string> {
  // This should be called from client-side with wallet
  throw new Error('registerDidOnChain must be called from client-side');
}

async function registerProfileOnBlockchain(
  verificationCid: string, 
  profileCid: string, 
  cvCid: string, 
  avatarCid: string
): Promise<string> {
  // This should be called from client-side with wallet
  throw new Error('registerProfileOnBlockchain must be called from client-side');
}

async function updateProfileAssets(
  profileCid: string, 
  cvCid: string, 
  avatarCid: string
): Promise<string> {
  // This should be called from client-side with wallet
  throw new Error('updateProfileAssets must be called from client-side');
}
