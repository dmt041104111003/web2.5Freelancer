
import { toast } from 'sonner';

// Environment variables
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const PROFILE_MODULE = process.env.NEXT_PUBLIC_PROFILE_MODULE as string;
const DID_MODULE = process.env.NEXT_PUBLIC_DID_MODULE as string;

export interface WalletBlockchainService {
  registerDidOnChain(): Promise<string>;
  registerProfileOnBlockchain(verificationCid: string, profileCid: string, cvCid: string, avatarCid: string): Promise<string>;
  updateProfileAssets(profileCid: string, cvCid: string, avatarCid: string): Promise<string>;
}

export class AptosWalletBlockchainService implements WalletBlockchainService {
  private getWallet() {
    if (typeof window === 'undefined' || !window.aptos) {
      throw new Error('Petra wallet not connected. Please connect your wallet first.');
    }
    return window.aptos;
  }

  private async getAccount() {
    const wallet = this.getWallet();
    const account = await wallet.account();
    return account.address;
  }

  async registerDidOnChain(): Promise<string> {
    try {
      const wallet = this.getWallet();
      const account = await this.getAccount();
      
      console.log('Registering DID on chain for account:', account);
      
      const transaction = {
        type: 'entry_function_payload',
        function: `${CONTRACT_ADDRESS}::${DID_MODULE}::register_did`,
        type_arguments: [],
        arguments: [account]
      };

      const response = await wallet.signAndSubmitTransaction(transaction);
      
      console.log('DID registration transaction hash:', response.hash);
      toast.success('DID đã được đăng ký thành công trên blockchain!');
      
      return response.hash;
    } catch (error) {
      console.error('Error registering DID on chain:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Lỗi đăng ký DID: ${errorMessage}`);
      throw error;
    }
  }

  async registerProfileOnBlockchain(
    verificationCid: string, 
    profileCid: string, 
    cvCid: string, 
    avatarCid: string
  ): Promise<string> {
    try {
      const wallet = this.getWallet();
      const account = await this.getAccount();
      
      console.log('Registering profile on blockchain for account:', account);
      console.log('Verification CID:', verificationCid);
      
      const transaction = {
        type: 'entry_function_payload',
        function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::register_profile`,
        type_arguments: [],
        arguments: [
          verificationCid,
          profileCid || '',
          cvCid || '',
          avatarCid || ''
        ]
      };

      const response = await wallet.signAndSubmitTransaction(transaction);
      
      console.log('Profile registration transaction hash:', response.hash);
      toast.success('Profile đã được đăng ký thành công trên blockchain!');
      
      return response.hash;
    } catch (error) {
      console.error('Error registering profile on blockchain:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Lỗi đăng ký profile: ${errorMessage}`);
      throw error;
    }
  }

  async updateProfileAssets(
    profileCid: string, 
    cvCid: string, 
    avatarCid: string
  ): Promise<string> {
    try {
      const wallet = this.getWallet();
      const account = await this.getAccount();
      
      console.log('Updating profile assets for account:', account);
      
      const transaction = {
        type: 'entry_function_payload',
        function: `${CONTRACT_ADDRESS}::${PROFILE_MODULE}::update_profile_assets`,
        type_arguments: [],
        arguments: [
          profileCid,
          cvCid,
          avatarCid
        ]
      };

      const response = await wallet.signAndSubmitTransaction(transaction);
      
      console.log('Profile assets update transaction hash:', response.hash);
      toast.success('Profile assets đã được cập nhật thành công!');
      
      return response.hash;
    } catch (error) {
      console.error('Error updating profile assets:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Lỗi cập nhật profile assets: ${errorMessage}`);
      throw error;
    }
  }
}

export const walletBlockchainService = new AptosWalletBlockchainService();

// Type definitions for window.aptos
declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string; publicKey: string }>;
      disconnect: () => Promise<void>;
      account: () => Promise<{ address: string; publicKey: string }>;
      network: () => Promise<string>;
      on?: (event: string, callback: (network: string) => void) => void;
      removeListener?: (event: string, callback: (network: string) => void) => void;
      addEventListener?: (event: string, callback: (network: string) => void) => void;
      removeEventListener?: (event: string, callback: (network: string) => void) => void;
      signAndSubmitTransaction: (transaction: {
        type: string;
        function: string;
        type_arguments: string[];
        arguments: unknown[];
      }) => Promise<{ hash: string }>;
      signMessage?: (message: { message: string; nonce: string }) => Promise<string>;
    };
  }
}
