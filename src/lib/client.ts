// Wallet signing helpers
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const PROFILE_MODULE = process.env.NEXT_PUBLIC_PROFILE_MODULE as string;
const DID_MODULE = process.env.NEXT_PUBLIC_DID_MODULE as string;

type EntryFunctionPayload = {
  type: 'entry_function_payload';
  function: string;
  type_arguments: string[];
  arguments: unknown[];
};

type AptosWallet = {
  signAndSubmitTransaction: (
    payload: EntryFunctionPayload
  ) => Promise<{ hash: string }>;
};

function getAptosWallet(): AptosWallet {
  const g = globalThis as unknown as {
    aptos?: AptosWallet;
    window?: { aptos?: AptosWallet };
  };
  const wallet = g.aptos ?? g.window?.aptos;
  if (!wallet) {
    throw new Error('Petra wallet not connected');
  }
  return wallet;
}

export async function registerDidOnChain(): Promise<string> {
  const wallet = getAptosWallet();
  const payload: EntryFunctionPayload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${DID_MODULE}::register_did`,
    type_arguments: [],
    arguments: []
  };
  const tx = await wallet.signAndSubmitTransaction(payload);
  return tx.hash;
}

export async function registerProfileOnBlockchain(
  verificationCid: string,
  profileCid: string,
  cvCid: string,
  avatarCid: string
): Promise<string> {
  const wallet = getAptosWallet();
  const payload: EntryFunctionPayload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::register_profile`,
    type_arguments: [],
    arguments: [verificationCid, profileCid, cvCid, avatarCid]
  };
  const tx = await wallet.signAndSubmitTransaction(payload);
  return tx.hash;
}

export async function updateProfileAssets(
  profileCid: string,
  cvCid: string,
  avatarCid: string
): Promise<string> {
  const wallet = getAptosWallet();
  const payload: EntryFunctionPayload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::update_profile_assets`,
    type_arguments: [],
    arguments: [profileCid, cvCid, avatarCid]
  };
  const tx = await wallet.signAndSubmitTransaction(payload);
  return tx.hash;
}


export function cidToUrl(cid: string): string {
  const gatewayBase = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  const clean = cid.startsWith('ipfs://') ? cid.slice(7) : cid;
  return `${gatewayBase.replace(/\/$/, '')}/${clean}`;
}

export async function fetchJsonFromCid<T = unknown>(cid: string): Promise<T | null> {
  try {
    const res = await fetch(cidToUrl(cid), { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.error('fetchJsonFromCid error', e);
    return null;
  }
}

export async function checkProfileExists(address: string): Promise<boolean> {
  const res = await fetch(`/api/profile/${address}?select=exists`, { cache: 'no-store' });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.exists;
}


