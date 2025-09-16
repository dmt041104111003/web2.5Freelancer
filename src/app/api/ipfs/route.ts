import { NextRequest, NextResponse } from 'next/server';

const PINATA_API_KEY = process.env.PINATA_API_KEY as string;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY as string;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY as string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'pinJson':
        const cid = await pinJsonToIPFS(data);
        return NextResponse.json({ cid });

      case 'pinFile':
        const fileCid = await pinFileToIPFS(data);
        return NextResponse.json({ cid: fileCid });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('IPFS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cid = searchParams.get('cid');

    if (!cid) {
      return NextResponse.json(
        { error: 'Missing CID parameter' },
        { status: 400 }
      );
    }

    const data = await getFromIPFS(cid);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('IPFS GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function pinJsonToIPFS(jsonData: any): Promise<string> {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: {
          name: `verification-${Date.now()}.json`,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error pinning JSON to IPFS:', error);
    throw error;
  }
}

async function pinFileToIPFS(fileData: FormData): Promise<string> {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: fileData,
    });

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw error;
  }
}

async function getFromIPFS(cid: string): Promise<any> {
  try {
    const response = await fetch(`${PINATA_GATEWAY}/ipfs/${cid}`);
    
    if (!response.ok) {
      throw new Error(`IPFS Gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting data from IPFS:', error);
    throw error;
  }
}
