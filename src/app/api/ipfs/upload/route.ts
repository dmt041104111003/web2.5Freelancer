import { NextRequest, NextResponse } from 'next/server';
import { DID, JOB, APTOS_NODE_URL } from '@/constants/contracts';

const PINATA_JWT = process.env.PINATA_JWT;
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      requirements, 
      user_commitment, 
      type = 'job' 
    } = body;
    
    if (type === 'job') {
      if (!user_commitment) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'User commitment is required for job creation' 
          },
          { status: 400 }
        );
      }
      
      try {
        console.log('Checking DID profile for job creation:', user_commitment);
        console.log('Commitment type:', typeof user_commitment);
        console.log('Commitment length:', user_commitment.length);
        
        const hexEncodedCommitment = '0x' + Buffer.from(user_commitment, 'utf8').toString('hex');
        console.log('Hex encoded commitment for upload:', hexEncodedCommitment);
        
        const roleResponse = await fetch(`${APTOS_NODE_URL}/v1/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            function: DID.GET_ROLE_TYPES_BY_COMMITMENT,
            type_arguments: [],
            arguments: [hexEncodedCommitment]
          })
        });
        
        if (!roleResponse.ok) {
          console.error('Role API error:', roleResponse.status, roleResponse.statusText);
          return NextResponse.json(
            { 
              success: false, 
              error: 'Failed to check user role' 
            },
            { status: 500 }
          );
        }
        
        const userRolesResult = await roleResponse.json();
        console.log('User roles raw:', userRolesResult);
        
        const userRoles: number[] = [];
        for (const item of userRolesResult) {
          if (typeof item === 'number') {
            userRoles.push(item);
          } else if (typeof item === 'string') {
            if (item.startsWith('0x') && item.length > 2) { 
              const hex = item.slice(2);
              for (let i = 0; i < hex.length; i += 2) {
                const byteHex = hex.slice(i, i + 2);
                if (byteHex.length === 2) userRoles.push(parseInt(byteHex, 16));
              }
            } else if (item !== '0x' && item !== '') { 
              const n = parseInt(item);
              if (!Number.isNaN(n)) userRoles.push(n);
            }
          } else if (Array.isArray(item)) {
            for (const v of item) if (typeof v === 'number') userRoles.push(v);
          }
        }
        
        console.log('User roles:', userRoles);
        
        if (userRoles.length === 0) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'User does not have a DID profile. Please create profile first.' 
            },
            { status: 403 }
          );
        }

        if (!userRoles.includes(2)) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'User does not have poster role. Only posters can create jobs.' 
            },
            { status: 403 }
          );
        }
        
        console.log('✅ Job creation validation passed - userRoles:', userRoles);
        
        body.userRoles = userRoles;
        
      } catch (didError) {
        console.error('DID check error:', didError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to verify DID profile' 
          },
          { status: 500 }
        );
      }
    } else if (type === 'profile') {
      console.log('✅ Profile creation - no DID validation needed');
      
      const { roleTypes } = body;
      if (!roleTypes || !Array.isArray(roleTypes) || roleTypes.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Role types are required for profile creation' 
          },
          { status: 400 }
        );
      }
      
      body.userRoles = roleTypes;
    } else if (type === 'milestone') {
      console.log('✅ Milestone submission - no DID validation needed');
    }
    let metadata: any;
    let fileName: string;
    
    if (type === 'job') {
      metadata = {
        title,
        description,
        requirements: Array.isArray(requirements) ? requirements : [requirements], // Ensure requirements is array
        created_at: new Date().toISOString(),
        version: "1.0.0",
        type: "job"
      };
      fileName = 'job-metadata.json';
    } else if (type === 'profile') {
      let profileData: any = {
        created_at: new Date().toISOString(),
        version: "1.0.0",
        type: "profile"
      };
      
      const { skills, about, experience, roleTypes, freelancerAbout, posterAbout } = body;
      
      if (roleTypes && roleTypes.includes(1)) { 
        profileData = { 
          ...profileData, 
          skills: skills || '', 
          freelancerAbout: freelancerAbout || about || '', 
          experience: experience || '' 
        };
      }
      
      if (roleTypes && roleTypes.includes(2)) { 
        profileData = { 
          ...profileData, 
          posterAbout: posterAbout || about || '' 
        };
      }
      
      if (roleTypes && roleTypes.includes(1) && roleTypes.includes(2)) {
        profileData = { 
          ...profileData, 
          skills: skills || '', 
          freelancerAbout: freelancerAbout || about || '', 
          posterAbout: posterAbout || about || '', 
          experience: experience || '' 
        };
      }
      
      metadata = profileData;
      fileName = 'profile-metadata.json';
    } else if (type === 'milestone') {
      const { milestone_index, description, timestamp, worker_commitment } = body;
      metadata = {
        milestone_index,
        description,
        timestamp,
        worker_commitment,
        created_at: new Date().toISOString(),
        version: "1.0.0",
        type: "milestone"
      };
      fileName = 'milestone-metadata.json';
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid type. Must be "job", "profile", or "milestone"' 
        },
        { status: 400 }
      );
    }
    
    const formData = new FormData();
    formData.append('file', new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' }), fileName);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 1
    });
    formData.append('pinataOptions', pinataOptions);

    const pinataMetadata = JSON.stringify({
      name: `${type}-${type === 'job' ? title : 'profile'}-${Date.now()}`,
      keyvalues: {
        type: `${type}-metadata`,
        title: type === 'job' ? title : 'profile'
      }
    });
    formData.append('pinataMetadata', pinataMetadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const ipfsHash = result.IpfsHash;

    return NextResponse.json({
      success: true,
      ipfsHash,
      ipfsUrl: `${IPFS_GATEWAY}/${ipfsHash}`,
      metadata,
      type,
      contractInfo: {
        didRegistry: {
          createProfile: DID.CREATE_PROFILE,
          updateProfile: DID.UPDATE_PROFILE,
          getProfileData: DID.GET_PROFILE_DATA_BY_COMMITMENT
        },
        escrow: {
          executeJobAction: JOB.EXECUTE_JOB_ACTION,
          getJobById: JOB.GET_JOB_BY_ID,
          getJobLatest: JOB.GET_JOB_LATEST,
          hasNoActiveJobs: JOB.HAS_NO_ACTIVE_JOBS
        }
      }
    });

  } catch (error: any) {
    console.error('IPFS upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to upload to IPFS' 
      },
      { status: 500 }
    );
  }
}