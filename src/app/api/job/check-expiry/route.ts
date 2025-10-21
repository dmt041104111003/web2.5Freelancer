import { NextRequest, NextResponse } from 'next/server';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { JOB } from '@/constants/contracts';

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const job_id = searchParams.get('job_id');
    const milestone_index = searchParams.get('milestone_index');

    if (!job_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing job_id parameter' 
      });
    }

    if (!milestone_index || milestone_index === 'undefined' || milestone_index === 'null') {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing or invalid milestone_index parameter' 
      });
    }

    const milestoneIndex = parseInt(milestone_index);
    if (isNaN(milestoneIndex)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid milestone_index parameter' 
      });
    }

    // Check if milestone is expired
    const isExpired = await aptos.view({
      payload: {
        function: JOB.IS_MILESTONE_EXPIRED,
        functionArguments: [job_id, milestoneIndex]
      }
    });

    // Get milestone deadline for reference
    const deadline = await aptos.view({
      payload: {
        function: JOB.GET_MILESTONE_DEADLINE,
        functionArguments: [job_id, milestoneIndex]
      }
    });

    return NextResponse.json({
      success: true,
      is_expired: isExpired[0],
      milestone_deadline: deadline[0],
      current_time: Math.floor(Date.now() / 1000)
    });

  } catch (error: any) {
    console.error('Check expiry error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to check milestone expiry' 
    });
  }
}
