import { NextRequest, NextResponse } from 'next/server';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { JOB } from '@/constants/contracts';

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const job_id = searchParams.get('job_id');
    const worker_commitment = searchParams.get('worker_commitment');

    if (!job_id || !worker_commitment) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing job_id or worker_commitment parameter' 
      });
    }

    const isBanned = await aptos.view({
      payload: {
        function: JOB.IS_WORKER_BANNED,
        functionArguments: [job_id, worker_commitment]
      }
    });

    return NextResponse.json({
      success: true,
      is_banned: isBanned[0],
      worker_commitment,
      job_id
    });

  } catch (error: any) {
    console.error('Check banned error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to check if worker is banned' 
    });
  }
}
