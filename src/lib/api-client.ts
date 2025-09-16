
export class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Note: Blockchain write operations must be called from client-side with wallet
  // These methods are placeholders and should be implemented with wallet integration
  async registerDidOnChain() {
    throw new Error('registerDidOnChain must be implemented with wallet integration on client-side');
  }

  async registerProfileOnBlockchain(verificationCid: string, profileCid: string, cvCid: string, avatarCid: string) {
    throw new Error('registerProfileOnBlockchain must be implemented with wallet integration on client-side');
  }

  async updateProfileAssets(newProfileCid: string, newCvCid: string, newAvatarCid: string) {
    throw new Error('updateProfileAssets must be implemented with wallet integration on client-side');
  }

  async checkProfileExists(userAddress: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/blockchain?action=checkProfileExists&userAddress=${userAddress}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.exists;
  }

  async getProfileData(userAddress: string) {
    const response = await fetch(`${this.baseUrl}/blockchain?action=getProfileData&userAddress=${userAddress}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  }

  async getDidDetails(userAddress: string) {
    const response = await fetch(`${this.baseUrl}/blockchain?action=getDidDetails&userAddress=${userAddress}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  }

  async pinJsonToIPFS(jsonData: any): Promise<string> {
    const response = await fetch(`${this.baseUrl}/ipfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: jsonData }),
    });
    const data = await response.json();
    return data.cid;
  }

  async pinFileToIPFS(fileData: FormData): Promise<string> {
    const response = await fetch(`${this.baseUrl}/ipfs`, {
      method: 'POST',
      body: fileData,
    });
    const data = await response.json();
    return data.cid;
  }

  async getFromIPFS(cid: string) {
    const response = await fetch(`${this.baseUrl}/ipfs?cid=${cid}`);
    const data = await response.json();
    return data.data;
  }

  async uploadIdCard(file: File) {
    const formData = new FormData();
    formData.append('id_card', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_FACE_API_BASE_URL}/upload_id_card`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  async verifyWebcam(file: File) {
    const formData = new FormData();
    formData.append('webcam', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_FACE_API_BASE_URL}/verify_webcam`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

}

export const apiClient = new APIClient();
