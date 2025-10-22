import { NextRequest, NextResponse } from 'next/server';
import {DID } from '@/constants/contracts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      did, 
      roleTypes, 
      didCommitment, 
      profileCid, 
      tableCommitmentHex, 
      tICommitment, 
      aCommitment 
    } = body;
    
    if (!did || !roleTypes || !Array.isArray(roleTypes)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: did, roleTypes' 
        },
        { status: 400 }
      );
    }

    const validRoles = roleTypes.every(role => role === 1 || role === 2);
    if (!validRoles) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid role types. Only 1 (freelancer) and 2 (poster) are allowed' 
        },
        { status: 400 }
      );
    }
    
    const processedDidCommitment = didCommitment && didCommitment.length > 0 ? didCommitment : [];
    const processedProfileCid = profileCid && profileCid.length > 0 ? profileCid : [];
    const processedTableCommitmentHex = tableCommitmentHex && tableCommitmentHex.trim().length > 0 ? tableCommitmentHex : '';
    const processedTICommitment = tICommitment && tICommitment.length > 0 ? tICommitment : [];
    const processedACommitment = aCommitment && aCommitment.length > 0 ? aCommitment : [];

    const payload = {
      type: 'entry_function_payload',
      function: DID.CREATE_PROFILE,
      type_arguments: [],
      arguments: [
        did,
        roleTypes,
        processedDidCommitment,
        processedProfileCid,
        processedTableCommitmentHex,
        processedTICommitment,
        processedACommitment
      ]
    };

    return NextResponse.json({
      success: true,
      payload,
      message: 'Profile creation payload generated'
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create profile' 
      },
      { status: 500 }
    );
  }
}
