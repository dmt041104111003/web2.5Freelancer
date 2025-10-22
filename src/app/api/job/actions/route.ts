import { NextRequest, NextResponse } from 'next/server';
import { JOB } from '@/constants/contracts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    
    switch (action) {
      case 'post':
        return await postJob(params);
      case 'apply':
        return await applyJob(params);
      case 'approve':
        return await approveJob(params);
      case 'submit':
        return await submitMilestone(params);
      case 'accept':
        return await acceptMilestone(params);
      case 'complete':
        return await completeJob(params);
      case 'claim':
        return await claimJob(params);
      case 'cancel':
        return await cancelJob(params);
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action. Must be: post, apply, approve, submit, accept, complete, claim, cancel' 
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Job action error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to execute job action' 
      },
      { status: 500 }
    );
  }
}

async function postJob(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_details_cid, 
    milestones, 
    milestone_durations,
    application_deadline 
  } = params;
  
  if (!user_address || !user_commitment || !job_details_cid || !milestones || !application_deadline) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_details_cid, milestones, application_deadline' 
      },
      { status: 400 }
    );
  }
  
  try {
    console.log('🔍 DEBUG - postJob parameters:', {
      user_address,
      user_commitment,
      job_details_cid,
      milestones,
      application_deadline,
      commitmentLength: user_commitment?.length
    });

    const milestonesAmounts = milestones.map((milestone: any) => {
      if (typeof milestone === 'number') {
        return milestone;
      }
      const amount = parseFloat(milestone.amount || '0');
      return Math.floor(amount * 100_000_000); 
    });
    
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_POST, 
        0, 
        user_commitment, 
        [], 
        0, 
        [], 
        job_details_cid, 
        milestonesAmounts, 
        milestone_durations || [], 
        application_deadline 
      ]
    };

    console.log('🔍 DEBUG - Transaction payload:', {
      function: JOB.EXECUTE_JOB_ACTION,
      arguments: payload.arguments,
      user_commitment_in_args: payload.arguments[2],
      commitment_match: payload.arguments[2] === user_commitment
    });
    
    return NextResponse.json({
      success: true,
      message: 'Job posting transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare job posting: ${error.message}`);
  }
}

async function applyJob(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_APPLY, 
        job_id, 
        user_commitment, 
        user_commitment, 
        0, 
        [], 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Job application transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare job application: ${error.message}`);
  }
}

async function approveJob(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_APPROVE, 
        job_id, 
        user_commitment, 
        [], 
        0, 
        [], 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Job approval transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare job approval: ${error.message}`);
  }
}

async function submitMilestone(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id, 
    milestone_index, 
    cid 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined || milestone_index === undefined || !cid) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id, milestone_index, cid' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_SUBMIT, 
        job_id, 
        user_commitment, 
        [], 
        milestone_index, 
        cid, 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Milestone submission transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare milestone submission: ${error.message}`);
  }
}

async function acceptMilestone(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id, 
    milestone_index, 
    cid 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined || milestone_index === undefined || !cid) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id, milestone_index, cid' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_ACCEPT, 
        job_id, 
        user_commitment, 
        [], 
        milestone_index, 
        cid, 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Milestone acceptance transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare milestone acceptance: ${error.message}`);
  }
}

async function completeJob(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_COMPLETE, 
        job_id, 
        user_commitment, 
        [], 
        0, 
        [], 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Job completion transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare job completion: ${error.message}`);
  }
}

async function claimJob(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_CLAIM, 
        job_id, 
        user_commitment, 
        [], 
        0, 
        [], 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Job claim transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare job claim: ${error.message}`);
  }
}

async function cancelJob(params: any) {
  const { 
    user_address, 
    user_commitment, 
    job_id 
  } = params;
  
  if (!user_address || !user_commitment || job_id === undefined) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing required parameters: user_address, user_commitment, job_id' 
      },
      { status: 400 }
    );
  }
  
  try {
    const payload = {
      type: 'entry_function_payload',
      function: JOB.EXECUTE_JOB_ACTION,
      type_arguments: [],
      arguments: [
        JOB.ACTION_CANCEL, 
        job_id, 
        user_commitment, 
        [], 
        0, 
        [], 
        [], 
        [], 
        [], 
        0 
      ]
    };
    
    return NextResponse.json({
      success: true,
      message: 'Job cancellation transaction prepared',
      payload,
      instructions: 'Submit this payload to Aptos network using your wallet'
    });
    
  } catch (error: any) {
    throw new Error(`Failed to prepare job cancellation: ${error.message}`);
  }
}
